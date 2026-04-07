use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, TokenAccount, Mint};

/// ============ RISK-BOUND NON-CUSTODIAL VAULT ============
/// Enforces strict per-position limits, auto-deducts 0.5% Software License Fee.
/// User retains private keys via Phantom/Fireblocks. Vault PDAs are non-custodial.

#[account]
#[derive(InitSpace)]
pub struct NeuralVault {
    pub bump: u8,
    pub owner: Pubkey,
    pub vault_id: u64,
    pub usdc_mint: Pubkey,
    pub token_account: Pubkey,      // User's spl-token account holding USDC
    pub balance: u64,               // Current vault balance in USDC
    pub total_delegated_volume: u64,// Cumulative execution volume
    pub max_position_size_bps: u16, // Max position as % of balance (e.g., 500 = 5%)
    pub risk_level: u8,             // 0-100 (user's tolerance threshold)
    pub status: u8,                 // 0 = Inactive, 1 = Active
    pub created_at: i64,
    pub last_execution: i64,
    pub protocol_fee_earned: u64,   // Total 0.5% fees collected
}

impl NeuralVault {
    pub const MAX_LEVERAGE: u8 = 10;
    pub const MIN_BALANCE: u64 = 100_000;      // 0.1 USDC minimum
    pub const LICENSE_FEE_BPS: u16 = 50;       // 0.5% = 50 basis points
    pub const TREASURY_SEED: &'static [u8] = b"treasury";
}

#[account]
#[derive(InitSpace)]
pub struct VaultRiskSnapshot {
    pub bump: u8,
    pub vault_id: u64,
    pub timestamp: i64,
    pub snapshot_balance: u64,
    pub position_limit: u64,
    pub utilization_bps: u16,  // Percentage of balance utilized (0-10000)
}

// ============ INITIALIZATION & LIFECYCLE ============

pub fn init_user_vault(
    ctx: &mut Context<InitializeVault>,
    vault_id: u64,
    max_position_size_bps: u16,
    risk_level: u8,
    usdc_mint: Pubkey,
) -> Result<()> {
    require!(
        max_position_size_bps > 0 && max_position_size_bps <= 10000,
        VaultError::InvalidPositionLimit
    );
    require!(risk_level <= 100, VaultError::InvalidRiskLevel);

    let vault = &mut ctx.accounts.vault;
    vault.bump = ctx.bumps.vault;
    vault.owner = ctx.accounts.user.key();
    vault.vault_id = vault_id;
    vault.usdc_mint = usdc_mint;
    vault.token_account = ctx.accounts.user_token_account.key();
    vault.balance = 0;
    vault.total_delegated_volume = 0;
    vault.max_position_size_bps = max_position_size_bps;
    vault.risk_level = risk_level;
    vault.status = 1; // Active
    vault.created_at = Clock::get()?.unix_timestamp;
    vault.last_execution = 0;
    vault.protocol_fee_earned = 0;

    emit!(VaultInitialized {
        owner: ctx.accounts.user.key(),
        vault_id,
        usdc_mint,
        max_position_bps: max_position_size_bps,
        timestamp: Clock::get()?.unix_timestamp,
    });

    Ok(())
}

/// Deposit USDC into non-custodial vault
/// User's wallet must approve spl-token transfer beforehand
pub fn deposit_usdc(
    ctx: &mut Context<DepositUSDC>,
    amount: u64,
) -> Result<()> {
    require!(amount > 0, VaultError::InvalidAmount);

    let vault = &mut ctx.accounts.vault;
    require!(vault.status == 1, VaultError::VaultInactive);

    // Transfer USDC from user's token account to vault token account
    token::transfer(
        CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            token::Transfer {
                from: ctx.accounts.user_token_account.to_account_info(),
                to: ctx.accounts.vault_token_account.to_account_info(),
                authority: ctx.accounts.user.to_account_info(),
            },
        ),
        amount,
    )?;

    vault.balance = vault.balance.checked_add(amount).unwrap();

    emit!(DepositMade {
        vault_id: vault.vault_id,
        owner: vault.owner,
        amount,
        new_balance: vault.balance,
        timestamp: Clock::get()?.unix_timestamp,
    });

    Ok(())
}

/// Withdraw USDC from vault (user retains full control)
pub fn withdraw_usdc(
    ctx: &mut Context<WithdrawUSDC>,
    amount: u64,
) -> Result<()> {
    require!(amount > 0, VaultError::InvalidAmount);

    let vault = &mut ctx.accounts.vault;
    require!(vault.balance >= amount, VaultError::InsufficientBalance);

    // CPI transfer from vault token account back to user
    token::transfer(
        CpiContext::new_with_signer(
            ctx.accounts.token_program.to_account_info(),
            token::Transfer {
                from: ctx.accounts.vault_token_account.to_account_info(),
                to: ctx.accounts.user_token_account.to_account_info(),
                authority: vault.to_account_info(),
            },
            &[&[
                b"vault",
                vault.owner.as_ref(),
                &vault.vault_id.to_le_bytes(),
                &[vault.bump],
            ]],
        ),
        amount,
    )?;

    vault.balance = vault.balance.checked_sub(amount).unwrap();

    emit!(WithdrawalMade {
        vault_id: vault.vault_id,
        owner: vault.owner,
        amount,
        remaining_balance: vault.balance,
        timestamp: Clock::get()?.unix_timestamp,
    });

    Ok(())
}

/// Update vault risk parameters (max position size and risk level)
pub fn update_risk_params(
    ctx: &mut Context<UpdateRiskParams>,
    max_position_size_bps: u16,
    risk_level: u8,
) -> Result<()> {
    require!(
        max_position_size_bps > 0 && max_position_size_bps <= 10000,
        VaultError::InvalidPositionLimit
    );
    require!(risk_level <= 100, VaultError::InvalidRiskLevel);

    let vault = &mut ctx.accounts.vault;
    vault.max_position_size_bps = max_position_size_bps;
    vault.risk_level = risk_level;

    emit!(RiskParamsUpdated {
        vault_id: vault.vault_id,
        owner: vault.owner,
        max_position_bps: max_position_size_bps,
        risk_level,
        timestamp: Clock::get()?.unix_timestamp,
    });

    Ok(())
}

// ============ EXECUTION & RISK MANAGEMENT ============

/// Execute a DFlow trade intent with automatic risk checks and license fee deduction
pub fn execute_trade_with_fee(
    ctx: &mut Context<ExecuteTrade>,
    intent_id: [u8; 32],
    market_ticker: [u8; 32],
    side: u8,                  // 0 = NO, 1 = YES
    amount: u64,               // Requested position size in USDC
    execution_price: u64,      // Actual fill price in basis points (1 BTC = 10000 = 1.0)
) -> Result<()> {
    let vault = &mut ctx.accounts.vault;
    require!(vault.status == 1, VaultError::VaultInactive);
    require!(vault.balance >= amount, VaultError::InsufficientBalance);

    // =========== RISK CHECK: Max Position Size ===========
    let max_position = (vault.balance as u128)
        .saturating_mul(vault.max_position_size_bps as u128)
        .saturating_div(10000) as u64;

    require!(
        amount <= max_position,
        VaultError::PositionExceedsLimit
    );

    // =========== CALCULATE & DEDUCT 0.5% LICENSE FEE ===========
    let license_fee = amount
        .saturating_mul(NeuralVault::LICENSE_FEE_BPS as u64)
        .saturating_div(10000);

    let net_amount = amount.saturating_sub(license_fee);

    // Deduct from vault balance
    vault.balance = vault.balance.saturating_sub(license_fee);
    vault.protocol_fee_earned = vault.protocol_fee_earned.saturating_add(license_fee);
    vault.total_delegated_volume = vault.total_delegated_volume.saturating_add(net_amount);
    vault.last_execution = Clock::get()?.unix_timestamp;

    // =========== EMIT RISK SNAPSHOT ===========
    let utilization_bps = (net_amount as u128)
        .saturating_mul(10000)
        .saturating_div(vault.balance.max(1) as u128) as u16;

    emit!(TradeExecutedWithFee {
        vault_id: vault.vault_id,
        intent_id,
        owner: vault.owner,
        market_ticker,
        side,
        gross_amount: amount,
        license_fee,
        net_amount,
        execution_price,
        utilization_bps,
        new_balance: vault.balance,
        timestamp: Clock::get()?.unix_timestamp,
    });

    Ok(())
}

/// Record a prediction outcome and adjust vault state
pub fn record_trade_outcome(
    ctx: &mut Context<RecordOutcome>,
    vault_id: u64,
    intent_id: [u8; 32],
    pnl: i64,                  // Profit/Loss in USDC (signed)
    winning_side: u8,          // 0 or 1 (the correct side)
) -> Result<()> {
    let vault = &mut ctx.accounts.vault;
    require!(vault.vault_id == vault_id, VaultError::VaultMismatch);

    // Apply P&L to vault balance
    if pnl >= 0 {
        vault.balance = vault.balance.saturating_add(pnl as u64);
    } else {
        vault.balance = vault.balance.saturating_sub((-pnl) as u64);
    }

    emit!(TradeOutcomeRecorded {
        vault_id,
        intent_id,
        owner: vault.owner,
        pnl,
        winning_side,
        new_balance: vault.balance,
        timestamp: Clock::get()?.unix_timestamp,
    });

    Ok(())
}

/// Harvest accumulated license fees to protocol treasury
pub fn harvest_fees(
    ctx: &mut Context<HarvestFees>,
    vault_id: u64,
) -> Result<()> {
    let vault = &mut ctx.accounts.vault;
    require!(vault.vault_id == vault_id, VaultError::VaultMismatch);

    let fees_to_harvest = vault.protocol_fee_earned;
    require!(fees_to_harvest > 0, VaultError::NoFeesToHarvest);

    // Transfer fees to protocol treasury
    token::transfer(
        CpiContext::new_with_signer(
            ctx.accounts.token_program.to_account_info(),
            token::Transfer {
                from: ctx.accounts.vault_token_account.to_account_info(),
                to: ctx.accounts.treasury_token_account.to_account_info(),
                authority: vault.to_account_info(),
            },
            &[&[
                b"vault",
                vault.owner.as_ref(),
                &vault.vault_id.to_le_bytes(),
                &[vault.bump],
            ]],
        ),
        fees_to_harvest,
    )?;

    vault.protocol_fee_earned = 0;

    emit!(FeesHarvested {
        vault_id,
        amount: fees_to_harvest,
        timestamp: Clock::get()?.unix_timestamp,
    });

    Ok(())
}

// ============ ACCOUNT CONTEXTS ============

#[derive(Accounts)]
#[instruction(vault_id: u64)]
pub struct InitializeVault<'info> {
    #[account(
        init,
        payer = user,
        space = 8 + NeuralVault::INIT_SPACE,
        seeds = [b"vault", user.key().as_ref(), &vault_id.to_le_bytes()],
        bump
    )]
    pub vault: Account<'info, NeuralVault>,

    #[account(
        init,
        payer = user,
        token::mint = usdc_mint,
        token::authority = vault,
        seeds = [b"vault-token", vault.key().as_ref()],
        bump
    )]
    pub vault_token_account: Account<'info, TokenAccount>,

    #[account(
        constraint = user_token_account.mint == usdc_mint.key(),
        constraint = user_token_account.owner == user.key(),
    )]
    pub user_token_account: Account<'info, TokenAccount>,

    pub usdc_mint: Account<'info, Mint>,

    #[account(mut)]
    pub user: Signer<'info>,
    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
}

#[derive(Accounts)]
pub struct DepositUSDC<'info> {
    #[account(mut)]
    pub vault: Account<'info, NeuralVault>,

    #[account(
        mut,
        token::mint = vault.usdc_mint,
    )]
    pub vault_token_account: Account<'info, TokenAccount>,

    #[account(
        mut,
        token::mint = vault.usdc_mint,
        constraint = user_token_account.owner == user.key(),
    )]
    pub user_token_account: Account<'info, TokenAccount>,

    #[account(mut)]
    pub user: Signer<'info>,
    pub token_program: Program<'info, Token>,
}

#[derive(Accounts)]
pub struct WithdrawUSDC<'info> {
    #[account(mut)]
    pub vault: Account<'info, NeuralVault>,

    #[account(
        mut,
        token::mint = vault.usdc_mint,
    )]
    pub vault_token_account: Account<'info, TokenAccount>,

    #[account(
        mut,
        constraint = user_token_account.owner == user.key(),
    )]
    pub user_token_account: Account<'info, TokenAccount>,

    pub user: Signer<'info>,
    pub token_program: Program<'info, Token>,
}

#[derive(Accounts)]
pub struct ExecuteTrade<'info> {
    #[account(mut)]
    pub vault: Account<'info, NeuralVault>,
    pub user: Signer<'info>,
}

#[derive(Accounts)]
pub struct RecordOutcome<'info> {
    #[account(mut)]
    pub vault: Account<'info, NeuralVault>,
    pub user: Signer<'info>,
}

#[derive(Accounts)]
pub struct HarvestFees<'info> {
    #[account(mut)]
    pub vault: Account<'info, NeuralVault>,

    #[account(
        mut,
        token::mint = vault.usdc_mint,
    )]
    pub vault_token_account: Account<'info, TokenAccount>,

    #[account(
        mut,
        token::mint = vault.usdc_mint,
    )]
    pub treasury_token_account: Account<'info, TokenAccount>,

    pub user: Signer<'info>,
    pub token_program: Program<'info, Token>,
}

#[derive(Accounts)]
pub struct UpdateRiskParams<'info> {
    #[account(
        mut,
        constraint = vault.owner == user.key()
    )]
    pub vault: Account<'info, NeuralVault>,

    #[account(mut)]
    pub user: Signer<'info>,
}

// ============ ERRORS ============

#[error_code]
pub enum VaultError {
    #[msg("Invalid position limit (must be 1-10000 bps).")]
    InvalidPositionLimit,

    #[msg("Risk level must be 0-100.")]
    InvalidRiskLevel,

    #[msg("Amount must be greater than zero.")]
    InvalidAmount,

    #[msg("Vault is not active.")]
    VaultInactive,

    #[msg("Insufficient balance in vault.")]
    InsufficientBalance,

    #[msg("Position exceeds max size limit.")]
    PositionExceedsLimit,

    #[msg("Vault ID mismatch.")]
    VaultMismatch,

    #[msg("No fees to harvest.")]
    NoFeesToHarvest,
}

// ============ EVENTS ============

#[event]
pub struct VaultInitialized {
    pub owner: Pubkey,
    pub vault_id: u64,
    pub usdc_mint: Pubkey,
    pub max_position_bps: u16,
    pub timestamp: i64,
}

#[event]
pub struct DepositMade {
    pub vault_id: u64,
    pub owner: Pubkey,
    pub amount: u64,
    pub new_balance: u64,
    pub timestamp: i64,
}

#[event]
pub struct WithdrawalMade {
    pub vault_id: u64,
    pub owner: Pubkey,
    pub amount: u64,
    pub remaining_balance: u64,
    pub timestamp: i64,
}

#[event]
pub struct TradeExecutedWithFee {
    pub vault_id: u64,
    pub intent_id: [u8; 32],
    pub owner: Pubkey,
    pub market_ticker: [u8; 32],
    pub side: u8,
    pub gross_amount: u64,
    pub license_fee: u64,
    pub net_amount: u64,
    pub execution_price: u64,
    pub utilization_bps: u16,
    pub new_balance: u64,
    pub timestamp: i64,
}

#[event]
pub struct TradeOutcomeRecorded {
    pub vault_id: u64,
    pub intent_id: [u8; 32],
    pub owner: Pubkey,
    pub pnl: i64,
    pub winning_side: u8,
    pub new_balance: u64,
    pub timestamp: i64,
}

#[event]
pub struct FeesHarvested {
    pub vault_id: u64,
    pub amount: u64,
    pub timestamp: i64,
}

#[event]
pub struct RiskParamsUpdated {
    pub vault_id: u64,
    pub owner: Pubkey,
    pub max_position_bps: u16,
    pub risk_level: u8,
    pub timestamp: i64,
}

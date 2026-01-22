use anchor_lang::prelude::*;

declare_id!("A7FnyNVtkcRMEkhaBjgtKZ1Z7Mh4N9XLBN8AGneXNK2F");

#[program]
pub mod neural_vault {
    use super::*;

    /// Initialize user profile (one per wallet)
    pub fn initialize_user(ctx: Context<InitializeUser>) -> Result<()> {
        let user_stats = &mut ctx.accounts.user_stats;
        user_stats.bump = ctx.bumps.user_stats;
        user_stats.user = ctx.accounts.user.key();
        user_stats.total_volume = 0;
        user_stats.predictions_count = 0;
        user_stats.correct_predictions = 0;
        user_stats.agents_count = 0;
        Ok(())
    }

    /// Create a new agent with unique ID (multiple per wallet)
    pub fn create_agent(
        ctx: Context<CreateAgent>, 
        agent_id: u64,
        archetype: u8,      // 0 = Sniper, 1 = Sentinel, 2 = Oracle
        risk_level: u8,     // 0-100
        capital: u64,       // Initial capital in lamports
        leverage: u8,       // 1, 2, 5, 10
        name: [u8; 32],     // Agent name (padded)
    ) -> Result<()> {
        let agent = &mut ctx.accounts.agent;
        agent.bump = ctx.bumps.agent;
        agent.owner = ctx.accounts.user.key();
        agent.agent_id = agent_id;
        agent.archetype = archetype;
        agent.risk_level = risk_level;
        agent.capital = capital;
        agent.leverage = leverage;
        agent.name = name;
        agent.status = AgentStatus::Active as u8;
        agent.created_at = Clock::get()?.unix_timestamp;
        agent.total_trades = 0;
        agent.profitable_trades = 0;
        agent.total_pnl = 0;

        // Increment user's agent count
        let user_stats = &mut ctx.accounts.user_stats;
        user_stats.agents_count += 1;

        emit!(AgentCreated {
            owner: ctx.accounts.user.key(),
            agent_id,
            archetype,
            timestamp: Clock::get()?.unix_timestamp,
        });

        Ok(())
    }

    /// Record a prediction for a specific agent
    pub fn record_agent_prediction(
        ctx: Context<RecordAgentPrediction>, 
        agent_id: u64,
        volume: u64, 
        prediction_hash: [u8; 32],
        is_profitable: bool,
        pnl: i64,
    ) -> Result<()> {
        let agent = &mut ctx.accounts.agent;
        agent.total_trades += 1;
        if is_profitable {
            agent.profitable_trades += 1;
        }
        agent.total_pnl = agent.total_pnl.checked_add(pnl).unwrap_or(agent.total_pnl);

        let user_stats = &mut ctx.accounts.user_stats;
        user_stats.total_volume = user_stats.total_volume.checked_add(volume).unwrap();
        user_stats.predictions_count += 1;
        if is_profitable {
            user_stats.correct_predictions += 1;
        }
        
        emit!(PredictionMade {
            user: ctx.accounts.user.key(),
            agent_id,
            volume,
            prediction_hash,
            pnl,
            timestamp: Clock::get()?.unix_timestamp,
        });
        
        Ok(())
    }

    /// Deactivate an agent
    pub fn deactivate_agent(ctx: Context<UpdateAgent>, _agent_id: u64) -> Result<()> {
        let agent = &mut ctx.accounts.agent;
        agent.status = AgentStatus::Inactive as u8;
        Ok(())
    }

    /// Reactivate an agent
    pub fn reactivate_agent(ctx: Context<UpdateAgent>, _agent_id: u64) -> Result<()> {
        let agent = &mut ctx.accounts.agent;
        agent.status = AgentStatus::Active as u8;
        Ok(())
    }

    /// Record trade for agent (standalone - no UserStats dependency)
    pub fn record_trade_standalone(
        ctx: Context<RecordTradeStandalone>, 
        _agent_id: u64,
        volume: u64, 
        is_profitable: bool,
        pnl: i64,
    ) -> Result<()> {
        let agent = &mut ctx.accounts.agent;
        agent.total_trades += 1;
        if is_profitable {
            agent.profitable_trades += 1;
        }
        agent.total_pnl = agent.total_pnl.checked_add(pnl).unwrap_or(agent.total_pnl);
        
        // Generate simple hash
        let timestamp = Clock::get()?.unix_timestamp;
        let mut prediction_hash = [0u8; 32];
        prediction_hash[..8].copy_from_slice(&timestamp.to_le_bytes());
        prediction_hash[8..16].copy_from_slice(&volume.to_le_bytes());

        emit!(PredictionMade {
            user: ctx.accounts.user.key(),
            agent_id: agent.agent_id,
            volume,
            prediction_hash,
            pnl,
            timestamp,
        });
        
        Ok(())
    }

    /// Legacy: Record prediction (backwards compatibility)
    pub fn record_prediction(ctx: Context<RecordPrediction>, volume: u64, prediction_hash: [u8; 32]) -> Result<()> {
        let user_stats = &mut ctx.accounts.user_stats;
        user_stats.total_volume = user_stats.total_volume.checked_add(volume).unwrap();
        user_stats.predictions_count += 1;
        
        emit!(LegacyPredictionMade {
            user: ctx.accounts.user.key(),
            volume,
            prediction_hash,
            timestamp: Clock::get()?.unix_timestamp,
        });
        
        Ok(())
    }

    /// Create agent without requiring UserStats (standalone mode)
    pub fn create_agent_standalone(
        ctx: Context<CreateAgentStandalone>, 
        agent_id: u64,
        archetype: u8,
        risk_level: u8,
        capital: u64,
        leverage: u8,
        name: [u8; 32],
    ) -> Result<()> {
        let agent = &mut ctx.accounts.agent;
        agent.bump = ctx.bumps.agent;
        agent.owner = ctx.accounts.user.key();
        agent.agent_id = agent_id;
        agent.archetype = archetype;
        agent.risk_level = risk_level;
        agent.capital = capital;
        agent.leverage = leverage;
        agent.name = name;
        agent.status = AgentStatus::Active as u8;
        agent.created_at = Clock::get()?.unix_timestamp;
        agent.total_trades = 0;
        agent.profitable_trades = 0;
        agent.total_pnl = 0;

        emit!(AgentCreated {
            owner: ctx.accounts.user.key(),
            agent_id,
            archetype,
            timestamp: Clock::get()?.unix_timestamp,
        });

        Ok(())
    }

    /// Execute a Trade Intent (DFlow Integration)
    /// Emits an event that off-chain solvers listen to for execution.
    pub fn submit_trade_intent(
        ctx: Context<SubmitTradeIntent>,
        agent_id: u64,
        market_ticker: [u8; 32], // e.g., "FED_RATES_MAR24"
        side: u8,                // 0 = NO, 1 = YES
        amount: u64,             // Amount in USDC/SOL
        limit_price: u64,        // Max price to pay (in basis points)
    ) -> Result<()> {
        let agent = &mut ctx.accounts.agent;
        
        // Validation: Agent must be active
        require!(agent.status == AgentStatus::Active as u8, CustomError::AgentInactive);
        
        // Emit Intent for DFlow Solvers
        emit!(TradeIntentSubmitted {
            agent_id,
            owner: ctx.accounts.user.key(),
            market_ticker,
            side,
            amount,
            limit_price,
            timestamp: Clock::get()?.unix_timestamp,
        });

        Ok(())
    }
}

// ============ ACCOUNTS ============

#[derive(Accounts)]
pub struct InitializeUser<'info> {
    #[account(
        init, 
        payer = user, 
        space = 8 + UserStats::INIT_SPACE, 
        seeds = [b"user-stats", user.key().as_ref()], 
        bump
    )]
    pub user_stats: Account<'info, UserStats>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(agent_id: u64)]
pub struct CreateAgent<'info> {
    #[account(
        init,
        payer = user,
        space = 8 + Agent::INIT_SPACE,
        seeds = [b"agent", user.key().as_ref(), &agent_id.to_le_bytes()],
        bump
    )]
    pub agent: Account<'info, Agent>,
    #[account(
        mut,
        seeds = [b"user-stats", user.key().as_ref()],
        bump = user_stats.bump,
    )]
    pub user_stats: Account<'info, UserStats>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(agent_id: u64)]
pub struct RecordAgentPrediction<'info> {
    #[account(
        mut,
        seeds = [b"agent", user.key().as_ref(), &agent_id.to_le_bytes()],
        bump = agent.bump,
        constraint = agent.owner == user.key()
    )]
    pub agent: Account<'info, Agent>,
    #[account(
        mut,
        seeds = [b"user-stats", user.key().as_ref()],
        bump = user_stats.bump,
    )]
    pub user_stats: Account<'info, UserStats>,
    pub user: Signer<'info>,
}

#[derive(Accounts)]
#[instruction(agent_id: u64)]
pub struct UpdateAgent<'info> {
    #[account(
        mut,
        seeds = [b"agent", user.key().as_ref(), &agent_id.to_le_bytes()],
        bump = agent.bump,
        constraint = agent.owner == user.key()
    )]
    pub agent: Account<'info, Agent>,
    pub user: Signer<'info>,
}

#[derive(Accounts)]
#[instruction(volume: u64, prediction_hash: [u8; 32])]
pub struct RecordPrediction<'info> {
    #[account(
        mut,
        seeds = [b"user-stats", user.key().as_ref()],
        bump = user_stats.bump,
    )]
    pub user_stats: Account<'info, UserStats>,
    pub user: Signer<'info>,
}

#[derive(Accounts)]
#[instruction(agent_id: u64)]
pub struct CreateAgentStandalone<'info> {
    #[account(
        init,
        payer = user,
        space = 8 + Agent::INIT_SPACE,
        seeds = [b"agent", user.key().as_ref(), &agent_id.to_le_bytes()],
        bump
    )]
    pub agent: Account<'info, Agent>,
    /// CHECK: Protocol Treasury Wallet (Funds sent here)
    #[account(mut)]
    pub treasury: AccountInfo<'info>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(agent_id: u64)]
pub struct RecordTradeStandalone<'info> {
    #[account(
        mut,
        seeds = [b"agent", user.key().as_ref(), &agent_id.to_le_bytes()],
        bump = agent.bump,
        constraint = agent.owner == user.key()
    )]
    pub agent: Account<'info, Agent>,
    pub user: Signer<'info>,
}

#[derive(Accounts)]
#[instruction(agent_id: u64)]
pub struct SubmitTradeIntent<'info> {
    #[account(
        mut,
        seeds = [b"agent", user.key().as_ref(), &agent_id.to_le_bytes()],
        bump = agent.bump,
        constraint = agent.owner == user.key()
    )]
    pub agent: Account<'info, Agent>,
    pub user: Signer<'info>,
}

// ============ STATE ACCOUNTS ============

#[account]
#[derive(InitSpace)]
pub struct UserStats {
    pub bump: u8,
    pub user: Pubkey,
    pub total_volume: u64,
    pub predictions_count: u64,
    pub correct_predictions: u64,
    pub agents_count: u64,
}

#[account]
#[derive(InitSpace)]
pub struct Agent {
    pub bump: u8,
    pub owner: Pubkey,
    pub agent_id: u64,
    pub archetype: u8,         // 0 = Sniper, 1 = Sentinel, 2 = Oracle
    pub risk_level: u8,        // 0-100
    pub capital: u64,          // In lamports
    pub leverage: u8,          // 1, 2, 5, 10
    #[max_len(32)]
    pub name: [u8; 32],        // Agent name (padded)
    pub status: u8,            // 0 = Inactive, 1 = Active
    pub created_at: i64,
    pub total_trades: u64,
    pub profitable_trades: u64,
    pub total_pnl: i64,
}

#[repr(u8)]
pub enum AgentStatus {
    Inactive = 0,
    Active = 1,
}

#[error_code]
pub enum CustomError {
    #[msg("Agent is currently inactive.")]
    AgentInactive,
}

// ============ EVENTS ============

#[event]
pub struct AgentCreated {
    pub owner: Pubkey,
    pub agent_id: u64,
    pub archetype: u8,
    pub timestamp: i64,
}

#[event]
pub struct PredictionMade {
    pub user: Pubkey,
    pub agent_id: u64,
    pub volume: u64,
    pub prediction_hash: [u8; 32],
    pub pnl: i64,
    pub timestamp: i64,
}

#[event]
pub struct LegacyPredictionMade {
    pub user: Pubkey,
    pub volume: u64,
    pub prediction_hash: [u8; 32],
    pub timestamp: i64,
}

#[event]
pub struct TradeIntentSubmitted {
    pub agent_id: u64,
    pub owner: Pubkey,
    pub market_ticker: [u8; 32],
    pub side: u8,
    pub amount: u64,
    pub limit_price: u64,
    pub timestamp: i64,
}

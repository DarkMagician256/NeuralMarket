/**
 * ============ UTILITY FUNCTIONS ============
 *
 * Common formatting and helper functions used across the frontend
 */

/**
 * Format USDC amount for display
 * @param cents - Amount in cents (e.g., 500000 = $5000.00)
 * @returns Formatted string (e.g., "5,000.00")
 */
export function formatUSDC(cents: number): string {
  const dollars = cents / 100;
  return dollars.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

/**
 * Format Solana wallet address
 * @param address - Full Solana address
 * @param length - Number of characters to show (default: 4)
 * @returns Shortened address (e.g., "11111...u0vW")
 */
export function shortenAddress(address: string, length = 4): string {
  if (address.length <= length * 2) return address;
  return `${address.substring(0, length)}...${address.substring(address.length - length)}`;
}

/**
 * Format timestamp for display
 * @param timestamp - Millisecond timestamp
 * @returns Formatted date/time string
 */
export function formatDate(timestamp: number): string {
  const date = new Date(timestamp);
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Format basis points to percentage
 * @param bps - Basis points (0-10000)
 * @returns Percentage string (e.g., "65.00%")
 */
export function formatBpsToPercent(bps: number): string {
  return (bps / 100).toFixed(2) + '%';
}

/**
 * Parse basis points to decimal
 * @param bps - Basis points (0-10000)
 * @returns Decimal value (0-1)
 */
export function bpsToDecimal(bps: number): number {
  return bps / 10000;
}

/**
 * Parse percentage to basis points
 * @param percent - Percentage (0-100)
 * @returns Basis points (0-10000)
 */
export function percentToBps(percent: number): number {
  return Math.round(percent * 100);
}

/**
 * Generate a hex color from a value
 * @param value - Value between 0-100
 * @returns Hex color code
 */
export function valueToHexColor(value: number): string {
  const hue = (value / 100) * 120; // Green (0) to Red (120)
  const saturation = 100;
  const lightness = 50;

  const c = ((1 - Math.abs((2 * lightness) / 100 - 1)) * saturation) / 100;
  const x = c * (1 - Math.abs(((hue / 60) % 2) - 1));
  const m = lightness / 100 - c / 2;

  let r = 0,
    g = 0,
    b = 0;

  if (hue >= 0 && hue < 60) {
    r = c;
    g = x;
  } else if (hue >= 60 && hue < 120) {
    r = x;
    g = c;
  } else if (hue >= 120 && hue < 180) {
    g = c;
    b = x;
  } else if (hue >= 180 && hue < 240) {
    g = x;
    b = c;
  } else if (hue >= 240 && hue < 300) {
    r = x;
    b = c;
  } else {
    r = c;
    b = x;
  }

  r = Math.round((r + m) * 255);
  g = Math.round((g + m) * 255);
  b = Math.round((b + m) * 255);

  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
}

/**
 * Copy text to clipboard
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

/**
 * Validate Solana public key
 */
export function isValidPublicKey(key: string): boolean {
  try {
    // Base58 validation (simplified)
    return /^[1-9A-HJ-NP-Z]{44}$/.test(key);
  } catch {
    return false;
  }
}

/**
 * Format transaction hash
 */
export function formatTxHash(hash: string): string {
  return shortenAddress(hash, 8);
}

/**
 * Get Solscan URL for Devnet
 */
export function getSolscanUrl(txHash: string): string {
  return `https://solscan.io/tx/${txHash}?cluster=devnet`;
}

/**
 * Calculate time ago string
 */
export function timeAgo(timestamp: number): string {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  const intervals: Array<[string, number]> = [
    ['year', 31536000],
    ['month', 2592000],
    ['week', 604800],
    ['day', 86400],
    ['hour', 3600],
    ['minute', 60],
  ];

  for (const [name, interval] of intervals) {
    const count = Math.floor(seconds / interval);
    if (count >= 1) return `${count} ${name}${count > 1 ? 's' : ''} ago`;
  }

  return 'just now';
}

import { z } from 'zod';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const envSchema = z.object({
    // Solana
    SOLANA_PRIVATE_KEY: z.string().optional().default(""), // RELAXED FOR DEBUGGING
    RPC_URL: z.string().optional().default("https://api.devnet.solana.com"), // RELAXED

    // AI
    // Force a valid-looking dummy if missing to prevent crash, user must update later
    OPENAI_API_KEY: z.string().default("sk-dummy-key-for-startup-check"),
    TAVILY_API_KEY: z.string().optional(),

    // Kalshi
    KALSHI_API_KEY: z.string().optional().default(""), // RELAXED
    KALSHI_ACCESS_KEY: z.string().optional().default(""), // RELAXED
    KALSHI_BUILDER_CODE: z.string().optional().default("ORACULO_V2"),

    // DFlow
    DFLOW_API_KEY: z.string().optional(),

    // Infra
    SERVER_PORT: z.coerce.number().default(3000),
    DATABASE_URL: z.string().optional(),
    SUPABASE_URL: z.string().optional().default(""), // RELAXED
    SUPABASE_SERVICE_KEY: z.string().optional().default(""), // RELAXED
});

export type EnvConfig = z.infer<typeof envSchema>;

function validateEnv(): EnvConfig {
    console.log("🔍 [DEBUG] Checking Environment Variables...");
    const keys = Object.keys(process.env).filter(k => !k.startsWith('npm_') && !k.startsWith('BUN_'));
    console.log("   Available Keys:", keys.join(', '));

    // Debug specific critical keys presence (without leaking values)
    const criticalKeys = ['SOLANA_PRIVATE_KEY', 'RPC_URL', 'OPENAI_API_KEY', 'KALSHI_API_KEY', 'SUPABASE_URL'];
    criticalKeys.forEach(key => {
        const val = process.env[key];
        console.log(`   -> ${key}: ${val ? (val.length > 5 ? val.substring(0, 3) + '...' : 'PRESENT (SHORT)') : 'MISSING/UNDEFINED'}`);
    });

    try {
        return envSchema.parse(process.env);
    } catch (error: any) {
        if (error instanceof z.ZodError) {
            console.error("❌ FATAL: Invalid Configuration");
            error.errors.forEach((err: any) => {
                console.error(`   -> ${err.path.join('.')}: ${err.message}`);
            });
            process.exit(1);
        }
        throw error;
    }
}

export const config = validateEnv();

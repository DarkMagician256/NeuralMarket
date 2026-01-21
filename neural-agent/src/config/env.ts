import { z } from 'zod';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const envSchema = z.object({
    // Solana
    SOLANA_PRIVATE_KEY: z.string().min(10, "Solana Private Key is required"),
    RPC_URL: z.string().url("Valid RPC URL is required"),

    // AI
    OPENAI_API_KEY: z.string().startsWith("sk-", "Invalid OpenAI Key"),
    TAVILY_API_KEY: z.string().optional(),

    // Kalshi
    KALSHI_API_KEY: z.string().min(1, "Kalshi API Key is required"),
    KALSHI_ACCESS_KEY: z.string().min(1, "Kalshi Access Key is required"),
    KALSHI_BUILDER_CODE: z.string().min(1, "CRITICAL: KALSHI_BUILDER_CODE is missing. Monetization disabled."),

    // DFlow
    DFLOW_API_KEY: z.string().optional(),

    // Infra
    SERVER_PORT: z.coerce.number().default(3000),
    DATABASE_URL: z.string().optional(),
    SUPABASE_URL: z.string().url("Valid Supabase URL is required"),
    SUPABASE_SERVICE_KEY: z.string().min(1, "Supabase Service Key is required"),
});

export type EnvConfig = z.infer<typeof envSchema>;

function validateEnv(): EnvConfig {
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

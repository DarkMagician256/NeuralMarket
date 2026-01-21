"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const zod_1 = require("zod");
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
// Load environment variables
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, '../.env') });
const envSchema = zod_1.z.object({
    // Solana
    SOLANA_PRIVATE_KEY: zod_1.z.string().min(10, "Solana Private Key is required"),
    RPC_URL: zod_1.z.string().url("Valid RPC URL is required"),
    // AI
    OPENAI_API_KEY: zod_1.z.string().startsWith("sk-", "Invalid OpenAI Key"),
    TAVILY_API_KEY: zod_1.z.string().optional(),
    // Kalshi
    KALSHI_API_KEY: zod_1.z.string().min(1, "Kalshi API Key is required"),
    KALSHI_ACCESS_KEY: zod_1.z.string().min(1, "Kalshi Access Key is required"),
    KALSHI_BUILDER_CODE: zod_1.z.string().min(1, "CRITICAL: KALSHI_BUILDER_CODE is missing. Monetization disabled."),
    // DFlow
    DFLOW_API_KEY: zod_1.z.string().optional(),
    // Infra
    SERVER_PORT: zod_1.z.coerce.number().default(3000),
    DATABASE_URL: zod_1.z.string().optional(),
    SUPABASE_URL: zod_1.z.string().url("Valid Supabase URL is required"),
    SUPABASE_SERVICE_KEY: zod_1.z.string().min(1, "Supabase Service Key is required"),
});
function validateEnv() {
    try {
        return envSchema.parse(process.env);
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            console.error("❌ FATAL: Invalid Configuration");
            error.errors.forEach((err) => {
                console.error(`   -> ${err.path.join('.')}: ${err.message}`);
            });
            process.exit(1);
        }
        throw error;
    }
}
exports.config = validateEnv();

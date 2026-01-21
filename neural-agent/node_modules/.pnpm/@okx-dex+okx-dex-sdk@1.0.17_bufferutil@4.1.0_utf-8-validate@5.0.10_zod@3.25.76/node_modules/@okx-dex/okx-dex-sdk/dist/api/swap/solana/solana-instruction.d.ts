import { ChainConfig, OKXConfig, SolanaSwapInstructionData, SwapResult } from "../../../types";
export declare class SolanaInstructionExecutor {
    private readonly config;
    private readonly networkConfig;
    constructor(config: OKXConfig, networkConfig: ChainConfig);
    executeInstructions(instrData: SolanaSwapInstructionData): Promise<SwapResult>;
}

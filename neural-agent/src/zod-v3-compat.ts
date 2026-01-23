// Compatibility layer for Langchain importing 'zod/v3'
import { z } from 'zod';

// Re-export everything from zod
export * from 'zod';
export default z;

// Zod 4 style top-level functions (bridged from Zod 3 schema methods)
export const parseAsync = async (schema: z.ZodType, data: unknown) => {
    return schema.parseAsync(data);
};

export const parse = (schema: z.ZodType, data: unknown) => {
    return schema.parse(data);
};

export const safeParse = (schema: z.ZodType, data: unknown) => {
    return schema.safeParse(data);
};

export const safeParseAsync = async (schema: z.ZodType, data: unknown) => {
    return schema.safeParseAsync(data);
};

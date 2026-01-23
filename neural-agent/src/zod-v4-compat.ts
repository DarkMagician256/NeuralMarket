// Compatibility layer for Langchain importing 'zod/v4/core'
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

// Type exports that Zod 4 might expose
export const $ZodType = z.ZodType;
export const $ZodObject = z.ZodObject;
export const $ZodString = z.ZodString;
export const $ZodNumber = z.ZodNumber;
export const $ZodBoolean = z.ZodBoolean;
export const $ZodArray = z.ZodArray;
export const $ZodOptional = z.ZodOptional;
export const $ZodNullable = z.ZodNullable;
export const $ZodUnion = z.ZodUnion;
export const $ZodEnum = z.ZodEnum;
export const $ZodLiteral = z.ZodLiteral;
export const $ZodTuple = z.ZodTuple;
export const $ZodRecord = z.ZodRecord;
export const $ZodMap = z.ZodMap;
export const $ZodSet = z.ZodSet;
export const $ZodFunction = z.ZodFunction;
export const $ZodLazy = z.ZodLazy;
export const $ZodEffects = z.ZodEffects;
export const $ZodNativeEnum = z.ZodNativeEnum;
export const $ZodDefault = z.ZodDefault;
export const $ZodCatch = z.ZodCatch;
export const $ZodBranded = z.ZodBranded;
export const $ZodPipeline = z.ZodPipeline;

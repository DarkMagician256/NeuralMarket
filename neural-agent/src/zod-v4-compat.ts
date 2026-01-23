// Compatibility layer for Langchain importing 'zod/v4/core'
import { z } from 'zod';
export * from 'zod';
export default z;
// v4/core specific exports that Langchain might need
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

/** Get the instance type of abstract class */
export type AbstractInstanceType<T> = T extends { prototype: infer U } ? U : never;
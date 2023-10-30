import type { Class } from 'type-fest';
import type { AbstractDialect } from '../dialects/abstract/index.js';
import type { EscapeOptions } from '../dialects/abstract/query-generator-typescript.js';
import type { Expression } from '../sequelize.js';
import { BaseSqlExpression } from './base-sql-expression.js';
/**
 * Unlike {@link Fn}, this class does not accept a function name.
 * It must instead be extended by a class that implements the {@link apply} method, in which
 * the function name is provided.
 *
 * The goal of this class is to allow dialect-specific functions to be used in a cross-dialect way.
 * For instance, an extension of this class could be used to represent the `LOWER` function in a cross-dialect way,
 * by generating the correct SQL function name based on which dialect is used.
 */
export declare abstract class DialectAwareFn extends BaseSqlExpression {
    readonly args: readonly Expression[];
    constructor(...args: DialectAwareFn['args']);
    get maxArgCount(): number;
    get minArgCount(): number;
    abstract apply(dialect: AbstractDialect, options?: EscapeOptions): string;
    static build<M extends DialectAwareFn>(this: Class<M>, ...args: DialectAwareFn['args']): M;
}
/**
 * Unquotes JSON values.
 */
export declare class Unquote extends DialectAwareFn {
    get maxArgCount(): number;
    get minArgCount(): number;
    apply(dialect: AbstractDialect, options?: EscapeOptions): string;
}

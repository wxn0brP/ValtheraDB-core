/**
 * Strict mode is enabled by default.
 *
 * ```
 * declare module "@wxn0brp/db-core/types/config" {
 *   interface TypeConfig {
 *     strict: false;
 *   }
 * }
 * ```
 */
export interface TypeConfig {}

export type IsStrict = TypeConfig extends {
	strict: false;
}
	? false
	: true;

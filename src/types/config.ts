/**
 * Enable strict mode.
 * Currently opt-in, but will be enabled by default later.
 *
 * ```
 * declare module "@wxn0brp/db-core/types/config" {
 *   interface TypeConfig {
 *     strict: true;
 *   }
 * }
 * ```
 */
export interface TypeConfig {}

export type IsStrict = TypeConfig extends {
	strict: false;
}
	? false
	: TypeConfig extends {
				strict: true;
			}
		? true
		: false;

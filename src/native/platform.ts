/**
 * Single source of truth for "is this the native App build?".
 *
 * `VITE_BUILD_TARGET=native` is set only by the `build:native` script. Because
 * this is a compile-time constant (Vite statically replaces import.meta.env),
 * every `if (IS_NATIVE_BUILD)` branch is dead-code-eliminated from the Site
 * builds — so no Capacitor code ever ships to the web. See CONTEXT.md
 * "Distribution" and docs/adr/0003.
 */
export const IS_NATIVE_BUILD = import.meta.env.VITE_BUILD_TARGET === 'native';

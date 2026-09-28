import type { ComputedRef, InjectionKey } from 'vue'

export const TABLE_GRID_KEY: InjectionKey<ComputedRef<string | undefined>> = Symbol('table-grid')

import type { InjectionKey, Ref } from 'vue'

export type TableDragMovePayload = {
  itemId: string
  fromGroupId: string
  toGroupId: string
  toIndex: number
}

export type TableDragContext = {
  draggingId: Ref<string | null>
  isDropLineAt: (groupId: string, index: number) => boolean
  isDragging: (itemId: string) => boolean
  onRowDragStart: (e: DragEvent, itemId: string, groupId: string, index: number) => void
  onRowDragOver: (e: DragEvent, groupId: string, index: number) => void
  onGroupDragOver: (e: DragEvent, groupId: string, itemCount: number) => void
  onDrop: (e: DragEvent) => void
  onDragEnd: () => void
  onRootDragOver: (e: DragEvent) => void
}

export type TableDragGroupContext = {
  id: Ref<string>
  itemCount: Ref<number>
}

export const TABLE_DRAG_KEY: InjectionKey<TableDragContext> = Symbol('table-drag')
export const TABLE_DRAG_GROUP_KEY: InjectionKey<TableDragGroupContext> = Symbol('table-drag-group')

export function applyTableDragMove<TItem extends { id: string }>(
  groups: Array<{ id: string; items: TItem[] }>,
  payload: TableDragMovePayload,
) {
  const from = groups.find((group) => group.id === payload.fromGroupId)
  const to = groups.find((group) => group.id === payload.toGroupId)
  if (!from || !to) return

  const fromIndex = from.items.findIndex((item) => item.id === payload.itemId)
  if (fromIndex === -1) return
  if (from.id === to.id && fromIndex === payload.toIndex) return

  const [item] = from.items.splice(fromIndex, 1)
  if (!item) return

  let insertAt = payload.toIndex
  if (from.id === to.id && fromIndex < insertAt) insertAt -= 1
  insertAt = Math.max(0, Math.min(insertAt, to.items.length))
  to.items.splice(insertAt, 0, item)
}

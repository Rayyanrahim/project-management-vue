import { onBeforeUnmount, ref } from 'vue'
import type { TableDragContext, TableDragMovePayload } from './table-drag'

function isInteractiveTarget(target: EventTarget | null) {
  if (!(target instanceof Element)) return false
  return !!target.closest('button, a, input, textarea, select, [data-no-drag]')
}

export function createTableDrag(options: {
  onMove: (payload: TableDragMovePayload) => void
  onGroupHover?: (groupId: string) => void
}): TableDragContext {
  const draggingId = ref<string | null>(null)
  const fromGroupId = ref<string | null>(null)
  const dropGroupId = ref<string | null>(null)
  const dropIndex = ref(0)

  function clearDrop() {
    draggingId.value = null
    fromGroupId.value = null
    dropGroupId.value = null
    dropIndex.value = 0
    document.documentElement.classList.remove('table-is-dragging')
  }

  function isDropLineAt(groupId: string, index: number) {
    return !!draggingId.value && dropGroupId.value === groupId && dropIndex.value === index
  }

  function isDragging(itemId: string) {
    return draggingId.value === itemId
  }

  function setDropAt(groupId: string, index: number) {
    dropGroupId.value = groupId
    dropIndex.value = index
    options.onGroupHover?.(groupId)
  }

  function onRowDragStart(e: DragEvent, itemId: string, groupId: string, index: number) {
    if (isInteractiveTarget(e.target)) {
      e.preventDefault()
      return
    }

    const transfer = e.dataTransfer
    if (!transfer) return

    draggingId.value = itemId
    fromGroupId.value = groupId
    dropGroupId.value = groupId
    dropIndex.value = index

    transfer.effectAllowed = 'move'
    transfer.setData('text/plain', itemId)

    const row = e.currentTarget
    if (row instanceof HTMLElement) {
      transfer.setDragImage(row, 24, 16)
    }

    document.documentElement.classList.add('table-is-dragging')
  }

  function onRowDragOver(e: DragEvent, groupId: string, index: number) {
    if (!draggingId.value) return
    e.preventDefault()
    e.stopPropagation()
    if (e.dataTransfer) e.dataTransfer.dropEffect = 'move'

    const row = e.currentTarget
    if (!(row instanceof HTMLElement)) return
    const rect = row.getBoundingClientRect()
    setDropAt(groupId, e.clientY > rect.top + rect.height / 2 ? index + 1 : index)
  }

  function onGroupDragOver(e: DragEvent, groupId: string, itemCount: number) {
    if (!draggingId.value) return
    e.preventDefault()
    if (e.dataTransfer) e.dataTransfer.dropEffect = 'move'

    const target = e.target
    if (target instanceof Element && target.closest('[data-table-drag-id]')) return

    setDropAt(groupId, itemCount)
  }

  function onDrop(e: DragEvent) {
    if (!draggingId.value || !fromGroupId.value || !dropGroupId.value) return
    e.preventDefault()
    e.stopPropagation()

    options.onMove({
      itemId: draggingId.value,
      fromGroupId: fromGroupId.value,
      toGroupId: dropGroupId.value,
      toIndex: dropIndex.value,
    })
    clearDrop()
  }

  function onDragEnd() {
    if (draggingId.value) clearDrop()
  }

  function onRootDragOver(e: DragEvent) {
    if (!draggingId.value) return
    const list = e.currentTarget
    if (!(list instanceof HTMLElement)) return

    const rect = list.getBoundingClientRect()
    const edge = 56
    if (e.clientY < rect.top + edge) list.scrollTop -= 14
    else if (e.clientY > rect.bottom - edge) list.scrollTop += 14
  }

  onBeforeUnmount(clearDrop)

  return {
    draggingId,
    isDropLineAt,
    isDragging,
    onRowDragStart,
    onRowDragOver,
    onGroupDragOver,
    onDrop,
    onDragEnd,
    onRootDragOver,
  }
}

<script setup lang="ts">
import { inject, provide, toRef, type HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'
import { TABLE_DRAG_GROUP_KEY, TABLE_DRAG_KEY } from './table-drag'

const props = defineProps<{
  groupId: string
  itemCount: number
  class?: HTMLAttributes['class']
}>()

const drag = inject(TABLE_DRAG_KEY, null)

provide(TABLE_DRAG_GROUP_KEY, {
  id: toRef(props, 'groupId'),
  itemCount: toRef(props, 'itemCount'),
})
</script>

<template>
  <div
    :class="cn(props.class)"
    :data-table-drag-group="groupId"
    @dragover="drag?.onGroupDragOver($event, groupId, itemCount)"
    @drop="drag?.onDrop($event)"
  >
    <slot />
  </div>
</template>

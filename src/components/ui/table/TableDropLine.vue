<template>
  <div class="table-drop-line" aria-hidden="true" />
</template>

<style scoped>
.table-drop-line {
  position: relative;
  z-index: 5;
  height: 0;
  pointer-events: none;
}

.table-drop-line::before {
  content: '';
  position: absolute;
  top: -1px;
  right: 12px;
  left: 18px;
  height: 2px;
  border-radius: 1px;
  background: var(--color-primary);
}

.table-drop-line::after {
  content: '';
  position: absolute;
  top: -4px;
  left: 8px;
  border-top: 4px solid transparent;
  border-bottom: 4px solid transparent;
  border-left: 6px solid var(--color-primary);
}
</style>

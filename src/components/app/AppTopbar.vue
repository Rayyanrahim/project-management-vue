<template>
  <header class="flex h-10 w-full justify-between items-center gap-2 border-x border-t border-[var(--color-border-default)] bg-white px-2.5">
    <div class="flex items-center gap-2">
    <Dropdown class="inline-flex">
      <DropdownTrigger
        class="app-control-height flex cursor-pointer items-center gap-[6px] rounded-md bg-app-muted-foreground px-1.5 hover:bg-surface-muted"
      >
        <template #default="{ open }">
          <div class="flex h-4.5 w-4.5 items-center justify-center rounded-sm px-[6px] text-[12px] font-semibold text-white bg-sky-700">
            T
          </div>
          <div class="flex items-center gap-[6px]">
            <span class="hidden text-[13px] font-medium text-app-black lg:inline">
              testing-15
            </span>
            <ChevronDown class="h-3 w-3 text-para hover:text-app-black transition-transform " />
          </div>
        </template>
      </DropdownTrigger>

      <DropdownContent class="w-72" align="start">
        <DropdownItem class="app-control-height text-app-black">
          testing-15
        </DropdownItem>
        <DropdownItem class="app-control-height text-app-black">
          K-labs
        </DropdownItem>
        <DropdownItem class="app-control-height text-app-black">
          Create workspace
        </DropdownItem>
      </DropdownContent>
    </Dropdown>
    </div>

    <div class="ml-2 flex  items-center">
      <Button
        type="button"
        variant="app-outline"
        size="lg"
        class="app-control-height min-w-[250px] justify-start rounded-xl border-[var(--color-border-default)] px-3 text-[12px] font-medium text-gray-500 shadow-sm"
      >
        <Search class="mr-2 h-3.5 w-3.5 text-gray-400" />
        Search
      </Button>
    </div>

    <div class=" flex items-center gap-2.5">
      <div class="flex h-6 w-6 items-center justify-center rounded-full bg-amber-800 text-[10px] font-semibold text-white">
        R
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ChevronDown, Search } from '@lucide/vue'
import { Button } from '@/components/ui/button'
import { Dropdown, DropdownContent, DropdownItem, DropdownTrigger } from '@/components/ui/dropdown'
</script>

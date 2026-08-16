<template>
  <header class="flex h-10 w-full items-center justify-between gap-2 border-x border-t border-[var(--color-border-default)] bg-white px-2.5">
    <div class="flex items-center gap-2">
      <Dropdown class="inline-flex">
        <DropdownTrigger
          class="app-control-height flex cursor-pointer items-center gap-[6px] rounded-md bg-app-muted-foreground px-1.5 hover:bg-surface-muted"
        >
          <template #default="{ open }">
            <div class="flex h-4.5 w-4.5 items-center justify-center rounded-sm bg-sky-700 px-[6px] text-[12px] font-semibold text-white">
              F
            </div>
            <div class="flex items-center gap-[6px]">
              <span class="hidden text-[13px] font-medium text-app-black lg:inline">
                Flixx Solutions
              </span>
              <ChevronDown class="h-3 w-3 text-para transition-transform hover:text-app-black" />
            </div>
          </template>
        </DropdownTrigger>

        <DropdownContent class="w-72 max-w-[calc(100vw-1rem)]" align="start">
          <DropdownItem>
            Flixx Solutions
          </DropdownItem>
          <DropdownItem>
            K-labs
          </DropdownItem>
          <DropdownItem>
            Create workspace
          </DropdownItem>
        </DropdownContent>
      </Dropdown>
    </div>

    <div class="ml-2 flex items-center">
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

    <div class="flex items-center gap-2.5">
      <Dropdown class="inline-flex">
        <DropdownTrigger
          aria-label="Open profile menu"
          class="inline-flex h-8 cursor-pointer items-center gap-0.5 rounded-full px-1 text-app-black transition-colors hover:bg-surface-muted"
        >
          <template #default="{ open }">
            <div class="relative flex h-6 w-6 items-center justify-center rounded-full bg-violet-600 text-[10px] font-semibold text-white">
              R
              
                <span class="absolute -bottom-0.5 -right-0.5 h-[11px] w-[11px] rounded-sm border-2 border-white bg-emerald-500" />
            </div>
            <ChevronDown class="h-3 w-3 text-para transition-colors hover:text-app-black" />
          </template>
        </DropdownTrigger>

        <DropdownContent
          class="w-72 max-w-[calc(100vw-1rem)]"
          align="end"
        >
          <div class="max-h-[calc(100dvh-4.5rem)] overflow-y-auto overscroll-contain">
            <div class="px-3 pb-3 pt-1">
              <div class="flex items-start gap-2.5">
                <div class="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-violet-600 text-sm font-semibold text-white">
                  R
                  <span class="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-sm border-2 border-white bg-emerald-500" />
                </div>

                <div class="min-w-0 flex-1">
                  <div class="flex items-center text-app-black">
                    <span class="truncate text-[13px] font-medium">rayyan.klabs@gmail.com</span>
                  </div>
                  <div class="flex items-center leading-3 text-[12px] text-para">
                    <span>Online</span>
                  </div>
                </div>
              </div>
            </div>

            <div class="border-t border-[var(--color-border-default)] pt-2">
              <!-- <DropdownSub>
                <DropdownSubTrigger
                  :icon="VolumeX"
                  :end-icon="ChevronRight"
                  aria-label="Toggle mute notifications submenu"
                >
                  <span>Mute notifications</span>
                </DropdownSubTrigger>

                <DropdownSubContent class="w-40">
                  <DropdownItem>
                    <span>30 minutes</span>
                  </DropdownItem>
                  <DropdownItem>
                    <span>50 minutes</span>
                  </DropdownItem>
                </DropdownSubContent>
              </DropdownSub> -->
              <DropdownItem :icon="VolumeX">
                <span>Mute notifications</span>
              </DropdownItem>
              <DropdownItem :icon="Settings">
                <span>Settings</span>
              </DropdownItem>
              <DropdownItem :icon="Bell">
                <span>Notifications</span>
              </DropdownItem>
              <DropdownItem :icon="CircleArrowRight">
                <span>Logout</span>
              </DropdownItem>
            </div>
          </div>
        </DropdownContent>
      </Dropdown>
    </div>
  </header>
</template>

<script setup lang="ts">
import { Bell, VolumeX, ChevronDown, ChevronRight, CircleArrowRight , Search, Settings } from '@lucide/vue'
import { Button } from '@/components/ui/button'
import { Dropdown, DropdownContent, DropdownItem, DropdownSub, DropdownSubContent, DropdownSubTrigger, DropdownTrigger } from '@/components/ui/dropdown'
</script>

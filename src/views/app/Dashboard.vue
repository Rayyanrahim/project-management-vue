<template>
  <div class="app-dashboard">
    <Tabs v-model="activeTab">
      <AppPageHeader>
        <TabsList class="gap-1 px-1">
          <TabsTrigger value="unread">Unread</TabsTrigger>
          <TabsTrigger value="read">Read</TabsTrigger>
        </TabsList>
      </AppPageHeader>

      <div class="flex min-h-0 flex-1 items-center justify-center px-4 py-10">
        <TabsContent value="unread" class="flex w-full flex-col items-center text-center">
          <div class="relative mb-6 h-[7.5rem] w-40">
            <div
              class="absolute left-6 top-0 h-[4.25rem] w-[7.25rem] rounded-xl border border-border-default bg-[#f3f3f3]"
            />
            <div
              class="absolute left-3 top-3 h-[4.25rem] w-[7.25rem] rounded-xl border border-border-default bg-[#ececec]"
            />
            <div
              class="absolute left-0 top-6 flex h-[4.25rem] w-[7.25rem] items-center gap-2 rounded-xl border border-border-default bg-[#f7f7f7] px-3"
            >
              <div class="flex h-8 w-8 items-center justify-center rounded-full bg-white">
                <User class="h-4 w-4 text-para" />
              </div>
              <div class="flex flex-1 flex-col gap-1.5">
                <span class="h-1.5 w-10 rounded-full bg-[#d9d9d9]" />
                <span class="h-1.5 w-14 rounded-full bg-[#e5e5e5]" />
              </div>
            </div>
            <div
              class="absolute bottom-1 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-[#3a3a3a] text-white"
            >
              <Check class="h-4 w-4" />
            </div>
          </div>

          <h2 class="text-[18px] font-semibold text-app-black">You're all caught up!</h2>
          <p class="mt-1 text-sm text-para">Looks like you don't have any unread replies</p>

          <Button variant="app-outline" class="mt-5 font-medium text-para" @click="activeTab = 'read'">
            Read old replies
          </Button>
        </TabsContent>

        <TabsContent value="read" class="flex w-full flex-col items-center text-center">
          <h2 class="text-[18px] font-semibold text-app-black">No read replies yet</h2>
          <p class="mt-1 text-sm text-para">Replies you have already seen will show up here</p>
        </TabsContent>
      </div>
    </Tabs>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Check, User } from '@lucide/vue'
import AppPageHeader from '@/components/app/AppPageHeader.vue'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

const activeTab = ref<'unread' | 'read'>('unread')
</script>

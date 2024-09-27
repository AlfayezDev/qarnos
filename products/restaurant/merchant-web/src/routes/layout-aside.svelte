<script lang="ts">
import { page } from "$app/stores";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import * as Card from "@/components/ui/card";
import clsx from "clsx";
import { Package2, Bell, type Icon } from "lucide-svelte";
import type { ComponentType } from "svelte";
export let paths: {
	label: string;
	path: string;
	icon: ComponentType<Icon>;
	notificationsCount: number;
}[];
</script>

<div class="flex h-full flex-col gap-2">
  <div class="flex h-14 items-center border-b px-4 lg:h-16 lg:px-6">
    <a href="/" class="flex items-center gap-2 font-semibold">
      <Package2 class="h-6 w-6" />
      <span class="">Qarnos</span>
    </a>
    <Button variant="outline" size="icon" class="ml-auto h-8 w-8">
      <Bell class="h-4 w-4" />
      <span class="sr-only">Toggle notifications</span>
    </Button>
  </div>
  <nav class="flex-1 overflow-auto px-2 py-4 lg:px-4">
    <div class="grid items-start text-sm font-medium">
      {#each paths as path}
        <a
          href={path.path}
          class={clsx(
            "flex capitalize items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-foreground",
            {
              "text-foreground bg-muted": $page.url.pathname.endsWith(
                path.path,
              ),
              "text-muted-foreground": !$page.url.pathname.endsWith(path.path),
            },
          )}
        >
          <svelte:component this={path.icon} class="h-4 w-4" />
          {path.label}
          {#if path.notificationsCount > 0}
            <Badge
              class="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full"
            >
              {path.notificationsCount}
            </Badge>
          {/if}
        </a>
      {/each}
    </div>
  </nav>
  <div class="p-4">
    <Card.Root>
      <Card.Header class="p-2 pt-0 md:p-4">
        <Card.Title>Upgrade to Pro</Card.Title>
        <Card.Description>
          Unlock all features and get unlimited access to our support team.
        </Card.Description>
      </Card.Header>
      <Card.Content class="p-2 pt-0 md:p-4 md:pt-0">
        <Button size="sm" class="w-full">Upgrade</Button>
      </Card.Content>
    </Card.Root>
  </div>
</div>

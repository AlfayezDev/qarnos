<script lang="ts">
import CircleUser from "lucide-svelte/icons/circle-user";
import Menu from "lucide-svelte/icons/menu";
import Package2 from "lucide-svelte/icons/package-2";
import Search from "lucide-svelte/icons/search";
import { Badge } from "$lib/components/ui/badge";
import { Button } from "$lib/components/ui/button";
import * as Card from "$lib/components/ui/card";
import * as DropdownMenu from "$lib/components/ui/dropdown-menu";
import { Input } from "$lib/components/ui/input";
import * as Sheet from "$lib/components/ui/sheet";
import clsx from "clsx";
import { page } from "$app/stores";
import type { ComponentType } from "svelte";
import type { Icon } from "lucide-svelte";
export let paths: {
	label: string;
	path: string;
	icon: ComponentType<Icon>;
	notificationsCount: number;
}[];
</script>

<Sheet.Root>
  <Sheet.Trigger asChild let:builder>
    <Button
      variant="outline"
      size="icon"
      class="shrink-0 md:hidden"
      builders={[builder]}
    >
      <Menu class="h-5 w-5" />
      <span class="sr-only">Toggle navigation menu</span>
    </Button>
  </Sheet.Trigger>
  <Sheet.Content side="left" class="flex flex-col">
    <nav class="grid gap-2 text-lg font-medium">
      <a href="/" class="flex items-center gap-2 text-lg font-semibold">
        <Package2 class="h-6 w-6" />
        <span class="sr-only">Acme Inc</span>
      </a>
      {#each paths as path}
        <a
          href={path.path}
          class={clsx(
            "mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 hover:text-foreground",
            {
              "bg-muted text-foreground": $page.url.pathname.endsWith(
                path.path,
              ),
              "text-muted-foreground": !$page.url.pathname.endsWith(path.path),
            },
          )}
        >
          <svelte:component this={path.icon} class="h-5 w-5" />
          {path.label}
          {#if path.notificationsCount > 0}
            <Badge
              class="ms-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full"
            >
              {path.notificationsCount}
            </Badge>
          {/if}
        </a>
      {/each}
    </nav>
    <div class="mt-auto">
      <Card.Root>
        <Card.Header>
          <Card.Title>Upgrade to Pro</Card.Title>
          <Card.Description>
            Unlock all features and get unlimited access to our support team.
          </Card.Description>
        </Card.Header>
        <Card.Content>
          <Button size="sm" class="w-full">Upgrade</Button>
        </Card.Content>
      </Card.Root>
    </div>
  </Sheet.Content>
</Sheet.Root>
<div class="w-full flex-1">
  <form>
    <div class="relative">
      <Search
        class="absolute start-2.5 top-2.5 h-4 w-4 text-muted-foreground"
      />
      <Input
        type="search"
        placeholder="Search products..."
        class="w-full appearance-none bg-background ps-8 shadow-none md:w-2/3 lg:w-2/3"
      />
    </div>
  </form>
</div>
<DropdownMenu.Root>
  <DropdownMenu.Trigger asChild let:builder>
    <Button
      builders={[builder]}
      variant="secondary"
      size="icon"
      class="rounded-full"
    >
      <CircleUser class="h-5 w-5" />
      <span class="sr-only">Toggle user menu</span>
    </Button>
  </DropdownMenu.Trigger>
  <DropdownMenu.Content align="end">
    <DropdownMenu.Label>My Account</DropdownMenu.Label>
    <DropdownMenu.Separator />
    <DropdownMenu.Item href="/x/settings/general">Settings</DropdownMenu.Item>
    <DropdownMenu.Item href="/x/settings/support">Support</DropdownMenu.Item>
    <DropdownMenu.Separator />
    <DropdownMenu.Item href="/logout">Logout</DropdownMenu.Item>
  </DropdownMenu.Content>
</DropdownMenu.Root>

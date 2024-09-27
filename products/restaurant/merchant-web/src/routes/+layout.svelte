<script lang="ts">
  import "../app.css";
  import Sun from "lucide-svelte/icons/sun";
  import Moon from "lucide-svelte/icons/moon";
  import { toggleMode, ModeWatcher } from "mode-watcher";
  import { Button } from "$lib/components/ui/button";
</script>

<svelte:head>
  <title>Qarnos</title>
</svelte:head>
<Button
  on:click={toggleMode}
  variant="outline"
  size="icon"
  class="fixed z-50 bottom-5 end-5"
>
  <Sun
    class="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
  />
  <Moon
    class="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
  />
  <span class="sr-only">Toggle theme</span>
</Button>
<ModeWatcher />
<div dir="ltr" class="h-full w-full">
  <slot></slot>
</div>

<script lang="ts">
  import * as Dialog from "$lib/components/ui/dialog";
  import { Button } from "$lib/components/ui/button";

  export let isOpen: boolean;
  export let onConfirm: () => void;
  export let onCancel: () => void;
  export let title: string;
  export let message: string;
</script>

<Dialog.Root bind:open={isOpen}>
  <Dialog.Content>
    <Dialog.Header>
      <Dialog.Title>{title}</Dialog.Title>
      <Dialog.Description>{message}</Dialog.Description>
    </Dialog.Header>
    <div class="flex justify-end space-x-2">
      <Button variant="outline" on:click={onCancel}>No</Button>
      <Button variant="default" on:click={onConfirm}>Yes</Button>
    </div>
  </Dialog.Content>
</Dialog.Root>

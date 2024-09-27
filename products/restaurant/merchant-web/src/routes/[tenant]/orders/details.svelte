<script lang="ts">
  import Copy from "lucide-svelte/icons/copy";
  import CreditCard from "lucide-svelte/icons/credit-card";
  import Utensils from "lucide-svelte/icons/utensils";
  import { Button } from "$lib/components/ui/button";
  import * as Card from "$lib/components/ui/card";
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu";
  import { Separator } from "$lib/components/ui/separator";
  import ConfirmModal from "@/components/confirm-modal.svelte";
  import { EllipsisVertical } from "lucide-svelte";
  import type { MealPlan } from "./tempTypes";
  export let details: MealPlan;

  let isConfirmationModalOpen = false;
  let confirmationAction: (() => void) | null = null;
  let confirmationTitle = "";
  let confirmationMessage = "";

  function openConfirmationModal(
    title: string,
    message: string,
    action: () => void,
  ) {
    confirmationMessage = message;
    confirmationTitle = title;
    confirmationAction = action;
    isConfirmationModalOpen = true;
  }

  function handleConfirm() {
    if (confirmationAction) {
      confirmationAction();
    }
    isConfirmationModalOpen = false;
  }

  function handleCancel() {
    isConfirmationModalOpen = false;
  }

  function pauseSubscription() {
    openConfirmationModal(
      "Pause Subscription",
      "Are you sure you want to pause your subscription?",
      () => {
        console.log("Subscription paused");
        // Implement the actual pause logic here
      },
    );
  }

  function cancelSubscription() {
    openConfirmationModal(
      "Cancel Subscription",
      "Are you sure you want to cancel your subscription?",
      () => {
        console.log("Subscription cancelled");
        // Implement the actual cancellation logic here
      },
    );
  }
</script>

<Card.Root class="overflow-hidden">
  <Card.Header class="flex flex-col-reverse gap-2 items-start bg-muted/50">
    <div class="grid gap-0.5">
      <Card.Title class="group flex items-center gap-2 text-lg">
        Meal Plan {details.id}
        <Button
          size="icon"
          variant="outline"
          class="h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100"
        >
          <Copy class="h-3 w-3" />
          <span class="sr-only">Copy Subscription ID</span>
        </Button>
      </Card.Title>
      <Card.Description>Started on: {details.startDate}</Card.Description>
    </div>
    <div class="ms-auto flex items-center gap-1">
      <Button size="sm" variant="outline" class="h-8 gap-1">
        <Utensils class="h-3.5 w-3.5" />
        <span class="lg:sr-only xl:not-sr-only xl:whitespace-nowrap">
          Customize Meals
        </span>
      </Button>
      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild let:builder>
          <Button
            builders={[builder]}
            size="icon"
            variant="outline"
            class="h-8 w-8"
          >
            <EllipsisVertical class="h-3.5 w-3.5" />
            <span class="sr-only">More</span>
          </Button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content align="end">
          <DropdownMenu.Item>Edit Plan</DropdownMenu.Item>
          <DropdownMenu.Item on:click={pauseSubscription}
            >Pause Deliveries</DropdownMenu.Item
          >
          <DropdownMenu.Separator />
          <DropdownMenu.Item on:click={cancelSubscription}
            >Cancel Subscription</DropdownMenu.Item
          >
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    </div>
  </Card.Header>
  <Card.Content class="p-6 text-sm">
    <div class="grid gap-3">
      <div class="font-semibold">Meal Plan Details</div>
      <ul class="grid gap-3">
        <li class="flex items-center justify-between">
          <span class="text-muted-foreground">Plan</span>
          <span>{details.plan}</span>
        </li>
        <li class="flex items-center justify-between">
          <span class="text-muted-foreground">Meals per Week</span>
          <span>{details.mealsPerWeek}</span>
        </li>
        <li class="flex items-center justify-between">
          <span class="text-muted-foreground">Servings per Meal</span>
          <span>{details.servingsPerMeal}</span>
        </li>
        <li class="flex items-center justify-between">
          <span class="text-muted-foreground">Billing Cycle</span>
          <span>{details.billingCycle}</span>
        </li>
        <li class="flex items-center justify-between font-semibold">
          <span class="text-muted-foreground">Weekly Amount</span>
          <span>{details.amount}</span>
        </li>
      </ul>
    </div>
    <Separator class="my-4" />
    <div class="grid gap-3">
      <div class="font-semibold">Dietary Preferences</div>
      <ul class="list-inside list-disc">
        {#each details.dietaryPreferences as preference}
          <li>{preference}</li>
        {/each}
      </ul>
    </div>
    <Separator class="my-4" />

    <div class="grid gap-3">
      <div class="font-semibold">Delivery Address</div>
      <address class="not-italic">
        {details.deliveryAddress.street}<br />
        {details.deliveryAddress.city}, {details.deliveryAddress.state}
        {details.deliveryAddress.zipCode}<br />
        {details.deliveryAddress.country}
      </address>
    </div>
    <Separator class="my-4" />
    <div class="grid gap-3">
      <div class="font-semibold">Payment Information</div>
      <dl class="grid gap-3">
        <div class="flex items-center justify-between">
          <dt class="flex items-center gap-1 text-muted-foreground">
            <CreditCard class="h-4 w-4" />
            {details.paymentMethod.cardType}
          </dt>
          <dd>**** **** **** {details.paymentMethod.lastFourDigits}</dd>
        </div>
      </dl>
    </div>
  </Card.Content>
</Card.Root>

<ConfirmModal
  bind:isOpen={isConfirmationModalOpen}
  title={confirmationTitle}
  message={confirmationMessage}
  onConfirm={handleConfirm}
  onCancel={handleCancel}
/>

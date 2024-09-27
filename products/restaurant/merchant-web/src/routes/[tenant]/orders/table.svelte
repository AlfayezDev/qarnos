<script lang="ts">
import { Badge } from "$lib/components/ui/badge/index.js";
import * as Card from "$lib/components/ui/card/index.js";
import * as Table from "$lib/components/ui/table/index.js";
import clsx from "clsx";
import type { MealPlan, StatusBadgeVariant } from "./tempTypes";

export let mealPlans: MealPlan[];
export let onRowClick: (mealPlan: MealPlan) => void;
export let activeRowId: string | undefined = undefined;
activeRowId = undefined;

function getStatusBadgeVariant(status: MealPlan["status"]): StatusBadgeVariant {
	switch (status) {
		case "Active":
			return "default";
		case "Paused":
			return "outline";
		case "Cancelled":
			return "destructive";
		default:
			return "secondary";
	}
}
</script>

<Card.Root>
  <Card.Header class="px-7">
    <Card.Title>Meal Plans</Card.Title>
    <Card.Description>Your current meal plan subscriptions.</Card.Description>
  </Card.Header>
  <Card.Content>
    <Table.Root>
      <Table.Header>
        <Table.Row>
          <Table.Head>Customer</Table.Head>
          <Table.Head class="hidden sm:table-cell">Plan</Table.Head>
          <Table.Head class="hidden sm:table-cell">Status</Table.Head>
          <Table.Head class="hidden md:table-cell">Next Delivery</Table.Head>
          <Table.Head class="text-right">Amount</Table.Head>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {#each mealPlans as plan (plan.id)}
          <Table.Row
            on:click={() => onRowClick(plan)}
            class={clsx(
              "cursor-pointer transition-colors hover:bg-primary/5 duration-200 ease-in-out",
              {
                "bg-primary/10": plan.id === activeRowId,
              },
            )}
          >
            <Table.Cell>
              <div class="font-medium">{plan.customer}</div>
              <div class="hidden text-sm text-muted-foreground md:inline">
                {plan.email}
              </div>
            </Table.Cell>
            <Table.Cell class="hidden sm:table-cell">{plan.plan}</Table.Cell>
            <Table.Cell class="hidden sm:table-cell">
              <Badge variant={getStatusBadgeVariant(plan.status)}>
                {plan.status}
              </Badge>
            </Table.Cell>
            <Table.Cell class="hidden md:table-cell"
              >{plan.nextDelivery}</Table.Cell
            >
            <Table.Cell class="text-right">{plan.amount}</Table.Cell>
          </Table.Row>
        {/each}
      </Table.Body>
    </Table.Root>
  </Card.Content>
</Card.Root>

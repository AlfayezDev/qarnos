<script lang="ts">
import { Badge } from "$lib/components/ui/badge/index.js";
import * as Table from "$lib/components/ui/table/index.js";

export let subscription: {
	customer: string;
	email: string;
	plan: string;
	status: string;
	renewalDate: string;
	amount: string;
};
export let isFirst: boolean;
</script>

<Table.Row class={isFirst ? "bg-accent" : ""}>
  <Table.Cell>
    <div class="font-medium">{subscription.customer}</div>
    <div class="hidden text-sm text-muted-foreground md:inline">
      {subscription.email}
    </div>
  </Table.Cell>
  <Table.Cell class="hidden sm:table-cell">{subscription.plan}</Table.Cell>
  <Table.Cell class="hidden sm:table-cell">
    <Badge
      class="text-xs"
      variant={subscription.status === "Active" ? "secondary" : "outline"}
    >
      {subscription.status}
    </Badge>
  </Table.Cell>
  <Table.Cell class="hidden md:table-cell"
    >{subscription.renewalDate}</Table.Cell
  >
  <Table.Cell class="text-right">{subscription.amount}</Table.Cell>
</Table.Row>

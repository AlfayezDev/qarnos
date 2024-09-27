<script lang="ts">
  import ArrowUpRight from "lucide-svelte/icons/arrow-up-right";
  import UserPlus from "lucide-svelte/icons/user-plus";
  import DollarSign from "lucide-svelte/icons/dollar-sign";
  import * as Avatar from "$lib/components/ui/avatar";
  import { Badge } from "$lib/components/ui/badge";
  import { Button } from "$lib/components/ui/button";
  import * as Card from "$lib/components/ui/card";
  import * as Table from "$lib/components/ui/table";
  const metrics = [
    {
      title: "Total Revenue",
      value: "$45,231.89",
      change: "+20.1% from last month",
      icon: DollarSign,
    },
    {
      title: "New Subscriptions",
      value: "+2350",
      change: "+180.1% from last month",
      icon: UserPlus,
    },
  ];

  const transactions = [
    {
      customer: "Liam Johnson",
      email: "liam@example.com",
      type: "Sale",
      status: "Approved",
      date: "2023-06-23",
      amount: "$250.00",
    },
    {
      customer: "Olivia Smith",
      email: "olivia@example.com",
      type: "Refund",
      status: "Declined",
      date: "2023-06-24",
      amount: "$150.00",
    },
    {
      customer: "Noah Williams",
      email: "noah@example.com",
      type: "Subscription",
      status: "Approved",
      date: "2023-06-25",
      amount: "$350.00",
    },
    {
      customer: "Emma Brown",
      email: "emma@example.com",
      type: "Sale",
      status: "Approved",
      date: "2023-06-26",
      amount: "$450.00",
    },
    {
      customer: "Liam Johnson",
      email: "liam@example.com",
      type: "Sale",
      status: "Approved",
      date: "2023-06-27",
      amount: "$550.00",
    },
  ];

  const recentSales = [
    {
      name: "Olivia Martin",
      email: "olivia.martin@email.com",
      amount: "+$1,999.00",
      avatar: "/avatars/01.png",
      initials: "OM",
    },
    {
      name: "Jackson Lee",
      email: "jackson.lee@email.com",
      amount: "+$39.00",
      avatar: "/avatars/02.png",
      initials: "JL",
    },
    {
      name: "Isabella Nguyen",
      email: "isabella.nguyen@email.com",
      amount: "+$299.00",
      avatar: "/avatars/03.png",
      initials: "IN",
    },
    {
      name: "William Kim",
      email: "will@email.com",
      amount: "+$99.00",
      avatar: "/avatars/04.png",
      initials: "WK",
    },
    {
      name: "Sofia Davis",
      email: "sofia.davis@email.com",
      amount: "+$39.00",
      avatar: "/avatars/05.png",
      initials: "SD",
    },
  ];
</script>

<main class="flex flex-1 flex-col gap-4 md:gap-8">
  <div class="grid gap-4 md:gap-8 lg:grid-cols-6">
    <div class="lg:col-span-3 flex gap-2 flex-col">
      <div class="flex flex-row gap-4 md:gap-8">
        {#each metrics as metric}
          <Card.Root>
            <Card.Header
              class="flex flex-row items-center justify-between space-y-0 pb-2"
            >
              <Card.Title class="text-sm font-medium">{metric.title}</Card.Title
              >
              <svelte:component
                this={metric.icon}
                class="h-4 w-4 text-muted-foreground"
              />
            </Card.Header>
            <Card.Content>
              <div class="text-2xl font-bold">{metric.value}</div>
              <p class="text-xs text-muted-foreground">{metric.change}</p>
            </Card.Content>
          </Card.Root>
        {/each}
      </div>
      <Card.Root>
        <Card.Header class="flex flex-row items-center">
          <div class="grid gap-2">
            <Card.Title>New Customers</Card.Title>
            <Card.Description>First ever subscribers.</Card.Description>
          </div>
          <Button href="/x/orders" size="sm" class="ml-auto gap-1">
            View All
            <ArrowUpRight class="h-4 w-4" />
          </Button>
        </Card.Header>
        <Card.Content>
          <Table.Root>
            <Table.Header>
              <Table.Row>
                <Table.Head>Customer</Table.Head>
                <Table.Head class="text-right">Joined at</Table.Head>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {#each transactions as transaction}
                <Table.Row>
                  <Table.Cell>
                    <div class="font-medium">{transaction.customer}</div>
                    <div class="hidden text-sm text-muted-foreground md:inline">
                      {transaction.email}
                    </div>
                  </Table.Cell>
                  <Table.Cell class="text-right">{transaction.date}</Table.Cell>
                </Table.Row>
              {/each}
            </Table.Body>
          </Table.Root>
        </Card.Content>
      </Card.Root>
    </div>
    <Card.Root class="lg:col-span-3">
      <Card.Header>
        <Card.Title>Recent Subscriptions</Card.Title>
      </Card.Header>
      <Card.Content class="grid gap-8">
        {#each recentSales as sale}
          <div class="flex items-center gap-2">
            <Avatar.Root class="hidden h-9 w-9 sm:flex">
              <Avatar.Image src={sale.avatar} alt="Avatar" />
              <Avatar.Fallback>{sale.initials}</Avatar.Fallback>
            </Avatar.Root>
            <div class="grid gap-1">
              <p class="text-sm font-medium leading-none">{sale.name}</p>
              <p class="text-xs text-muted-foreground">{sale.email}</p>
            </div>
            <div class="ms-auto font-medium">{sale.amount}</div>
          </div>
        {/each}
      </Card.Content>
    </Card.Root>
  </div>
</main>

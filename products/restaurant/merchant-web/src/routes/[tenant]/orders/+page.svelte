<script lang="ts">
  import { goto } from "$app/navigation";
  import File from "lucide-svelte/icons/file";
  import ListFilter from "lucide-svelte/icons/list-filter";
  import { Button } from "$lib/components/ui/button";
  import * as Card from "$lib/components/ui/card";
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu";
  import * as Pagination from "$lib/components/ui/pagination";
  import { Progress } from "$lib/components/ui/progress";
  import * as Tabs from "$lib/components/ui/tabs";
  import { fly } from "svelte/transition";
  import MealPlanTable from "./table.svelte";
  import MealPlanDetails from "./details.svelte";

  import type { PageData } from "./$types";
  import type { MealPlan } from "./tempTypes";
  import { spring } from "svelte/motion";

  const scale = spring(1);
  export let data: PageData;

  $: ({ mealPlans, pagination, filterOptions, appliedFilters, stats } = data);
  let selectedPlanId: string | undefined = undefined;
  $: selectedPlan = selectedPlanId
    ? mealPlans.find((plan) => plan.id === selectedPlanId)
    : null;
  function handleRowClick(mealPlan: MealPlan): void {
    selectedPlanId = mealPlan.id;
  }

  function applyFilters(status: string, plan: string): void {
    goto(`?page=1&status=${status}&plan=${plan}`);
  }

  function changePage(newPage: number): void {
    goto(
      `?page=${newPage}&status=${appliedFilters.status}&plan=${appliedFilters.plan}`,
    );
  }
</script>

<main
  class="grid flex-1 items-start gap-4 md:gap-8 lg:grid-cols-3 xl:grid-cols-3"
>
  <div class="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
    <div
      class="grid gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4"
    >
      <Card.Root class="sm:col-span-2">
        <Card.Header class="pb-3">
          <Card.Title>Your Healthy Meal Plans</Card.Title>
          <Card.Description class="max-w-lg text-balance leading-relaxed">
            Manage your personalized meal plans and track your journey to a
            healthier lifestyle with our dynamic dashboard.
          </Card.Description>
        </Card.Header>
        <Card.Footer>
          <Button>Create New Meal Plan</Button>
        </Card.Footer>
      </Card.Root>
      {#each stats as stat}
        <Card.Root>
          <Card.Header class="pb-2">
            <Card.Description>{stat.period}</Card.Description>
            <Card.Title class="text-4xl">{stat.amount}</Card.Title>
          </Card.Header>
          <Card.Content>
            <div class="text-xs text-muted-foreground">{stat.change}</div>
          </Card.Content>
          <Card.Footer>
            <Progress
              value={stat.progress}
              aria-label="{stat.progress}% increase"
            />
          </Card.Footer>
        </Card.Root>
      {/each}
    </div>
    <Tabs.Root value="week">
      <div class="flex items-center">
        <Tabs.List>
          <Tabs.Trigger value="week">Week</Tabs.Trigger>
          <Tabs.Trigger value="month">Month</Tabs.Trigger>
          <Tabs.Trigger value="year">Year</Tabs.Trigger>
        </Tabs.List>
        <div class="ms-auto flex items-center gap-2">
          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild let:builder>
              <Button
                variant="outline"
                size="sm"
                class="h-7 gap-1 text-sm"
                builders={[builder]}
              >
                <ListFilter class="h-3.5 w-3.5" />
                <span class="sr-only sm:not-sr-only">Filter</span>
              </Button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Content align="end">
              <DropdownMenu.Label>Filter by Status</DropdownMenu.Label>
              <DropdownMenu.Separator />
              {#each filterOptions.status as status}
                <DropdownMenu.CheckboxItem
                  checked={appliedFilters.status === status}
                  onCheckedChange={() =>
                    applyFilters(status, appliedFilters.plan)}
                >
                  {status}
                </DropdownMenu.CheckboxItem>
              {/each}
              <DropdownMenu.Separator />
              <DropdownMenu.Label>Filter by Plan</DropdownMenu.Label>
              <DropdownMenu.Separator />
              {#each filterOptions.plan as plan}
                <DropdownMenu.CheckboxItem
                  checked={appliedFilters.plan === plan}
                  onCheckedChange={() =>
                    applyFilters(appliedFilters.status, plan)}
                >
                  {plan}
                </DropdownMenu.CheckboxItem>
              {/each}
            </DropdownMenu.Content>
          </DropdownMenu.Root>
          <Button size="sm" variant="outline" class="h-7 gap-1 text-sm">
            <File class="h-3.5 w-3.5" />
            <span class="sr-only sm:not-sr-only">Export</span>
          </Button>
        </div>
      </div>
      <Tabs.Content value="week">
        <MealPlanTable
          {mealPlans}
          onRowClick={handleRowClick}
          activeRowId={selectedPlan?.id}
        />

        <div class="mt-4 flex items-center justify-between">
          <div class="text-sm text-muted-foreground">
            Showing {(pagination.currentPage - 1) * 5 + 1} to {Math.min(
              pagination.currentPage * 5,
              pagination.totalItems,
            )} of {pagination.totalItems} meal plans
          </div>
          <Pagination.Root
            count={pagination.totalPages}
            class="ml-auto mr-0 w-auto"
          >
            <Pagination.Content>
              <Pagination.PrevButton
                disabled={pagination.currentPage === 1}
                on:click={() => changePage(pagination.currentPage - 1)}
              />
              {#each Array(pagination.totalPages) as _, i}
                <Pagination.Item>
                  <Button
                    size="icon"
                    variant={pagination.currentPage === i + 1
                      ? "default"
                      : "outline"}
                    class="h-6 w-6"
                    on:click={() => changePage(i + 1)}
                  >
                    {i + 1}
                  </Button>
                </Pagination.Item>
              {/each}
              <Pagination.NextButton
                disabled={pagination.currentPage === pagination.totalPages}
                on:click={() => changePage(pagination.currentPage + 1)}
              />
            </Pagination.Content>
          </Pagination.Root>
        </div>
      </Tabs.Content>
    </Tabs.Root>
  </div>
  <div>
    {#if selectedPlan}
      <div in:fly={{ duration: 300, x: 10 }} style="transform: scale({$scale})">
        <MealPlanDetails details={selectedPlan} />
      </div>
    {/if}
  </div>
</main>

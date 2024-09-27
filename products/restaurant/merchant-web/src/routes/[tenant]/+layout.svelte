<script lang="ts">
  import LayoutHeader from "../layout-header.svelte";
  import LayoutAside from "../layout-aside.svelte";
  import {
    HomeIcon,
    type Icon,
    LineChartIcon,
    PackageIcon,
    ShoppingCartIcon,
    UsersIcon,
  } from "lucide-svelte";
  import type { ComponentType } from "svelte";

  const paths = [
    {
      label: "Dashboard",
      path: "/x/dashboard",
      notificationsCount: 0,
      icon: HomeIcon,
    },
    {
      label: "Orders",
      path: "/x/orders",
      notificationsCount: 6,
      icon: ShoppingCartIcon,
    },
    {
      label: "Products",
      path: "/x/products",
      notificationsCount: 0,
      icon: PackageIcon,
    },
    {
      label: "Customers",
      notificationsCount: 0,
      path: "/x/customers",
      icon: UsersIcon,
    },
    {
      notificationsCount: 0,
      label: "Analytics",
      path: "/x/analytics",
      icon: LineChartIcon,
    },
  ] as {
    label: string;
    path: string;
    icon: ComponentType<Icon>;
    notificationsCount: number;
  }[];
</script>

<div class="relative min-h-screen">
  <aside
    class="fixed top-0 left-0 z-30 hidden h-full w-[220px] border-r bg-muted/40 lg:w-[280px] md:block"
  >
    <LayoutAside {paths} />
  </aside>

  <!-- Fixed Header -->
  <header
    class="fixed inset-x-0 top-0 z-20 flex w-full h-16 items-center gap-4 border-b bg-background/80 backdrop-blur-sm px-4 md:ps-60 lg:pe-6 lg:ps-72"
  >
    <LayoutHeader {paths} />
  </header>

  <main class="pt-14 md:pl-[220px] lg:pl-[280px]">
    <div class="min-h-[calc(100vh-3.5rem)] overflow-auto p-4">
      <slot />
    </div>
  </main>
</div>

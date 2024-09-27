import type { PageServerLoad } from "./$types";
import type { MealPlan, FilterOptions, Stat } from "./tempTypes";

// This would typically come from a database
const mealPlans: MealPlan[] = [
  {
    id: "MP1",
    customer: "Liam Johnson",
    email: "liam@example.com",
    plan: "Fit & Lean",
    status: "Active",
    nextDelivery: "2023-07-23",
    amount: "$89.99",
    startDate: "2023-01-15",
    mealsPerWeek: 5,
    servingsPerMeal: 2,
    features: [
      "Calorie-controlled portions",
      "High protein",
      "Low carb options",
    ],
    dietaryPreferences: ["Low-carb", "High-protein", "Dairy-free options"],
    deliverySchedule: {
      day: "Monday",
      timeWindow: "2 PM - 8 PM",
    },
    billingCycle: "Weekly",
    phone: "+1 234 567 890",
    deliveryAddress: {
      street: "1234 Fitness Lane",
      city: "Healthytown",
      state: "CA",
      zipCode: "12345",
      country: "United States",
    },
    paymentMethod: {
      type: "Credit Card",
      cardType: "Visa",
      lastFourDigits: "4532",
    },
  },
];

function getStats(): Stat[] {
  // In a real application, this data would be calculated based on actual orders
  return [
    {
      period: "This Week",
      amount: "1,329 meals",
      change: "+25% from last week",
      progress: 25,
    },
    {
      period: "This Month",
      amount: "5,329 meals",
      change: "+10% from last month",
      progress: 12,
    },
  ];
}

export const load: PageServerLoad = async ({ url }) => {
  const page = Number(url.searchParams.get("page")) || 1;
  const itemsPerPage = 5;
  const status = url.searchParams.get("status") || "All";
  const plan = url.searchParams.get("plan") || "All";

  // Apply filters
  const filteredMealPlans = mealPlans.filter(
    (mealPlan) =>
      (status === "All" || mealPlan.status === status) &&
      (plan === "All" || mealPlan.plan === plan),
  );

  // Calculate pagination
  const totalItems = filteredMealPlans.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedMealPlans = filteredMealPlans.slice(startIndex, endIndex);

  // Get unique plan names for filter options
  const planOptions = ["All", ...new Set(mealPlans.map((plan) => plan.plan))];

  const filterOptions: FilterOptions = {
    status: ["All", "Active", "Paused", "Cancelled"],
    plan: planOptions,
  };

  // Get stats
  const stats = getStats();

  return {
    mealPlans: paginatedMealPlans,
    pagination: {
      currentPage: page,
      totalPages,
      totalItems,
    },
    filterOptions,
    appliedFilters: {
      status,
      plan,
    },
    stats,
  };
};

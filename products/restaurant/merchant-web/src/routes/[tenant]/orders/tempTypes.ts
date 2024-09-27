import type { Variant } from "$lib/components/ui/badge";
export interface Stat {
  period: string;
  amount: string;
  change: string;
  progress: number;
}

export interface MealPlan {
  id: string;
  customer: string;
  email: string;
  plan: string;
  status: "Active" | "Paused" | "Cancelled";
  nextDelivery: string;
  amount: string;
  startDate: string;
  mealsPerWeek: number;
  servingsPerMeal: number;
  features: string[];
  dietaryPreferences: string[];
  deliverySchedule: {
    day: string;
    timeWindow: string;
  };
  billingCycle: string;
  phone: string;
  deliveryAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  paymentMethod: {
    type: string;
    cardType: string;
    lastFourDigits: string;
  };
}

export interface FilterOptions {
  status: ("All" | MealPlan["status"])[];
  plan: string[];
}

export interface SelectedFilters {
  status: "All" | MealPlan["status"];
  plan: string;
}

export interface SubscriptionDetails {
  id: string;
  startDate: string;
  plan: {
    name: string;
    mealsPerWeek: number;
    servingsPerMeal: number;
    features: string[];
  };
  dietaryPreferences: string[];
  deliverySchedule: {
    day: string;
    timeWindow: string;
  };
  nextDeliveryDate: string;
  billingCycle: string;
  nextBillingDate: string;
  amount: string;
  subscriber: {
    name: string;
    email: string;
    phone: string;
  };
  deliveryAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  paymentMethod: {
    type: string;
    cardType: string;
    lastFourDigits: string;
  };
}

export type StatusBadgeVariant = Variant;

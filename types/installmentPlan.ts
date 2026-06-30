// types/installmentPlan.types.ts

export interface InstallmentPlan {
  _id: string;
  name: string;
  months: number;
  downPaymentPercentage: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export type CreateInstallmentPlanDto = Omit<InstallmentPlan,
  "_id" | "createdAt" | "updatedAt"
>;

export type UpdateInstallmentPlanDto = Partial<CreateInstallmentPlanDto>;
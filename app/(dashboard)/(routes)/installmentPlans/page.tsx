// app/installmentPlans/page.tsx
import Link from "next/link";
import { getAllInstallments } from "@/services/InstallmentPlan.service";
import InstallmentPlanTable from "@/components/installmentPlan/InstallmentPlanTable";

export default async function InstallmentPlansPage() {
  const plans = await getAllInstallments();

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-medium">خطط التقسيط</h1>
          <p className="text-sm text-muted-foreground mt-1">
            إدارة جميع خطط التقسيط المتاحة
          </p>
        </div>
        <Link
          href="/installmentPlans/create"
          className="flex items-center gap-2 px-4 py-2 text-sm rounded-lg bg-green-700 hover:bg-green-800 text-white font-semibold transition-opacity"
        >
          + خطة جديدة
        </Link>
      </div>

      <InstallmentPlanTable plans={plans} />
    </div>
  );
}

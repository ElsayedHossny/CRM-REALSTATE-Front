// app/installmentPlans/[id]/page.tsx
import { getOneInstallment } from "@/services/InstallmentPlan.service";
import Link from "next/link";
import { Pencil } from "lucide-react";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function InstallmentPlanDetailPage({ params }: Props) {
  const { id } = await params;
  const plan = await getOneInstallment(id);

  return (
    <div className="p-6 max-w-lg">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-medium">{plan.name}</h1>
          <p className="text-sm text-muted-foreground mt-1">
            تفاصيل خطة التقسيط
          </p>
        </div>
        <Link
          href={`/installmentPlans/${plan._id}/edit`}
          className="flex items-center gap-2 px-4 py-2 text-sm rounded-lg border border-border hover:bg-muted transition-colors"
        >
          <Pencil size={14} /> تعديل
        </Link>
      </div>

      {/* Details Card */}
      <div className="rounded-xl border border-border bg-card divide-y divide-border">
        <div className="flex justify-between items-center px-5 py-4">
          <span className="text-sm text-muted-foreground">الاسم</span>
          <span className="text-sm font-medium">{plan.name}</span>
        </div>

        <div className="flex justify-between items-center px-5 py-4">
          <span className="text-sm text-muted-foreground">المدة</span>
          <span className="text-sm font-medium">{plan.months} شهر</span>
        </div>

        <div className="flex justify-between items-center px-5 py-4">
          <span className="text-sm text-muted-foreground">الدفعة الأولى</span>
          <span className="text-sm font-medium">
            {plan.downPaymentPercentage}%
          </span>
        </div>

        <div className="flex justify-between items-center px-5 py-4">
          <span className="text-sm text-muted-foreground">الحالة</span>
          <span
            className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-medium ${
              plan.isActive
                ? "bg-green-50 text-green-700"
                : "bg-muted text-muted-foreground"
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${plan.isActive ? "bg-green-500" : "bg-gray-400"}`}
            />
            {plan.isActive ? "فعّال" : "معطّل"}
          </span>
        </div>

        <div className="flex justify-between items-center px-5 py-4">
          <span className="text-sm text-muted-foreground">تاريخ الإنشاء</span>
          <span className="text-sm text-muted-foreground">
            {new Date(plan.createdAt).toLocaleDateString("ar-EG")}
          </span>
        </div>

        <div className="flex justify-between items-center px-5 py-4">
          <span className="text-sm text-muted-foreground">آخر تعديل</span>
          <span className="text-sm text-muted-foreground">
            {new Date(plan.updatedAt).toLocaleDateString("ar-EG")}
          </span>
        </div>
      </div>

      {/* Back */}
      <Link
        href="/installmentPlans"
        className="inline-block mt-4 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        ← رجوع للقائمة
      </Link>
    </div>
  );
}

// app/installmentPlans/[id]/edit/page.tsx
import { getOneInstallment } from "@/services/InstallmentPlan.service";
import InstallmentPlanEditForm from "@/components/installmentPlan/InstallmentPlanEditForm";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditInstallmentPlanPage({ params }: Props) {
  const { id } = await params;
  const plan = await getOneInstallment(id);

  return (
    <div className="p-6 max-w-lg">
      <div className="mb-6">
        <h1 className="text-xl font-medium">تعديل خطة التقسيط</h1>
        <p className="text-sm text-muted-foreground mt-1">{plan.name}</p>
      </div>
      <InstallmentPlanEditForm plan={plan} />
    </div>
  );
}

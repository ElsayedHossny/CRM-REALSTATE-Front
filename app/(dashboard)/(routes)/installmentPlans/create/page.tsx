import InstallmentPlanForm from "@/components/installmentPlan/InstallmentPlanForm";

export default function CreateInstallmentPlanPage() {
  return (
    <div className="p-6 max-w-lg">
      <div className="mb-6">
        <h1 className="text-xl font-medium">خطة تقسيط جديدة</h1>
        <p className="text-sm text-muted-foreground mt-1">
          أضف خطة تقسيط جديدة للنظام
        </p>
      </div>
      <InstallmentPlanForm mode="create" />
    </div>
  );
}

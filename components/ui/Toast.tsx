// components/ui/Toast.tsx
export const Toast = ({
  toast,
  onClose,
}: {
  toast: any;
  onClose: () => void;
}) => {
  if (!toast) return null;

  return (
    <div
      className={`fixed bottom-5 right-5 z-50 p-4 rounded-xl shadow-lg text-white ${toast.type === "success" ? "bg-green-700" : "bg-red-600"}`}
    >
      <div className="flex items-center gap-2">
        <span>{toast.message}</span>
        <button onClick={onClose} className="ml-2 font-bold">
          ✕
        </button>
      </div>
    </div>
  );
};

import { Suspense } from "react";
import NewInvoice from "./NewInvoice";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <NewInvoice />
    </Suspense>
  );
}

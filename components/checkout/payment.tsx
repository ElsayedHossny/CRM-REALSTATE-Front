// "use client";

// import { stripePromise } from "@/lib/stripe";

// // 1. تعريف نوع الـ Props لحل أخطاء الـ Any
// interface CheckoutButtonProps {
//   invoiceId: string;
//   installmentId: string;
//   token: string;
// }

// // 2. إضافة النوع للـ Component
// export default function CheckoutButton({ invoiceId, installmentId, token }: CheckoutButtonProps) {
  
//   const handleCheckout = async () => {
//     try {
//       const stripe = await stripePromise;

//       // تأكد إن الـ Stripe متحمّل
//       if (!stripe) {
//         console.error("Stripe.js hasn't loaded yet.");
//         return;
//       }

//       const res = await fetch(
//         "https://back-end-crm-project.vercel.app/api/payments/checkout",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`, 
//           },
//           body: JSON.stringify({
//             invoice_id: invoiceId,
//             installment_id: installmentId,
//           }),
//         }
//       );

//       const data = await res.json();
      
//       if (data.success && data.data) {
        
//         if (data.data.sessionId) {
//           const { error } = await stripe.checkout.sessions.redirectToCheckout({
//             sessionId: data.data.sessionId,
//           });

//           if (error) {
//             console.error(error.message);
//           }
//           return;
//         }

//         if (data.data.url) {
//           window.location.href = data.data.url;
//           return;
//         }
//       }

//       console.error("Failed to get checkout URL", data);
      
//     } catch (error) {
//       console.error("Checkout Error:", error);
//     }
//   };

//   return (
//     <button
//       onClick={handleCheckout}
//       className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
//     >
//       Pay Now
//     </button>
//   );
// }
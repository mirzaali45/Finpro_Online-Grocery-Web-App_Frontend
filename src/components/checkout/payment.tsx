// import { useState } from 'react';

// interface PaymentButtonProps {
//   order_id: string;
// }

// const PaymentButton: React.FC<PaymentButtonProps> = ({ order_id }) => {
//   const [loading, setLoading] = useState<boolean>(false);
//   const [error, setError] = useState<string | null>(null);

//   const handlePayment = async () => {
//     setLoading(true);
//     setError(null);

//     try {
//       // Make the API call to your backend to initiate the payment
//       const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL_BE!}/payment/${order_id}`, {
//         method: 'POST',
//       });

//       if (!response.ok) {
//         throw new Error('Failed to initiate payment');
//       }

//       const data = await response.json();

//       // Redirect the user to the payment page from Midtrans
//       if (data.payment_url) {
//         window.location.href = data.payment_url; // Redirect to Midtrans payment page
//       } else {
//         throw new Error('Payment URL not received');
//       }
//     } catch (err: any) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="text-center">
//       <button
//         onClick={handlePayment}
//         disabled={loading}
//         className="bg-blue-500 text-white px-6 py-3 rounded-md text-lg font-semibold hover:bg-blue-600 disabled:bg-gray-400"
//       >
//         {loading ? 'Processing...' : 'Pay Now'}
//       </button>

//       {error && (
//         <div className="mt-3 text-red-500 font-medium">
//           <p>{error}</p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default PaymentButton;

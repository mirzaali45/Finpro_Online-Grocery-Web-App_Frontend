"use client";

import React, { useState } from "react";

// Define the Payment Method type
interface PaymentMethod {
  name: string;
  description: string;
  steps: string[];
  processingTime: string;
  minAmount: number;
  maxAmount: number;
  icon: React.ReactNode;
  banks: {
    name: string;
    code: string;
    logo: string;
  }[];
  color: {
    border: string;
    bg: string;
    text: string;
    accent: string;
  };
}

export default function PaymentInformation(): JSX.Element {
  const paymentMethods: PaymentMethod[] = [
    {
      name: "Virtual Account",
      description: "Pay using bank transfer to a virtual account number",
      steps: [
        "Select Virtual Account as your payment method during checkout",
        "Choose your preferred bank",
        "You'll receive a unique virtual account number",
        "Pay the exact amount to the virtual account number through your banking channel (mobile banking, internet banking, or ATM)",
        "Payment will be automatically verified once completed",
      ],
      processingTime: "Instant after payment received",
      minAmount: 10000,
      maxAmount: 1000000000,
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
          <path
            fillRule="evenodd"
            d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z"
            clipRule="evenodd"
          />
        </svg>
      ),
      banks: [
        {
          name: "BCA",
          code: "bca",
          logo: "/images/banks/bca.png",
        },
        {
          name: "BNI",
          code: "bni",
          logo: "/images/banks/bni.png",
        },
        {
          name: "BRI",
          code: "bri",
          logo: "/images/banks/bri.png",
        },
        {
          name: "Mandiri",
          code: "mandiri",
          logo: "/images/banks/mandiri.png",
        },
        {
          name: "Permata",
          code: "permata",
          logo: "/images/banks/permata.png",
        },
      ],
      color: {
        border: "border-blue-600",
        bg: "bg-blue-900",
        text: "text-blue-300",
        accent: "text-blue-400",
      },
    },
    {
      name: "QRIS",
      description: "Pay using QR code with your mobile banking app or e-wallet",
      steps: [
        "Select QRIS as your payment method during checkout",
        "Scan the QR code using your mobile banking app or e-wallet (GoPay, OVO, DANA, LinkAja, etc.)",
        "Confirm and complete the payment in your app",
        "Payment will be automatically verified once completed",
      ],
      processingTime: "Instant after payment received",
      minAmount: 1000,
      maxAmount: 10000000,
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M3 4a1 1 0 011-1h3a1 1 0 011 1v3a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm2 2V5h1v1H5zM3 13a1 1 0 011-1h3a1 1 0 011 1v3a1 1 0 01-1 1H4a1 1 0 01-1-1v-3zm2 2v-1h1v1H5zM13 3a1 1 0 00-1 1v3a1 1 0 001 1h3a1 1 0 001-1V4a1 1 0 00-1-1h-3zm1 2v1h1V5h-1z"
            clipRule="evenodd"
          />
          <path d="M11 4a1 1 0 10-2 0v1a1 1 0 002 0V4zM10 7a1 1 0 011 1v1h2a1 1 0 110 2h-3a1 1 0 01-1-1V8a1 1 0 011-1zM16 9a1 1 0 100 2 1 1 0 000-2zM9 13a1 1 0 011-1h1a1 1 0 110 2v2a1 1 0 11-2 0v-3zM7 11a1 1 0 100-2H4a1 1 0 100 2h3zM17 13a1 1 0 01-1 1h-2a1 1 0 110-2h2a1 1 0 011 1zM16 17a1 1 0 100-2h-3a1 1 0 100 2h3z" />
        </svg>
      ),
      banks: [],
      color: {
        border: "border-green-600",
        bg: "bg-green-900",
        text: "text-green-300",
        accent: "text-green-400",
      },
    },
    {
      name: "Credit Card",
      description: "Pay using Visa, Mastercard, or JCB credit card",
      steps: [
        "Select Credit Card as your payment method during checkout",
        "Enter your credit card details (card number, expiry date, CVV)",
        "Complete 3D Secure verification if required by your bank",
        "Payment will be processed immediately",
      ],
      processingTime: "Instant",
      minAmount: 10000,
      maxAmount: 100000000,
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
          <path
            fillRule="evenodd"
            d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z"
            clipRule="evenodd"
          />
        </svg>
      ),
      banks: [],
      color: {
        border: "border-purple-600",
        bg: "bg-purple-900",
        text: "text-purple-300",
        accent: "text-purple-400",
      },
    },
  ];

  const [expandedMethod, setExpandedMethod] = useState<string>(
    paymentMethods[0].name
  );

  const toggleExpand = (method: string): void => {
    setExpandedMethod(expandedMethod === method ? "" : method);
  };

  // Function to format price in Indonesian Rupiah
  const formatRupiah = (price: number): string => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 pt-20 pb-16">
      {" "}
      {/* Added pt-20 for navbar spacing */}
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <header className="mb-8">
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-blue-500">
              Payment Information
            </h1>
            <div className="h-1 w-32 bg-gradient-to-r from-purple-500 to-blue-500 mt-2"></div>
            <p className="mt-4 text-gray-300">
              Learn about our secure payment methods and how to complete your
              purchase.
            </p>
          </header>

          {/* Midtrans Information */}
          <div className="bg-gray-800 rounded-lg shadow-xl p-6 mb-8 border border-gray-700">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-white rounded-lg p-1 mr-3 flex items-center justify-center">
                <svg
                  className="w-8 h-8"
                  viewBox="0 0 129 34"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M34.5 17C34.5 26.1127 26.8639 33.5 17.5 33.5C8.13614 33.5 0.5 26.1127 0.5 17C0.5 7.8873 8.13614 0.5 17.5 0.5C26.8639 0.5 34.5 7.8873 34.5 17Z"
                    fill="white"
                    stroke="#E4E7EB"
                  />
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M17.5 33C26.6127 33 34 25.6127 34 16.5C34 7.3873 26.6127 0 17.5 0C8.3873 0 1 7.3873 1 16.5C1 25.6127 8.3873 33 17.5 33Z"
                    fill="white"
                  />
                  <path
                    d="M10.9761 8.19048C12.1508 8.19048 13.1048 9.14444 13.1048 10.3191C13.1048 11.4937 12.1508 12.4477 10.9761 12.4477C9.80146 12.4477 8.84753 11.4937 8.84753 10.3191C8.84753 9.14444 9.80146 8.19048 10.9761 8.19048Z"
                    fill="#0B4CAD"
                  />
                  <path
                    d="M23.1048 9.51423C24.2794 9.51423 25.2334 10.4682 25.2334 11.6429C25.2334 12.8175 24.2794 13.7715 23.1048 13.7715C21.9301 13.7715 20.9762 12.8175 20.9762 11.6429C20.9762 10.4682 21.9301 9.51423 23.1048 9.51423Z"
                    fill="#FEBD00"
                  />
                  <path
                    d="M16.6938 10.4C17.8684 10.4 18.8223 11.3539 18.8223 12.5286C18.8223 13.7032 17.8684 14.6572 16.6938 14.6572C15.5191 14.6572 14.5652 13.7032 14.5652 12.5286C14.5652 11.3539 15.5191 10.4 16.6938 10.4Z"
                    fill="#EB3324"
                  />
                  <path
                    d="M20.2938 15.5333C21.4685 15.5333 22.4224 16.4873 22.4224 17.6619C22.4224 18.8366 21.4685 19.7905 20.2938 19.7905C19.1192 19.7905 18.1652 18.8366 18.1652 17.6619C18.1652 16.4873 19.1192 15.5333 20.2938 15.5333Z"
                    fill="#0B4CAD"
                  />
                  <path
                    d="M13.7905 16.0191C14.9651 16.0191 15.9191 16.973 15.9191 18.1477C15.9191 19.3223 14.9651 20.2762 13.7905 20.2762C12.6158 20.2762 11.6619 19.3223 11.6619 18.1477C11.6619 16.973 12.6158 16.0191 13.7905 16.0191Z"
                    fill="#FEBD00"
                  />
                  <path
                    d="M17.9048 20.9333C19.0794 20.9333 20.0334 21.8873 20.0334 23.0619C20.0334 24.2366 19.0794 25.1905 17.9048 25.1905C16.7301 25.1905 15.7762 24.2366 15.7762 23.0619C15.7762 21.8873 16.7301 20.9333 17.9048 20.9333Z"
                    fill="#EB3324"
                  />
                  <path
                    d="M63.7028 16.7086H61.2376V9.83429H58.1029V21.8666H61.2376V19.4497H63.7028V21.8666H66.8294V9.83429H63.7028V16.7086Z"
                    fill="#0A0F17"
                  />
                  <path
                    d="M48.5333 9.83429V21.8666H51.6599V9.83429H48.5333Z"
                    fill="#0A0F17"
                  />
                  <path
                    d="M76.9854 12.9713H74.5201V9.83429H80.1039V12.9713H77.6468V21.8666H74.5201V12.9713H76.9854Z"
                    fill="#0A0F17"
                  />
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M53.2754 21.2569C54.7354 21.8747 56.7316 22.0202 57.8996 21.6583C58.2372 21.5492 58.5587 21.3639 58.8397 21.1165C58.9349 21.022 58.9997 20.8997 59.0235 20.7669C59.0473 20.6342 59.0291 20.4974 58.9707 20.3758C58.9124 20.2542 58.8169 20.1539 58.6975 20.0885C58.578 20.0231 58.4405 19.9957 58.3039 20.01C57.6963 20.1071 57.083 20.149 56.4691 20.1354C55.5635 20.1354 54.9619 19.9657 54.6 19.6605L55.1777 17.2032L56.9373 17.4375L56.6078 18.8248C57.7433 18.8248 58.5575 18.6227 59.0831 18.2267C59.6087 17.8307 59.8715 17.1809 59.8715 16.287C59.8834 15.9849 59.8254 15.6838 59.7015 15.4037C59.5776 15.1237 59.3899 14.8713 59.1517 14.6651C58.9134 14.459 58.6298 14.3039 58.3203 14.2105C58.0109 14.1172 57.6831 14.0879 57.3607 14.1245C56.6435 14.1918 55.926 14.2191 55.2081 14.2063C54.4903 14.1934 53.7723 14.1404 53.0542 14.0472C52.891 14.0472 52.6082 15.0338 52.5271 15.2176C52.1652 16.0286 51.9889 16.905 52.0095 17.7891C52.0094 19.3172 52.4284 20.2435 53.2754 21.2569Z"
                    fill="#0A0F17"
                  />
                  <path
                    d="M81.0257 21.8666V9.83429H87.7218C88.2067 9.82235 88.6906 9.89166 89.1501 10.041C89.5533 10.1744 89.9229 10.3945 90.2323 10.6853C90.5418 10.9761 90.7836 11.3307 90.9424 11.7226C91.1013 12.1144 91.1734 12.5348 91.1542 12.9561C91.1542 14.5813 90.0691 15.557 88.6496 15.8774L91.4826 21.8666H87.7137L85.323 16.4885H84.172V21.8666H81.0257ZM84.1639 13.639H86.6372C87.3143 13.639 87.902 13.0513 87.902 12.3742C87.902 11.6971 87.3143 11.1094 86.6372 11.1094H84.1639V13.639Z"
                    fill="#0A0F17"
                  />
                  <path
                    d="M92.3657 9.83429H95.9183L98.3758 17.7566H98.4083L100.874 9.83429H104.418L100.371 21.8666H96.4125L92.3657 9.83429Z"
                    fill="#0A0F17"
                  />
                  <path
                    d="M105.495 9.83429H112.784C115.267 9.83429 116.809 11.7226 116.809 14.0634C116.809 17.1982 114.663 18.7647 111.667 18.7647H108.622V21.8666H105.495V9.83429ZM108.622 16.4885H111.366C112.452 16.4885 113.528 15.8603 113.528 14.3998C113.528 13.0027 112.606 12.1105 111.301 12.1105H108.622V16.4885Z"
                    fill="#0A0F17"
                  />
                  <path
                    d="M122.889 21.8422C120.842 21.8422 119.399 21.5138 118.055 20.4448L119.301 18.1283C120.207 18.8308 121.279 19.3071 122.411 19.5147C123.055 19.5147 123.725 19.2837 123.725 18.5986C123.725 18.0109 123.055 17.7881 122.101 17.5409C120.753 17.2206 118.717 16.6248 118.717 14.5651C118.717 12.5053 120.436 11.3309 122.973 11.3309C124.614 11.3309 125.87 11.6513 127.033 12.4821L125.649 14.8881C124.907 14.2277 124.045 13.7251 123.105 13.4107C122.638 13.4107 122.012 13.6498 122.012 14.2617C122.012 14.8736 122.638 15.0964 123.674 15.3436C125.022 15.6639 127 16.2597 127 18.2868C127 20.5523 125.356 21.8422 122.889 21.8422Z"
                    fill="#0A0F17"
                  />
                  <path
                    d="M68.1844 15.9622L72.2718 9.85068H68.1844V15.9622Z"
                    fill="#0A0F17"
                  />
                  <path
                    d="M68.1437 15.9379V21.883H72.2312L68.1437 15.9379Z"
                    fill="#0A0F17"
                  />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-purple-300">
                Secure Payments via Midtrans
              </h2>
            </div>
            <p className="text-gray-300 mb-4">
              We use Midtrans as our payment gateway to ensure secure and
              reliable payment processing. Midtrans is a leading Indonesian
              payment gateway that supports various payment methods including
              Virtual Accounts, QRIS, and Credit Cards.
            </p>
            <div className="flex flex-wrap gap-3 mt-4">
              <div className="py-1 px-3 bg-gray-750 rounded-full text-xs font-medium text-gray-300 flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-1 text-green-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                PCI DSS Compliant
              </div>
              <div className="py-1 px-3 bg-gray-750 rounded-full text-xs font-medium text-gray-300 flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-1 text-green-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                3D Secure
              </div>
              <div className="py-1 px-3 bg-gray-750 rounded-full text-xs font-medium text-gray-300 flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-1 text-green-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                Fraud Detection
              </div>
              <div className="py-1 px-3 bg-gray-750 rounded-full text-xs font-medium text-gray-300 flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-1 text-green-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                Real-time Notifications
              </div>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="bg-gray-800 rounded-lg shadow-xl p-6 mb-8 border border-gray-700">
            <h2 className="text-xl font-semibold mb-6 text-purple-300">
              Available Payment Methods
            </h2>

            <div className="space-y-6">
              {paymentMethods.map((method) => (
                <div key={method.name}>
                  <div
                    className={`border ${method.color.border} rounded-lg bg-gray-750 shadow-lg shadow-${method.color.bg}/20 overflow-hidden`}
                  >
                    <div
                      className="flex items-center justify-between p-4 cursor-pointer"
                      onClick={() => toggleExpand(method.name)}
                    >
                      <div className="flex items-center">
                        <div
                          className={`w-10 h-10 rounded-full ${method.color.bg} flex items-center justify-center mr-3`}
                        >
                          <div className={method.color.text}>{method.icon}</div>
                        </div>
                        <div>
                          <h3
                            className={`font-bold text-lg ${method.color.text}`}
                          >
                            {method.name}
                          </h3>
                          <p className="text-gray-400 text-sm">
                            {method.description}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <span
                          className={`text-sm font-medium ${method.color.accent} mr-3`}
                        >
                          {method.processingTime}
                        </span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className={`h-5 w-5 text-gray-400 transition-transform duration-300 ${
                            expandedMethod === method.name ? "rotate-180" : ""
                          }`}
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    </div>

                    {expandedMethod === method.name && (
                      <div className="px-4 pb-4 pt-2 border-t border-gray-700">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <h4
                              className={`${method.color.text} font-medium mb-2`}
                            >
                              How to Pay
                            </h4>
                            <ol className="space-y-1 text-gray-300 list-decimal list-inside">
                              {method.steps.map((step, index) => (
                                <li key={index} className="pl-1">
                                  {step}
                                </li>
                              ))}
                            </ol>
                          </div>

                          <div>
                            <h4
                              className={`${method.color.text} font-medium mb-2`}
                            >
                              Payment Details
                            </h4>
                            <ul className="space-y-1 text-gray-300">
                              <li className="flex items-center">
                                <span className={`${method.color.accent} mr-2`}>
                                  •
                                </span>
                                Processing time: {method.processingTime}
                              </li>
                              <li className="flex items-center">
                                <span className={`${method.color.accent} mr-2`}>
                                  •
                                </span>
                                Minimum amount: {formatRupiah(method.minAmount)}
                              </li>
                              <li className="flex items-center">
                                <span className={`${method.color.accent} mr-2`}>
                                  •
                                </span>
                                Maximum amount: {formatRupiah(method.maxAmount)}
                              </li>
                            </ul>

                            {method.name === "Virtual Account" &&
                              method.banks.length > 0 && (
                                <div className="mt-4">
                                  <h4
                                    className={`${method.color.text} font-medium mb-2`}
                                  >
                                    Supported Banks
                                  </h4>
                                  <div className="flex flex-wrap gap-2">
                                    {method.banks.map((bank) => (
                                      <div
                                        key={bank.code}
                                        className="flex items-center justify-center w-16 h-10 bg-white rounded-md p-1"
                                      >
                                        <div className="text-gray-800 font-bold text-sm">
                                          {bank.name}
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Virtual Account Payment Guide */}
          <div className="bg-gray-800 rounded-lg shadow-xl p-6 mb-8 border border-gray-700">
            <h2 className="text-xl font-semibold mb-6 text-purple-300">
              Virtual Account Payment Guide
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gray-750 p-5 rounded-lg border border-gray-700">
                <div className="w-12 h-12 rounded-full bg-blue-900 flex items-center justify-center mb-4">
                  <span className="text-blue-300 text-xl font-bold">1</span>
                </div>
                <h3 className="text-lg font-medium text-blue-300 mb-2">
                  Choose Virtual Account
                </h3>
                <p className="text-gray-300">
                  Select Virtual Account as your payment method and choose your
                  preferred bank during checkout.
                </p>
              </div>

              <div className="bg-gray-750 p-5 rounded-lg border border-gray-700">
                <div className="w-12 h-12 rounded-full bg-blue-900 flex items-center justify-center mb-4">
                  <span className="text-blue-300 text-xl font-bold">2</span>
                </div>
                <h3 className="text-lg font-medium text-blue-300 mb-2">
                  Get Virtual Account Number
                </h3>
                <p className="text-gray-300">
                  You will be provided with a unique virtual account number
                  specific to your transaction.
                </p>
              </div>

              <div className="bg-gray-750 p-5 rounded-lg border border-gray-700">
                <div className="w-12 h-12 rounded-full bg-blue-900 flex items-center justify-center mb-4">
                  <span className="text-blue-300 text-xl font-bold">3</span>
                </div>
                <h3 className="text-lg font-medium text-blue-300 mb-2">
                  Make the Payment
                </h3>
                <p className="text-gray-300">
                  Transfer the exact amount to the virtual account number using
                  your banking channel (mobile banking, internet banking, or
                  ATM).
                </p>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-lg font-medium text-blue-300 mb-3">
                Payment Methods by Bank
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-750 p-4 rounded-lg border border-gray-700">
                  <div className="flex items-center mb-3">
                    <div className="bg-white rounded-md p-1 w-10 h-6 flex items-center justify-center mr-2">
                      <span className="text-gray-800 font-bold text-sm">
                        BCA
                      </span>
                    </div>
                    <h4 className="font-medium text-gray-300">
                      BCA Virtual Account
                    </h4>
                  </div>
                  <ul className="text-gray-400 text-sm space-y-1">
                    <li>• ATM BCA</li>
                    <li>• KlikBCA Internet Banking</li>
                    <li>• BCA Mobile</li>
                  </ul>
                </div>

                <div className="bg-gray-750 p-4 rounded-lg border border-gray-700">
                  <div className="flex items-center mb-3">
                    <div className="bg-white rounded-md p-1 w-10 h-6 flex items-center justify-center mr-2">
                      <span className="text-gray-800 font-bold text-sm">
                        BNI
                      </span>
                    </div>
                    <h4 className="font-medium text-gray-300">
                      BNI Virtual Account
                    </h4>
                  </div>
                  <ul className="text-gray-400 text-sm space-y-1">
                    <li>• ATM BNI</li>
                    <li>• BNI Internet Banking</li>
                    <li>• BNI Mobile Banking</li>
                  </ul>
                </div>

                <div className="bg-gray-750 p-4 rounded-lg border border-gray-700">
                  <div className="flex items-center mb-3">
                    <div className="bg-white rounded-md p-1 w-10 h-6 flex items-center justify-center mr-2">
                      <span className="text-gray-800 font-bold text-sm">
                        BRI
                      </span>
                    </div>
                    <h4 className="font-medium text-gray-300">
                      BRI Virtual Account
                    </h4>
                  </div>
                  <ul className="text-gray-400 text-sm space-y-1">
                    <li>• ATM BRI</li>
                    <li>• BRI Internet Banking</li>
                    <li>• BRI Mobile Banking</li>
                  </ul>
                </div>

                <div className="bg-gray-750 p-4 rounded-lg border border-gray-700">
                  <div className="flex items-center mb-3">
                    <div className="bg-white rounded-md p-1 w-18 h-6 flex items-center justify-center mr-2">
                      <span className="text-gray-800 font-bold text-sm">
                        Mandiri
                      </span>
                    </div>
                    <h4 className="font-medium text-gray-300">
                      Mandiri Virtual Account
                    </h4>
                  </div>
                  <ul className="text-gray-400 text-sm space-y-1">
                    <li>• ATM Mandiri</li>
                    <li>• Mandiri Internet Banking</li>
                    <li>• Mandiri Mobile Banking</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Payment FAQ */}
          <div className="bg-gray-800 rounded-lg shadow-xl p-6 border border-gray-700">
            <h2 className="text-xl font-semibold mb-6 text-purple-300">
              Payment FAQ
            </h2>

            <div className="space-y-4">
              <div className="bg-gray-750 p-4 rounded-lg border border-gray-700">
                <h3 className="text-lg font-medium text-blue-300 mb-2">
                  How long is my virtual account number valid?
                </h3>
                <p className="text-gray-300">
                  Your virtual account number is valid for 24 hours from the
                  time of checkout. If you don't complete the payment within
                  this timeframe, the order will be automatically canceled.
                </p>
              </div>

              <div className="bg-gray-750 p-4 rounded-lg border border-gray-700">
                <h3 className="text-lg font-medium text-blue-300 mb-2">
                  How do I know if my payment is successful?
                </h3>
                <p className="text-gray-300">
                  Once your payment is successful, you will receive a payment
                  confirmation email. You can also check your order status in
                  your account dashboard.
                </p>
              </div>

              <div className="bg-gray-750 p-4 rounded-lg border border-gray-700">
                <h3 className="text-lg font-medium text-blue-300 mb-2">
                  Can I pay using multiple payment methods for a single order?
                </h3>
                <p className="text-gray-300">
                  No, each order must be paid using a single payment method. If
                  you wish to use multiple payment methods, you will need to
                  place separate orders.
                </p>
              </div>

              <div className="bg-gray-750 p-4 rounded-lg border border-gray-700">
                <h3 className="text-lg font-medium text-blue-300 mb-2">
                  What happens if I pay an amount different from my order total?
                </h3>
                <p className="text-gray-300">
                  You must pay the exact amount shown in your order. Payments
                  with different amounts will not be automatically processed. If
                  you've made a payment with a different amount, please contact
                  our customer service.
                </p>
              </div>

              <div className="bg-gray-750 p-4 rounded-lg border border-gray-700">
                <h3 className="text-lg font-medium text-blue-300 mb-2">
                  Is it safe to use Midtrans for payment?
                </h3>
                <p className="text-gray-300">
                  Yes, Midtrans is a secure payment gateway that is PCI DSS
                  compliant and uses industry-standard encryption to protect
                  your payment information. Your payment data is never stored on
                  our servers.
                </p>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="mt-8 p-6 bg-gray-800 rounded-lg border border-gray-700 shadow-xl">
            <h2 className="text-xl font-semibold mb-4 text-purple-300">
              Payment Support
            </h2>
            <p className="text-gray-300 mb-4">
              If you have any questions or issues with your payment, our
              customer service team is available to assist you.
            </p>
            <div className="flex items-center text-blue-400 mb-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
              <span>finalprojectkel@gmail.com</span>
            </div>
            <div className="flex items-center text-blue-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
              </svg>
              <span>+62 81 1229 8203</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

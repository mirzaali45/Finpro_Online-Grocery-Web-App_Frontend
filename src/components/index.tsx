import Link from 'next/link';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-4">Welcome to the Shopping Cart App</h1>
      <Link href="/cart">
        <a className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          Go to Cart
        </a>
      </Link>
    </div>
  );
};

export default HomePage;

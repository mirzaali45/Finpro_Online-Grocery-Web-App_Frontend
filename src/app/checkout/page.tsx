"use client"; // Ensure this component runs on the client side

import { useState, useEffect } from "react";
import Image from "next/image"; // Optimized image component
import { CartData } from "@/types/cart-types"; // Assuming CartData is already defined
import { fetchCartId, removeFromCart, updateCartItem } from "@/services/cart.service"; // Assuming these functions are implemented
import dynamic from "next/dynamic";
import L from "leaflet";

// Dynamic import for Leaflet to avoid SSR issues
const MapContainer = dynamic(() => import("react-leaflet").then((mod) => mod.MapContainer), {
  ssr: false,
});
const TileLayer = dynamic(() => import("react-leaflet").then((mod) => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import("react-leaflet").then((mod) => mod.Marker), { ssr: false });
const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), { ssr: false });

const CheckoutPage = () => {
  const [cartData, setCartData] = useState<CartData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isUpdating, setIsUpdating] = useState<number | null>(null);

  // For Address change modal
  const [address, setAddress] = useState<string>("Kampus Telkom University - Robotic SAS"); // Default Address
  const [addressModalOpen, setAddressModalOpen] = useState<boolean>(false);
  const [newAddress, setNewAddress] = useState<string>(address); // New address input

  // For Leaflet map
  const [latitude, setLatitude] = useState<number>(-6.8971); // Default coordinates (example)
  const [longitude, setLongitude] = useState<number>(107.6104); // Default coordinates (example)

  // Delivery method options
  const [deliveryMethod, setDeliveryMethod] = useState<string>("Ekonomi");
  const [shippingInsurance, setShippingInsurance] = useState<boolean>(false);

  // Load cart data function
  const loadCart = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Please login to view your cart");

      // Call your fetchCartId function
      const response = await fetchCartId(); // Assuming this function works correctly
      setCartData(response.data);
      setError("");
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to load cart");
      if (error instanceof Error && error.message.includes("login")) {
        localStorage.removeItem("token");
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCart();
  }, []);

  // Update cart item quantity
  const handleUpdateQuantity = async (cartItemId: number, newQuantity: number) => {
    if (newQuantity < 1) return;

    try {
      setIsUpdating(cartItemId);
      await updateCartItem(cartItemId, newQuantity); // Assuming updateCartItem is defined elsewhere
      if (cartData) {
        const updatedItems = cartData.items.map((item) => {
          if (item.cartitem_id === cartItemId) {
            return { ...item, quantity: newQuantity };
          }
          return item;
        });

        const totalQuantity = updatedItems.reduce(
          (sum, item) => sum + item.quantity,
          0
        );
        const totalPrice = updatedItems.reduce(
          (sum, item) => sum + item.quantity * item.product.price,
          0
        );

        setCartData({
          ...cartData,
          items: updatedItems,
          summary: {
            ...cartData.summary,
            totalQuantity,
            totalPrice,
          },
        });
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to update quantity");
    } finally {
      setIsUpdating(null);
    }
  };

  // Remove an item from the cart
  const handleRemoveItem = async (cartItemId: number) => {
    try {
      setIsUpdating(cartItemId);
      await removeFromCart(cartItemId); // Assuming removeFromCart is defined elsewhere
      await loadCart(); // Reload cart data after item removal
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to remove item");
    } finally {
      setIsUpdating(null);
    }
  };

  // Save Address and Close Modal
  const handleSaveAddress = () => {
    setAddress(newAddress);
    setAddressModalOpen(false);
  };

  // Toggle Address Modal
  const toggleAddressModal = () => {
    setAddressModalOpen(!addressModalOpen);
  };

  // Handle Delivery Method Change
  const handleDeliveryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDeliveryMethod(event.target.value);
  };

  // Handle Shipping Insurance Change
  const handleShippingInsuranceChange = () => {
    setShippingInsurance(!shippingInsurance);
  };

  // Handle map click to update address
  const handleMapClick = (event: L.LeafletMouseEvent) => {
    setLatitude(event.latlng.lat);
    setLongitude(event.latlng.lng);
    setNewAddress(
      `Latitude: ${event.latlng.lat}, Longitude: ${event.latlng.lng}`
    );
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-screen-xl mx-auto p-6 sm:p-8 md:p-10">
      <h1 className="text-3xl font-semibold text-center mb-6">Checkout</h1>

      {/* Display errors */}
      {error && <div className="text-red-500">{error}</div>}

      {/* Shipping Address Section */}
      <div className="border p-4 rounded-lg shadow-md bg-white mb-6">
        <h2 className="text-xl font-semibold">Alamat Pengiriman</h2>
        <div className="flex justify-between mt-4">
          <p className="text-lg">{address}</p>
          <button
            onClick={toggleAddressModal}
            className="text-blue-600 hover:text-blue-700"
          >
            Ganti
          </button>
        </div>
      </div>

      {/* Address Modal */}
      {addressModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg w-96">
            <h3 className="text-2xl font-semibold mb-4">
              Ganti Alamat Pengiriman
            </h3>

            {/* Leaflet Map */}
            <MapContainer
              center={[latitude, longitude]}
              zoom={13}
              style={{ height: "300px", width: "100%" }}
            >
              {/* Remove onClick prop */}
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              <Marker position={[latitude, longitude]}>
                <Popup>Alamat Pengiriman Baru</Popup>
              </Marker>
            </MapContainer>

            <input
              type="text"
              value={newAddress}
              onChange={(e) => setNewAddress(e.target.value)}
              className="w-full p-2 border rounded-md mt-4"
              placeholder="Masukkan alamat baru"
            />
            <div className="mt-4 flex justify-end space-x-4">
              <button
                onClick={toggleAddressModal}
                className="text-gray-600 border px-4 py-2 rounded-md"
              >
                Batal
              </button>
              <button
                onClick={handleSaveAddress}
                className="bg-blue-600 text-white px-4 py-2 rounded-md"
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cart Items */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          {cartData?.items.length ? (
            cartData.items.map((item) => (
              <div
                key={item.cartitem_id}
                className="flex items-center space-x-4 border p-4 rounded-lg shadow-md"
              >
                <Image
                  src={
                    item.product.ProductImage[0]?.url || "/images/default.jpg"
                  }
                  alt={item.product.name}
                  width={80}
                  height={80}
                  className="object-cover rounded-md"
                />
                <div className="flex-1">
                  <p className="font-semibold">{item.product.name}</p>
                  <p className="text-sm text-gray-500">x {item.quantity}</p>
                  <p className="text-lg font-semibold">
                    Rp {item.product.price * item.quantity}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() =>
                      handleUpdateQuantity(item.cartitem_id, item.quantity - 1)
                    }
                    disabled={
                      isUpdating === item.cartitem_id || item.quantity <= 1
                    }
                    className="p-2 bg-gray-200 rounded-md"
                  >
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    onClick={() =>
                      handleUpdateQuantity(item.cartitem_id, item.quantity + 1)
                    }
                    disabled={isUpdating === item.cartitem_id}
                    className="p-2 bg-gray-200 rounded-md"
                  >
                    +
                  </button>
                  <button
                    onClick={() => handleRemoveItem(item.cartitem_id)}
                    className="text-red-500 ml-2"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p>Your cart is empty.</p>
          )}
        </div>

        {/* Delivery Method Section */}
        <div className="bg-white border p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-800">
            Metode Pengiriman
          </h2>
          <div className="mt-4 space-y-4">
            <div>
              <label className="block text-gray-700">
                Pilih Jenis Pengiriman
              </label>
              <div className="flex space-x-4">
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="ekonomi"
                    name="deliveryMethod"
                    value="Ekonomi"
                    checked={deliveryMethod === "Ekonomi"}
                    onChange={handleDeliveryChange}
                    className="form-radio"
                  />
                  <label htmlFor="ekonomi" className="ml-2 text-gray-700">
                    Ekonomi (Rp9.000)
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="express"
                    name="deliveryMethod"
                    value="Express"
                    checked={deliveryMethod === "Express"}
                    onChange={handleDeliveryChange}
                    className="form-radio"
                  />
                  <label htmlFor="express" className="ml-2 text-gray-700">
                    Express (Rp20.000)
                  </label>
                </div>
              </div>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="shippingInsurance"
                checked={shippingInsurance}
                onChange={handleShippingInsuranceChange}
                className="form-checkbox"
              />
              <label htmlFor="shippingInsurance" className="ml-2 text-gray-700">
                Pakai Asuransi Pengiriman (Rp2.000)
              </label>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-white border p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-800">
            Ringkasan Belanja
          </h2>
          <div className="mt-4 space-y-4">
            <div className="flex justify-between items-center">
              <span>Total Harga</span>
              <span>
                Rp {cartData?.summary.totalPrice?.toLocaleString() || 0}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span>Total Ongkos Kirim</span>
              <span>
                Rp {deliveryMethod === "Ekonomi" ? "9.000" : "20.000"}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span>Total Asuransi Pengiriman</span>
              <span>Rp {shippingInsurance ? "2.000" : "0"}</span>
            </div>
            <div className="flex justify-between items-center font-semibold text-lg mt-4">
              <span>Total Pembayaran</span>
              <span>
                Rp{" "}
                {(cartData?.summary.totalPrice ?? 0) +
                  (deliveryMethod === "Ekonomi" ? 9000 : 20000) +
                  (shippingInsurance ? 2000 : 0)}
              </span>
            </div>
          </div>
          <div className="mt-6 text-center">
            <button
              className="w-full py-3 px-6 bg-green-600 text-white rounded-lg hover:bg-green-700"
              disabled={isLoading || !cartData?.items.length}
            >
              {isLoading ? "Processing..." : "Proceed to Payment"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;

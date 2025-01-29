interface CartItemProps {
    item: {
      cartitem_id: number;
      product: { name: string; price: number };
      quantity: number;
    };
    onUpdateQuantity: (id: number, quantity: number) => void;
    onRemove: (id: number) => void;
  }
  
  export const CartItem = ({ item, onUpdateQuantity, onRemove }: CartItemProps) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newQuantity = parseInt(e.target.value, 10);
      if (newQuantity > 0) {
        onUpdateQuantity(item.cartitem_id, newQuantity);
      }
    };
  
    return (
      <div className="bg-white p-4 shadow rounded">
        <h2 className="text-lg font-bold">{item.product.name}</h2>
        <p className="text-gray-700">Price: ${item.product.price}</p>
        <div className="flex items-center gap-2 mt-2">
          <input
            type="number"
            min="1"
            value={item.quantity}
            onChange={handleChange}
            className="w-16 px-2 py-1 border rounded"
          />
          <button
            onClick={() => onRemove(item.cartitem_id)}
            className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Remove
          </button>
        </div>
      </div>
    );
  };
  
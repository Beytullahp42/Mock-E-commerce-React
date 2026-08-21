import Item from "../models/Item";
import {useState} from "react";
import {toast} from "react-toastify";
import {addToCart} from "../services/CartService.ts";
import {useAuth} from "../context/auth-context.ts";
import {useNavigate} from "react-router-dom";

interface ItemTileProps {
    item: Item,
    fetchCartItems: () => Promise<void>
}

function ItemTile({item, fetchCartItems}: ItemTileProps) {
    const [quantity, setQuantity] = useState<number>(1);
    const {account} = useAuth();
    const navigate = useNavigate();

    const handlePlus = () => setQuantity((prev) => prev + 1);
    const handleMinus = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

    const handleAddToCart = async () => {
        if (!account) {
            navigate("/login", {state: {from: "/"}});
            return;
        }
        await toast.promise(addToCart(item.id, quantity), {
            pending: "Adding to cart...",
            success: "Added to cart!",
            error: "Error adding to cart",
        });
        await fetchCartItems();
    };

    return (
        <div
            className="item-tile w-full max-w-xs min-h-[360px] border-2 border-gray-300 rounded-xl p-3 shadow-md flex flex-col bg-white"
        >
            <img
                className="w-full max-w-56 aspect-square object-cover border rounded self-center"
                src={item.imageUrl}
                alt={item.name}
            />
            <div className="flex flex-col justify-between gap-3 mt-3">
                <div className="min-w-0">
                    <h2 className="text-xl font-semibold truncate">{item.name}</h2>
                    <p className="text-gray-600 line-clamp-2 text-sm">{item.description}</p>
                    <p className="text-lg font-bold text-green-700 mt-1">Price: ${item.price}</p>
                </div>
                <div className="flex flex-col justify-between">
                    <div className="flex bg-amber-100 items-center justify-between gap-2 mb-2">
                        <button
                            onClick={handleMinus}
                            className="bg-amber-500 text-white font-bold w-10 h-10 text-xl rounded hover:bg-amber-600"
                        >
                            -
                        </button>
                        <span className="text-xl font-medium w-6 text-center">{quantity}</span>
                        <button
                            onClick={handlePlus}
                            className="bg-amber-500 text-white font-bold w-10 h-10 text-xl rounded hover:bg-amber-600"
                        >
                            +
                        </button>
                    </div>

                    <button
                        onClick={handleAddToCart}
                        className="w-full bg-amber-500 text-white font-semibold py-2 rounded hover:bg-amber-600"
                    >
                        Add to Cart
                    </button>
                </div>
            </div>
        </div>
    );

}

export default ItemTile;

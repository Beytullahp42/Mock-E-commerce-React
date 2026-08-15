import {useEffect, useState} from "react";
import type Item from "../models/Item.ts";
import {getAllItems} from "../services/ItemService.ts";
import ItemTile from "../components/ItemTile.tsx";
import CartItemTile from "../components/CartItemTile.tsx";
import {clearCart, getCartItems} from "../services/CartService.ts";
import CartItem from "../models/CartItem.ts";
import {toast} from "react-toastify";
import CheckoutModal from "../components/CheckoutModal.tsx";

function Home() {
    const [items, setItems] = useState<Item[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

    const openCheckout = () => {
        if (cartItems.length === 0) {
            toast.error("Your cart is empty.");
            return;
        }
        setIsCheckoutOpen(true)
    };
    const closeCheckout = () => setIsCheckoutOpen(false);

    const renderCartContent = () => {
        if (loading) {
            return <p className={"mx-3"}>Loading...</p>;
        }
        if (error) {
            return <p className={"mx-3 text-red-600"}>{error}</p>;
        }
        if (cartItems.length === 0) {
            return <p className={"mx-3"}>Your cart is empty.</p>;
        }
        return (
            <div className="cart-items flex flex-col items-center space-y-4 mx-3 overflow-y-auto">
                {cartItems.map((item) => (
                    <CartItemTile key={item.id} cartItem={item} fetchCartItems={fetchCartItems}/>
                ))}
            </div>
        );
    }

    const fetchCartItems = async () => {
        setLoading(true);
        setError(null);

        try {
            const fetchedItems = await getCartItems();
            setCartItems(fetchedItems);
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.error(error);
                setError(error.message);
            } else {
                setError("An unexpected error occurred.");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleClearCart = async () => {
        setLoading(true);
        setError(null);

        await toast.promise(
            clearCart(),
            {
                pending: "Clearing cart...",
                success: "Cart cleared!",
                error: "Error clearing cart",
            }
        );

        await fetchCartItems();
    }

    const fetchItems = async () => {
        setLoading(true);
        setError(null);

        try {
            const fetchedItems = await getAllItems();
            setItems(fetchedItems);
        } catch (error: unknown) {
            if (error instanceof Error) {
                setError(error.message);
            } else {
                setError("An unexpected error occurred.");
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchItems();
        fetchCartItems();
    }, []);

    return (
        <div className="flex">
            {/* Main content area - adding right padding to account for fixed cart */}
            <div className="flex-1 pr-72">
                {loading && <p>Loading...</p>}
                {error && <p style={{color: "red"}}>{error}</p>}
                {!loading && !error && (
                    <div className="item-list flex flex-wrap gap-4">
                        {items.length === 0
                            ? <p className="text-gray-600">No items available yet.</p>
                            : items.map((item) => (
                                <ItemTile key={item.id} item={item} fetchCartItems={fetchCartItems}/>
                            ))}
                    </div>
                )}
            </div>

            {/* Fixed Cart Section */}
            <div className="fixed right-4 top-20 w-72 h-[calc(100vh-7rem)] flex flex-col border-2 border-amber-400 rounded-xl shadow-md bg-white">
                <div className="flex flex-row justify-between border-b-2 border-amber-400 w-full p-2">
                    <h1 className="ps-2 text-3xl font-bold text-center">
                        Cart
                    </h1>
                    <p className="text-gray-700 text-sm underline select-none cursor-pointer"
                       onClick={handleClearCart}
                    >
                        Clear
                    </p>
                </div>

                {/* Scrollable cart items area */}
                <div className="flex-1 overflow-y-auto my-2">
                    {renderCartContent()}
                </div>

                {/* Checkout button (fixed at bottom) */}
                <button
                    className="bg-amber-500 text-white font-semibold px-4 py-2 rounded m-2"
                    onClick={openCheckout}
                >
                    Checkout
                </button>
            </div>

            <CheckoutModal isOpen={isCheckoutOpen} closeModal={closeCheckout} refreshCart={fetchCartItems}/>
        </div>
    );
}

export default Home;

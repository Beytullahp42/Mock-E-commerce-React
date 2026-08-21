import {useCallback, useEffect, useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import type Item from "../models/Item.ts";
import type CartItem from "../models/CartItem.ts";
import {getAllItems} from "../services/ItemService.ts";
import {clearCart, getCartItems} from "../services/CartService.ts";
import ItemTile from "../components/ItemTile.tsx";
import CartItemTile from "../components/CartItemTile.tsx";
import CheckoutModal from "../components/CheckoutModal.tsx";
import {toast} from "react-toastify";
import {useAuth} from "../context/auth-context.ts";

function Home() {
    const [items, setItems] = useState<Item[]>([]);
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [itemsLoading, setItemsLoading] = useState(true);
    const [cartLoading, setCartLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
    const {account} = useAuth();
    const navigate = useNavigate();

    const fetchItems = async () => {
        setItemsLoading(true);
        try {
            setItems(await getAllItems());
        } catch (requestError: unknown) {
            setError(requestError instanceof Error ? requestError.message : "Could not load items");
        } finally {
            setItemsLoading(false);
        }
    };

    const fetchCartItems = useCallback(async () => {
        if (!account) {
            setCartItems([]);
            return;
        }
        setCartLoading(true);
        try {
            setCartItems(await getCartItems());
        } catch (requestError: unknown) {
            setError(requestError instanceof Error ? requestError.message : "Could not load cart");
        } finally {
            setCartLoading(false);
        }
    }, [account]);

    useEffect(() => {
        fetchItems();
    }, []);

    useEffect(() => {
        fetchCartItems();
    }, [fetchCartItems]);

    const openCheckout = () => {
        if (!account) {
            navigate("/login", {state: {from: "/"}});
            return;
        }
        if (cartItems.length === 0) {
            toast.error("Your cart is empty.");
            return;
        }
        setIsCheckoutOpen(true);
    };

    const handleClearCart = async () => {
        if (!account || cartItems.length === 0) return;
        await toast.promise(clearCart(), {
            pending: "Clearing cart...",
            success: "Cart cleared!",
            error: "Error clearing cart",
        });
        await fetchCartItems();
    };

    const renderCartContent = () => {
        if (!account) {
            return <p className="mx-3">Please <Link className="text-blue-600 underline" to="/login">log in</Link> to use your cart.</p>;
        }
        if (cartLoading) return <p className="mx-3">Loading...</p>;
        if (cartItems.length === 0) return <p className="mx-3">Your cart is empty.</p>;
        return (
            <div className="flex flex-col items-center space-y-4 mx-3">
                {cartItems.map((item) => (
                    <CartItemTile key={item.id} cartItem={item} fetchCartItems={fetchCartItems}/>
                ))}
            </div>
        );
    };

    return (
        <div className="min-w-0 pr-56 sm:pr-72">
            <section className="min-w-0">
                {itemsLoading && <p>Loading...</p>}
                {error && <p className="text-red-600">{error}</p>}
                {!itemsLoading && !error && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 justify-items-start">
                        {items.length === 0
                            ? <p className="text-gray-600">No items available yet.</p>
                            : items.map((item) => (
                                <ItemTile key={item.id} item={item} fetchCartItems={fetchCartItems}/>
                            ))}
                    </div>
                )}
            </section>

            <aside className="fixed right-2 top-20 z-20 flex h-[calc(100vh-6rem)] w-52 flex-col border-2 border-amber-400 rounded-xl bg-white shadow-md sm:right-4 sm:w-64">
                <div className="flex justify-between items-center border-b-2 border-amber-400 p-2">
                    <h1 className="ps-2 text-3xl font-bold">Cart</h1>
                    <button className="text-gray-700 text-sm underline" onClick={handleClearCart}>Clear</button>
                </div>
                <div className="flex-1 overflow-y-auto my-2">{renderCartContent()}</div>
                <button
                    className="bg-amber-500 text-white font-semibold px-4 py-2 rounded m-2 hover:bg-amber-600"
                    onClick={openCheckout}
                >
                    Checkout
                </button>
            </aside>

            <CheckoutModal
                isOpen={isCheckoutOpen}
                closeModal={() => setIsCheckoutOpen(false)}
                refreshCart={fetchCartItems}
            />
        </div>
    );
}

export default Home;

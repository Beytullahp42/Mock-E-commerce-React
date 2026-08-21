import type Order from "../models/Order.ts";
import {useCallback, useEffect, useState} from "react";
import {getOrders} from "../services/OrderService.ts";
import OrderTile from "../components/OrderTile.tsx";
import {useLocation} from "react-router-dom";

function OrderListPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [income, setIncome] = useState<number>(0);
    const location = useLocation();
    const isAdmin = location.pathname.startsWith("/admin");


    const fetchOrders = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const fetchedOrders = await getOrders(isAdmin);
            setOrders(fetchedOrders);
            if (fetchedOrders) {
                let totalIncome = 0;
                fetchedOrders.forEach((order: Order) => {
                    totalIncome += order.totalPrice;
                })
                setIncome(totalIncome);
            }
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
    }, [isAdmin]);

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    return (
        <div className="flex flex-col lg:flex-row justify-center gap-8 lg:gap-20">
            <div className="w-full max-w-xl">
                <h1 className={"text-center font-bold text-3xl mb-4"}>Order List</h1>
                {loading && <p>Loading...</p>}
                {error && <p style={{color: "red"}}>{error}</p>}
                {!loading && !error && (
                    <div className="order-list flex flex-col items-center gap-4">
                        {orders.length === 0
                            ? <p className="text-gray-600">No orders yet.</p>
                            : orders.map((order) => (
                                <OrderTile key={order.id} order={order}/>
                            ))}
                    </div>
                )}
            </div>
            {isAdmin && (
                <h2 className="text-center font-bold text-2xl lg:text-3xl mb-4">Total income: {income} $</h2>
            )}
        </div>
    );
}


export default OrderListPage;

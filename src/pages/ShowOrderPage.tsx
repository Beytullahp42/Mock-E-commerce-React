import {useParams} from "react-router";
import {useCallback, useEffect, useState} from "react";
import type Order from "../models/Order.ts";
import {getOrderById, updateOrderStatus} from "../services/OrderService.ts";
import type OrderItem from "../models/OrderItem.ts";
import {toast} from "react-toastify";
import {useLocation} from "react-router-dom";

function ShowOrderPage() {
    const {id} = useParams();
    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedStatus, setSelectedStatus] = useState<string>("PENDING");
    const location = useLocation();
    const isAdmin = location.pathname.startsWith("/admin");

    const fetchOrder = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const fetchedOrder = await getOrderById(Number(id), isAdmin);
            setOrder(fetchedOrder);
            if (fetchedOrder) {
                setSelectedStatus(fetchedOrder.orderStatus);
            }
        } catch (error: unknown) {
            if (error instanceof Error) {
                setError(error.message);
            } else {
                setError("An unexpected error occurred.");
            }
        } finally {
            setLoading(false);
        }
    }, [id, isAdmin]);


    useEffect(() => {
        fetchOrder();
    }, [fetchOrder]);

    const handleStatusChange = async () => {
        await toast.promise(
            updateOrderStatus(Number(id), selectedStatus),
            {
                pending: "Updating order status...",
                success: "Order status updated successfully!",
                error: "Error updating order status",
            }
        )
        await fetchOrder();
    }

    return (
        <div className="max-w-4xl mx-auto p-4">
            <h1 className="text-2xl font-semibold mb-4">Order Details</h1>

            {loading && <p>Loading...</p>}
            {error && <p className="text-red-600">{error}</p>}
            {!loading && !error && order == null && <p>Order not found</p>}

            {!loading && !error && order && (
                <div className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                        <div><strong>Order ID:</strong> {order.id}</div>
                        <div><strong>Status:</strong> {order.orderStatus}</div>
                        <div><strong>Name:</strong> {order.name}</div>
                        <div><strong>Surname:</strong> {order.surname}</div>
                        <div><strong>Email:</strong> {order.email}</div>
                        <div><strong>Phone:</strong> {order.phoneNumber}</div>
                        <div className="sm:col-span-2"><strong>Address:</strong> {order.address}</div>
                        <div className="sm:col-span-2"><strong>Total Price:</strong> ${order.totalPrice.toFixed(2)}</div>
                    </div>

                    <div>
                        <h2 className="text-xl font-medium mb-2">Purchased Items</h2>
                        <div className="overflow-x-auto">
                        <table className="w-full min-w-[640px] border border-gray-300 text-sm">
                            <thead className="bg-gray-100">
                            <tr>
                                <th className="border border-gray-300 p-2 text-left">Image</th>
                                <th className="border border-gray-300 p-2 text-left">Item</th>
                                <th className="border border-gray-300 p-2 text-left">Description</th>
                                <th className="border border-gray-300 p-2 text-left">Quantity</th>
                                <th className="border border-gray-300 p-2 text-left">Price</th>
                            </tr>
                            </thead>
                            <tbody>
                            {order.orderItems.map((orderItem: OrderItem, index: number) => (
                                <tr
                                    key={orderItem.id}
                                    className={`border-t border-gray-300 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                                >
                                    <td className="border border-gray-300 p-2">
                                        <img
                                            src={orderItem.imageUrl}
                                            alt={orderItem.name}
                                            className="w-16 h-16 object-cover"
                                        />
                                    </td>
                                    <td className="border border-gray-300 p-2">{orderItem.name}</td>
                                    <td className="border border-gray-300 p-2">{orderItem.description}</td>
                                    <td className="border border-gray-300 p-2">{orderItem.quantity}</td>
                                    <td className="border border-gray-300 p-2">${orderItem.unitPrice.toFixed(2)}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                        </div>

                    </div>
                    {isAdmin && (
                        <div className="flex justify-end mt-4">
                            <select
                                className="border border-gray-300 rounded p-2 mr-2"
                                value={selectedStatus ?? ""}
                                onChange={(e) => setSelectedStatus(e.target.value)}
                            >
                                <option value="PENDING">PENDING</option>
                                <option value="ACCEPTED">ACCEPTED</option>
                                <option value="DELIVERED">DELIVERED</option>
                                <option value="CANCELLED">CANCELLED</option>
                            </select>

                            <button
                                className="bg-blue-500 text-white font-semibold py-2 px-4 rounded hover:bg-blue-600"
                                onClick={handleStatusChange}
                            >
                                Set Status
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default ShowOrderPage;

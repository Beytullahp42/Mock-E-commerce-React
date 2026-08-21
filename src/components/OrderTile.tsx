import type Order from "../models/Order.ts";
import {Link, useLocation} from "react-router-dom";

interface OrderTileProps {
    order: Order
}

function OrderTile({order}: OrderTileProps) {
    const location = useLocation();
    const isAdmin = location.pathname.startsWith("/admin");

    return (
        <div className="bg-white border border-gray-300 rounded p-4 mb-4 flex flex-col gap-2 w-full max-w-md">
            <div className="font-semibold text-lg">
                {order.name} {order.surname}
            </div>
            <div className="text-sm text-gray-700"> {order.email}</div>
            <div className="text-sm text-gray-700"> ${order.totalPrice.toFixed(2)}</div>
            <div className="text-sm text-gray-700"> Status: <span className="font-medium">{order.orderStatus}</span></div>

            <Link
                to={`${isAdmin ? `/admin/orders/${order.id}` : `/orders/${order.id}`}`}
                className="mt-2 bg-amber-500 text-white text-sm font-medium px-4 py-2 rounded hover:bg-amber-600 w-fit"
            >
                View Details
            </Link>
        </div>
    );
}

export default OrderTile;

import api from "./api.ts";
import type {OrderDto} from "../dto/OrderDto.ts";
import Order from "../models/Order.ts";
import type OrderItem from "../models/OrderItem.ts";

const USER_ORDER_URL = "/api/orders";
const ADMIN_ORDER_URL = "/api/admin/orders";

function toOrder(order: Order): Order {
    return new Order(
        order.id,
        order.name,
        order.surname,
        order.email,
        order.phoneNumber,
        order.address,
        order.orderItems as OrderItem[],
        order.totalPrice,
        order.orderStatus
    );
}

export async function createOrder(orderDto: OrderDto): Promise<boolean> {
    const res = await api.post(USER_ORDER_URL, orderDto);
    return res.status === 200;
}

export async function getOrders(isAdmin: boolean): Promise<Order[]> {
    const res = await api.get(isAdmin ? ADMIN_ORDER_URL : USER_ORDER_URL);
    return res.data.map(toOrder);
}

export async function getOrderById(id: number, isAdmin: boolean): Promise<Order | null> {
    try {
        const baseUrl = isAdmin ? ADMIN_ORDER_URL : USER_ORDER_URL;
        const res = await api.get(`${baseUrl}/${id}`);
        return toOrder(res.data);
    } catch {
        return null;
    }
}

export async function updateOrderStatus(id: number, status: string) {
    const res = await api.put(`${ADMIN_ORDER_URL}/${id}/status`, {orderStatus: status});
    return res.status === 200;
}

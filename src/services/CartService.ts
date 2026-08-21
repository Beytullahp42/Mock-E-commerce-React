import CartItem from "../models/CartItem.ts";
import api from "./api.ts";

const CART_URL = "/api/cart";

export async function addToCart(itemId: number, quantity: number): Promise<boolean> {
    const res = await api.post(CART_URL, {
        itemId,
        quantity
    });
    return res.status === 201 || res.status === 200;
}

export async function getCartItems(): Promise<CartItem[]> {
    const res = await api.get(CART_URL);
    return res.data.cartItems.map((cartItem: CartItem) => new CartItem(
        cartItem.id,
        cartItem.item,
        cartItem.quantity
    ));
}

export async function removeFromCart(itemId: number): Promise<boolean> {
    const res = await api.delete(CART_URL + "/" + itemId);
    return res.status === 200;
}

export async function clearCart(): Promise<boolean> {
    const res = await api.delete(CART_URL);
    return res.status === 200 || res.status === 204;
}

import CartItem from "./CartItem.ts";

class Cart{
    id: number;
    cartItems: CartItem[];

    constructor(id: number, cartItems: CartItem[]) {
        const tempCartItems: CartItem[] = [];
        for (let i = 0; i < cartItems.length; i++) {
            tempCartItems.push(new CartItem(
                cartItems[i].id,
                cartItems[i].item,
                cartItems[i].quantity
            ));
        }
        this.id = id;
        this.cartItems = tempCartItems;
    }
}

export default Cart;

import OrderItem from "./OrderItem.ts";

class Order {
    id: number;
    name: string;
    surname: string;
    email: string;
    phoneNumber: string;
    address: string;
    orderItems: OrderItem[];
    totalPrice: number;
    orderStatus: string;

    constructor(id: number, name: string, surname: string, email: string, phoneNumber: string, address: string,
                orderItems: OrderItem[], totalPrice: number, orderStatus: string) {
        this.id = id;
        this.name = name;
        this.surname = surname;
        this.email = email;
        this.phoneNumber = phoneNumber;
        this.address = address;
        this.orderItems = orderItems.map((item) => new OrderItem(
            item.id,
            item.name,
            item.description,
            item.unitPrice,
            item.quantity,
            item.imageUrl
        ));
        this.totalPrice = totalPrice;
        this.orderStatus = orderStatus;
    }
}

export default Order;

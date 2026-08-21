import {IMAGE_URL} from "../services/BASE_URL.ts";

class OrderItem {
    id: number;
    name: string;
    description: string;
    unitPrice: number;
    quantity: number;
    imageUrl: string;

    constructor(id: number, name: string, description: string, unitPrice: number, quantity: number, imageUrl: string) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.unitPrice = unitPrice;
        this.quantity = quantity;
        this.imageUrl = imageUrl.startsWith("http") ? imageUrl : IMAGE_URL + imageUrl;
    }
}

export default OrderItem;

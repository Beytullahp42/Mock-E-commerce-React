import Item from "../models/Item";
import type {ItemDto} from "../dto/ItemDto";
import api from "./api.ts";

const PUBLIC_ITEMS_URL = "/api/items";
const ADMIN_ITEMS_URL = "/api/admin/items";



export async function getAllItems(): Promise<Item[]> {
    const res = await api.get(PUBLIC_ITEMS_URL);
    return res.data.map((item: Item) => new Item(
        item.id,
        item.name,
        item.description,
        item.imageUrl,
        item.price
    ));
}

export async function getAllAdminItems(): Promise<Item[]> {
    const res = await api.get(ADMIN_ITEMS_URL);
    return res.data.map((item: Item) => new Item(
        item.id,
        item.name,
        item.description,
        item.imageUrl,
        item.price
    ));
}

export async function createItem(itemDto: ItemDto): Promise<boolean> {
    const res = await api.post(ADMIN_ITEMS_URL, itemDto);
    return res.status === 201 || res.status === 200;
}
export async function getItemById(id: number): Promise<Item | null> {
    try {
        const res = await api.get(`${ADMIN_ITEMS_URL}/${id}`);
        const item = res.data;
        return new Item(
            item.id,
            item.name,
            item.description,
            item.imageUrl,
            item.price
        );
    } catch {
        return null;
    }
}

export async function updateItem(id: number, itemDto: ItemDto): Promise<boolean> {
    const res = await api.put(`${ADMIN_ITEMS_URL}/${id}`, itemDto);
    return res.status === 200;
}

export async function deleteItem(id: number): Promise<boolean> {
    const res = await api.delete(`${ADMIN_ITEMS_URL}/${id}`);
    return res.status === 204;
}

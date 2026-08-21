import {useState, useEffect} from "react";
import type Item from "../models/Item.ts";
import {getAllAdminItems} from "../services/ItemService.ts";
import AdminItemTile from "../components/AdminItemTile.tsx";


function Admin() {
    const [items, setItems] = useState<Item[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchItems = async () => {
            try {
                const fetchedItems = await getAllAdminItems();
                setItems(fetchedItems);
            } catch (error: unknown) {
                if (error instanceof Error) {
                    setError(error.message);
                } else {
                    setError("An unexpected error occurred.");
                }
            } finally {
                setLoading(false);
            }
    };

    useEffect(() => {
        fetchItems();
    }, []);

    return (
        <div>
            <h2 className={"text-center font-bold text-3xl"}>Item List</h2>
            {loading && <p>Loading...</p>}
            {error && <p style={{color: "red"}}>{error}</p>}
            {!loading && !error && (
                <div className="item-list grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 justify-items-center mt-4">
                    {items.length === 0
                        ? <p className="text-gray-600">No items yet. Create the first item to get started.</p>
                        : items.map((item) => (
                            <AdminItemTile key={item.id} item={item} onDeleted={fetchItems}/>
                        ))}
                </div>
            )}
        </div>
    );
}

export default Admin;

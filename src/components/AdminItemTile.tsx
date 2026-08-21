import Item from "../models/Item";
import {Link} from "react-router-dom";
import {deleteItem} from "../services/ItemService.ts";
import {toast} from "react-toastify";

interface AdminItemTileProps {
    item: Item,
    onDeleted: () => Promise<void>,
}

function AdminItemTile({item, onDeleted}: AdminItemTileProps) {
    const handleDelete = async () => {
        const confirmed = window.confirm(
            `Delete "${item.name}" permanently? Existing orders will keep their saved item details.`
        );
        if (!confirmed) return;

        await toast.promise(deleteItem(item.id), {
            pending: "Deleting item...",
            success: "Item deleted",
            error: "Could not delete item",
        });
        await onDeleted();
    };

    return (
        <div
            className="item-tile w-full max-w-sm min-h-[400px] border-2 border-gray-300 rounded-xl p-4 shadow-md flex flex-col bg-white"
        >
            <img
                className="w-full max-w-64 aspect-square object-cover border rounded self-center"
                src={item.imageUrl}
                alt={item.name}
            />
            <div className="flex flex-col sm:flex-row justify-between gap-3 sm:items-center mt-4">
                <div className="sm:w-2/3 sm:pr-2 min-w-0">
                    <h2 className="text-xl font-semibold truncate">{item.name}</h2>
                    <p className="text-gray-600 line-clamp-2 text-sm">{item.description}</p>
                    <p className="text-lg font-bold text-green-700 mt-1">Price: ${item.price}</p>
                </div>
                <div className="sm:w-1/3 sm:pl-2 flex flex-col gap-2">
                    <Link to={"/admin/edit/" + item.id}>
                        <button
                            className="w-full bg-blue-500 text-white font-semibold py-2 rounded hover:bg-blue-600"
                        >
                            Edit
                        </button>
                    </Link>
                    <button
                        className="w-full bg-red-500 text-white font-semibold py-2 rounded hover:bg-red-600"
                        onClick={handleDelete}
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );

}

export default AdminItemTile;

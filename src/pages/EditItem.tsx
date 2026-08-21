import React, {useEffect, useState} from "react";
import {useParams, useNavigate} from "react-router";
import {getItemById, updateItem} from "../services/ItemService.ts";
import {toast} from "react-toastify";

import {FilePond, registerPlugin} from "react-filepond";
import "filepond/dist/filepond.min.css";
import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import FilePondPluginFileValidateSize from "filepond-plugin-file-validate-size";
import FilePondPluginFileValidateType from "filepond-plugin-file-validate-type";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
import type {FilePondFile} from "filepond";
import {BASE_URL, IMAGE_URL} from "../services/BASE_URL.ts";
import {AUTH_TOKEN_KEY} from "../services/api.ts";

registerPlugin(
    FilePondPluginImageExifOrientation,
    FilePondPluginImagePreview,
    FilePondPluginFileValidateSize,
    FilePondPluginFileValidateType
);

function EditItem() {
    const {id} = useParams();
    const navigate = useNavigate();
    const [itemName, setItemName] = useState("");
    const [description, setDescription] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [oldImageName, setOldImageName] = useState("");
    const [price, setPrice] = useState(0);
    const [notFound, setNotFound] = useState(false);
    const [, setFiles] = useState<FilePondFile[]>([]);
    const url = BASE_URL + "/api/admin/uploads";

    useEffect(() => {
        const fetchItem = async () => {
            if (!id) return;
            const item = await getItemById(Number(id));
            if (!item) {
                setNotFound(true);
                return;
            }
            setItemName(item.name);
            setDescription(item.description);
            setPrice(item.price);

            const imageName = item.imageUrl.replace(IMAGE_URL, "");
            setOldImageName(imageName);
            setImageUrl(imageName);
        };

        fetchItem();
    }, [id]);

    if (notFound) {
        return <p className="text-center text-red-500 mt-10">Item not found</p>;
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const itemDto = {
            name: itemName,
            description: description,
            imageUrl: imageUrl,
            price: price,
        };

        await toast.promise(
            updateItem(Number(id), itemDto), {
                pending: "Updating item...",
                success: "Item updated successfully!",
                error: "Error updating item",
            });

        navigate("/admin");
    };

    return (
        <div className="w-full max-w-xl mx-auto my-4 sm:my-10 bg-white p-4 sm:p-6 rounded-xl shadow-md">
            <h1 className="text-2xl font-semibold mb-6 text-center">Edit Item</h1>
            <div className={"flex flex-col"}>
                <img
                    className="w-full max-w-64 aspect-square object-cover border rounded self-center mb-4"
                    src={IMAGE_URL + oldImageName}
                    alt={itemName}
                    draggable={false}
                />
            </div>
            <p className="text-gray-600 text-sm mb-4 text-center">Current Image</p>
            <div className="mb-6">
                <FilePond
                    onupdatefiles={setFiles}
                    allowMultiple={false}
                    maxFiles={1}
                    maxFileSize="10MB"
                    name="file"
                    acceptedFileTypes={["image/jpeg", "image/png", "image/webp"]}
                    labelIdle='Drag & Drop your image or <span class="filepond--label-action">Browse</span>'
                    server={{
                        url: url,
                        process: {
                            url: "",
                            method: "POST",
                            headers: {
                                Authorization: `Bearer ${localStorage.getItem(AUTH_TOKEN_KEY) ?? ""}`,
                            },
                            onload: (response) => {
                                const res = JSON.parse(response);
                                setImageUrl(res.imageUrl);
                                return res.imageUrl;
                            },
                        },
                    }}
                />
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Item Name</label>
                    <input
                        type="text"
                        value={itemName}
                        onChange={(e) => setItemName(e.target.value)}
                        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <input
                        type="text"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
                    <input
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(Number(e.target.value))}
                        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        min={1}
                        step="1"
                        required
                    />
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 font-semibold transition duration-200"
                >
                    Update Item
                </button>
            </form>
        </div>
    );
}

export default EditItem;

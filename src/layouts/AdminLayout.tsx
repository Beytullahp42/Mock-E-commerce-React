import { Link, Outlet } from "react-router-dom";

function AdminLayout() {
    return (
        <>
            <nav className="bg-blue-500 p-4 text-xl select-none text-white font-bold fixed top-0 w-full h-16 z-10">
                <ul className="flex justify-between items-end">
                    <li className={"text-3xl"}>Admin Panel</li>
                    <li><Link to="/admin">Item List</Link></li>
                    <li><Link to="/admin/create">Create Item</Link></li>
                    <li><Link to="/admin/orders">Orders</Link></li>
                    <li className="text-base font-medium"><Link to="/">Customer View</Link></li>
                </ul>
            </nav>
            <div className="mb-16"></div>
            <div className="p-3">
                <Outlet />
            </div>
        </>
    );
}

export default AdminLayout;

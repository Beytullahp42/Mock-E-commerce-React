import { Link, Outlet } from "react-router-dom";
import {useAuth} from "../context/auth-context.ts";

function AdminLayout() {
    const {logout} = useAuth();

    return (
        <>
            <nav className="bg-blue-500 px-4 py-3 text-lg select-none text-white font-bold sticky top-0 w-full z-10">
                <ul className="flex flex-wrap items-center gap-x-5 gap-y-2">
                    <li className="text-2xl sm:text-3xl mr-auto">Admin Panel</li>
                    <li><Link to="/admin">Item List</Link></li>
                    <li><Link to="/admin/create">Create Item</Link></li>
                    <li><Link to="/admin/orders">Orders</Link></li>
                    <li><Link to="/">Customer View</Link></li>
                    <li><button className="underline" onClick={logout}>Logout</button></li>
                </ul>
            </nav>
            <div className="p-3">
                <Outlet />
            </div>
        </>
    );
}

export default AdminLayout;

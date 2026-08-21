import { Link, Outlet } from "react-router-dom";
import {useAuth} from "../context/auth-context.ts";

function UserLayout() {
    const {account, logout} = useAuth();

    return (
        <>
            <nav className="bg-amber-400 px-4 py-3 select-none text-white font-bold sticky top-0 w-full z-10">
                <ul className="flex flex-wrap items-center gap-x-5 gap-y-2">
                    <li className="text-2xl sm:text-3xl mr-auto"><Link to="/">E-commerce</Link></li>
                    {!account && <li className="text-base"><Link to="/admin">Admin Panel</Link></li>}
                    {account?.role === "ROLE_ADMIN" && <li className="text-base"><Link to="/admin">Admin Panel</Link></li>}
                    {account?.role === "ROLE_USER" && <li className="text-base sm:text-xl"><Link to="/orders">My Orders</Link></li>}
                    {!account && <li className="text-base"><Link to="/login">Login</Link></li>}
                    {!account && <li className="text-base"><Link to="/register">Register</Link></li>}
                    {account && (
                        <li>
                            <button className="text-base underline" onClick={logout}>Logout</button>
                        </li>
                    )}
                </ul>
            </nav>
            <div className="p-3">
                <Outlet />
            </div>
        </>
    );
}

export default UserLayout;

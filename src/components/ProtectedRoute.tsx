import type {ReactNode} from "react";
import {Navigate, useLocation} from "react-router-dom";
import type {AuthRole} from "../models/Auth.ts";
import {useAuth} from "../context/auth-context.ts";

interface ProtectedRouteProps {
    children: ReactNode;
    role?: AuthRole;
}

function ProtectedRoute({children, role}: ProtectedRouteProps) {
    const {account, loading} = useAuth();
    const location = useLocation();

    if (loading) {
        return <p className="p-4">Loading...</p>;
    }
    if (!account) {
        return <Navigate to="/login" state={{from: location.pathname}} replace/>;
    }
    if (role && account.role !== role) {
        return <Navigate to="/" replace/>;
    }
    return children;
}

export default ProtectedRoute;

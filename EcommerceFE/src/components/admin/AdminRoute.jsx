import { Navigate } from "react-router-dom";
import { isAdminAuthenticated } from "../../hooks/useAdminAuth";

export default function AdminRoute({ children }) {
    if (!isAdminAuthenticated()) {
        return <Navigate to="/admin/login" replace />;
    }
    return children;
}

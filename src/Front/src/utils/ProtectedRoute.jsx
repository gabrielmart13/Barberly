import { Navigate, Outlet, useLocation } from "react-router-dom";
import { getRole, getToken, homeForRole } from "./session";
export default function ProtectedRoute({ roles }) {
    const location = useLocation();
    const token = getToken();
    const role = getRole();
    if (!token)
        return <Navigate to="/login" replace state={{ from: location }}/>;
    if (roles && !roles.includes(role))
        return <Navigate to={homeForRole(role)} replace/>;
    return <Outlet />;
}

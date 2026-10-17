import { useEffect, useState, type ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { getSelf, type User } from "../services/users.ts";
import { ApiError } from "../services/error.ts";

type ProtectedRouteProps = {
    allowedRole: User["role"];
    children: ReactNode;
};

export const ProtectedRoute = ({ allowedRole, children }: ProtectedRouteProps) => {
    const location = useLocation();
    const [status, setStatus] = useState<"loading" | "authorized" | "denied">("loading");
    
    useEffect(() => {
        let active = true;
        
        getSelf()
            .then(({ user }: { user: User }) => {
                if (active) {
                    setStatus(user.role === allowedRole ? "authorized" : "denied");
                }
            })
            .catch((error: unknown) => {
                if (active && error instanceof ApiError && error.status !== 401) {
                    setStatus("denied");
                }
            });
            
        return () => {
            active = false;
        };
    }, [allowedRole, location.pathname]);
    
    if (status === "loading") {
        return <div className="min-h-screen bg-slate-100" aria-busy="true" />;
    }
    
    if (status === "denied") {
        return <Navigate to={allowedRole === "admin" ? "/admin-login" : "/student-login"} replace />;
    }
    
    return children;
};

import { useEffect, useState, type ReactNode } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getSelf, type User } from "../services/users.ts";
import { ApiError } from "../services/error.ts";
import { canUseCookies } from "./CookieConsent.tsx";

type ProtectedRouteProps = {
    allowedRole: User["role"];
    children: ReactNode;
};

export const ProtectedRoute = ({ allowedRole, children }: ProtectedRouteProps) => {
    const location = useLocation();
    const navigate = useNavigate();
    const [status, setStatus] = useState<"loading" | "authorized" | "denied">("loading");
    
    useEffect(() => {
        let active = true;
        
        const loginPath = allowedRole === "admin" ? "/admin-login" : "/student-login";
        const redirectToLogin = (reason: "unauthorized" | "cookies-disabled") => {
            if (active) {
                setStatus("denied");
                navigate(loginPath, {
                    replace: true,
                    state: { notify: true, reason },
                });
            }
        };
        
        if (!canUseCookies()) {
            redirectToLogin("cookies-disabled");
            return;
        }
        
        getSelf()
            .then(({ user }: { user: User }) => {
                if (active) {
                    if (user.role === allowedRole) {
                        setStatus("authorized");
                    } else {
                        redirectToLogin("unauthorized");
                    }
                }
            })
            .catch((error: unknown) => {
                if (error instanceof ApiError && error.status === 401) {
                    redirectToLogin("unauthorized");
                } else {
                    redirectToLogin("unauthorized");
                }
            });
            
        return () => {
            active = false;
        };
    }, [allowedRole, location.pathname, navigate]);
    
    if (status === "loading") {
        return <div className="min-h-screen bg-slate-100" aria-busy="true" />;
    }
    
    if (status === "denied") return null;
    
    return children;
};

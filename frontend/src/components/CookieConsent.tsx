// components/CookieConsent.tsx
import { useEffect, useState } from "react";

const TEST_COOKIE = "attendscan-cookie-test";

const canUseCookies = () => {
    if (!navigator.cookieEnabled) return false;
    
    const probeValue = `${Date.now()}-${Math.random()}`;
    try {
        document.cookie = `${TEST_COOKIE}=${probeValue}; Max-Age=60; Path=/; SameSite=Lax`;
        const cookieWasStored = document.cookie
            .split("; ")
            .some((cookie) => cookie === `${TEST_COOKIE}=${probeValue}`);
        document.cookie = `${TEST_COOKIE}=; Max-Age=0; Path=/; SameSite=Lax`;
        return cookieWasStored;
    } catch {
        return false;
    }
};

export const CookieConsent = () => {
    const [visible, setVisible] = useState(false);
    const [cookiesBlocked, setCookiesBlocked] = useState(false);
    
    useEffect(() => {
        const blocked = !canUseCookies();
        setCookiesBlocked(blocked);
        setVisible(blocked);
    }, []);
    
    const choose = (value: "accepted" | "declined") => {
        try {
            if (value === "accepted") {
                document.cookie = `${TEST_COOKIE}=1; Max-Age=31536000; Path=/; SameSite=Lax`;
            } else {
                document.cookie = `${TEST_COOKIE}=; Max-Age=0; Path=/; SameSite=Lax`;
            }
        } 
        catch {}
        setVisible(false);
    };
    
    if (!visible) return null;
    
    return (
        <div className="fixed bottom-0 inset-x-0 z-50 bg-white border-t border-gray-200 shadow-lg p-4 sm:px-6">
            <div className="max-w-5xl mx-auto flex flex-col sm:flex-row sm:items-center gap-3">
                <div className="flex-1 text-sm text-gray-700">
                    <p>This website uses cookies to properly function.</p>
                    {cookiesBlocked && (
                        <p className="mt-1 text-red-600">
                            To allow cookies, please enable them in your browser settings. <br/>
                            (Settings → Privacy & Security → Cookies and Site Data → Allow cookies) <br/>
                            If you have already enabled cookies, please refresh the page.
                        </p>
                    )}
                </div>
                <div className="flex gap-2">
                    <button type="button" onClick={() => choose("declined")}
                        className="bg-gray-100 border border-gray-400 hover:bg-gray-200 text-gray-600 font-bold py-1.5 px-4 rounded">
                        Decline
                    </button>
                    <button type="button" onClick={() => choose("accepted")}
                        className="bg-blue-800 hover:bg-blue-900 text-white font-bold py-1.5 px-4 rounded">
                        Accept
                    </button>
                </div>
            </div>
        </div>
    );
};
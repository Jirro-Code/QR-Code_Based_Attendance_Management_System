import { Navbar } from "../../components/Navbar";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useView } from "../../hooks/useView.ts";
import { type User } from "../../services/users.ts";
import { logout } from "../../services/auth.ts";


export const AdminProfilePage = () => {
    const location = useLocation();
    const admin = location.state?.user as User || "";
    const [profilePicture, setProfilePicture] = useState<string | null>(null);
    const [isLoadingPicture, setIsLoadingPicture] = useState<boolean>(true);
    const { useViewProfilePicture } = useView();
    
    useEffect(() => {
        
        window.scrollTo({ top: 0, left: 0 });
        
        const fetchProfilePicture = async () => {
            if (!admin.id) return;
            setIsLoadingPicture(true);
            try {
                const url = await useViewProfilePicture(admin.id, (error) => {
                    console.error("Error fetching profile picture:", error);
                });
                setProfilePicture(url);
            }
            catch (e) {
                console.error("Error fetching profile picture:", e);
                setProfilePicture(null);
            }
            finally {
                setIsLoadingPicture(false);
            }
        }
        fetchProfilePicture();
    }, [admin.id]);
    
    
    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar dashPath="/admin-dashboard" profilePath="/admin-profile" user={admin}/>
            
            <div className="w-full">
                <div className="relative h-40 sm:h-50 md:h-60 bg-blue-800">
                    <div className="absolute inset-x-0 bottom-0 h-30 bg-linear-to-t from-gray-50 to-transparent" />
                </div>
                
                <div className="relative px-5 sm:px-8 lg:px-12">
                    <div className="flex items-end -mt-20 sm:-mt-24 md:-mt-28">
                        <div className="w-36 sm:w-44 md:w-52 shrink-0">
                            {isLoadingPicture ? (
                                <div className="w-full aspect-square rounded-md bg-gray-100 ring-4 ring-white animate-pulse" />
                            ) : profilePicture ? (
                                <img
                                    src={profilePicture}
                                    alt="Profile"
                                    className="w-full aspect-square rounded-md object-cover ring-4 ring-white bg-white"
                                />
                            ) : (
                                <div className="w-full aspect-square rounded-md bg-gray-100 ring-4 ring-white flex items-center justify-center">
                                    <span className="text-gray-500 text-sm">
                                        No Photo
                                    </span>
                                </div>
                            )}
                        </div>
                        
                        <div className="ml-5 mbe-1.5 min-w-0">
                            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 wrap-break-word truncate">
                                {admin.username || "Admin"}
                            </h1>
                            <p className="mt-2 text-sm sm:text-base text-gray-500">
                                Admin Profile
                            </p>
                        </div>
                    </div>
                </div>
                
                <div className="px-4 pt-10 pb-8">
                    <div className="border-b border-gray-200"></div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-7 px-4 py-7 sm:py-8">
                        
                        <div className="min-w-0">
                            <div className="text-xs sm:text-sm font-semibold uppercase tracking-wide text-gray-500">
                                Email
                            </div>
                            <div className="mt-2 text-lg sm:text-xl font-medium text-gray-800 wrap-break-word">
                                {admin.email}
                            </div>
                        </div>
                        
                        <div className="min-w-0">
                            <div className="text-xs sm:text-sm font-semibold uppercase tracking-wide text-gray-500">
                                School
                            </div>
                            <div className="mt-2 text-lg sm:text-xl font-medium text-gray-800 wrap-break-word">
                                Immaculate Conception Polytechnic Santa Maria, Bulacan
                            </div>
                        </div>                            
                        
                    </div>
                    
                    <div className="mt-8 flex justify-start items-center gap-4 px-4">
                        <button
                            onClick={() => logout("/admin-login")}
                            className="rounded-lg border border-red-700 bg-white px-6 py-3 text-sm font-semibold text-red-700 transition hover:bg-red-50"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
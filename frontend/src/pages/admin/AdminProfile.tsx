import { Navbar } from "../../components/Navbar";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getProfilePictureById, getSelf, type User } from "../../services/users.ts";
import { logout } from "../../services/auth.ts";
import { UserPen } from "lucide-react"

export const AdminProfilePage = () => {
    const navigate = useNavigate();
    const [admin, setAdmin] = useState<Partial<User>>({});
    const [profilePicture, setProfilePicture] = useState<string | null>(null);
    const [isLoadingPicture, setIsLoadingPicture] = useState<boolean>(true);
    
    useEffect(() => {
        window.scrollTo({ top: 0, left: 0 });
        
        const loadAdminProfile = async () => {
            try {
                const response = await getSelf();
                const user = response.user as User;
                setAdmin(user);
                if (!user.profilePictureUrl) {
                    setProfilePicture(null);
                    return;
                }

                const pictureResponse = await getProfilePictureById(user.id);
                setProfilePicture(pictureResponse.url as string);
            } catch (e) {
                console.error("Error fetching admin profile:", e);
                setProfilePicture(null);
            }
            setIsLoadingPicture(false);
        };
        loadAdminProfile();
    }, []);
    
    
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar dashPath="/admin-dashboard" profilePath="/admin-profile" user={admin}/>
            
            <div className="w-full flex-1 flex flex-col">
                <div className="relative h-40 sm:h-50 md:h-60 bg-blue-800">
                    <div className="absolute inset-x-0 bottom-0 h-30 bg-linear-to-t from-gray-50 to-transparent" />
                </div>
                
                <div className="relative px-5 sm:px-8 lg:px-12">
                    <div className="flex items-end -mt-20 sm:-mt-24 md:-mt-28">
                        <div className="w-25 sm:w-40 md:w-50 shrink-0">
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
                        
                        <button onClick={() => navigate("/admin-edit")} className="flex gap-2 ml-auto mb-1.5 shrink-0 rounded-lg border border-blue-800 bg-white px-4 py-2 text-sm font-semibold text-blue-800 transition hover:bg-blue-50">
                            <UserPen className="w-5 h-5"/>
                            <span className="hidden sm:inline">Edit</span>
                        </button>
                    </div>
                </div>
                
                <div className="flex-1 flex flex-col px-4 pt-10 pb-8">
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
                    
                    <div className="mt-auto flex justify-end px-4 pt-8">
                        <button onClick={() => logout("/admin-login")} className="rounded-lg border border-red-700 bg-white px-6 py-3 text-sm font-semibold text-red-700 transition hover:bg-red-50">
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
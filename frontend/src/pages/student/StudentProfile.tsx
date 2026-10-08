import { Navbar } from "../../components/Navbar";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useView } from "../../hooks/useView.ts";
import { getSelf, type User } from "../../services/users.ts";
import { logout } from "../../services/auth.ts";
import { KeyRound } from "lucide-react";
import { NotificationCard } from "../../components/Cards/NotificationCard.tsx";

export const StudentProfilePage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [showNotification, setShowNotification] = useState(!!location.state?.notify);
    const [student, setStudent] = useState<Partial<User>>(() => location.state?.user as User || {});
    const [profilePicture, setProfilePicture] = useState<string | null>(null);
    const [isLoadingPicture, setIsLoadingPicture] = useState<boolean>(true);
    const { useViewProfilePicture } = useView();
    
    useEffect(() => {
        window.scrollTo({ top: 0, left: 0 });

        if (!student.id) {
            getSelf()
                .then((response) => setStudent(response.user as User))
                .catch((error) => console.error("Error fetching student profile:", error));
        }
        
        const fetchProfilePicture = async () => {
            if (!student.id) return;
            setIsLoadingPicture(true);
            try {
                const url = await useViewProfilePicture(student.id, (error) => {
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
    }, [student.id]);
    
    
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar dashPath="/student-dashboard" profilePath="/student-profile" user={student}/>
            
            <div className="w-full flex-1 flex flex-col">
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
                        
                        <div className="ml-5 mb-2 min-w-0">
                            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 wrap-break-word truncate">
                                {student.username || "Student"}
                            </h1>
                            <p className="mt-2 text-sm sm:text-base text-gray-500">
                                Student Profile
                            </p>
                        </div>
                    </div>
                </div>
                
                <div className="flex-1 flex flex-col px-4 pt-5 pb-8">
                    <div className="border-b border-gray-200"></div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-7 px-4 py-7 sm:py-8">
                        
                        <div className="min-w-0">
                            <div className="text-xs sm:text-sm font-semibold uppercase tracking-wide text-gray-500">
                                Email
                            </div>
                            <div className="mt-2 text-lg sm:text-xl font-medium text-gray-800 wrap-break-word">
                                {student.email}
                            </div>
                        </div>
                        
                        <div className="min-w-0">
                            <div className="text-xs sm:text-sm font-semibold uppercase tracking-wide text-gray-500">
                                Student ID
                            </div>
                            <div className="mt-2 text-lg sm:text-xl font-medium text-gray-800 wrap-break-word">
                                {student.studentId}
                            </div>
                        </div>
                        
                        <div className="min-w-0">
                            <div className="text-xs sm:text-sm font-semibold uppercase tracking-wide text-gray-500">
                                LRN
                            </div>
                            <div className="mt-2 text-lg sm:text-xl font-medium text-gray-800 wrap-break-word">
                                {student.studentLRN}
                            </div>
                        </div>
                        
                        <div className="min-w-0">
                            <div className="text-xs sm:text-sm font-semibold uppercase tracking-wide text-gray-500">
                                Strand
                            </div>
                            <div className="mt-2 text-lg sm:text-xl font-medium text-gray-800 wrap-break-word">
                                {student.studentStrand}
                            </div>
                        </div>
                        
                        <div className="min-w-0">
                            <div className="text-xs sm:text-sm font-semibold uppercase tracking-wide text-gray-500">
                                Section
                            </div>
                            <div className="mt-2 text-lg sm:text-xl font-medium text-gray-800 wrap-break-word">
                                {student.studentSection}
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
                    
                    <div className="mt-auto flex flex-wrap justify-between sm:justify-end gap-5 px-4 pt-8">
                        <button onClick={() => navigate("/student-change-password", { state: { user: student } })} className="inline-flex items-center gap-2 rounded-lg border border-blue-800 bg-white px-5 py-3 text-sm font-semibold text-blue-800 transition hover:bg-blue-50">
                            <KeyRound className="h-4 w-4" />
                            Change Password
                        </button>
                        <button onClick={() => logout("/student-login")} className="rounded-lg border border-red-700 bg-white px-6 py-3 text-sm font-semibold text-red-700 transition hover:bg-red-50">
                            Logout
                        </button>
                    </div>
                </div>
            </div>
            {showNotification && (
                <NotificationCard
                    title="Password Changed"
                    message="Your password has been changed successfully."
                    onClose={() => {
                        setShowNotification(false);
                        navigate(location.pathname, { replace: true, state: { user: student } });
                    }}
                />
            )}
        </div>
    );
}
import { useCurrentUser } from "../../hooks/useCurrentUser.ts";
import { useScrollToTop } from "../../hooks/useScrollToTop.ts";
import {useState } from "react";
import { useNavigate } from "react-router-dom";
import { logout } from "../../services/auth.ts";
import { type User } from "../../services/users.ts";
import { SelectionCard } from "../../components/Cards/SelectionCard.tsx";
import { Navbar } from "../../components/Navbar.tsx";
import { UserPlus, ScanSquare, CalendarPlus2, Calendars, Users, SquareArrowOutUpRight } from 'lucide-react';

export const AdminDashboard = () => {
    useScrollToTop("/admin-dashboard");
    const navigate = useNavigate();
    const [isSelecting, setIsSelecting] = useState<boolean>(false);
    const [adminData, setAdminData] = useState<Partial<User>>({
        id: "",
        username: "",
        email: "",
        role: "admin",
    });
    
    useCurrentUser("/admin-login", setAdminData);
    
    const isSelectingHandler = () => {
        setIsSelecting(false);
    }
    
    return (
    <>
        <Navbar dashPath="/admin-dashboard" profilePath="/admin/profile" />
        
        <div className="min-h-screen bg-slate-100 px-6 py-10">
            <div className="mx-auto max-w-6xl">
                <div className="h-2"></div>
                <div className="mb-8">
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">Admin Dashboard</h1>
                    <p className="mt-2 text-slate-500"> Welcome back,{" "} <span className="font-semibold text-blue-800">{adminData.username}</span>!</p>
                </div>
                <div className="h-10"></div>
                
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    <button onClick={() => navigate("/manage-students")}
                        className="group rounded-2xl border border-slate-200 bg-white p-6 text-left shadow-sm transition duration-200 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl"
                    >
                        <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-sm font-semibold text-blue-700">
                            <Users size={20} />
                        </div>
                        
                        <h2 className="text-lg font-bold text-slate-900">
                            Manage Students
                        </h2>
                        
                        <p className="mt-2 text-sm leading-6 text-slate-500">
                            View, update, and manage student accounts.
                        </p>
                        
                        <div className="mt-5 text-sm font-semibold text-blue-700 transition group-hover:text-blue-900 flex items-center gap-1">
                            <SquareArrowOutUpRight /> Open
                        </div>
                    </button>
                    
                    
                    <button
                        onClick={() => setIsSelecting(true)}
                        className="group rounded-2xl border border-slate-200 bg-white p-6 text-left shadow-sm transition duration-200 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl"
                    >
                        <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-sm font-semibold text-blue-700">
                            <UserPlus size={20} />
                        </div>
                        
                        <h2 className="text-lg font-bold text-slate-900">
                            Create Account
                        </h2>
                        
                        <p className="mt-2 text-sm leading-6 text-slate-500">
                            Create a new student or administrator account.
                        </p>
                        
                        <div className="mt-5 text-sm font-semibold text-blue-700 transition group-hover:text-blue-900 flex items-center gap-1">
                            <SquareArrowOutUpRight /> Open
                        </div>
                    </button>
                    
                    
                    <button
                        onClick={() => navigate("/manage-events")}
                        className="group rounded-2xl border border-slate-200 bg-white p-6 text-left shadow-sm transition duration-200 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl"
                    >
                        <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-sm font-semibold text-blue-700">
                            <Calendars size={20} />
                        </div>
                        
                        <h2 className="text-lg font-bold text-slate-900">
                            Manage Events
                        </h2>
                        
                        <p className="mt-2 text-sm leading-6 text-slate-500">
                            View and manage school events.
                        </p>
                        
                        <div className="mt-5 text-sm font-semibold text-blue-700 transition group-hover:text-blue-900 flex items-center gap-1">
                            <SquareArrowOutUpRight /> Open
                        </div>
                    </button>
                    
                    
                    <button
                        onClick={() => navigate("/create-event")}
                        className="group rounded-2xl border border-slate-200 bg-white p-6 text-left shadow-sm transition duration-200 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl"
                    >
                        <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-sm font-semibold text-blue-700">
                            <CalendarPlus2 size={20} />
                        </div>
                        
                        <h2 className="text-lg font-bold text-slate-900">
                            New Event
                        </h2>
                        
                        <p className="mt-2 text-sm leading-6 text-slate-500">
                            Create a new school event.
                        </p>
                        
                        <div className="mt-5 text-sm font-semibold text-blue-700 transition group-hover:text-blue-900 flex items-center gap-1">
                            <SquareArrowOutUpRight /> Open
                        </div>
                    </button>
                    
                    
                    <button
                        onClick={() => navigate("/scanner")}
                        className="group rounded-2xl border border-slate-200 bg-white p-6 text-left shadow-sm transition duration-200 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl"
                    >
                        <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-sm font-semibold text-blue-700">
                            <ScanSquare size={20} />
                        </div>
                        
                        <h2 className="text-lg font-bold text-slate-900">
                            Scanner
                        </h2>
                        
                        <p className="mt-2 text-sm leading-6 text-slate-500">
                            Scan student QR codes for attendance.
                        </p>
                        
                        <div className="mt-5 text-sm font-semibold text-blue-700 transition group-hover:text-blue-900 flex items-center gap-1">
                            <SquareArrowOutUpRight /> Open
                        </div>
                    </button>
                    
                </div>
                
                
                <div className="mt-8">
                    <button
                        onClick={() => logout("/admin-login")}
                        className="rounded-xl border border-red-200 bg-white px-5 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-50"
                    >
                        Logout
                    </button>
                </div>
                
                {isSelecting && (<SelectionCard onClose={() => isSelectingHandler()} /> )}
            </div>
        </div>
    </>
);
}
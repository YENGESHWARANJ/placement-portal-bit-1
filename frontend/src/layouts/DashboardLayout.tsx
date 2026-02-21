import React from "react";
import { useAuth } from "../features/auth/AuthContext";
import StudentLayout from "./StudentLayout";
import RecruiterLayout from "./RecruiterLayout";
import AdminLayout from "./AdminLayout";
import useNotifications from "../hooks/useNotifications";
import { RoleSwitcher } from "../components/RoleSwitcher";

export default function DashboardLayout() {
    const { user } = useAuth();
    const role = user?.role || "student";

    // Initialize real-time notifications
    useNotifications();

    const renderLayout = () => {
        if (role === "student") return <StudentLayout />;
        if (role === "admin" || role === "officer") return <AdminLayout />;
        return <RecruiterLayout />;
    };

    return (
        <>
            {renderLayout()}
            <RoleSwitcher />
        </>
    );
}

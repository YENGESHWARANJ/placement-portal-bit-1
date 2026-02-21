import React, { useEffect } from 'react';
import { useAuth } from '../../features/auth/AuthContext';
import { useNavigate } from 'react-router-dom';
import StudentDashboard from './StudentDashboard';
import RecruiterDashboard from './RecruiterDashboard';
import AdminDashboard from '../Admin/AdminDashboard';
import SuperAdminDashboard from '../Admin/SuperAdminDashboard';

export default function Dashboard() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const role = user?.role || 'student';

    useEffect(() => {
        if (role === 'admin' || role === 'officer') {
            navigate('/admin/dashboard', { replace: true });
        }
    }, [role, navigate]);

    // Different portals for different roles
    if (role === 'student') {
        return <StudentDashboard />;
    }

    // Default to Recruiter Dashboard
    return <RecruiterDashboard />;
}

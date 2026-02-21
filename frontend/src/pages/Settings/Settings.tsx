import React from 'react';
import { useAuth } from '../../features/auth/AuthContext';
import StudentSettings from './StudentSettings';
import RecruiterSettings from './RecruiterSettings';
import AdminSettings from './AdminSettings';

export default function Settings() {
    const { user } = useAuth();
    const role = user?.role || 'student';

    // Role-Based Settings Page
    if (role === 'student') {
        return <StudentSettings />;
    }

    if (role === 'admin') {
        return <AdminSettings />;
    }

    // Default to Recruiter Settings
    return <RecruiterSettings />;
}

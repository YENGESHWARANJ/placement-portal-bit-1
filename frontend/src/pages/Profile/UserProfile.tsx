import React from 'react';
import { useAuth } from '../../features/auth/AuthContext';
import StudentProfile from './StudentProfile';
import RecruiterProfile from './RecruiterProfile';
import AdminProfile from './AdminProfile';

export default function UserProfile() {
    const { user } = useAuth();
    const role = user?.role || 'student';

    // Role-Based Profile View
    if (role === 'student') {
        return <StudentProfile />;
    }

    if (role === 'admin') {
        return <AdminProfile />;
    }

    // Default to Recruiter Profile
    return <RecruiterProfile />;
}

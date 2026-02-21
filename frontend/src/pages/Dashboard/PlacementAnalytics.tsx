import React from 'react';
import { useAuth } from '../../features/auth/AuthContext';
import StudentAnalytics from './StudentAnalytics';
import RecruiterAnalytics from '../recruiter/RecruiterAnalytics';
import PlacementAnalyticsView from './PlacementAnalyticsView';

export default function Analytics() {
    const { user } = useAuth();
    const role = user?.role || 'student';

    // Role-Based Analytics View
    if (role === 'student') {
        return <StudentAnalytics />;
    }

    if (role === 'admin') {
        return <PlacementAnalyticsView />; // The institutional view
    }

    // Default to Recruiter Analytics (Hiring Intel)
    return <RecruiterAnalytics />;
}

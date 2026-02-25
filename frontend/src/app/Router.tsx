import React, { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import Login from "../features/auth/Login";
import StudentLogin from "../features/auth/StudentLogin";
import RecruiterLogin from "../features/auth/RecruiterLogin";
import Register from "../features/auth/Register";
import ForgotPassword from "../features/auth/ForgotPassword";
import ResetPassword from "../features/auth/ResetPassword";
import OTPVerification from "../features/auth/OTPVerification";
import AdminLogin from "../features/auth/AdminLogin";
import AdminRegister from "../features/auth/AdminRegister";
import Onboarding from "../features/auth/Onboarding";

import DashboardLayout from "../layouts/DashboardLayout";
import Dashboard from "../pages/Dashboard/Dashboard";
import PlacementAnalytics from "../pages/Dashboard/PlacementAnalytics";
import CareerRoadmap from "../pages/Dashboard/CareerRoadmap";
import StudentManagement from "../pages/Students/StudentManagement";
import JobPosting from "../pages/recruiter/JobPosting";
import MyJobs from "../pages/recruiter/MyJobs";
import JobApplicants from "../pages/recruiter/JobApplicants";
import RecruiterAnalytics from "../pages/recruiter/RecruiterAnalytics";
import JobDetails from "../pages/recruiter/JobDetails";
import InterviewLedger from "../pages/recruiter/InterviewLedger";
import TPOReports from "../pages/recruiter/TPOReports";
import ArenaHub from "../pages/Arena/ArenaHub";
import Companies from "../pages/Companies/Companies";
import UserProfile from "../pages/Profile/UserProfile";
import Portfolio from "../pages/Profile/Portfolio";
import Settings from "../pages/Settings/Settings";
import Resources from "../pages/Resources/Resources";
import ResumeUpload from "../pages/Resume/ResumeUpload";
import ProtectedRoute from "./ProtectedRoute";
import MockInterview from "../pages/Interview/MockInterview";
import ApplicationTracker from "../pages/Applications/ApplicationTracker";
import SecuritySettings from "../pages/Settings/SecuritySettings";
import NotificationsCenter from "../pages/NotificationsCenter";
import AnalyticsDashboard from "../pages/AnalyticsDashboard";
import JobRecommendations from "../pages/JobRecommendations";
import AptitudeAssessment from "../pages/Assessments/AptitudeAssessment";
import CodingAssessment from "../pages/Assessments/CodingAssessment";
import AssessmentAnalysis from "../pages/Assessments/AssessmentAnalysis";
import InterviewAssessment from "../pages/Assessments/InterviewAssessment";
import ResumeBuilder from "../pages/Resume/ResumeBuilder";
import MainProfile from "../pages/Profile/MainProfile";
import StudentProfileView from "../pages/recruiter/StudentProfileView";
import TalentDiscovery from "../pages/recruiter/TalentDiscovery";

import AICoach from "../pages/Student/AICoach";
import SavedJobs from "../pages/SavedJobs/SavedJobs";
import PrepTips from "../pages/PrepTips/PrepTips";
import GoalsPage from "../pages/Goals/GoalsPage";
import InterviewQABank from "../pages/InterviewQA/InterviewQABank";
import LandingPage from "../pages/LandingPage";
import ActivityHistory from "../pages/Activity/ActivityHistory";
import LiveInterviewRoom from "../pages/Interview/LiveInterviewRoom";
import VoiceInterview from "../pages/Interview/VoiceInterview";
import AlumniNetwork from "../pages/Alumni/AlumniNetwork";

const InsightsHub = lazy(() => import("../pages/Insights/InsightsHub"));
const InsightsHubFallback = () => (
  <div className="h-full flex items-center justify-center min-h-[400px]" role="status" aria-label="Loading Insights Hub">
    <div className="h-10 w-10 rounded-full border-4 border-slate-100 dark:border-slate-700 border-t-blue-500 animate-spin" aria-hidden />
  </div>
);

import AdminDashboard from "../pages/Admin/AdminDashboard";
import StudentManager from "../pages/Admin/StudentManager";
import RecruiterManager from "../pages/Admin/RecruiterManager";
import JobManager from "../pages/Admin/JobManager";
import PlacementDriveManager from "../pages/Admin/PlacementDriveManager";
import TestManager from "../pages/Admin/TestManager";
import SuperAdminDashboard from "../pages/Admin/SuperAdminDashboard";
import CompanyManager from "../pages/Admin/CompanyManager";
import PortalSettings from "../pages/Admin/PortalSettings";
import { useAuth, getRoleRedirect } from "../features/auth/AuthContext";

// Smart root redirect based on auth state + role
function RootRedirect() {
  const { isAuthenticated, user, loading } = useAuth();
  if (loading) return null;
  if (isAuthenticated && user) {
    return <Navigate to={getRoleRedirect(user.role)} replace />;
  }
  return <Navigate to="/login" replace />;
}

// Role-specific redirect to the right login portal
function LoginPortalRedirect() {
  const { isAuthenticated, user, loading } = useAuth();
  if (loading) return null;
  if (isAuthenticated && user) return <Navigate to={getRoleRedirect(user.role)} replace />;
  return <Navigate to="/login" replace />;
}

export default function Router() {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Toaster position="top-right" />
      <Routes>

        {/* ROOT: smart redirect */}
        {/* ROOT: Landing Page */}
        <Route path="/" element={<LandingPage />} />

        {/* ── ROLE-SPECIFIC PORTALS ──────────────────────────────── */}
        {/* Student Portal */}
        <Route path="/login" element={<StudentLogin />} />
        {/* Recruiter Portal */}
        <Route path="/recruiter-portal" element={<RecruiterLogin />} />
        {/* Admin Command Center */}
        <Route path="/admin-portal" element={<AdminLogin />} />
        <Route path="/admin-portal/register" element={<AdminRegister />} />

        {/* ── PUBLIC AUTH ─────────────────────────────────────────── */}
        <Route path="/register" element={<Register />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/verify-email" element={<OTPVerification />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />

        {/* ── PROTECTED DASHBOARD ─────────────────────────────────── */}
        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>

            {/* Common routes (all authenticated roles) */}
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/companies" element={<Companies />} />
            <Route path="/roadmap" element={<CareerRoadmap />} />
            <Route path="/analytics" element={<PlacementAnalytics />} />
            <Route path="/jobs/:id" element={<JobDetails />} />
            <Route path="/profile" element={<UserProfile />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/security" element={<SecuritySettings />} />
            <Route path="/notifications" element={<NotificationsCenter />} />
            <Route path="/activity" element={<ActivityHistory />} />
            <Route path="/resources" element={<Resources />} />

            {/* Student routes */}
            <Route path="/resume-upload" element={<ResumeUpload />} />
            <Route path="/interview" element={<MockInterview />} />
            <Route path="/applications" element={<ApplicationTracker />} />
            <Route path="/portfolio" element={<Portfolio />} />
            <Route path="/analytics-hub" element={<AnalyticsDashboard />} />
            <Route path="/job-recommendations" element={<JobRecommendations />} />
            <Route path="/aptitude-test" element={<AptitudeAssessment />} />
            <Route path="/coding-test" element={<CodingAssessment />} />
            <Route path="/interview-test" element={<InterviewAssessment />} />
            <Route path="/assessment-analysis" element={<AssessmentAnalysis />} />
            <Route path="/resume-builder" element={<ResumeBuilder />} />
            <Route path="/student-intel" element={<MainProfile />} />
            <Route path="/ai-coach" element={<AICoach />} />
            <Route path="/arena" element={<ArenaHub />} />
            <Route path="/saved-jobs" element={<SavedJobs />} />
            <Route path="/prep-tips" element={<PrepTips />} />
            <Route path="/goals" element={<GoalsPage />} />
            <Route path="/interview-qa" element={<InterviewQABank />} />
            <Route path="/insights" element={
              <Suspense fallback={<InsightsHubFallback />}>
                <InsightsHub />
              </Suspense>
            } />

            <Route path="/interviews/live/:roomId" element={<LiveInterviewRoom />} />
            <Route path="/interview/voice" element={<VoiceInterview />} />
            <Route path="/alumni" element={<AlumniNetwork />} />

          </Route>
        </Route>

        {/* ── RECRUITER-ONLY PROTECTED ROUTES ─────────────────────── */}
        <Route element={<ProtectedRoute roles={["recruiter"]} redirectTo="/recruiter-portal" />}>
          <Route element={<DashboardLayout />}>
            <Route path="/jobs/my" element={<MyJobs />} />
            <Route path="/jobs/create" element={<JobPosting />} />
            <Route path="/jobs/edit/:jobId" element={<JobPosting />} />
            <Route path="/hiring-intel" element={<RecruiterAnalytics />} />
            <Route path="/jobs/:jobId/applicants" element={<JobApplicants />} />
            <Route path="/students" element={<StudentManagement />} />
            <Route path="/students/:id" element={<StudentProfileView />} />
            <Route path="/talent-discovery" element={<TalentDiscovery />} />
            <Route path="/interviews/ledger" element={<InterviewLedger />} />
          </Route>
        </Route>

        {/* ── ADMIN-ONLY PROTECTED ROUTES ──────────────────────────── */}
        <Route element={<ProtectedRoute roles={["admin", "officer"]} redirectTo="/admin-portal" />}>
          <Route element={<DashboardLayout />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/system" element={<SuperAdminDashboard />} />
            <Route path="/admin/students" element={<StudentManager />} />
            <Route path="/admin/recruiters" element={<RecruiterManager />} />
            <Route path="/admin/jobs" element={<JobManager />} />
            <Route path="/admin/drives" element={<PlacementDriveManager />} />
            <Route path="/admin/tests" element={<TestManager />} />
            <Route path="/admin/reports" element={<TPOReports />} />
            <Route path="/admin/companies" element={<CompanyManager />} />
            <Route path="/admin/settings" element={<PortalSettings />} />
          </Route>
        </Route>

        {/* Catch-all → smart redirect */}
        <Route path="*" element={<RootRedirect />} />

      </Routes>
    </BrowserRouter>
  );
}

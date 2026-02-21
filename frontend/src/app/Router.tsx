import React, { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import Login from "../features/auth/Login";
import Register from "../features/auth/Register";
import ForgotPassword from "../features/auth/ForgotPassword";
import AdminLogin from "../features/auth/AdminLogin";
import AdminRegister from "../features/auth/AdminRegister";

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
import ProtectedRoute from "../components/ProtectedRoute";
import MockInterview from "../pages/Interview/MockInterview";
import ApplicationTracker from "../pages/Applications/ApplicationTracker";
import SecuritySettings from "../pages/Settings/SecuritySettings";
import NotificationsCenter from "../pages/NotificationsCenter";
import AnalyticsDashboard from "../pages/AnalyticsDashboard";
import JobRecommendations from "../pages/JobRecommendations";
import AptitudeAssessment from "../pages/Assessments/AptitudeAssessment";
import CodingAssessment from "../pages/Assessments/CodingAssessment";
import AssessmentAnalysis from "../pages/Assessments/AssessmentAnalysis";
import ResumeBuilder from "../pages/Resume/ResumeBuilder";
import MainProfile from "../pages/Profile/MainProfile";
import StudentProfileView from "../pages/recruiter/StudentProfileView";
import TalentDiscovery from "../pages/recruiter/TalentDiscovery";

import AICoach from "../pages/Student/AICoach";
import SavedJobs from "../pages/SavedJobs/SavedJobs";
import PrepTips from "../pages/PrepTips/PrepTips";
import GoalsPage from "../pages/Goals/GoalsPage";
import InterviewQABank from "../pages/InterviewQA/InterviewQABank";

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

export default function Router() {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Toaster position="top-right" />
      <Routes>

        {/* 🔥 DEFAULT ROOT */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* AUTH */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/admin-portal" element={<AdminLogin />} />
        <Route path="/admin-portal/register" element={<AdminRegister />} />

        {/* PREMIUM DASHBOARD */}
        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/companies" element={<Companies />} />
            <Route path="/roadmap" element={<CareerRoadmap />} />
            <Route path="/analytics" element={<PlacementAnalytics />} />
            <Route path="/jobs/:id" element={<JobDetails />} />

            {/* Student & Admin Routes */}
            <Route path="/students" element={<StudentManagement />} />
            <Route path="/resume-upload" element={<ResumeUpload />} />
            <Route path="/interview" element={<MockInterview />} />
            <Route path="/applications" element={<ApplicationTracker />} />
            <Route path="/portfolio" element={<Portfolio />} />
            <Route path="/profile" element={<UserProfile />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/security" element={<SecuritySettings />} />
            <Route path="/notifications" element={<NotificationsCenter />} />
            <Route path="/analytics-hub" element={<AnalyticsDashboard />} />
            <Route path="/job-recommendations" element={<JobRecommendations />} />
            <Route path="/resources" element={<Resources />} />
            <Route path="/aptitude-test" element={<AptitudeAssessment />} />
            <Route path="/coding-test" element={<CodingAssessment />} />
            <Route path="/assessment-analysis" element={<AssessmentAnalysis />} />
            <Route path="/resume-builder" element={<ResumeBuilder />} />
            <Route path="/student-intel" element={<MainProfile />} />
            <Route path="/ai-coach" element={<AICoach />} />
            <Route path="/arena" element={<ArenaHub />} />
            <Route path="/saved-jobs" element={<SavedJobs />} />
            <Route path="/prep-tips" element={<PrepTips />} />
            <Route path="/goals" element={<GoalsPage />} />
            <Route path="/interview-qa" element={<InterviewQABank />} />
            {/* Advanced (next-level) */}
            <Route path="/insights" element={<Suspense fallback={<InsightsHubFallback />}><InsightsHub /></Suspense>} />

            {/* Recruiter Routes */}
            <Route path="/jobs/my" element={<MyJobs />} />
            <Route path="/jobs/create" element={<JobPosting />} />
            <Route path="/jobs/edit/:jobId" element={<JobPosting />} />
            <Route path="/hiring-intel" element={<RecruiterAnalytics />} />
            <Route path="/jobs/:jobId/applicants" element={<JobApplicants />} />
            <Route path="/students/:id" element={<StudentProfileView />} />
            <Route path="/talent-discovery" element={<TalentDiscovery />} />
            <Route path="/interviews/ledger" element={<InterviewLedger />} />
            {/* Admin Routes */}
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

      </Routes>
    </BrowserRouter>
  );
}

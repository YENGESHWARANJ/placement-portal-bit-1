import React, { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useAuth, getRoleRedirect } from "../features/auth/AuthContext";
import ProtectedRoute from "./ProtectedRoute";
import DashboardLayout from "../layouts/DashboardLayout";

// ── AUTH ──────────────────────────────────────────────────────────
const Login = lazy(() => import("../features/auth/Login"));
const AdminRegister = lazy(() => import("../features/auth/AdminRegister"));
const Onboarding = lazy(() => import("../features/auth/Onboarding"));
const ForgotPassword = lazy(() => import("../features/auth/ForgotPassword"));
const ResetPassword = lazy(() => import("../features/auth/ResetPassword"));
const OTPVerification = lazy(() => import("../features/auth/OTPVerification"));

// ── COMMON ────────────────────────────────────────────────────────
const Dashboard = lazy(() => import("../pages/Dashboard/Dashboard"));
const Companies = lazy(() => import("../pages/Companies/Companies"));
const CareerRoadmap = lazy(() => import("../pages/Dashboard/CareerRoadmap"));
const PlacementAnalytics = lazy(() => import("../pages/Dashboard/PlacementAnalytics"));
const JobDetails = lazy(() => import("../pages/recruiter/JobDetails"));
const StudentProfileView = lazy(() => import("../pages/recruiter/StudentProfileView"));
const UserProfile = lazy(() => import("../pages/Profile/UserProfile"));
const Settings = lazy(() => import("../pages/Settings/Settings"));
const SecuritySettings = lazy(() => import("../pages/Settings/SecuritySettings"));
const NotificationsCenter = lazy(() => import("../pages/NotificationsCenter"));
const ActivityHistory = lazy(() => import("../pages/Activity/ActivityHistory"));
const Resources = lazy(() => import("../pages/Resources/Resources"));
const ChatPage = lazy(() => import("../pages/Chat/ChatPage"));
const StudentPlacementDrives = lazy(() => import("../pages/Student/PlacementDrives"));
const LandingPage = lazy(() => import("../pages/LandingPage"));

// ── STUDENT ───────────────────────────────────────────────────────
const ResumeUpload = lazy(() => import("../pages/Resume/ResumeUpload"));
const MockInterview = lazy(() => import("../pages/Interview/MockInterview"));
const ApplicationTracker = lazy(() => import("../pages/Applications/ApplicationTracker"));
const Portfolio = lazy(() => import("../pages/Profile/Portfolio"));
const AnalyticsDashboard = lazy(() => import("../pages/AnalyticsDashboard"));
const JobRecommendations = lazy(() => import("../pages/JobRecommendations"));
const AptitudeAssessment = lazy(() => import("../pages/Assessments/AptitudeAssessment"));
const CodingAssessment = lazy(() => import("../pages/Assessments/CodingAssessment"));
const InterviewAssessment = lazy(() => import("../pages/Assessments/InterviewAssessment"));
const AssessmentAnalysis = lazy(() => import("../pages/Assessments/AssessmentAnalysis"));
const ResumeBuilder = lazy(() => import("../pages/Resume/ResumeBuilder"));
const MainProfile = lazy(() => import("../pages/Profile/MainProfile"));
const AICoach = lazy(() => import("../pages/Student/AICoach"));
const ArenaHub = lazy(() => import("../pages/Arena/ArenaHub"));
const SavedJobs = lazy(() => import("../pages/SavedJobs/SavedJobs"));
const PrepTips = lazy(() => import("../pages/PrepTips/PrepTips"));
const GoalsPage = lazy(() => import("../pages/Goals/GoalsPage"));
const InterviewQABank = lazy(() => import("../pages/InterviewQA/InterviewQABank"));
const PreparationHub = lazy(() => import("../pages/PrepTips/PreparationHub"));
const InsightsHub = lazy(() => import("../pages/Insights/InsightsHub"));
const LiveInterviewRoom = lazy(() => import("../pages/Interview/LiveInterviewRoom"));
const VoiceInterview = lazy(() => import("../pages/Interview/VoiceInterview"));
const AlumniNetwork = lazy(() => import("../pages/Alumni/AlumniNetwork"));

// ── MENTOR ────────────────────────────────────────────────────────
const MyJobs = lazy(() => import("../pages/recruiter/MyJobs"));
const JobPosting = lazy(() => import("../pages/recruiter/JobPosting"));
const RecruiterAnalytics = lazy(() => import("../pages/recruiter/RecruiterAnalytics"));
const JobApplicants = lazy(() => import("../pages/recruiter/JobApplicants"));
const StudentManagement = lazy(() => import("../pages/Students/StudentManagement"));
const TalentDiscovery = lazy(() => import("../pages/recruiter/TalentDiscovery"));
const InterviewLedger = lazy(() => import("../pages/recruiter/InterviewLedger"));

// ── ADMIN ─────────────────────────────────────────────────────────
const AdminDashboard = lazy(() => import("../pages/Admin/AdminDashboard"));
const SuperAdminDashboard = lazy(() => import("../pages/Admin/SuperAdminDashboard"));
const StudentManager = lazy(() => import("../pages/Admin/StudentManager"));
const RecruiterManager = lazy(() => import("../pages/Admin/RecruiterManager"));
const JobManager = lazy(() => import("../pages/Admin/JobManager"));
const PlacementDriveManager = lazy(() => import("../pages/Admin/PlacementDriveManager"));
const DriveApplications = lazy(() => import("../pages/Admin/DriveApplications"));
const TestManager = lazy(() => import("../pages/Admin/TestManager"));
const TPOReports = lazy(() => import("../pages/recruiter/TPOReports"));
const CompanyManager = lazy(() => import("../pages/Admin/CompanyManager"));
const PortalSettings = lazy(() => import("../pages/Admin/PortalSettings"));

const RouterFallback = () => (
  <div className="h-screen w-screen flex flex-col items-center justify-center bg-white space-y-6">
    <div className="h-16 w-16 border-4 border-slate-100 border-t-indigo-600 rounded-full animate-spin" />
    <p className="text-sm font-black uppercase tracking-[0.2em] text-slate-400 animate-pulse">Initializing Neural Interface...</p>
  </div>
);

function RootRedirect() {
  const { isAuthenticated, user, loading } = useAuth();
  if (loading) return null;
  if (isAuthenticated && user) {
    return <Navigate to={getRoleRedirect(user.role)} replace />;
  }
  return <Navigate to="/login" replace />;
}

export default function Router() {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Toaster position="top-right" />
      <Suspense fallback={<RouterFallback />}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin-portal/register" element={<AdminRegister />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/verify-email" element={<OTPVerification />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/onboarding" element={<Onboarding />} />
            <Route element={<DashboardLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/companies" element={<Companies />} />
              <Route path="/roadmap" element={<CareerRoadmap />} />
              <Route path="/analytics" element={<PlacementAnalytics />} />
              <Route path="/jobs/:id" element={<JobDetails />} />
              <Route path="/students/:id" element={<StudentProfileView />} />
              <Route path="/profile" element={<UserProfile />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/security" element={<SecuritySettings />} />
              <Route path="/notifications" element={<NotificationsCenter />} />
              <Route path="/activity" element={<ActivityHistory />} />
              <Route path="/resources" element={<Resources />} />
              <Route path="/messages" element={<ChatPage />} />
              <Route path="/placement-drives" element={<StudentPlacementDrives />} />

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
              <Route path="/preparation-hub" element={<PreparationHub />} />
              <Route path="/insights" element={<InsightsHub />} />
              <Route path="/interviews/live/:roomId" element={<LiveInterviewRoom />} />
              <Route path="/interview/voice" element={<VoiceInterview />} />
              <Route path="/alumni" element={<AlumniNetwork />} />
            </Route>
          </Route>

          <Route element={<ProtectedRoute roles={["recruiter"]} />}>
            <Route element={<DashboardLayout />}>
              <Route path="/jobs/my" element={<MyJobs />} />
              <Route path="/jobs/create" element={<JobPosting />} />
              <Route path="/jobs/edit/:jobId" element={<JobPosting />} />
              <Route path="/hiring-intel" element={<RecruiterAnalytics />} />
              <Route path="/jobs/:id/applicants" element={<JobApplicants />} />
              <Route path="/students" element={<StudentManagement />} />
              <Route path="/talent-discovery" element={<TalentDiscovery />} />
              <Route path="/interviews/ledger" element={<InterviewLedger />} />
            </Route>
          </Route>

          <Route element={<ProtectedRoute roles={["admin", "officer"]} />}>
            <Route element={<DashboardLayout />}>
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/system" element={<SuperAdminDashboard />} />
              <Route path="/admin/students" element={<StudentManager />} />
              <Route path="/admin/recruiters" element={<RecruiterManager />} />
              <Route path="/admin/jobs" element={<JobManager />} />
              <Route path="/admin/drives" element={<PlacementDriveManager />} />
              <Route path="/admin/drives/:driveId/applications" element={<DriveApplications />} />
              <Route path="/admin/tests" element={<TestManager />} />
              <Route path="/admin/reports" element={<TPOReports />} />
              <Route path="/admin/companies" element={<CompanyManager />} />
              <Route path="/admin/settings" element={<PortalSettings />} />
            </Route>
          </Route>

          <Route path="*" element={<RootRedirect />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

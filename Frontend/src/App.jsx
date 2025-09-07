
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/shared/Navbar.jsx";
import Footer from "./components/shared/Footer.jsx";
import Home from "./pages/Home.jsx";
import Scholarships from "./pages/Scholarships.jsx";
import ScholarshipDetails from "./pages/ScholarshipDetails.jsx";
import News from "./pages/News.jsx";
import NotFound from "./pages/NotFound.jsx";
import Login from "./pages/auth/Login.jsx";
import Register from "./pages/auth/Register.jsx";
import AuthProvider from "./context/AuthContext.jsx";
import Protected from "./Protected.jsx";
import RoleProtected from "./RoleProtected.jsx";

import Dashboard from "./pages/Dashboard.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import Verify from "./pages/Verify.jsx";

import ComposeHub from "./pages/ComposeHub.jsx";
import CreateUniversity from "./pages/CreateUniversity.jsx";
import AdminCompose from "./pages/AdminCompose.jsx"; // keep only THIS import

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="min-h-screen flex flex-col bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100">
          <Navbar />
          <main className="flex-1">
            <Routes>
              {/* Public */}
              <Route path="/" element={<Home />} />
              <Route path="/scholarships" element={<Scholarships />} />
              <Route path="/scholarships/:id" element={<ScholarshipDetails />} />
              <Route path="/news" element={<News />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/verify" element={<Verify />} />

              {/* Authenticated */}
              <Route
                path="/dashboard"
                element={
                  <Protected>
                    <Dashboard />
                  </Protected>
                }
              />

              {/* Compose hub: recruiters/admins (verified) */}
              <Route
                path="/compose"
                element={
                  <Protected roles={["recruiter", "admin"]} requireVerified>
                    <ComposeHub />
                  </Protected>
                }
              />

              {/* Register a university */}
              <Route
                path="/compose/university"
                element={
                  <Protected roles={["recruiter", "admin"]} requireVerified>
                    <CreateUniversity />
                  </Protected>
                }
              />

              {/* Compose a scholarship */}
              <Route
                path="/admin/compose"
                element={
                  <Protected roles={["recruiter", "admin"]} requireVerified>
                    <AdminCompose />
                  </Protected>
                }
              />

              {/* Admin/recruiter dashboard */}
              <Route
                path="/admin"
                element={
                  <RoleProtected roles={["admin", "recruiter"]} requireVerified>
                    <AdminDashboard />
                  </RoleProtected>
                }
              />

              {/* Catch-all */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}

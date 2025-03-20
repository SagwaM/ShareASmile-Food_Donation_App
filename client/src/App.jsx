import { Snackbar, Alert, Tooltip } from "@mui/material";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import LockScreen from './pages/LockScreen';
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Donations from "./pages/Donations";
import NgoDashboard from "./pages/Dashboard/ngo/ngo";
import RecipientDashboard from "./pages/Dashboard/recipient/recipient";
import AdminDashboard from "./pages/Dashboard/admin/admin";
import DonorDashboard from "./pages/Dashboard/donor/donor";
import MyDonations from "./pages/Dashboard/donor/MyDonations";
import Claims from "./pages/Dashboard/donor/Claims"
import CreateDonations from "./pages/Dashboard/admin/ManageUsers";
import AdminDonations from "./pages/Dashboard/admin/Donations";
import ManageUsers from "./pages/Dashboard/admin/ManageUsers";
import Reports from "./pages/Dashboard/admin/Reports";
import AvailableFood from "./pages/Dashboard/recipient/AvailableFood";
import MyRequests from "./pages/Dashboard/recipient/MyRequests";
import AvailableDonations from "./pages/Dashboard/ngo/AvailableFood";
import MyRequest from "./pages/Dashboard/ngo/MyRequests";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import Notifications from "./pages/Notifications";
import NotFound from "./pages/NotFound";
import TermsPage from "./pages/TermsPage";
import ForgotPassword from "./pages/ForgotPassword";
import ThemeToggle from "./components/ThemeToggle";
import { ThemeProviderWrapper } from "@/context/ThemeContext";
import { AuthProvider } from '@/context/AuthContext';
import ProtectedRoute from "./components/ProtectedRoute";
import BackToTop from '@/components/BackToTop';

const queryClient = new QueryClient();

const App = () => {
  const [open, setOpen] = useState(false);

  return (
    <AuthProvider> {/* ✅ Wrap entire app in AuthProvider */}
      <QueryClientProvider client={queryClient}>
        <ThemeProviderWrapper> {/* ✅ Wrap entire app in ThemeProvider */}
          <BrowserRouter>
            <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
             
              <main style={{ flexGrow: 1, paddingTop: "4rem" }}>
                <Routes>
                  <Route path="/" element={
                    <>
                      <Navbar />
                      <Home />
                      <Footer />
                    </>
                    } />
                  <Route path="/about" element={
                    <>
                      <Navbar />
                      <About />
                      <Footer />
                    </>
                    } />
                  <Route path="/contact" element={
                    <>
                      <Navbar />
                      <Contact />
                      <Footer />
                    </>
                    } />
                  <Route path="/login" element={
                    <>
                      <Navbar />
                      <Login />
                      <Footer />
                    </>
                    } />
                  <Route path="/register" element={
                    <>
                      <Navbar />
                      <Register />
                      <Footer />
                    </>
                    } />
                  <Route path="/donations" element={
                    <>
                      <Navbar />
                      <Donations />
                      <Footer />
                    </>
                    } />
                    {/* 🔒 Lock Screen Route */}
                  <Route path="/lockscreen" element={<LockScreen />} />
                  <Route path="/terms" element={
                    <>
                    <TermsPage />
                    <Footer />
                    </>
                    } 
                    />
                    <Route path="/forgot-password" element={
                    <>
                    <ForgotPassword />
                    <Footer />
                    </>
                    } 
                    />
                  {/* 🔒 Protected Routes - Only accessible when logged in */}
                  <Route element={<ProtectedRoute allowedRoles={['admin', 'ngo', 'donor', 'recipient']} />}>
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="/notifications" element={<Notifications />} />
                  </Route>
                  

                  {/* 🔒 Role-based Routes */}

                  <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
                    <Route path="/dashboard/admin" element={ <AdminDashboard />} />
                    <Route path="/dashboard/admin/donations" element={<AdminDonations />} />
                    <Route path="/dashboard/admin/manage-users" element={<ManageUsers />} />
                    <Route path="/dashboard/admin/reports" element={<Reports />} />
                  </Route>

                  <Route element={<ProtectedRoute allowedRoles={['ngo']} />}>
                    <Route path="/dashboard/ngo" element={<NgoDashboard /> } />
                    <Route path="/dashboard/ngo/available" element={<AvailableDonations />} />
                    <Route path="/dashboard/ngo/requests" element={<MyRequest />} />

                  </Route>

                  <Route element={<ProtectedRoute allowedRoles={['donor']} />}>
                    <Route path="/dashboard/donor" element={<DonorDashboard/>}/>
                    <Route path="/dashboard/donor/my-donations" element={<MyDonations />}/>
                    <Route path="/dashboard/donor/claims" element={<Claims />}/>
                    <Route path="/dashboard/donor/create" element={<CreateDonations />}
                  
                    />
                  </Route>

                  <Route element={<ProtectedRoute allowedRoles={['recipient']} />}>
                    <Route path="/dashboard/recipient" element={<RecipientDashboard />} />
                    <Route path="/dashboard/recipient/available-food" element={<AvailableFood />} />
                    <Route path="/dashboard/recipient/my-requests" element={<MyRequests />} />
                  </Route>

                  <Route path="*" element={
                    <>
                      <Navbar />
                      <NotFound />
                      <Footer />
                    </>
                   } />
                </Routes>
              </main>
            </div>

            <ThemeToggle />

            {/* Snackbar Notification (Replaces Toaster/Sonner) */}
            <Snackbar open={open} autoHideDuration={4000} onClose={() => setOpen(false)}>
              <Alert onClose={() => setOpen(false)} severity="success" sx={{ width: "100%" }}>
                Operation Successful!
              </Alert>
            </Snackbar>
          </BrowserRouter>
        </ThemeProviderWrapper>
        <BackToTop />
      </QueryClientProvider>
    </AuthProvider>
  );
};

export default App;

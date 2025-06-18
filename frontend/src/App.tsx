import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { CartProvider } from "./contexts/CartContext";
import { SettingsProvider } from "./contexts/SettingsContext";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import DashboardLayout from "./components/layout/DashboardLayout";
import DashboardPage from "./pages/DashboardPage";
import SalesPage from "./pages/SalesPage";
import ProductsPage from "./pages/ProductsPage";
import CustomersPage from "./pages/CustomersPage";
import SettingsPage from "./pages/SettingsPage";
import NotFound from "./pages/NotFound";
import InventoryPage from "./pages/InventoryPage";
import PaymentsPage from "./pages/PaymentsPage";
import UsersPage from "./pages/UsersPage";
import LoginForm from "./components/auth/LoginForm";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider
    client={queryClient}
    data-id="kh8gd4ioj"
    data-path="src/App.tsx"
  >
    <TooltipProvider data-id="ru2pwnq8a" data-path="src/App.tsx">
      <AuthProvider data-id="837hjwf3g" data-path="src/App.tsx">
        <SettingsProvider data-id="fjaa1croo" data-path="src/App.tsx">
          <CartProvider data-id="exyhlhea1" data-path="src/App.tsx">
            <Toaster data-id="c1mdatd85" data-path="src/App.tsx" />
            <Routes data-id="j7llmo431" data-path="src/App.tsx">
              <Route path="/" element={<LoginForm />} />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute data-id="d0k1wyomw" data-path="src/App.tsx">
                    <DashboardLayout
                      data-id="jct8y3i6a"
                      data-path="src/App.tsx"
                    >
                      <DashboardPage
                        data-id="m9ap4yjfr"
                        data-path="src/App.tsx"
                      />
                    </DashboardLayout>
                  </ProtectedRoute>
                }
                data-id="6jmqtkcnm"
                data-path="src/App.tsx"
              />
              <Route
                path="/sales"
                element={
                  <ProtectedRoute data-id="nesjl9gsu" data-path="src/App.tsx">
                    <DashboardLayout
                      data-id="xtni3w4bs"
                      data-path="src/App.tsx"
                    >
                      <SalesPage data-id="gh60vlb07" data-path="src/App.tsx" />
                    </DashboardLayout>
                  </ProtectedRoute>
                }
                data-id="frrkeevx5"
                data-path="src/App.tsx"
              />
              <Route
                path="/products"
                element={
                  <ProtectedRoute data-id="oi4gs0grz" data-path="src/App.tsx">
                    <DashboardLayout
                      data-id="g7fmdj74x"
                      data-path="src/App.tsx"
                    >
                      <ProductsPage
                        data-id="r1870mfzp"
                        data-path="src/App.tsx"
                      />
                    </DashboardLayout>
                  </ProtectedRoute>
                }
                data-id="3dyrejbat"
                data-path="src/App.tsx"
              />
              <Route
                path="/inventory"
                element={
                  <ProtectedRoute>
                    <DashboardLayout>
                      <InventoryPage />
                    </DashboardLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/customers"
                element={
                  <ProtectedRoute data-id="218b0nays" data-path="src/App.tsx">
                    <DashboardLayout
                      data-id="vk659k69p"
                      data-path="src/App.tsx"
                    >
                      <CustomersPage
                        data-id="fn35dqvhl"
                        data-path="src/App.tsx"
                      />
                    </DashboardLayout>
                  </ProtectedRoute>
                }
                data-id="lfmwc2nme"
                data-path="src/App.tsx"
              />
              <Route
                path="/reports"
                element={
                  <ProtectedRoute data-id="lds4ibi7v" data-path="src/App.tsx">
                    <DashboardLayout
                      data-id="kx2hormzk"
                      data-path="src/App.tsx"
                    >
                      <DashboardPage
                        data-id="ninh3y7tn"
                        data-path="src/App.tsx"
                      />
                    </DashboardLayout>
                  </ProtectedRoute>
                }
                data-id="jf1qmf9il"
                data-path="src/App.tsx"
              />
              <Route
                path="/payments"
                element={
                  <ProtectedRoute>
                    <DashboardLayout>
                      <PaymentsPage />
                    </DashboardLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/users"
                element={
                  <ProtectedRoute
                    requiredRole="admin"
                    data-id="cs0em4443"
                    data-path="src/App.tsx"
                  >
                    <DashboardLayout
                      data-id="kbuy6e0y2"
                      data-path="src/App.tsx"
                    >
                      <UsersPage data-id="0ea81ap6m" data-path="src/App.tsx" />
                    </DashboardLayout>
                  </ProtectedRoute>
                }
                data-id="7pzyegub8"
                data-path="src/App.tsx"
              />
              <Route
                path="/settings"
                element={
                  <ProtectedRoute
                    requiredRole="admin"
                    data-id="9mu1xfrid"
                    data-path="src/App.tsx"
                  >
                    <DashboardLayout
                      data-id="vfhsre5vc"
                      data-path="src/App.tsx"
                    >
                      <SettingsPage
                        data-id="kvfnt0jwl"
                        data-path="src/App.tsx"
                      />
                    </DashboardLayout>
                  </ProtectedRoute>
                }
                data-id="izcr3egd0"
                data-path="src/App.tsx"
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute data-id="l7bs0wh2u" data-path="src/App.tsx">
                    <DashboardLayout
                      data-id="ycc64ahqr"
                      data-path="src/App.tsx"
                    >
                      <SettingsPage
                        data-id="eqdyho1cm"
                        data-path="src/App.tsx"
                      />
                    </DashboardLayout>
                  </ProtectedRoute>
                }
                data-id="rv27lfnr1"
                data-path="src/App.tsx"
              />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route
                path="*"
                element={
                  <NotFound data-id="342294pug" data-path="src/App.tsx" />
                }
                data-id="7q5y4uqme"
                data-path="src/App.tsx"
              />
            </Routes>
          </CartProvider>
        </SettingsProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

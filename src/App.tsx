import { lazy, Suspense, useEffect } from "react";
import { Center, Loader } from "@mantine/core";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { AdminLayout } from "./layouts/admin-layout/AdminLayout";
import { getSession } from "./features/auth/api/auth-api";

const LandingPage = lazy(() =>
  import("./features/marketing/pages/LandingPage").then((m) => ({
    default: m.LandingPage,
  })),
);
const BusinessRegistrationPage = lazy(() =>
  import("./features/auth/pages/BusinessRegistrationPage").then((m) => ({
    default: m.BusinessRegistrationPage,
  })),
);
const VerifyEmailPage = lazy(() =>
  import("./features/auth/pages/VerifyEmailPage").then((m) => ({
    default: m.VerifyEmailPage,
  })),
);
const SetPasswordPage = lazy(() =>
  import("./features/auth/pages/SetPasswordPage").then((m) => ({
    default: m.SetPasswordPage,
  })),
);
const LoginPage = lazy(() => import("./features/auth/pages/LoginPage").then((m) => ({ default: m.LoginPage })));
const PublicTablePage = lazy(() => import("./features/tables/pages/PublicTablePage").then((m) => ({ default: m.PublicTablePage })));
const DashboardPage = lazy(() =>
  import("./features/dashboard/pages/DashboardPage").then((m) => ({
    default: m.DashboardPage,
  })),
);
const RestaurantsPage = lazy(() =>
  import("./features/restaurants/pages/RestaurantsPage").then((m) => ({
    default: m.RestaurantsPage,
  })),
);
const MenuPage = lazy(() =>
  import("./features/menu/pages/MenuPage").then((m) => ({
    default: m.MenuPage,
  })),
);
const TablesPage = lazy(() =>
  import("./features/tables/pages/TablesPage").then((m) => ({
    default: m.TablesPage,
  })),
);
const OrdersPage = lazy(() =>
  import("./features/orders/pages/OrdersPage").then((m) => ({
    default: m.OrdersPage,
  })),
);
const KitchenPage = lazy(() =>
  import("./features/kitchen/pages/KitchenPage").then((m) => ({
    default: m.KitchenPage,
  })),
);
const EmployeesPage = lazy(() =>
  import("./features/employees/pages/EmployeesPage").then((m) => ({
    default: m.EmployeesPage,
  })),
);
const AnalyticsPage = lazy(() =>
  import("./features/analytics/pages/AnalyticsPage").then((m) => ({
    default: m.AnalyticsPage,
  })),
);
const SettingsPage = lazy(() =>
  import("./features/settings/pages/SettingsPage").then((m) => ({
    default: m.SettingsPage,
  })),
);

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Suspense
        fallback={
          <Center mih="60vh">
            <Loader color="ember" />
          </Center>
        }
      >
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/register" element={<BusinessRegistrationPage />} />
          <Route path="/verify-email" element={<VerifyEmailPage />} />
          <Route path="/set-password" element={<SetPasswordPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/table/:restaurantID/:tableID" element={<PublicTablePage />} />
          <Route element={getSession() ? <AdminLayout /> : <Navigate to="/login" replace />}>
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="restaurants" element={<RestaurantsPage />} />
            <Route path="menu" element={<MenuPage />} />
            <Route path="tables" element={<TablesPage />} />
            <Route path="orders" element={<OrdersPage />} />
            <Route path="kitchen" element={<KitchenPage />} />
            <Route path="employees" element={<EmployeesPage />} />
            <Route path="analytics" element={<AnalyticsPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </>
  );
}

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname]);
  return null;
}

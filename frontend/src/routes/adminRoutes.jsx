import React, {
  lazy,
  memo,
} from "react";

import {
  Route,
  Navigate,
} from "react-router-dom";

import ProtectedRoute
  from "./ProtectedRoute";

import DashboardLayout
  from "../shared/layouts/DashboardLayout";


// ======================================================
// LAZY PAGES
// ======================================================

const AdminDashboard = lazy(() =>
  import("../modules/admin/pages/AdminDashboard")
);

const Analytics = lazy(() =>
  import("../modules/admin/pages/Analytics")
);

const LiveMap = lazy(() =>
  import("../modules/map/pages/LiveMap")
);

const UserManagement = lazy(() =>
  import("../modules/admin/pages/UserManagement")
);

const Reports = lazy(() =>
  import("../modules/admin/pages/Reports")
);

const Violations = lazy(() =>
  import("../modules/admin/pages/Violations")
);

const Settings = lazy(() =>
  import("../modules/admin/pages/Settings")
);

const BookingsPanel = lazy(() =>
  import("../modules/admin/pages/BookingsPanel")
);

const ParkingLots = lazy(() =>
  import("../modules/admin/pages/ParkingLots")
);

const PaymentsPanel = lazy(() =>
  import("../modules/admin/pages/PaymentsPanel")
);

const GateScanner = lazy(() =>
  import("../modules/gate/pages/GateScanner")
);


// ======================================================
// ADMIN WRAPPER
// ======================================================

const AdminWrapper = memo(({
  children,
}) => (
  <ProtectedRoute role="admin">
    <DashboardLayout>
      {children}
    </DashboardLayout>
  </ProtectedRoute>
));


// ======================================================
// ROUTES
// ======================================================

const adminRoutes = (
  <>

    {/* ROOT */}
    <Route
      path="/admin"
      element={
        <Navigate
          to="/admin/dashboard"
          replace
        />
      }
    />

    {/* DASHBOARD */}
    <Route
      path="/admin/dashboard"
      element={
        <AdminWrapper>
          <AdminDashboard />
        </AdminWrapper>
      }
    />

    {/* ANALYTICS */}
    <Route
      path="/admin/analytics"
      element={
        <AdminWrapper>
          <Analytics />
        </AdminWrapper>
      }
    />

    {/* LIVE MAP */}
    <Route
      path="/admin/live-map"
      element={
        <AdminWrapper>
          <LiveMap />
        </AdminWrapper>
      }
    />

    {/* USERS */}
    <Route
      path="/admin/users"
      element={
        <AdminWrapper>
          <UserManagement />
        </AdminWrapper>
      }
    />

    {/* BOOKINGS */}
    <Route
      path="/admin/bookings"
      element={
        <AdminWrapper>
          <BookingsPanel />
        </AdminWrapper>
      }
    />

    {/* PARKING LOTS */}
    <Route
      path="/admin/parking-lots"
      element={
        <AdminWrapper>
          <ParkingLots />
        </AdminWrapper>
      }
    />

    {/* PAYMENTS */}
    <Route
      path="/admin/payments"
      element={
        <AdminWrapper>
          <PaymentsPanel />
        </AdminWrapper>
      }
    />

    {/* GATE SCANNER */}
    <Route
      path="/admin/gate"
      element={
        <AdminWrapper>
          <GateScanner />
        </AdminWrapper>
      }
    />

    {/* REPORTS */}
    <Route
      path="/admin/reports"
      element={
        <AdminWrapper>
          <Reports />
        </AdminWrapper>
      }
    />

    {/* VIOLATIONS */}
    <Route
      path="/admin/violations"
      element={
        <AdminWrapper>
          <Violations />
        </AdminWrapper>
      }
    />

    {/* SETTINGS */}
    <Route
      path="/admin/settings"
      element={
        <AdminWrapper>
          <Settings />
        </AdminWrapper>
      }
    />

  </>
);


// ======================================================
// EXPORT
// ======================================================

export default adminRoutes;
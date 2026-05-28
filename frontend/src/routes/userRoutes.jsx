import React, {
  lazy,
  memo,
} from "react";

import {
  Route,
  Navigate,
} from "react-router-dom";

import ProtectedRoute from "./ProtectedRoute";
import DashboardLayout from "../shared/layouts/DashboardLayout";


// ======================================================
// LAZY PAGES
// ======================================================

const UserDashboard = lazy(() =>
  import("../modules/user/pages/UserDashboard")
);

const Slots = lazy(() =>
  import("../modules/user/pages/Slots")
);

const Payment = lazy(() =>
  import("../modules/user/pages/Payment")
);

const BookSlot = lazy(() =>
  import("../modules/booking/pages/BookSlot")
);

const MyBookings = lazy(() =>
  import("../modules/booking/pages/MyBookings")
);

const Profile = lazy(() =>
  import("../modules/profile/pages/Profile")
);

const VehicleManagement = lazy(() =>
  import("../modules/vehicles/pages/VehicleManagement")
);

const Settings = lazy(() =>
  import("../modules/user/pages/Settings")
);

const LiveMap = lazy(() =>
  import("../modules/map/pages/LiveMap")
);


// ======================================================
// WRAPPER
// ======================================================

const UserWrapper = memo(({
  children,
}) => (
  <ProtectedRoute role="user">
    <DashboardLayout>
      {children}
    </DashboardLayout>
  </ProtectedRoute>
));


// ======================================================
// ROUTES
// ======================================================

const userRoutes = (
  <>

    {/* ROOT */}
    <Route
      path="/user"
      element={
        <Navigate
          to="/user/dashboard"
          replace
        />
      }
    />

    {/* DASHBOARD */}
    <Route
      path="/user/dashboard"
      element={
        <UserWrapper>
          <UserDashboard />
        </UserWrapper>
      }
    />

    {/* SLOTS */}
    <Route
      path="/user/slots"
      element={
        <UserWrapper>
          <Slots />
        </UserWrapper>
      }
    />

    {/* BOOK SLOT */}
    <Route
      path="/user/book/:slotId"
      element={
        <UserWrapper>
          <BookSlot />
        </UserWrapper>
      }
    />

    {/* BOOKINGS */}
    <Route
      path="/user/bookings"
      element={
        <UserWrapper>
          <MyBookings />
        </UserWrapper>
      }
    />

    {/* PAYMENT */}
    <Route
      path="/user/payment"
      element={
        <UserWrapper>
          <Payment />
        </UserWrapper>
      }
    />

    {/* LIVE MAP */}
    <Route
      path="/user/live-map"
      element={
        <UserWrapper>
          <LiveMap />
        </UserWrapper>
      }
    />

    {/* VEHICLES */}
    <Route
      path="/user/vehicles"
      element={
        <UserWrapper>
          <VehicleManagement />
        </UserWrapper>
      }
    />

    {/* PROFILE */}
    <Route
      path="/user/profile"
      element={
        <UserWrapper>
          <Profile />
        </UserWrapper>
      }
    />

    {/* SETTINGS */}
    <Route
      path="/user/settings"
      element={
        <UserWrapper>
          <Settings />
        </UserWrapper>
      }
    />

  </>
);


// ======================================================
// EXPORT
// ======================================================

export default userRoutes;
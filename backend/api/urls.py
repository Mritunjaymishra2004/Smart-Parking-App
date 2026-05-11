from django.urls import path

from rest_framework_simplejwt.views import (
    TokenRefreshView,
)

from . import views


urlpatterns = [

    # =====================================================
    # AUTH
    # =====================================================

    path(
        "v1/auth/signup/",
        views.signup_view,
        name="signup",
    ),

    path(
        "v1/auth/login/",
        views.login_view,
        name="login",
    ),

    path(
        "v1/auth/me/",
        views.me,
        name="me",
    ),

    path(
        "v1/auth/refresh/",
        TokenRefreshView.as_view(),
        name="token_refresh",
    ),

    # =====================================================
    # PARKING LOTS
    # =====================================================

    path(
        "v1/parking/lots/",
        views.parking_lots,
        name="parking_lots",
    ),

    path(
        "v1/parking/active/",
        views.active_parking,
        name="active_parking",
    ),

    # =====================================================
    # SLOTS
    # =====================================================

    path(
        "v1/slots/",
        views.SlotListView.as_view(),
        name="slots",
    ),

    path(
        "v1/slots/<int:slot_id>/",
        views.get_slot,
        name="single_slot",
    ),

    # =====================================================
    # VEHICLES
    # =====================================================

    path(
        "v1/vehicles/",
        views.VehicleListCreateView.as_view(),
        name="vehicles",
    ),

    path(
        "v1/vehicles/live/",
        views.live_positions,
        name="live_positions",
    ),

    path(
        "v1/vehicles/position/",
        views.update_vehicle_position,
        name="vehicle_position",
    ),

    # =====================================================
    # RESERVATIONS
    # =====================================================

    path(
        "v1/reservations/",
        views.my_bookings,
        name="reservations",
    ),

    path(
        "v1/reservations/create/",
        views.create_reservation,
        name="create_reservation",
    ),

    path(
        "v1/reservations/cancel/",
        views.cancel_booking,
        name="cancel_reservation",
    ),

    # =====================================================
    # SESSIONS
    # =====================================================

    path(
        "v1/sessions/",
        views.user_sessions,
        name="sessions",
    ),

    path(
        "v1/sessions/enter/",
        views.vehicle_entry,
        name="vehicle_entry",
    ),

    path(
        "v1/sessions/exit/",
        views.vehicle_exit,
        name="vehicle_exit",
    ),

    # =====================================================
    # PAYMENTS
    # =====================================================

    path(
        "v1/payments/",
        views.pay,
        name="payments",
    ),

    # =====================================================
    # WALLET
    # =====================================================

    path(
        "v1/wallet/balance/",
        views.wallet_balance,
        name="wallet_balance",
    ),

    path(
        "v1/wallet/add/",
        views.add_money,
        name="wallet_add",
    ),

    # =====================================================
    # ADMIN DASHBOARD
    # =====================================================

    path(
        "v1/admin/stats/",
        views.admin_stats,
        name="admin_stats",
    ),

    path(
        "v1/admin/bookings/",
        views.admin_bookings,
        name="admin_bookings",
    ),

    path(
        "v1/admin/sessions/",
        views.admin_sessions,
        name="admin_sessions",
    ),

    path(
        "v1/admin/violations/",
        views.admin_violations,
        name="admin_violations",
    ),

    path(
        "v1/admin/free-slot/",
        views.admin_free_slot,
        name="admin_free_slot",
    ),

    path(
        "v1/admin/block-slot/",
        views.admin_block_slot,
        name="admin_block_slot",
    ),

    path(
        "v1/admin/payments/",
        views.admin_payments,
        name="admin_payments",
    ),

    path(
        "v1/admin/live-vehicles/",
        views.admin_live_vehicles,
        name="admin_live_vehicles",
    ),

    path(
        "v1/admin/wallet-users/",
        views.admin_wallet_users,
        name="admin_wallet_users",
    ),

    path(
        "v1/admin/add-money/",
        views.admin_add_money,
        name="admin_add_money",
    ),
]










# from django.urls import path
# from . import views

# urlpatterns = [

#     # =====================================================
#     # AUTH
#     # =====================================================
#     path("auth/signup/", views.signup),
#     path("auth/login/", views.login),
#     path("auth/me/", views.me),

#     # =====================================================
#     # PARKING LOTS
#     # =====================================================
#     path("parking/lots/", views.parking_lots),

#     # =====================================================
#     # SLOTS
#     # =====================================================
#     path("slots/", views.SlotListView.as_view()),

#     # =====================================================
#     # VEHICLES
#     # =====================================================
#     path("vehicles/", views.VehicleListCreateView.as_view()),   # <-- FIXED
#     path("vehicles/live/", views.live_positions),
#     path("vehicles/position/", views.update_vehicle_position),

#     # =====================================================
#     # RESERVATION & PARKING FLOW
#     # =====================================================
#     path("reservations/", views.my_bookings),                  # <-- FIXED
#     path("reservations/create/", views.create_reservation),   # <-- FIXED
#     path("sessions/enter/", views.vehicle_entry),             # <-- FIXED
#     path("sessions/exit/", views.vehicle_exit),               # <-- FIXED
#     path("sessions/", views.user_sessions),
    
#     # =====================================================
#     # PAYMENTS
#     # =====================================================
#     path("payments/", views.pay),                              # <-- FIXED

#     # =====================================================
#     # WALLET
#     # =====================================================
#     path("wallet/add/", views.add_money),
#     path("wallet/balance/", views.wallet_balance),

#     # =====================================================
#     # CANCEL & REFUND
#     # =====================================================
#     path("booking/cancel/", views.cancel_booking),
#     path("my-bookings/", views.my_bookings),

#     # =====================================================
#     # ADMIN DASHBOARD
#     # =====================================================
#     path("admin/stats/", views.admin_stats),
#     path("admin/sessions/", views.admin_sessions),
#     path("admin/violations/", views.admin_violations),
#     path("admin/free-slot/", views.admin_free_slot),
#     path("admin/block-slot/", views.admin_block_slot),
#     path("admin/bookings/", views.admin_bookings),

#     # =====================================================
#     # ADMIN FINANCE & MONITORING
#     # =====================================================
#     path("admin/payments/", views.admin_payments),
#     path("admin/live-vehicles/", views.admin_live_vehicles),
#     path("admin/wallet-users/", views.admin_wallet_users),
#     path("admin/add-money/", views.admin_add_money),
#     path("parking/active/", views.active_parking),
# ]













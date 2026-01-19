from django.urls import path
from . import views

urlpatterns = [

    # =====================================================
    # 🔐 AUTH
    # =====================================================
    path("auth/signup/", views.signup),
    path("auth/login/", views.login),
    path("auth/me/", views.me),

    # =====================================================
    # 🅿 PARKING LOTS
    # =====================================================
    path("parking/lots/", views.parking_lots),

    # =====================================================
    # 🅿 SLOTS
    # =====================================================
    path("slots/", views.SlotListView.as_view()),

    # =====================================================
    # 🚗 VEHICLES
    # =====================================================
    path("vehicles/", views.VehicleListCreateView.as_view()),   # <-- FIXED
    path("vehicles/live/", views.live_positions),
    path("vehicles/position/", views.update_vehicle_position),

    # =====================================================
    # 📅 RESERVATION & PARKING FLOW
    # =====================================================
    path("reservations/", views.my_bookings),                  # <-- FIXED
    path("reservations/create/", views.create_reservation),   # <-- FIXED
    path("sessions/enter/", views.vehicle_entry),             # <-- FIXED
    path("sessions/exit/", views.vehicle_exit),               # <-- FIXED

    # =====================================================
    # 💳 PAYMENTS
    # =====================================================
    path("payments/", views.pay),                              # <-- FIXED

    # =====================================================
    # 💰 WALLET
    # =====================================================
    path("wallet/add/", views.add_money),
    path("wallet/balance/", views.wallet_balance),

    # =====================================================
    # ❌ CANCEL & REFUND
    # =====================================================
    path("booking/cancel/", views.cancel_booking),
    path("my-bookings/", views.my_bookings),

    # =====================================================
    # 📊 ADMIN DASHBOARD
    # =====================================================
    path("admin/stats/", views.admin_stats),
    path("admin/sessions/", views.admin_sessions),
    path("admin/violations/", views.admin_violations),
    path("admin/free-slot/", views.admin_free_slot),
    path("admin/block-slot/", views.admin_block_slot),
    path("admin/bookings/", views.admin_bookings),

    # =====================================================
    # 💳 ADMIN FINANCE & MONITORING
    # =====================================================
    path("admin/payments/", views.admin_payments),
    path("admin/live-vehicles/", views.admin_live_vehicles),
    path("admin/wallet-users/", views.admin_wallet_users),
]













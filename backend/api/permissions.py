from rest_framework.permissions import BasePermission


# =====================================================
# BASE ROLE PERMISSION
# =====================================================

class RolePermission(
    BasePermission
):

    allowed_roles = []

    def has_permission(
        self,
        request,
        view
    ):

        user = request.user

        # =============================================
        # NOT AUTHENTICATED
        # =============================================

        if not user or not user.is_authenticated:
            return False

        # =============================================
        # DJANGO ADMIN ALWAYS ALLOWED
        # =============================================

        if user.is_superuser or user.is_staff:
            return True

        # =============================================
        # SAFE PROFILE ACCESS
        # =============================================

        profile = getattr(
            user,
            "profile",
            None
        )

        if not profile:
            return False

        # =============================================
        # ROLE CHECK
        # =============================================

        return profile.role in self.allowed_roles


# =====================================================
# ADMIN PERMISSION
# =====================================================

class IsAdmin(
    RolePermission
):

    """
    Allow only admin users.
    """

    allowed_roles = [

        "admin"
    ]


# =====================================================
# OPERATOR PERMISSION
# =====================================================

class IsOperator(
    RolePermission
):

    """
    Allow operators + admins.
    """

    allowed_roles = [

        "operator",

        "admin"
    ]


# =====================================================
# NORMAL USER PERMISSION
# =====================================================

class IsUser(
    RolePermission
):

    """
    Allow authenticated users.
    """

    allowed_roles = [

        "user",

        "operator",

        "admin"
    ]


# =====================================================
# WEBSOCKET SAFE ACCESS
# =====================================================

class IsAuthenticatedAndActive(
    BasePermission
):

    """
    Safe authenticated access.

    Useful for:
    - websocket APIs
    - realtime APIs
    - live tracking
    """

    def has_permission(
        self,
        request,
        view
    ):

        user = request.user

        return (

            user

            and

            user.is_authenticated

            and

            user.is_active
        )




# from rest_framework.permissions import BasePermission


# class IsAdmin(BasePermission):
#     """
#     Allow access only to users with profile.role = 'admin'
#     """

#     def has_permission(self, request, view):
#         user = request.user

#         if not user or not user.is_authenticated:
#             return False

#         # Django superuser always allowed
#         if user.is_superuser:
#             return True

#         # Profile is created by signals.py
#         profile = getattr(user, "profile", None)
#         if not profile:
#             return False

#         return profile.role == "admin"


# class IsOperator(BasePermission):
#     """
#     Allow access only to users with profile.role = 'operator'
#     """

#     def has_permission(self, request, view):
#         user = request.user

#         if not user or not user.is_authenticated:
#             return False

#         # Admins can also access operator endpoints
#         if user.is_superuser:
#             return True

#         profile = getattr(user, "profile", None)
#         if not profile:
#             return False

#         return profile.role in ["operator", "admin"]

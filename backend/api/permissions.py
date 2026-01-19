from rest_framework.permissions import BasePermission


class IsAdmin(BasePermission):
    """
    Allow access only to users with profile.role = 'admin'
    """

    def has_permission(self, request, view):
        user = request.user

        if not user or not user.is_authenticated:
            return False

        # Django superuser always allowed
        if user.is_superuser:
            return True

        # Profile is created by signals.py
        profile = getattr(user, "profile", None)
        if not profile:
            return False

        return profile.role == "admin"


class IsOperator(BasePermission):
    """
    Allow access only to users with profile.role = 'operator'
    """

    def has_permission(self, request, view):
        user = request.user

        if not user or not user.is_authenticated:
            return False

        # Admins can also access operator endpoints
        if user.is_superuser:
            return True

        profile = getattr(user, "profile", None)
        if not profile:
            return False

        return profile.role in ["operator", "admin"]

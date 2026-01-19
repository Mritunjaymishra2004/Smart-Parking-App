from django.contrib.auth.models import User
from api.models import Profile


def run():
    # ============================
    # Create Admin Account
    # ============================
    admin_email = "admin@gmail.com"
    admin_password = "Admin@123"

    if not User.objects.filter(username=admin_email).exists():
        admin = User.objects.create_superuser(
            username=admin_email,
            email=admin_email,
            password=admin_password
        )
        Profile.objects.get_or_create(user=admin, defaults={"role": "admin"})
        print("✅ Admin created:", admin_email)
    else:
        print("ℹ️ Admin already exists:", admin_email)

    # ============================
    # Create Normal User
    # ============================
    user_email = "user@gmail.com"
    user_password = "User@123"

    if not User.objects.filter(username=user_email).exists():
        user = User.objects.create_user(
            username=user_email,
            email=user_email,
            password=user_password
        )
        Profile.objects.get_or_create(user=user, defaults={"role": "user"})
        print("✅ User created:", user_email)
    else:
        print("ℹ️ User already exists:", user_email)

from django.apps import AppConfig


class ApiConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "api"

    def ready(self):
        """
        This method runs when Django starts.

        ❌ We must NEVER start background threads here
        because Django runs this during:
        - makemigrations
        - migrate
        - shell
        - createsuperuser
        - gunicorn workers

        Only signals are allowed here.
        """

        try:
            import api.signals  # noqa
        except Exception as e:
            print("Signal loading error:", e)
from django.apps import AppConfig


class ApiConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "api"

    def ready(self):
        """
        This method runs when Django starts.

        ❌ We must NEVER start background threads here
        because Django runs this during:
        - makemigrations
        - migrate
        - shell
        - createsuperuser
        - gunicorn workers

        Only signals are allowed here.
        """

        try:
            import api.signals  # noqa
        except Exception as e:
            # Never crash Django if signals fail
            print("⚠️ API signals failed to load:", e)

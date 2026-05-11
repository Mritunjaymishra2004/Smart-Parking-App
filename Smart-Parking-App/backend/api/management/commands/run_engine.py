from django.core.management.base import BaseCommand
from api.views import run_violation_engine
import time

class Command(BaseCommand):
    help = "Runs violation detection engine"

    def handle(self, *args, **kwargs):
        self.stdout.write("Violation engine running...")

        while True:
            try:
                run_violation_engine()
            except Exception as e:
                print("Engine error:", e)

            time.sleep(60)

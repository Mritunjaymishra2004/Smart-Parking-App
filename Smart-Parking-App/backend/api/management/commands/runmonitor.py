from django.core.management.base import BaseCommand
from api.monitor import start_monitor

class Command(BaseCommand):
    help = "Run parking violation monitor"

    def handle(self, *args, **kwargs):
        self.stdout.write("🚦 Parking monitor started")
        start_monitor()

import json
from channels.generic.websocket import AsyncWebsocketConsumer


class SlotsConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        # 🔐 Allow only authenticated users
        if self.scope["user"].is_anonymous:
            await self.close()
            return

        # =====================================================
        # Detect if admin or user socket
        # =====================================================
        path = self.scope.get("path", "")

        if "admin" in path:
            self.group_name = "admin_slots_group"
        else:
            self.group_name = "slots_group"

        await self.channel_layer.group_add(self.group_name, self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.group_name, self.channel_name)

    # Original slot update
    async def send_slot_update(self, event):
        await self.send(text_data=json.dumps(event["data"]))

    # 🔹 Added: Lightweight refresh signal
    async def refresh_slots(self, event):
        await self.send(text_data=json.dumps(event["data"]))


class VehicleConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        if self.scope["user"].is_anonymous:
            await self.close()
            return

        # =====================================================
        # Detect if admin or user socket
        # =====================================================
        path = self.scope.get("path", "")

        if "admin" in path:
            self.group_name = "admin_vehicles_group"
        else:
            self.group_name = "vehicles_group"

        await self.channel_layer.group_add(self.group_name, self.channel_name)
        await self.accept()

        # 🔹 Admin receives full GPS snapshot on connect
        if "admin" in path:
            try:
                from .utils_ws import broadcast_all_vehicle_positions
                broadcast_all_vehicle_positions()
            except Exception:
                pass

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.group_name, self.channel_name)

    # Original live position
    async def send_vehicle_update(self, event):
        await self.send(text_data=json.dumps(event["data"]))

    # 🔹 Added: Admin initial snapshot
    async def vehicle_snapshot(self, event):
        await self.send(text_data=json.dumps(event["data"]))

import json

from channels.generic.websocket import AsyncWebsocketConsumer


class ParkingConsumer(
    AsyncWebsocketConsumer
):

    async def connect(self):

        # ============================================
        # GROUP NAME
        # ============================================

        self.parking_group = "parking_group"

        # ============================================
        # JOIN GROUP
        # ============================================

        await self.channel_layer.group_add(

            self.parking_group,

            self.channel_name
        )

        # ============================================
        # ACCEPT CONNECTION
        # ============================================

        await self.accept()

        print(
            "WebSocket connected"
        )

    async def disconnect(
        self,
        close_code
    ):

        # ============================================
        # LEAVE GROUP SAFELY
        # ============================================

        try:

            await self.channel_layer.group_discard(

                self.parking_group,

                self.channel_name
            )

        except Exception as e:

            print(
                "Disconnect error:",
                e
            )

        print(
            "WebSocket disconnected"
        )

    async def receive(
        self,
        text_data
    ):

        try:

            data = json.loads(
                text_data
            )

            print(
                "Received:",
                data
            )

            # ========================================
            # ECHO BACK
            # ========================================

            await self.send(

                text_data=json.dumps({

                    "type":
                        "echo",

                    "message":
                        data,
                })
            )

        except Exception as e:

            print(
                "Receive error:",
                e
            )

    # ================================================
    # GROUP MESSAGE HANDLER
    # ================================================

    async def parking_update(
        self,
        event
    ):

        await self.send(

            text_data=json.dumps(

                event["data"]
            )
        )

























# import json

# from channels.generic.websocket import  AsyncWebsocketConsumer

# # =====================================================
# # PARKING CONSUMER
# # =====================================================

# class ParkingConsumer(
#     AsyncWebsocketConsumer
# ):

#     # =================================================
#     # CONNECT
#     # =================================================

#     async def connect(self):

#         # =============================================
#         # AUTH CHECK
#         # =============================================

#         user = self.scope.get("user")

#         if not user or user.is_anonymous:

#             await self.close()

#             return

#         # =============================================
#         # USER INFO
#         # =============================================

#         self.user = user

#         self.is_admin = (
#             user.is_staff
#             or user.is_superuser
#         )

#         # =============================================
#         # GROUPS
#         # =============================================

#         self.parking_group = "parking"

#         self.slot_group = "slots"

#         self.vehicle_group = "vehicles"

#         self.admin_group = "admins"

#         # =============================================
#         # JOIN COMMON GROUPS
#         # =============================================

#         await self.channel_layer.group_add(
#             self.parking_group,
#             self.channel_name,
#         )

#         await self.channel_layer.group_add(
#             self.slot_group,
#             self.channel_name,
#         )

#         await self.channel_layer.group_add(
#             self.vehicle_group,
#             self.channel_name,
#         )

#         # =============================================
#         # ADMIN EXTRA GROUP
#         # =============================================

#         if self.is_admin:

#             await self.channel_layer.group_add(
#                 self.admin_group,
#                 self.channel_name,
#             )

#         # =============================================
#         # ACCEPT CONNECTION
#         # =============================================

#         await self.accept()

#         print(
#             f"✅ WebSocket connected: {user.username}"
#         )

#     # =================================================
#     # DISCONNECT
#     # =================================================

#     async def disconnect(
#         self,
#         close_code
#     ):

#         await self.channel_layer.group_discard(
#             self.parking_group,
#             self.channel_name,
#         )

#         await self.channel_layer.group_discard(
#             self.slot_group,
#             self.channel_name,
#         )

#         await self.channel_layer.group_discard(
#             self.vehicle_group,
#             self.channel_name,
#         )

#         if self.is_admin:

#             await self.channel_layer.group_discard(
#                 self.admin_group,
#                 self.channel_name,
#             )

#         print(
#             "❌ WebSocket disconnected"
#         )

#     # =================================================
#     # RECEIVE FROM FRONTEND
#     # =================================================

#     async def receive(
#         self,
#         text_data
#     ):

#         try:

#             data = json.loads(
#                 text_data
#             )

#             message_type = data.get(
#                 "type"
#             )

#             # =========================================
#             # PING
#             # =========================================

#             if message_type == "ping":

#                 await self.send(
#                     text_data=json.dumps({

#                         "type":
#                             "pong"
#                     })
#                 )

#             # =========================================
#             # ECHO
#             # =========================================

#             else:

#                 await self.send(
#                     text_data=json.dumps({

#                         "type":
#                             "echo",

#                         "message":
#                             data,
#                     })
#                 )

#         except Exception as e:

#             print(
#                 "❌ WebSocket receive error:",
#                 e
#             )

#     # =================================================
#     # SLOT UPDATE EVENT
#     # =================================================

#     async def slot_update(
#         self,
#         event
#     ):

#         await self.send(
#             text_data=json.dumps({

#                 "type":
#                     "slot_update",

#                 "data":
#                     event["data"],
#             })
#         )

#     # =================================================
#     # VEHICLE UPDATE EVENT
#     # =================================================

#     async def vehicle_update(
#         self,
#         event
#     ):

#         await self.send(
#             text_data=json.dumps({

#                 "type":
#                     "vehicle_update",

#                 "data":
#                     event["data"],
#             })
#         )

#     # =================================================
#     # PARKING UPDATE EVENT
#     # =================================================

#     async def parking_update(
#         self,
#         event
#     ):

#         await self.send(
#             text_data=json.dumps({

#                 "type":
#                     "parking_update",

#                 "data":
#                     event["data"],
#             })
#         )

#     # =================================================
#     # ADMIN ALERT EVENT
#     # =================================================

#     async def admin_alert(
#         self,
#         event
#     ):

#         if self.is_admin:

#             await self.send(
#                 text_data=json.dumps({

#                     "type":
#                         "admin_alert",

#                     "data":
#                         event["data"],
#                 })
#             )










# import json
# from channels.generic.websocket import AsyncWebsocketConsumer


# class SlotsConsumer(AsyncWebsocketConsumer):
#     async def connect(self):
#         # 🔐 Allow only authenticated users
#         if self.scope["user"].is_anonymous:
#             await self.close()
#             return

#         # =====================================================
#         # Detect if admin or user socket
#         # =====================================================
#         path = self.scope.get("path", "")

#         if "admin" in path:
#             self.group_name = "admin_slots_group"
#         else:
#             self.group_name = "slots_group"

#         await self.channel_layer.group_add(self.group_name, self.channel_name)
#         await self.accept()

#     async def disconnect(self, close_code):
#         await self.channel_layer.group_discard(self.group_name, self.channel_name)

#     # Original slot update
#     async def send_slot_update(self, event):
#         await self.send(text_data=json.dumps(event["data"]))

#     # 🔹 Added: Lightweight refresh signal
#     async def refresh_slots(self, event):
#         await self.send(text_data=json.dumps(event["data"]))


# class VehicleConsumer(AsyncWebsocketConsumer):
#     async def connect(self):
#         if self.scope["user"].is_anonymous:
#             await self.close()
#             return

#         # =====================================================
#         # Detect if admin or user socket
#         # =====================================================
#         path = self.scope.get("path", "")

#         if "admin" in path:
#             self.group_name = "admin_vehicles_group"
#         else:
#             self.group_name = "vehicles_group"

#         await self.channel_layer.group_add(self.group_name, self.channel_name)
#         await self.accept()

#         # 🔹 Admin receives full GPS snapshot on connect
#         if "admin" in path:
#             try:
#                 from .utils_ws import broadcast_all_vehicle_positions
#                 broadcast_all_vehicle_positions()
#             except Exception:
#                 pass

#     async def disconnect(self, close_code):
#         await self.channel_layer.group_discard(self.group_name, self.channel_name)

#     # Original live position
#     async def send_vehicle_update(self, event):
#         await self.send(text_data=json.dumps(event["data"]))

#     # 🔹 Added: Admin initial snapshot
#     async def vehicle_snapshot(self, event):
#         await self.send(text_data=json.dumps(event["data"]))









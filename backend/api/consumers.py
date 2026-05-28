# import json

# from channels.generic.websocket import (
#     AsyncWebsocketConsumer
# )


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
#         # USER
#         # =============================================

#         user = self.scope.get(
#             "user"
#         )

#         # =============================================
#         # AUTH CHECK
#         # =============================================

#         if (
#             not user
#             or
#             user.is_anonymous
#         ):

#             await self.close()

#             return

#         # =============================================
#         # USER INFO
#         # =============================================

#         self.user = user

#         self.is_admin = (

#             user.is_staff

#             or

#             user.is_superuser
#         )

#         # =============================================
#         # GROUPS
#         # =============================================

#         self.parking_group = (
#             "parking_group"
#         )

#         self.slots_group = (
#             "slots_group"
#         )

#         self.vehicles_group = (
#             "vehicles_group"
#         )

#         self.admin_group = (
#             "admin_group"
#         )

#         # =============================================
#         # JOIN COMMON GROUPS
#         # =============================================

#         await self.channel_layer.group_add(

#             self.parking_group,

#             self.channel_name
#         )

#         await self.channel_layer.group_add(

#             self.slots_group,

#             self.channel_name
#         )

#         await self.channel_layer.group_add(

#             self.vehicles_group,

#             self.channel_name
#         )

#         # =============================================
#         # ADMIN GROUP
#         # =============================================

#         if self.is_admin:

#             await self.channel_layer.group_add(

#                 self.admin_group,

#                 self.channel_name
#             )

#         # =============================================
#         # ACCEPT CONNECTION
#         # =============================================

#         await self.accept()

#         # =============================================
#         # SUCCESS MESSAGE
#         # =============================================

#         await self.send(

#             text_data=json.dumps({

#                 "type":
#                     "connection",

#                 "message":
#                     "WebSocket Connected",

#                 "user":
#                     self.user.username,

#                 "admin":
#                     self.is_admin,
#             })
#         )

#         print(

#             f"✅ WebSocket connected: "

#             f"{self.user.username}"
#         )

#     # =================================================
#     # DISCONNECT
#     # =================================================

#     async def disconnect(
#         self,
#         close_code
#     ):

#         try:

#             # =========================================
#             # REMOVE COMMON GROUPS
#             # =========================================

#             await self.channel_layer.group_discard(

#                 self.parking_group,

#                 self.channel_name
#             )

#             await self.channel_layer.group_discard(

#                 self.slots_group,

#                 self.channel_name
#             )

#             await self.channel_layer.group_discard(

#                 self.vehicles_group,

#                 self.channel_name
#             )

#             # =========================================
#             # REMOVE ADMIN GROUP
#             # =========================================

#             if self.is_admin:

#                 await self.channel_layer.group_discard(

#                     self.admin_group,

#                     self.channel_name
#                 )

#         except Exception as error:

#             print(

#                 "Disconnect error:",

#                 error
#             )

#         print(

#             f"❌ WebSocket disconnected: "

#             f"{close_code}"
#         )

#     # =================================================
#     # RECEIVE MESSAGE
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

#             print(

#                 "Received:",

#                 data
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

#                 return

#             # =========================================
#             # ECHO
#             # =========================================

#             await self.send(

#                 text_data=json.dumps({

#                     "type":
#                         "echo",

#                     "message":
#                         data,
#                 })
#             )

#         except Exception as error:

#             print(

#                 "Receive error:",

#                 error
#             )

#             await self.send(

#                 text_data=json.dumps({

#                     "type":
#                         "error",

#                     "message":
#                         str(error),
#                 })
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
#                     event.get(
#                         "data",
#                         {}
#                     ),
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
#                     event.get(
#                         "data",
#                         {}
#                     ),
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
#                     event.get(
#                         "data",
#                         {}
#                     ),
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
#                         event.get(
#                             "data",
#                             {}
#                         ),
#                 })
#             )  





import json
from urllib.parse import parse_qs

from channels.generic.websocket import AsyncWebsocketConsumer
from rest_framework_simplejwt.tokens import AccessToken
from django.contrib.auth import get_user_model

User = get_user_model()


# =====================================================
# PARKING CONSUMER
# =====================================================

class ParkingConsumer(
    AsyncWebsocketConsumer
):

    # =================================================
    # CONNECT
    # =================================================

    async def connect(self):

        self.user = None
        self.is_admin = False

        self.parking_group = None
        self.slots_group = None
        self.vehicles_group = None
        self.admin_group = None

        try:
            query_string = self.scope[
                "query_string"
            ].decode()

            token = parse_qs(
                query_string
            ).get("token", [None])[0]

            if not token:
                print(
                    "❌ No WebSocket token"
                )
                await self.close()
                return

            access_token = AccessToken(
                token
            )

            user_id = access_token[
                "user_id"
            ]

            self.user = await User.objects.aget(
                id=user_id
            )

            self.is_admin = (
                self.user.is_staff
                or
                self.user.is_superuser
            )

            # GROUPS
            self.parking_group = (
                "parking_group"
            )

            self.slots_group = (
                "slots_group"
            )

            self.vehicles_group = (
                "vehicles_group"
            )

            self.admin_group = (
                "admin_group"
            )

            # JOIN GROUPS
            await self.channel_layer.group_add(
                self.parking_group,
                self.channel_name
            )

            await self.channel_layer.group_add(
                self.slots_group,
                self.channel_name
            )

            await self.channel_layer.group_add(
                self.vehicles_group,
                self.channel_name
            )

            if self.is_admin:
                await self.channel_layer.group_add(
                    self.admin_group,
                    self.channel_name
                )

            await self.accept()

            await self.send(
                text_data=json.dumps({
                    "type":
                        "connection",
                    "message":
                        "WebSocket Connected",
                    "user":
                        self.user.username,
                    "admin":
                        self.is_admin,
                })
            )

            print(
                f"✅ WebSocket connected: {self.user.username}"
            )

        except Exception as error:
            print(
                f"WebSocket JWT auth failed: {str(error)}"
            )
            await self.close()

    # =================================================
    # DISCONNECT
    # =================================================

    async def disconnect(
        self,
        close_code
    ):

        try:

            if self.parking_group:
                await self.channel_layer.group_discard(
                    self.parking_group,
                    self.channel_name
                )

            if self.slots_group:
                await self.channel_layer.group_discard(
                    self.slots_group,
                    self.channel_name
                )

            if self.vehicles_group:
                await self.channel_layer.group_discard(
                    self.vehicles_group,
                    self.channel_name
                )

            if self.admin_group and self.is_admin:
                await self.channel_layer.group_discard(
                    self.admin_group,
                    self.channel_name
                )

        except Exception as error:
            print(
                f"Disconnect error: {str(error)}"
            )

        print(
            f"❌ WebSocket disconnected: {close_code}"
        )

    # =================================================
    # RECEIVE
    # =================================================

    async def receive(
        self,
        text_data
    ):

        try:
            data = json.loads(
                text_data
            )

            if data.get("type") == "ping":

                await self.send(
                    text_data=json.dumps({
                        "type": "pong"
                    })
                )
                return

            await self.send(
                text_data=json.dumps({
                    "type": "echo",
                    "message": data,
                })
            )

        except Exception as error:

            await self.send(
                text_data=json.dumps({
                    "type": "error",
                    "message": str(error),
                })
            )

    # =================================================
    # EVENTS
    # =================================================

    async def slot_update(
        self,
        event
    ):
        await self.send(
            text_data=json.dumps(event)
        )

    async def vehicle_update(
        self,
        event
    ):
        await self.send(
            text_data=json.dumps(event)
        )

    async def parking_update(
        self,
        event
    ):
        await self.send(
            text_data=json.dumps(event)
        )

    async def admin_alert(
        self,
        event
    ):
        if self.is_admin:
            await self.send(
                text_data=json.dumps(event)
            )
import asyncio
import websockets
import json

async def test_ws():
    uri = "ws://localhost:8000/ws/slots/"

    async with websockets.connect(uri) as ws:
        print("Connected to WebSocket")

        await ws.send(json.dumps({"action": "ping"}))

        while True:
            msg = await ws.recv()
            print("WS:", msg)

asyncio.run(test_ws())

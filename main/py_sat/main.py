from ultralytics import YOLO  # Ensure proper import
import requests
import base64
import cv2
from PIL import Image
from io import BytesIO
import os
import numpy as np
import torch
import time
import json
import math

model = YOLO("best.pt")
meters_per_pixel = 2.97

center_lat = 37.757481
center_lon = -122.363672

METERS_PER_DEGREE_LAT = 111_320  # approx. at all latitudes

def meters_per_degree_lon(lat):
    return 111_320 * math.cos(math.radians(lat))

def pixel_to_latlon(px, py, img_w, img_h):
    """
    px,py = pixel coords in full image
    img_w,img_h = full image size
    returns (lat, lon)
    """
    # offset from image center in px
    dx = px - img_w/2
    dy = py - img_h/2

    # convert px ➔ meters
    mx = dx * meters_per_pixel
    my = dy * meters_per_pixel

    # convert meters ➔ degrees
    dlat = - (my  / METERS_PER_DEGREE_LAT)   # negative because y‐down is south
    mlon = mx  / meters_per_degree_lon(center_lat)

    return center_lat + dlat, center_lon + mlon


def get_best_device():
    if torch.cuda.is_available():
        return "cuda"  # Use NVIDIA GPU
    elif torch.backends.mps.is_available():
        return "mps"  # Use Apple Metal for M1/M2 Macs
    else:
        return "cpu"  # Fallback to CPU

def split_image_in_memory(image_path, tile_size=(640, 640)):
    img = Image.open(image_path)
    w, h = img.size
    tiles = []
    for x in range(0, w, tile_size[0]):
        for y in range(0, h, tile_size[1]):
            box = (x, y, min(x+tile_size[0], w), min(y+tile_size[1], h))
            tile = img.crop(box)
            tiles.append((tile, x, y))
    return w, h, tiles



def get_bounding_boxes(image_path, device):
    img_w, img_h, tiles = split_image_in_memory(image_path)
    bboxes = []

    for tile, x_off, y_off in tiles:
        arr = cv2.cvtColor(np.array(tile), cv2.COLOR_RGB2BGR)
        results = model.predict(arr, conf=0.5, iou=0.5, device=device, show=False)
        for res in results:
            if res.boxes is not None:
                # Iterate through each detected box
                # res.boxes.xyxy is a tensor of shape (N, 4) where N is the number of boxes
                # Each box is represented by [x1, y1, x2, y2]
                # res.boxes.cls is a tensor of shape (N,) containing class indices
                # res.boxes.conf is a tensor of shape (N,) containing confidence scores
                for box in res.boxes:
                    x1, y1, x2, y2 = map(int, box.xyxy[0])
                    cx, cy = (x1+x2)/2, (y1+y2)/2

                    # convert to full‑image pixel coords
                    full_cx = x_off + cx
                    full_cy = y_off + cy

                    lat, lon = pixel_to_latlon(full_cx, full_cy, img_w, img_h)

                    bboxes.append({
                        "Classification": model.names[int(box.cls[0])],
                        "timestamp": time.time(),
                        "latitude": lat,
                        "longitude": lon,
                        "width": x2-x1,
                        "height": y2-y1,
                        "image": base64.b64encode(
                            cv2.imencode('.png', arr[y1:y2, x1:x2])[1]
                        ).decode(),
                        "confidence": float(box.conf[0])
                    })
    return bboxes


def sendData(data):
    url = ' http://localhost:8000/satdump'
    print(f'sending {len(data)} ships to backend')
    resp = requests.post(url, json=data)

    if resp is None:
        print("Error: No response from server")
        return None

    if resp.status_code != 200:
        print(f"Error: {resp.status_code}")
        return None

    if not resp.text.strip():  # Check if response is empty
        print("Error: Empty response from server")
        return None

    try:
        return resp.json()
    except requests.exceptions.JSONDecodeError as e:
        print(f"JSON decoding error: {e}")
        return None
    

    return resp.json()

if __name__ == '__main__':
    image_path = "sfbay_1.png"  # Replace with your image
    device = get_best_device()  # Get the best device for inference
    objects = get_bounding_boxes(image_path, device=device)  # Run detection

    # Send each detected ship's data to the backend
    response = sendData(objects)

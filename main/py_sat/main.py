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

model = YOLO("best.pt")

def get_best_device():
    if torch.cuda.is_available():
        return "cuda"  # Use NVIDIA GPU
    elif torch.backends.mps.is_available():
        return "mps"  # Use Apple Metal for M1/M2 Macs
    else:
        return "cpu"  # Fallback to CPU

def split_image_in_memory(image_path, tile_size=(640, 640)):
    """Split an image into tiles without saving them to disk"""
    img = Image.open(image_path)
    img_array = np.array(img)

    img_height, img_width, _ = img_array.shape
    tiles = []

    for i in range(0, img_width, tile_size[0]):
        for j in range(0, img_height, tile_size[1]):
            tile = img_array[j:j+tile_size[1], i:i+tile_size[0], :]
            tiles.append(Image.fromarray(tile))

    return tiles

def get_bounding_boxes(image_path, device):
    """Run prediction and extract bounding boxes"""
    tiles = split_image_in_memory(image_path)  
    bounding_boxes = []

    for tile in tiles:
        tile = np.array(tile)
        tile_bgr = cv2.cvtColor(tile, cv2.COLOR_RGB2BGR)  # Convert to BGR for OpenCV


        # for production we need to make sure the device is set to cuda and show is false

        # maybe we can check if the device is available and set it to cuda or mps
        # Check if the device is available

        if device == 'cuda':
            results = model.predict(tile_bgr, conf=0.5, iou=0.5, device='cuda', show=False)
        elif device == 'mps':
            results = model.predict(tile_bgr, conf=0.5, iou=0.5, device='mps', show=True)
        else:
            # Fallback to CPU
            results = model.predict(tile_bgr, conf=0.5, iou=0.5, device='cpu', show=False)


        for result in results:  # Iterate over results (list of `Result` objects)
            if result.boxes is not None:  # Ensure boxes exist
                for box in result.boxes:
                    x_min, y_min, x_max, y_max = map(int, box.xyxy[0])  # Extract coordinates
                    confidence = float(box.conf[0])  # Confidence score
                    label = model.names[int(box.cls[0])]  # Class label

                    width = x_max - x_min
                    height = y_max - y_min

                    # Crop the detected object
                    cropped_img = tile_bgr[y_min:y_max, x_min:x_max]

                    # Convert cropped image to Base64
                    _, buffer = cv2.imencode('.png', cropped_img)
                    base64_image = base64.b64encode(buffer).decode("utf-8")

                    bounding_boxes.append({
                        "Classification": label,
                        "timestamp": time.time(),  # Current timestamp
                        "latitude": 37.7749,  # Placeholder, need actual calculation
                        "longitude": -122.4194,  # Placeholder, need actual calculation
                        "width": width,
                        "height": height,
                        "image": base64_image,
                        "confidence": confidence
                    })

    return bounding_boxes


def sendData(data):
    url = 'http://127.0.0.1:5000/satdump'
    # no headers needed if you use the json= kwarg
    resp = requests.post(url, json=data)
    if resp.status_code != 200:
        print(f"Error: {resp.status_code}")
        return None
    return resp.json()

if __name__ == '__main__':
    image_path = "sfbay_1.png"  # Replace with your image
    device = get_best_device()  # Get the best device for inference
    objects = get_bounding_boxes(image_path, device=device)  # Run detection

    # Send each detected ship's data to the backend
    response = sendData(objects)

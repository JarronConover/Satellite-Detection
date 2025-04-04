from ultralytics import YOLO  # Ensure proper import
import requests
import base64
import cv2
from PIL import Image
from io import BytesIO


model = YOLO("best.pt")

def get_bounding_boxes(image_path):
    """Run prediction and extract bounding boxes"""
    img = cv2.imread(image_path)
    results = model.predict(img)  # Run inference
    
    bounding_boxes = []
    for result in results:
        if result.boxes is not None:
            for box in result.boxes:
                x_min, y_min, x_max, y_max = map(int, box.xyxy[0])  # Extract coordinates
                confidence = float(box.conf[0])  # Confidence score
                label = model.names[int(box.cls[0])]  # Class label
            
                width = x_max - x_min
                height = y_max - y_min

                # Crop the ship image
                cropped_img = img[y_min:y_max, x_min:x_max]

                # Convert cropped image to Base64
                _, buffer = cv2.imencode('.png', cropped_img)
                base64_image = base64.b64encode(buffer).decode("utf-8")

                image_data = base64.b64decode(base64_image)
                image = Image.open(BytesIO(image_data))
                image.save("test_output.png")  # Writes the decoded image to file

                bounding_boxes.append({
                    "Classification": label,
                    "latitude": 37.7749,  # Placeholder, need actual calculation
                    "longitude": -122.4194,  # Placeholder, need actual calculation
                    "width": width,
                    "height": height,
                    "image": base64_image,
                    "confidence": confidence
                })

    
    return bounding_boxes

def sendData(data):
    """Send ship detection data to the backend"""
    url = 'http://localhost:5000/satdump'
    
    response = requests.post(url, json=data)
    if response.status_code != 200:
        print(f"Error: {response.status_code}")
        return None
    return response.json()

if __name__ == '__main__':
    print('Running detection...')

    image_path = "sfbay_1.png"  # Replace with your image
    objects = get_bounding_boxes(image_path)
    print("Detected objects:", objects)

    # Send each detected ship's data to the backend
    for obj in objects:
        response = sendData(obj)
        print("Response:", response)

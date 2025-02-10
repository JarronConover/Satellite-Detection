## **1\. Multi-Stage Processing Pipeline (Waterfall AI)**

### **Step 1: Pre-Processing (Fast Image Filtering)**

💡 **Goal:** Save power by skipping bad images before running detection.

* **Quick check for unusable images**:  
  * **Cloud cover detection**: Use a simple thresholding method or a small CNN to detect if too much of the image is obstructed.  
  * **Nighttime detection**: If IR sensors are available, use those. Otherwise, analyze brightness levels.  
  * **Water/land segmentation**: If large portions of the image are land, discard.  
* (**extra Mile) \-** crop image into usable parts? Not necessarily binary yes or no to image.

✅ **Possible Models:**

* Simple heuristics (brightness thresholding, edge density for water/land).  
  * Could be done **without AI** to save power.  
* A tiny CNN for **cloud detection**.

---

### **Step 2: Ship Detection (Bounding Box Model)**

💡 **Goal:** Detect ships in the image and get their locations (lat/lon).

* This step **finds ships and draws bounding boxes**.  
* Optimized models for edge detection on satellite images.

✅ **Possible Models:**

* **YOLOv5/YOLOv8-Tiny** – Optimized for real-time detection on edge devices.  
* **EfficientDet-Lite** – Works well with TFLite, but heavier than YOLO.  
* **Custom SSD MobileNet** – Works well on TensorFlow Lite.

⚡ **Optimization for Satellite Deployment:**

* Convert to **TensorFlow Lite or ONNX** for embedded hardware.  
* **Quantization (int8/fp16)** to fit within power constraints.

---

### **Step 3: Ship Classification (Type & Dimensions)**

💡 **Goal:** Identify **what type of ship it is (cargo, tanker, fishing vessel, etc.)**

* After detecting ships, **crop** the bounding boxes and classify each one.  
* Estimate **ship dimensions** based on pixel size and known satellite scale.

✅ **Possible Models:**

* **MobileNetV3** for classification (low power).  
* **EfficientNet-Lite** for better accuracy at a slight cost.

🚀 **Optimization Strategy:**

* First, **run detection** on low-res images.  
* Then, if ships are found, **process only those regions** in high-res to classify them.

---

### **Step 4: Output & Data Processing**

💡 **Goal:** Extract **latitude, longitude, ship type, dimensions, and optionally the image**.

* Once ships are classified, extract:  
  * **Lat/Lon** (based on satellite GPS & image coordinates).  
  * **Ship type & estimated dimensions**.  
  * **Possibly a cropped image of the detected ship**.  
* **Send data to ground station** in compressed format. (protobuf?)

📡 **Final Output Example:**

CopyEdit  
`{`  
  `"timestamp": "2025-02-05T12:34:56Z",`  
  `"ships": [`  
    `{`  
      `"lat": 45.1234,`  
      `"lon": -75.5678,`  
      `"type": "Cargo Ship",`  
      `"dimensions": {`  
        `"length": 120,`  
        `"width": 20`  
      `},`  
      `"image_url": "satellite_image_1234.jpg"`  
    `}`  
  `]`  
`}`  


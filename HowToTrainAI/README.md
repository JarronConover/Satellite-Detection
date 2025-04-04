# Training Your Own AI Model

This guide will walk you through setting up and training a YOLO model using the ShipRSImageNet dataset.

## Step 1: Download the Dataset

First, download the dataset from the following link:

[ShipRSImageNet Repository](https://github.com/zzndream/ShipRSImageNet?tab=readme-ov-file)

Once downloaded, unzip the file. Inside, you will find two folders:
- `COCO_Format`
- `VOC_Format`

## Step 2: Convert Dataset to YOLO Format

Since YOLO requires a specific format, the dataset needs to be converted. A script named `Conversion.py` is included for this purpose, but you might need to modify it based on your requirements. If you dont want to learn just run the script it assumes that you are in the same parent folder as COCO and VOC format.

I will incude a sample image and Annotation for some basic understanding
[Image of boat](0aa565354.bmp)

```xml
...
	<object>
		<name>Cargo</name>
		<level_0>1</level_0>
		<level_1>3</level_1>
		<level_2>15</level_2>
		<level_3>40</level_3>
		<iscrowd>0</iscrowd>
		<truncted>0</truncted>
		<is_closed>0</is_closed>
		<Ship_size>middle</Ship_size>
		<Ship_location>sea</Ship_location>
		<Ship_env>
			...
	</object>
</annotation>
```

As you can see the data is classified in levels first I focused on just detecting a boat or not that would be level 0. Level 1 is a basic clasification system merchant, warship, othership, and some other type. I need to keep researching but I just wanted to get the model going and started. 

the Point of the conversion script is to turn all of that xml into a much simpler txt file that typically describes the images like the following.
```
3 0.5345 0.9323 0.065 0.1182
```

This is a lot less then the anotations that we had before. but the first collum is just the class and then the rest is the bownding box for the square. next Ill show the python
```python 
# Define your directories here
VOC_ROOT = 'VOC_Format'  # Path to the VOC format data
YOLO_ROOT = 'YOLO_Format'  # Path where YOLO format data will be saved
CLASS_MAPPING = {
    '3': 2,  # Class ID for merchant
    '1': 0,   # Class ID for warship
    '2': 1, # Class ID for other_ship
    '4': 3
}
```

shows what classes are what the xml is 1-4 and yolo is zerobased 0-3.

After finding matching anotations and images we just go through the anotations and create are own yolo txt based file
```python 
 # Process objects
            yolo_anns = []
            for obj in root.findall('object'):
                try:
                    # Get class from level_1
                    level_1 = obj.find('level_1').text
                    if level_1 not in CLASS_MAPPING:
                        print(f"Warning: Class {level_1} not found in CLASS_MAPPING. Skipping object.")
                        continue  # Skip this object if class_id is not found

                    class_id = CLASS_MAPPING[level_1]

                    # Get bounding box
                    bndbox = obj.find('bndbox')
                    xmin = int(bndbox.find('xmin').text)
                    ymin = int(bndbox.find('ymin').text)
                    xmax = int(bndbox.find('xmax').text)
                    ymax = int(bndbox.find('ymax').text)

                    # Convert to YOLO format
                    x_center = (xmin + xmax) / 2 / width
                    y_center = (ymin + ymax) / 2 / height
                    w = (xmax - xmin) / width
                    h = (ymax - ymin) / height

                    yolo_anns.append(f"{class_id} {x_center:.6f} {y_center:.6f} {w:.6f} {h:.6f}")
                except Exception as e:
                    print(f"Error processing {img_name}: {str(e)}")
                    continue
```

then we have to calculate the bndbox the way that yolo needs.

Once we really want to start moving in and getting the proper classes we can change what "level" of classification that we're looking for there are over 60 different classifications that we're looking for and it really just depends on are scope and how much training data that we can get when trying to train these models.

afer running the script we should have a newly created YOLO_Format folder and we can move one to step 3


## Step 3: Place `dataset.yaml` in YOLO Format Folder

Once the conversion is complete, move the `dataset.yaml` file into the `YOLO_Format` folder.

make sure to ajust your paths to properly point to your data.
```yaml
train: /home/jadogg22/ai/satTrainingv2/data/ShipRSImageNet_V1/YOLO_Format/images/train
val: /home/jadogg22/ai/satTrainingv2/data/ShipRSImageNet_V1/YOLO_Format/images/val
nc: 4  # Adjust this according to your class count
names:
  0: other_ship
  1: warship
  2: merchant
  3: unknown

```

## Step 4: Set Up Conda Environment

1. Install [Miniconda](https://docs.conda.io/en/latest/miniconda.html) if you haven't already.
- also a great time to install the Cuda Toolkit if you have an NVIDIA GPU
2. Open a terminal and create a new Conda environment:
   ```bash
   conda create --name yolo_env python=3.8 -y
   ```
3. Activate the environment:
   ```bash
   conda activate yolo_env
   ```

## Step 5: Install YOLO Requirements

Ensure you have the required dependencies installed:

```bash
pip install ultralytics
```

This will install the YOLO package for training the model.

## Step 6: Train the Model

In your Python script or interactive session, use the following:

```python
from ultralytics import YOLO

# Load a pre-trained YOLO model (adjust model version as needed)
model = YOLO("yolov8n.pt")

# Train the model on the custom dataset
model.train(data="YOLO_Format/dataset.yaml", epochs=100, imgsz=640)
```

Adjust the parameters as needed, such as increasing epochs for better accuracy. lowering batchsize if you run out of memory, etc.

---
This guide should get you started! Feel free to modify the dataset conversion section as needed. 🚀


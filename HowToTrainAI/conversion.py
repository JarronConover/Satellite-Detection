

import os
import shutil
import xml.etree.ElementTree as ET

# Define your directories here
VOC_ROOT = 'VOC_Format'  # Path to the VOC format data
YOLO_ROOT = 'YOLO_Format'  # Path where YOLO format data will be saved
CLASS_MAPPING = {
    '3': 2,  # Class ID for merchant
    '1': 0,   # Class ID for warship
    '2': 1, # Class ID for other_ship
    '4': 3
}

def convert_voc_to_yolo():
    images_with_annotations = 0
    images_without_annotations = 0

    # Create YOLO directory structure
    for split in ['train', 'val', 'test']:
        os.makedirs(os.path.join(YOLO_ROOT, 'images', split), exist_ok=True)
        os.makedirs(os.path.join(YOLO_ROOT, 'labels', split), exist_ok=True)

    # Process each dataset split
    for split in ['train', 'val', 'test']:
        with open(os.path.join(VOC_ROOT, 'ImageSets', f'{split}.txt'), 'r') as f:
            image_names = f.read().splitlines()

        for img_name in image_names:
            # Construct image and annotation file paths
            img_name_base = os.path.splitext(img_name)[0]  # Remove extension (e.g., .bmp)
            src_img = os.path.join(VOC_ROOT, 'JPEGImages', f'{img_name}')
            ann_path = os.path.join(VOC_ROOT, 'Annotations', f'{img_name_base}.xml')

            # Check if the annotation exists
            if not os.path.exists(ann_path):
                images_without_annotations += 1
                print(f"Warning: Annotation for {img_name} not found. Skipping.")
                continue

            # If annotation exists, process it
            images_with_annotations += 1

            # Copy image to YOLO format folder
            dst_img = os.path.join(YOLO_ROOT, 'images', split, f'{img_name}')
            shutil.copyfile(src_img, dst_img)

            # Parse annotation
            tree = ET.parse(ann_path)
            root = tree.getroot()

            # Get image dimensions
            size = root.find('size')
            width = int(size.find('width').text)
            height = int(size.find('height').text)

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

            # Save YOLO annotations to file
            if yolo_anns:
                ann_save_path = os.path.join(YOLO_ROOT, 'labels', split, f'{img_name_base}.txt')
                with open(ann_save_path, 'w') as f:
                    f.write('\n'.join(yolo_anns))

    # Print summary
    print(f"\nSummary:")
    print(f"Images with annotations: {images_with_annotations}")
    print(f"Images without annotations: {images_without_annotations}")

# Call the conversion function
convert_voc_to_yolo()


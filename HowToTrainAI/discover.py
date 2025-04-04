import os
import xml.etree.ElementTree as ET
from collections import defaultdict

# Define the path to the annotations folder
VOC_ANNOTATIONS_DIR = 'VOC_Format/Annotations'

# Dictionary to store classification counts
classification_counts = defaultdict(int)
classification_details = defaultdict(set)  # Stores unique level classifications per name

# Process all XML files in the directory
for xml_file in os.listdir(VOC_ANNOTATIONS_DIR):
    if not xml_file.endswith('.xml'):
        continue  # Skip non-XML files

    xml_path = os.path.join(VOC_ANNOTATIONS_DIR, xml_file)
    
    try:
        tree = ET.parse(xml_path)
        root = tree.getroot()

        for obj in root.findall('object'):
            name = obj.find('name').text.strip()
            level_0 = obj.find('level_0').text.strip() if obj.find('level_0') is not None else "N/A"
            level_1 = obj.find('level_1').text.strip() if obj.find('level_1') is not None else "N/A"
            level_2 = obj.find('level_2').text.strip() if obj.find('level_2') is not None else "N/A"
            level_3 = obj.find('level_3').text.strip() if obj.find('level_3') is not None else "N/A"

            # Create classification key
            classification_key = (name, level_0, level_1, level_2, level_3)

            # Update counts
            classification_counts[classification_key] += 1

            # Store unique level combinations per name
            classification_details[name].add((level_0, level_1, level_2, level_3))

    except Exception as e:
        print(f"Error processing {xml_file}: {str(e)}")

# Print summary
print("\nClassification Summary:")
for (name, level_0, level_1, level_2, level_3), count in classification_counts.items():
    print(f"{name} (Levels: {level_0}, {level_1}, {level_2}, {level_3}) → {count} occurrences")



print("\nUnique Level Combinations per Name:")
for name, levels in classification_details.items():
    print(f"{name}: {sorted(levels)}")


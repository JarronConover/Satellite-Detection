from PIL import Image
import numpy as np
import matplotlib.pyplot as plt

# Load the image (RGB)
image = Image.open('satellite_image.jpg')

# Convert the image to a NumPy array (RGB)
image_array = np.array(image)

# Check the shape of the image (height, width, channels)
print("Image shape:", image_array.shape)

# Define a threshold for cloud detection based on brightness
# The threshold will classify high brightness areas as clouds
threshold = 200  # You can adjust this value based on your image's brightness range

# Create a mask where pixels with high brightness are classified as clouds
cloud_mask = np.all(image_array >= threshold, axis=-1)

# Visualize the cloud mask (True = cloud, False = no cloud)
plt.imshow(cloud_mask, cmap='gray')
plt.title('Cloud Mask')
plt.show()

# Calculate the percentage of the image that is covered by clouds
cloud_coverage = np.sum(cloud_mask) / cloud_mask.size * 100
print(f"Cloud coverage: {cloud_coverage:.2f}%")

# Define a threshold for usability - for example, 50% cloud cover
if cloud_coverage > 50:
    print("The image is not usable due to excessive cloud cover.")
else:
    print("The image is usable.")


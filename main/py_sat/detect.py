import torch
import cv2
import numpy as np
import sys
import onnxruntime
import os

def check_cuda():
    """Check if CUDA is available"""
    return torch.cuda.is_available()

def load_onnx_model(onnx_path):
    """Load ONNX model based on CUDA availability"""
    if check_cuda():
        print("[INFO] CUDA available. Attempting GPU execution...")
        try:
            session = onnxruntime.InferenceSession(onnx_path, providers=["CUDAExecutionProvider"])
            print("[INFO] Using CUDAExecutionProvider")
        except Exception as e:
            print(f"[WARNING] Failed to use CUDA: {e}. Falling back to CPU.")
            session = onnxruntime.InferenceSession(onnx_path, providers=["CPUExecutionProvider"])
    else:
        print("[INFO] Running on CPU with ONNX Runtime")
        session = onnxruntime.InferenceSession(onnx_path, providers=["CPUExecutionProvider"])
    
    return session

def preprocess_image(image_path, input_size=(640, 640)):
    """Load and preprocess the image"""
    # Read the original image
    original_img = cv2.imread(image_path)
    if original_img is None:
        raise ValueError(f"Failed to load image from {image_path}")
    
    # Print original image information for debugging
    print(f"[DEBUG] Original image shape: {original_img.shape}")
    
    # Get original dimensions
    original_height, original_width = original_img.shape[:2]
    
    # Create a copy for preprocessing
    input_img = original_img.copy()
    
    # Resize the image
    input_img = cv2.resize(input_img, input_size)
    print(f"[DEBUG] Resized image shape: {input_img.shape}")
    
    # Prepare for model input
    input_img = input_img.transpose(2, 0, 1)  # Convert HWC to CHW
    input_img = np.expand_dims(input_img, axis=0)  # Add batch dimension
    input_img = input_img.astype(np.float32) / 255.0  # Normalize
    
    return input_img, original_img, (original_height, original_width)

def print_model_info(session):
    """Print model input and output information for debugging"""
    print("\n[DEBUG] Model Information:")
    
    print("\nInputs:")
    for i, input_info in enumerate(session.get_inputs()):
        print(f"  Input {i}:")
        print(f"    Name: {input_info.name}")
        print(f"    Shape: {input_info.shape}")
        print(f"    Type: {input_info.type}")
    
    print("\nOutputs:")
    for i, output_info in enumerate(session.get_outputs()):
        print(f"  Output {i}:")
        print(f"    Name: {output_info.name}")
        print(f"    Shape: {output_info.shape}")
        print(f"    Type: {output_info.type}")
    print()

def examine_outputs(outputs):
    """Examine the structure of model outputs for debugging"""
    print("\n[DEBUG] Examining model outputs:")
    for i, output in enumerate(outputs):
        print(f"  Output {i}:")
        print(f"    Type: {type(output)}")
        print(f"    Shape: {output.shape if hasattr(output, 'shape') else 'N/A'}")
        
        if isinstance(output, np.ndarray):
            print(f"    Data type: {output.dtype}")
            print(f"    Min value: {np.min(output)}")
            print(f"    Max value: {np.max(output)}")
            print(f"    Contains NaNs: {np.isnan(output).any()}")
            
            # Print a small sample of the output
            if output.size > 0:
                flat_sample = output.flatten()[:5]
                print(f"    Sample values: {flat_sample}")
    print()

def process_output(outputs, original_shape, input_shape=(640, 640), conf_threshold=0.25, iou_threshold=0.45):
    """Process YOLO model output to get predicted bounding boxes, classes, and confidence scores"""
    # Get original dimensions
    original_height, original_width = original_shape
    print(f"[DEBUG] Original image dimensions: {original_width}x{original_height}")
    
    # Examine outputs to determine format
    examine_outputs(outputs)
    
    # Find detection output (typically a large array with detection data)
    detection_output = None
    for i, output in enumerate(outputs):
        if isinstance(output, np.ndarray) and len(output.shape) >= 2:
            if detection_output is None or output.size > detection_output.size:
                detection_output = output
                selected_output_idx = i
    
    if detection_output is None:
        raise ValueError("Could not identify detection output in model results")
    
    print(f"[DEBUG] Selected output index: {selected_output_idx}")
    print(f"[DEBUG] Detection output shape: {detection_output.shape}")
    
    # Try different output formats based on shape
    detections = []
    predictions = detection_output
    
    # Determine if the model output is in the xywh or xyxy format
    # This is a heuristic approach - we'll try different formats and see which one works
    
    try:
        # Approach 1: YOLOv8-style format with single output, 4+1+n_classes values per prediction
        # Shape is expected to be (1, num_detections, 4+1+n_classes)
        if len(predictions.shape) == 3 and predictions.shape[2] > 5:
            print("[DEBUG] Processing as YOLOv8 output format")
            rows = predictions.shape[1]
            
            # Print sample detections for debugging
            for i in range(min(3, rows)):
                print(f"[DEBUG] Sample detection {i}: {predictions[0, i, :10]}")  # Print first 10 values
                
            for i in range(rows):
                row = predictions[0, i]
                
                if len(row) > 5:
                    # Extract confidence and class scores
                    if np.max(row[5:]) > conf_threshold:
                        # Standard YOLOv8 format: x, y, w, h, conf, class_scores...
                        x, y, w, h = row[0:4]
                        conf = row[4]
                        classes_scores = row[5:]
                        class_id = np.argmax(classes_scores)
                        
                        # Calculate absolute coordinates (assuming normalized 0-1 values)
                        # For center-based format (YOLO style)
                        left = int((x - w/2) * original_width)
                        top = int((y - h/2) * original_height)
                        width = int(w * original_width)
                        height = int(h * original_height)
                        
                        detections.append({
                            "class_id": int(class_id),
                            "confidence": float(conf),
                            "bbox": [left, top, width, height]
                        })
        
        # Approach 2: Alternative format where outputs might be split or structured differently
        elif len(predictions.shape) >= 2 and predictions.shape[-1] >= 4:
            print("[DEBUG] Processing as alternative output format")
            
            # Determine if we have box coordinates + objectness + class scores
            if predictions.shape[-1] == 5:  # x, y, w, h, objectness
                print("[DEBUG] Format appears to be [x, y, w, h, objectness]")
                for i in range(min(20, predictions.shape[0])):
                    box = predictions[i]
                    if box[4] > conf_threshold:
                        x, y, w, h = box[0:4]
                        # Assuming these are normalized coordinates
                        left = int(x * original_width)
                        top = int(y * original_height)
                        width = int(w * original_width)
                        height = int(h * original_height)
                        
                        detections.append({
                            "class_id": 0,  # Default class if no class info
                            "confidence": float(box[4]),
                            "bbox": [left, top, width, height]
                        })
            
            elif predictions.shape[-1] > 5:  # x, y, w, h, objectness, class_scores
                print("[DEBUG] Format appears to include class scores")
                for i in range(min(20, predictions.shape[0])):
                    box = predictions[i]
                    objectness = box[4]
                    if objectness > conf_threshold:
                        classes_scores = box[5:]
                        if len(classes_scores) > 0:
                            class_id = np.argmax(classes_scores)
                            class_score = classes_scores[class_id]
                            if class_score > conf_threshold:
                                x, y, w, h = box[0:4]
                                # Assuming these are normalized coordinates
                                left = int(x * original_width)
                                top = int(y * original_height)
                                width = int(w * original_width)
                                height = int(h * original_height)
                                
                                detections.append({
                                    "class_id": int(class_id),
                                    "confidence": float(objectness),
                                    "bbox": [left, top, width, height]
                                })
    
    except Exception as e:
        print(f"[ERROR] Error processing outputs: {e}")
        # As a fallback, try a direct approach with the first output
        predictions = outputs[0]
        print(f"[DEBUG] Fallback - using first output with shape {predictions.shape}")
        
        # Try to make sense of it based on shape
        if len(predictions.shape) == 2 and predictions.shape[1] >= 6:  # Likely detection data
            for i in range(predictions.shape[0]):
                if i < 10:  # Print first few rows for debugging
                    print(f"[DEBUG] Row {i}: {predictions[i, :10]}")
                    
                row = predictions[i]
                # Assuming standard YOLO format: x1, y1, x2, y2, conf, class_id
                try:
                    x1, y1, x2, y2, conf, class_id = row[:6]
                    if conf > conf_threshold:
                        # Convert to original image coordinates
                        left = int(x1 * original_width)
                        top = int(y1 * original_height)
                        width = int((x2 - x1) * original_width)
                        height = int((y2 - y1) * original_height)
                        
                        detections.append({
                            "class_id": int(class_id),
                            "confidence": float(conf),
                            "bbox": [left, top, width, height]
                        })
                except Exception as inner_e:
                    print(f"[ERROR] Error processing row {i}: {inner_e}")
    
    print(f"[INFO] Found {len(detections)} raw detections before NMS")
    
    # Apply non-max suppression if we have multiple detections
    if len(detections) > 0:
        try:
            boxes = np.array([d["bbox"] for d in detections])
            # Convert [x, y, w, h] to [x1, y1, x2, y2] for NMS
            boxes_xyxy = np.zeros((boxes.shape[0], 4))
            boxes_xyxy[:, 0] = boxes[:, 0]
            boxes_xyxy[:, 1] = boxes[:, 1]
            boxes_xyxy[:, 2] = boxes[:, 0] + boxes[:, 2]
            boxes_xyxy[:, 3] = boxes[:, 1] + boxes[:, 3]
            
            scores = np.array([d["confidence"] for d in detections])
            
            indices = cv2.dnn.NMSBoxes(
                boxes_xyxy.tolist(), 
                scores.tolist(), 
                conf_threshold, 
                iou_threshold
            )
            
            result = [detections[i] for i in indices]
            print(f"[INFO] After NMS: {len(result)} detections")
            return result
        except Exception as e:
            print(f"[ERROR] Error in NMS: {e}")
            # Return all detections if NMS fails
            return detections
    
    return detections

def draw_detection(image, detections, class_names=None):
    """Draw bounding boxes and labels on the image"""
    output_img = image.copy()
    
    for detection in detections:
        # Extract data
        x, y, w, h = detection["bbox"]
        confidence = detection["confidence"]
        class_id = detection["class_id"]
        
        # Ensure coordinates are within image bounds
        x = max(0, min(x, image.shape[1]-1))
        y = max(0, min(y, image.shape[0]-1))
        w = min(w, image.shape[1] - x)
        h = min(h, image.shape[0] - y)
        
        # Get class name if available, otherwise use class ID
        if class_names and class_id < len(class_names):
            label = f"{class_names[class_id]}: {confidence:.2f}"
        else:
            label = f"Class {class_id}: {confidence:.2f}"
        
        # Draw bounding box
        cv2.rectangle(output_img, (x, y), (x + w, y + h), (0, 255, 0), 2)
        
        # Draw label background (smaller for readability)
        text_size = cv2.getTextSize(label, cv2.FONT_HERSHEY_SIMPLEX, 0.5, 2)[0]
        cv2.rectangle(output_img, (x, y - 22), (x + text_size[0], y), (0, 255, 0), -1)
        
        # Draw label text
        cv2.putText(output_img, label, (x, y - 5), 
                    cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 0, 0), 1)
        
    return output_img

def run_detection(onnx_path, image_path, class_names=None, conf_threshold=0.25, iou_threshold=0.45):
    """Run full detection pipeline with debug information"""
    # Load model
    session = load_onnx_model(onnx_path)
    
    # Print model information
    print_model_info(session)
    
    # Process image
    input_img, original_img, original_shape = preprocess_image(image_path)
    
    # Get input details
    input_name = session.get_inputs()[0].name
    
    # Run inference
    print(f"[INFO] Running inference with input shape: {input_img.shape}")
    outputs = session.run(None, {input_name: input_img})
    
    # Process outputs
    detections = process_output(outputs, original_shape, 
                               conf_threshold=conf_threshold, 
                               iou_threshold=iou_threshold)
    
    # Draw detections on image
    result_img = draw_detection(original_img, detections, class_names)
    
    # Draw original image with a grid for debugging
    debug_img = original_img.copy()
    h, w = original_img.shape[:2]
    
    # Draw grid lines
    for x in range(0, w, 50):
        cv2.line(debug_img, (x, 0), (x, h), (0, 0, 255), 1)
        cv2.putText(debug_img, str(x), (x, 15), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 0, 255), 1)
    
    for y in range(0, h, 50):
        cv2.line(debug_img, (0, y), (w, y), (0, 0, 255), 1)
        cv2.putText(debug_img, str(y), (5, y), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 0, 255), 1)
    
    # Save debug image
    cv2.imwrite("detection_grid.jpg", debug_img)
    
    return result_img, detections, debug_img

if __name__ == "__main__":
    # Default to empty class names list - will use class IDs instead
    class_names = []
    
    if len(sys.argv) < 3:
        print("Usage: python detect.py <onnx_model_path> <image_path> [conf_threshold] [iou_threshold]")
        sys.exit(1)
    
    onnx_model_path = sys.argv[1]
    image_path = sys.argv[2]
    
    # Optional confidence and IoU thresholds
    conf_threshold = float(sys.argv[3]) if len(sys.argv) > 3 else 0.25
    iou_threshold = float(sys.argv[4]) if len(sys.argv) > 4 else 0.45
    
    print(f"[INFO] Processing image: {image_path}")
    print(f"[INFO] Using model: {onnx_model_path}")
    print(f"[INFO] Confidence threshold: {conf_threshold}")
    print(f"[INFO] IoU threshold: {iou_threshold}")
    
    # Run detection
    result_img, detections, debug_img = run_detection(
        onnx_model_path, 
        image_path, 
        class_names=class_names,
        conf_threshold=conf_threshold,
        iou_threshold=iou_threshold
    )
    
    # Save results
    cv2.imwrite("detection_result.jpg", result_img)
    
    print(f"[INFO] Detection complete. Found {len(detections)} objects.")
    print(f"[INFO] Results saved to detection_result.jpg")
    print(f"[INFO] Debug grid image saved to detection_grid.jpg")
    
    # Print detection details
    for i, detection in enumerate(detections):
        class_id = detection["class_id"]
        class_name = class_names[class_id] if class_id < len(class_names) else f"Class {class_id}"
        confidence = detection["confidence"]
        x, y, w, h = detection["bbox"]
        
        print(f"[DETECTION {i+1}] Class: {class_name}, Confidence: {confidence:.2f}")
        print(f"  Bounding Box: [x={x}, y={y}, width={w}, height={h}]")
    
    # Display the result (optional, comment out if running on a server without display)
    try:
        # Create comparison image (side by side original and detection)
        h1, w1 = original_img.shape[:2]
        h2, w2 = result_img.shape[:2]
        comparison = np.zeros((max(h1, h2), w1 + w2, 3), dtype=np.uint8)
        comparison[:h1, :w1] = debug_img
        comparison[:h2, w1:w1+w2] = result_img
        
        # Draw dividing line
        cv2.line(comparison, (w1, 0), (w1, max(h1, h2)), (255, 255, 255), 2)
        
        # Add labels
        cv2.putText(comparison, "Original with grid", (10, 30), 
                    cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 255, 255), 2)
        cv2.putText(comparison, "Detections", (w1 + 10, 30), 
                    cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 255, 255), 2)
        
        # Save comparison image
        cv2.imwrite("detection_comparison.jpg", comparison)
        print(f"[INFO] Comparison image saved to detection_comparison.jpg")
        
        # Show result
        cv2.imshow("Detection Result", comparison)
        cv2.waitKey(0)
        cv2.destroyAllWindows()
    except Exception as e:
        print(f"[INFO] Could not display image: {e}")

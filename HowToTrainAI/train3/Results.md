# YOLO Model Training Results

After training the YOLO model on the custom dataset, here are the key outputs and performance metrics:

## Performance Metrics

### F1 Score Curve
This graph shows the progression of the F1-score throughout training.
![F1 Score Curve](F1_curve.png)

### Precision-Recall Curve
Indicates the balance between precision and recall during training.
![Precision-Recall Curve](PR_curve.png)

### Precision and Recall Curves
These graphs illustrate how precision and recall evolved over the training process.
- **Precision Curve:**
  ![Precision Curve](P_curve.png)
- **Recall Curve:**
  ![Recall Curve](R_curve.png)

### Confusion Matrix
The confusion matrix provides insights into classification performance.
- **Raw Confusion Matrix:**
  ![Confusion Matrix](confusion_matrix.png)
- **Normalized Confusion Matrix:**
  ![Normalized Confusion Matrix](confusion_matrix_normalized.png)

## Training Batch Samples
Here are some sample images used in training, showing how the model learned from the dataset:
- ![Train Batch 0](train_batch0.jpg)
- ![Train Batch 1](train_batch1.jpg)
- ![Train Batch 2](train_batch2.jpg)

## Validation Results
Comparison of ground truth labels and model predictions:
- **Validation Labels:**
  - ![Validation Batch 0 Labels](val_batch0_labels.jpg)
  - ![Validation Batch 1 Labels](val_batch1_labels.jpg)
  - ![Validation Batch 2 Labels](val_batch2_labels.jpg)
- **Model Predictions:**
  - ![Validation Batch 0 Predictions](val_batch0_pred.jpg)
  - ![Validation Batch 1 Predictions](val_batch1_pred.jpg)
  - ![Validation Batch 2 Predictions](val_batch2_pred.jpg)

## Overall Training Summary
The summary of training performance and final results:
- **Results Overview:**
  ![Results Overview](results.png)
- **Weights Directory:** The trained model weights are saved in the `train3/weights/` folder for future inference.

These outputs provide insights into the effectiveness of the model and areas for further improvement.


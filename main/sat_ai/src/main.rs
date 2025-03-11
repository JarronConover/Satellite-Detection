use image::{GenericImageView, DynamicImage};
use std::path::Path;
use ndarray::Array;

const IMAGE_PATH: &str = "../../../AIwaterfall/assets/lb_3.png";
//const MODEL_PATH: &str = "best.onnx";
const WINDOW_SIZE: (u32, u32) = (640, 640); // this is based on the model input size originally
const STEP_SIZE: u32 = 320; // this is alot of overlap!! -- adjust as needed

fn image_to_tensor(img: &DynamicImage) -> Array<f32, ndarray::Dim<[usize; 4]>> {
    let (width, height) = img.dimensions();
    let mut input = Array::zeros((1, 3, height as usize, width as usize));

    for pixel in img.pixels() {
        let x = pixel.0 as usize;
        let y = pixel.1 as usize;
        let [r, g, b, _] = pixel.2.0;
        input[[0, 0, y, x]] = (r as f32) / 255.;
        input[[0, 1, y, x]] = (g as f32) / 255.;
        input[[0, 2, y, x]] = (b as f32) / 255.;
    }

    return input
}

#[derive(Debug, Clone, PartialEq)]
struct DetectedObject {
    x: u32,
    y: u32,
    width: u32,
    height: u32,
    confidence: f32,
    class_id: usize,
}

fn sliding_window(image: &DynamicImage, window_size: (u32, u32), step_size: u32) -> Vec<DetectedObject> {
    // Get image dimensions to calculate sliding window bounds
    let (img_width, img_height) = image.dimensions();
    let (win_w, win_h) = window_size;

    // setup a vector to store detected objects
    let mut detected_objects = Vec::new();

    // Slide the window across the image 
    for y in (0..=img_height.saturating_sub(win_h)).step_by(step_size as usize) {
        for x in (0..=img_width.saturating_sub(win_w)).step_by(step_size as usize) {
            let cropped = image.crop_imm(x, y, win_w, win_h);

            // Convert cropped image to tensor format
            let input_tensor = image_to_tensor(&cropped);

            // Run YOLO model inference
            let detections = run_yolo_model(input_tensor);

            // Adjust coordinates relative to full image and store results
            for det in detections {
                detected_objects.push(DetectedObject {
                    x: x + det.x,
                    y: y + det.y,
                    width: det.width,
                    height: det.height,
                    confidence: det.confidence,
                    class_id: det.class_id,
                });
            }
        }
    }

    detected_objects
}

fn run_yolo_model(_input_tensor: Array<f32, ndarray::Dim<[usize; 4]>>) -> Vec<DetectedObject> {
    // Placeholder for running YOLO model
    // This function should return a list of detected objects
    // with their coordinates, confidence, and class ID
    // For now, we will return an empty list
    Vec::new()
}

fn main() {
    let image_path = Path::new(IMAGE_PATH);
    let img = image::open(image_path).expect("Failed to open image");

    let window_size = WINDOW_SIZE;
    let step_size = STEP_SIZE; // Adjust for overlap

    // return a list of cropped images in tensor format
    let detections = sliding_window(&img, window_size, step_size);
    for det in detections {
        println!("{:?}", det);
    }
}


/*

fn main() -> Result<(), Box<dyn std::error::Error>> {
    // Path to the YOLO model
    let model_path = "best.onnx";
    
    println!("Loading YOLO model from: {}", model_path);
    
    // Create an environment with the default logger
    let environment = Arc::new(
        Environment::builder()
            .with_name("yolo_environment")
            .build()?
    );
    
    // Create a session using SessionBuilder
    let session = SessionBuilder::new(&environment)?
        .with_optimization_level(GraphOptimizationLevel::Level1)?
        .with_model_from_file(model_path)?;
    
    println!("Model loaded successfully!");
    
    // Print model information
    println!("Model inputs: {}", session.inputs.len());
    for (i, input) in session.inputs.iter().enumerate() {
        println!("Input #{}: Name: {}, Shape: {:?}, Type: {:?}", 
                 i, input.name, input.dimensions, input.input_type);
    }
    
    println!("Model outputs: {}", session.outputs.len());
    for (i, output) in session.outputs.iter().enumerate() {
        println!("Output #{}: Name: {}, Shape: {:?}, Type: {:?}", 
                 i, output.name, output.dimensions, output.output_type);
    }
    
    Ok(())
}

*/

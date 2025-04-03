import ultralitics as ul
import requests 
import base64

model = ul.Model('best.onnx')
model.load()

#TODO
    # get lat and long of sf bay image 
    # trig for image lat and long
    # get width and height of ship from pixels
    # get individual ship images

#send a post request to our backend server with the data we want to show
def sendData(data):
    url = 'http://localhost:5000/satdump'

    data = {'Classification': "Merchant",
            'latitude': 37.7749, # delta from satellite image
            'longitude': -122.4194, # delta from satellite image
            'width': '100', # width of ship calculated from pixels  
            'height': '100', # height of ship calculated from pixels
            'image': "base64Encode", # base 64 encoded image
            'confidence': '0.9', # confidence of the model of classification
            }


    response = requests.post(url, json=data)
    return response.json()

#base 64 encode the image to send to the backend to display on frontend
def make_Image():
    # Read the image and encode it in Base64
    with open("small_image.png", "rb") as img_file:
        base64_image = base64.b64encode(img_file.read()).decode("utf-8")
    return base64_image


def predict():
    data = ul.request.get_json
    prediction = model.predict(data)
    return ul.jsonify(prediction)

if __name__ == '__main__':
    print('Running server...')
    # run detection model
    objects = predict()
    # send datat to backend server
    sendData(objects)



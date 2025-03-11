# Base program

## introduction

This is the base program for the satilite in the project, for now it takes in an image and outputs the data of the image that it detected. Fairly simple for now.

## Limitations

there are a few limitations to this project because our goal is to make this run on a small cube sattilite. This means that we need to be very careful with how this runs. there isn't an easy "unplug and replug" option for this.

simarlarly there is a very small power constraint that we need to keep in mind. This means that we need to be very careful with how we use the power. MAXIMUM efficiency is key.

## problems 

for now our model is trained on 640,640 pixels and so that is what it like although our images are much much bigger then this. This means that we need to resize the image to 640,640 pixels before we can run the model on it. How we do this is still up for debate. resizing this image to 640,640 we will loose much of our fine detail. this is no good because some times the ships we are detecting are just a few pixels accross. for now I have settled with a simple sliding window approach. This is not ideal but it is a start. i'm sure we're going to have to approch this from both angles for max efficiency. 

for now I have just implemented the sliding window approach and its a bit slow...

most likley going to need to run this in parallel on the GPU.



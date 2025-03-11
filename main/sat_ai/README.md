# Writing the Sat Code

## Introduction

For this sprint I wanted to focus on building out the base software that the satilite will be running in orbit. Rather get the base mvp of getting the jetson board to translate an image from the camera into a usable classification format. I havn't even been able to get the board yet and so its my goal to be able to get a couple of different projects running inorder to run a "test" suite of code inorder to see the best power efficient way to run the different models. 

Originaly our goal was to use a memory safe language like rust to build out the code for the satilite. However, there is not a lot of tensorRT suport for something like rust. This is one of the main things that I woul like to test. Especially since I dont have much experince with c++. So I mostly want to compair and contrast efficiency of the two languages with their "respective" models.

## The Plan

The goal of the project is to use the jetson board at under 14 watts which is fairly low. If we can acheive this we may have a really nice product.

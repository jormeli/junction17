import os
import cv2
import sys
import numpy as np
from skimage import io
import dlib
from PIL import Image, ImageDraw

face_detector = dlib.get_frontal_face_detector()
face_pose_predictor = dlib.shape_predictor('shape_predictor_68_face_landmarks.dat')

def get_faces_in_frame(frame):
    faces = face_detector(frame)
    bboxes = [(f.left(), f.top(), f.right(), f.bottom()) for f in faces]

    

    return bboxes



#win = dlib.image_window()

#img = np.array(Image.open('./group.jpg'))
img = Image.open('./sale.jpg').convert('RGB')
draw = ImageDraw.Draw(img)

dets = face_detector(np.array(img), 0)
print('%d faces' % len(dets))

for d in dets:
#    crop = img[d.top():d.bottom(), d.left():d.right(), :]
    draw.rectangle(((d.left(), d.top()), (d.right(), d.bottom())), outline="red")
    shape = face_pose_predictor(np.array(img), d)
    for i in range(shape.num_parts):
        point = shape.part(i)
        draw.point(((point.x, point.y )), fill="green")

img.save('dets.png')

"""Performs face alignment and calculates L2 distance between the embeddings of images."""

# MIT License
# 
# Copyright (c) 2016 David Sandberg
# 
# Permission is hereby granted, free of charge, to any person obtaining a copy
# of this software and associated documentation files (the "Software"), to deal
# in the Software without restriction, including without limitation the rights
# to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
# copies of the Software, and to permit persons to whom the Software is
# furnished to do so, subject to the following conditions:
# 
# The above copyright notice and this permission notice shall be included in all
# copies or substantial portions of the Software.
# 
# THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
# IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
# FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
# AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
# LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
# OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
# SOFTWARE.

from __future__ import absolute_import
from __future__ import division
from __future__ import print_function

from scipy import misc
import tensorflow as tf
import cv2
import numpy as np
from math import sqrt
import sys
from datetime import datetime
import os
import argparse
import facenet
from facedata import FaceData, Spotting
import align.detect_face
import time
import skvideo.io
import skimage.io
import skimage.draw
from PIL import Image

face_data = FaceData()
all_items = face_data.getall()
largest_id = max([item.dbid for item in all_items])

def main(args):

    batches = 10
    b_size = 16
    cap = skvideo.io.VideoCapture('../crowd2.mp4')
    for i in range(0):
        _,_ = cap.read()

    embs = []
    with tf.Graph().as_default():
        with tf.Session() as sess:
            # Load the model
            facenet.load_model(args.model)
            for b in range(batches):
                print('Batch %d of %d' % (b, batches))
                frames = []
                for i in range(b_size):
                    ret, frame = cap.read()
                    if i < 0:
                        continue
                    if not ret:
                        continue

                    frame_np = np.array(frame)
                    print(frame_np.shape)
                    frames.append(frame_np)

                frames_np = np.stack(frames)
                print(frames_np.shape)
                images, crops = detect_faces(b, frames, args.image_size, args.margin, args.gpu_memory_fraction)
                faces_per_frame = [len(i) for i in images]
                images = [i for i in images if len(i) > 0]
                crops = [i for i in crops if len(i) > 0]

                if len(images) < 1:
                    continue

                images_np = np.squeeze(np.concatenate(images))
                crops_np = np.squeeze(np.concatenate(crops))

                print('%d faces' % (images_np.shape[0]))

                # Get input and output tensors
                images_placeholder = tf.get_default_graph().get_tensor_by_name("input:0")
                embeddings = tf.get_default_graph().get_tensor_by_name("embeddings:0")
                phase_train_placeholder = tf.get_default_graph().get_tensor_by_name("phase_train:0")

                # Run forward pass to calculate embeddings
                feed_dict = { images_placeholder: images_np, phase_train_placeholder:False }
                print('Running model...')
                start = time.time()
                emb = sess.run(embeddings, feed_dict=feed_dict)
                end = time.time()
                print(crops_np.shape)
                for z in range(emb.shape[0]):
                    e = emb[z]
                    largest_id += 1
                    dbid = largest_id
                    crop = crops_np[z].astype(np.uint8)
                    timedelta = (b * b_size)/args.fps
                    spotted_at = datetime.fromtimestamp(args.starting_time + \
                                                        int(time.time()))

                    spot = Spotting(dbid, e, datetime.now(), spotted_at,
                                    Image.fromarray(crop), args.location)
                    face_data.insert(spot)
                print('Execution time: %f ms' % ((end - start) * 1000.))
                embs.append(emb)

    cap.release()


def load_models(gpu_memory_fraction):
    print('Creating networks and loading parameters')
    with tf.Graph().as_default():
        gpu_options = tf.GPUOptions(per_process_gpu_memory_fraction=gpu_memory_fraction)
        sess = tf.Session(config=tf.ConfigProto(gpu_options=gpu_options, log_device_placement=False))
        with sess.as_default():
            pnet, rnet, onet = align.detect_face.create_mtcnn(sess, None)

    return pnet, rnet, onet


def detect_faces(batch, frames_list, image_size, margin, gpu_memory_fraction):
    pnet, rnet, onet = load_models(1.0)
    minsize = 20 # minimum size of face
    threshold = [ 0.6, 0.7, 0.7 ]  # three steps's threshold
    factor = 0.709 # scale factor
    margin = 0

    faces = []
    crops = []
    for f in range(len(frames_list)):
        faces.append([])
        crops.append([])
        frame = frames_list[f]
        frame_bb = np.copy(frame)
        img_size = np.asarray(frame.shape)[0:2]
        skimage.io.imsave('./frame.png', frame)
        bounding_boxes, _ = align.detect_face.detect_face(frame, minsize, pnet, rnet, onet, threshold, factor)
        print(bounding_boxes.shape)
        for i in range(bounding_boxes.shape[0]):
            det = np.squeeze(bounding_boxes[i,0:4])
            bb = np.zeros(4, dtype=np.int32)
#            frame_bb[skimage.draw.rectangle((bb[1],bb[0]), (bb[3],bb[2]))] = 255.
            bb[0] = np.maximum(det[0]-margin/2, 0)
            bb[1] = np.maximum(det[1]-margin/2, 0)
            bb[2] = np.minimum(det[2]+margin/2, img_size[1]-1)
            bb[3] = np.minimum(det[3]+margin/2, img_size[0]-1)
            frame_bb[bb[1]:bb[3], bb[0], :] = 255.
            frame_bb[bb[1]:bb[3], bb[2], :] = 255.
            frame_bb[bb[1], bb[0]:bb[2], :] = 255.
            frame_bb[bb[3], bb[0]:bb[2], :] = 255.
#            circle = skimage.draw.circle(center_y, center_x, rad)
#            frame_bb[circle] = 255.0
            cropped = frame[bb[1]:bb[3],bb[0]:bb[2],:]
            aligned = misc.imresize(cropped, (image_size, image_size), interp='bilinear')
            crops[f].append(aligned)
            prewhitened = facenet.prewhiten(aligned)
            faces[f].append(prewhitened)

        skimage.io.imsave('./frames/%03d_%03d.png' % (batch, f), frame_bb)

        if len(faces[f]) > 0:
            faces[f] = np.stack(faces[f])
            crops[f] = np.stack(crops[f])

    return faces, crops

def parse_arguments(argv):
    parser = argparse.ArgumentParser()

    parser.add_argument('model', type=str, 
        help='Could be either a directory containing the meta_file and ckpt_file or a model protobuf (.pb) file')
    parser.add_argument('--image_size', type=int,
        help='Image size (height, width) in pixels.', default=160)
    parser.add_argument('--margin', type=int,
        help='Margin for the crop around the bounding box (height, width) in pixels.', default=44)
    parser.add_argument('--gpu_memory_fraction', type=float,
        help='Upper bound on the amount of GPU memory that will be used by the process.', default=1.0)
    parser.add_argument('--starting_time', type=int,
        help='Timestamp of the starting time of the input video', default=time.time())
    parser.add_argument('--location', type=str,
        help='Location of the camera', default='entrance')
    parser.add_argument('--fps', type=float,
        help='Video FPS', default=30.0)
    return parser.parse_args(argv)

if __name__ == '__main__':
    main(parse_arguments(sys.argv[1:]))

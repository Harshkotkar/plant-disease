from PIL import Image
import numpy as np

def load_and_preprocess_image(image, target_size=(256, 256)):
    img = Image.open(image)
    img = img.resize(target_size)
    img_array = np.array(img) / 255.0
    img_array = np.expand_dims(img_array, axis=0)
    return img_array

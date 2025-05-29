# from flask import Flask, request, render_template
# import numpy as np
# from tensorflow.keras.models import load_model
# from PIL import Image
# import json
# import os

# app = Flask(__name__)

# # Load the trained model
# model = load_model(r'C:\Users\HP\Desktop\project02\model\model.h5')
# # Load class indices from JSON file
# with open('class_indices.json', 'r') as f:
#     class_indices = json.load(f)

# # Reverse the dictionary for index-to-class mapping (ensure keys are integers)
# class_indices = {int(k): v for k, v in class_indices.items()}

# # Function to Load and Preprocess Image
# def load_and_preprocess_image(image_path, target_size=(256, 256)):
#     img = Image.open(image_path)
#     img = img.resize(target_size)
#     img_array = np.array(img) / 255.0
#     img_array = np.expand_dims(img_array, axis=0)  # Add batch dimension
#     return img_array

# # Home Route
# @app.route("/", methods=['GET', 'POST'])
# def home():
#     if request.method == 'POST':
#         file = request.files['file']
#         if file:
#             # Save the uploaded file
#             image_path = os.path.join('static', file.filename)
#             file.save(image_path)

#             # Prediction
#             img_array = load_and_preprocess_image(image_path)
#             prediction = model.predict(img_array)

#             # Handle unknown classes safely
#             predicted_index = np.argmax(prediction)
#             predicted_class = class_indices.get(predicted_index, "Unknown Class")

#             # Confidence Score
#             confidence_score = np.max(prediction) * 100

#             return render_template('result.html', 
#                                    image_path=image_path, 
#                                    prediction=predicted_class,
#                                    confidence=round(confidence_score, 2))
#     return render_template('index.html')

# # Run the app
# if __name__ == "__main__":
#     app.run(debug=True)

from flask import Flask, request, jsonify
import numpy as np
from tensorflow.keras.models import load_model
from PIL import Image
import json
import os

app = Flask(__name__)

# Load the trained model
model = load_model(r'C:\Users\HP\Desktop\project02\model\model.h5')

# Load class indices from JSON file
with open('class_indices.json', 'r') as f:
    class_indices = json.load(f)

# Reverse the dictionary for index-to-class mapping (ensure keys are integers)
class_indices = {int(k): v for k, v in class_indices.items()}

# Function to Load and Preprocess Image
def load_and_preprocess_image(image_path, target_size=(256, 256)):
    img = Image.open(image_path)
    img = img.resize(target_size)
    img_array = np.array(img) / 255.0
    img_array = np.expand_dims(img_array, axis=0)  # Add batch dimension
    return img_array

# Prediction Route
@app.route("/predict", methods=['POST'])
def predict():
    if 'file' not in request.files:
        return jsonify({"error": "No file uploaded."}), 400

    file = request.files['file']
    if file:
        # Save the uploaded file
        image_path = os.path.join('static', file.filename)
        file.save(image_path)

        # Prediction
        img_array = load_and_preprocess_image(image_path)
        prediction = model.predict(img_array)

        # Handle unknown classes safely
        predicted_index = int(np.argmax(prediction))  # Ensure integer type
        predicted_class = class_indices.get(predicted_index, "Unknown Class")

        # Confidence Score
        confidence_score = float(np.max(prediction) * 100)  # Ensure float type

        return jsonify({
            "image_path": image_path,
            "prediction": predicted_class,
            "confidence": round(confidence_score, 2)
        })

    return jsonify({"error": "Invalid file."}), 400

# Run the app
if __name__ == "__main__":
    app.run(debug=True)

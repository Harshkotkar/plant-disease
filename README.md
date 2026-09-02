# Plant Disease Detection & AI Advisory System

A full-stack machine learning web application that identifies plant diseases from leaf images using a Convolutional Neural Network (CNN) and provides localized, multilingual treatment recommendations using AI.

---

## Overview

Plant diseases significantly impact agricultural productivity. This project provides an accessible tool for farmers and agronomists to:
1. **Detect Crop Diseases**: Upload leaf photos to classify diseases across 14 crop species (38 classes) with high accuracy.
2. **Incorporate Weather Context**: Use the farm's location to fetch 10-day historical climate data (temperature, humidity, wind) to understand pathogen growth conditions.
3. **Generate Actionable Advisory**: Use generative AI to deliver practical advice on root causes, prevention, organic remedies, and chemical pesticide options in multiple languages.

---

## Key Features

- **Leaf Disease Classification**: Identifies 38 distinct plant conditions (healthy and diseased) using a custom CNN deep learning model.
- **Confidence Score**: Displays diagnosis probability for each classification result.
- **Location-Based Weather Analysis**: Automatically looks up regional coordinates via OpenStreetMap and retrieves historical climate data.
- **Context-Aware AI Advisory**: Generates treatment guidelines tailored to the detected disease and local microclimate.
- **Multilingual Support**: Provides advisory in English, Hindi, Marathi, Bengali, Spanish, French, and German.
- **Modern User Interface**: Built with Next.js and Tailwind CSS featuring drag-and-drop image upload, instant image preview, and collapsible result cards.

---

## Tech Stack

### Frontend
- **Framework**: Next.js 15 (React 19)
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI primitives, Lucide Icons

### Backend
- **Framework**: Flask (Python REST API)
- **Machine Learning**: TensorFlow / Keras, NumPy, Pillow

### External APIs
- **Generative AI**: Google Gemini API / OpenAI API
- **Geocoding**: OpenStreetMap Nominatim API
- **Weather Data**: WorldWeatherOnline API

---

## How It Works

```
[ User Uploads Leaf Image + Enters Location ]
                      │
                      ▼
            [ Next.js Frontend ]
                      │
                      ├──────────────────────────┐
                      ▼                          ▼
            [ Flask Backend API ]       [ OpenStreetMap API ]
                      │                          │
            [ Custom CNN Model ]        [ Lat/Lon Coordinates ]
                      │                          │
           (Predicts Disease & %)                ▼
                      │                 [ Weather API Data ]
                      │                 (10-Day Avg Weather)
                      │                          │
                      └───────────┬──────────────┘
                                  │
                                  ▼
                     [ Generative AI LLM ]
                   (Gemini / OpenAI Model)
                                  │
                                  ▼
               [ Diagnosis & Treatment Report ]
             (Causes, Prevention, Pesticides)
```

---

## Machine Learning Model

- **Dataset**: Kaggle PlantVillage Dataset (54,305 leaf images across 38 classes).
- **Architecture**: Sequential Convolutional Neural Network (CNN)
  - 3 Convolutional Blocks (`Conv2D` + `BatchNormalization` + `MaxPooling2D`)
  - Fully Connected Layers (`Dense 256` -> `Dropout 0.2` -> `Dense 126` -> `Dropout 0.2` -> `Dense 38 Softmax`)
- **Input Size**: `256 x 256 x 3` (Inference) / `222 x 222 x 3` (Training)
- **Validation Accuracy**: ~88.3%
- **Training Accuracy**: ~98.3%
- **Model File**: Saved Keras model stored at `server/model/model.h5`.

---

## Supported Crops & Diseases (38 Classes)

| Crop | Supported Conditions |
| :--- | :--- |
| **Apple** | Apple Scab, Black Rot, Cedar Apple Rust, Healthy |
| **Blueberry** | Healthy |
| **Cherry** | Powdery Mildew, Healthy |
| **Corn (Maize)** | Cercospora Leaf Spot, Common Rust, Northern Leaf Blight, Healthy |
| **Grape** | Black Rot, Esca (Black Measles), Leaf Blight, Healthy |
| **Orange** | Huanglongbing (Citrus Greening) |
| **Peach** | Bacterial Spot, Healthy |
| **Pepper (Bell)** | Bacterial Spot, Healthy |
| **Potato** | Early Blight, Late Blight, Healthy |
| **Raspberry** | Healthy |
| **Soybean** | Healthy |
| **Squash** | Powdery Mildew |
| **Strawberry** | Leaf Scorch, Healthy |
| **Tomato** | Bacterial Spot, Early Blight, Late Blight, Leaf Mold, Septoria Leaf Spot, Spider Mites, Target Spot, Tomato Yellow Leaf Curl Virus, Tomato Mosaic Virus, Healthy |

---

## Project Structure

```plaintext
plant-disease/
├── package.json              # Frontend dependencies and scripts
├── next.config.mjs           # Next.js configuration
├── tailwind.config.js        # Tailwind CSS configuration
│
├── server/                   # Python Backend
│   ├── app.py                # Flask API server (/predict endpoint)
│   ├── class_indices.json    # 38-class index-to-name mapping
│   ├── requirements.txt      # Python dependencies
│   ├── openai.py             # AI advisory helper module
│   ├── model/
│   │   └── model.h5          # Trained CNN model file
│   └── Plant_Disease_Prediction_CNN_Image_Classifier.ipynb # Training notebook
│
├── src/                      # Next.js Frontend Source
│   ├── app/
│   │   ├── page.js           # Home page
│   │   ├── layout.js         # Root layout
│   │   └── components/
│   │       ├── Hero.jsx      # Main application container
│   │       ├── UserInput.jsx # Image upload & location input
│   │       ├── Prediction.jsx# Results and treatment display
│   │       └── HowItWorks.jsx# Step-by-step guide
│   └── components/ui/        # Reusable UI elements (cards, buttons, accordion)
└── README.md
```

---

## Getting Started (Local Setup)

### Prerequisites
- Node.js (v18 or higher)
- Python (3.9 to 3.11)
- Git

---

### Step 1: Start the Backend Server

1. Open a terminal and navigate to the `server` folder:
   ```bash
   cd server
   ```

2. Create and activate a Python virtual environment:
   ```bash
   # Windows
   python -m venv env
   .\env\Scripts\activate

   # macOS / Linux
   python3 -m venv env
   source env/bin/activate
   ```

3. Install required Python packages:
   ```bash
   pip install -r requirements.txt
   ```

4. Run the Flask backend:
   ```bash
   python app.py
   ```
   *The backend will run on `http://127.0.0.1:5000`.*

---

### Step 2: Start the Frontend Application

1. Open a new terminal and navigate to the project root directory:
   ```bash
   cd plant-disease
   ```

2. Install Node.js dependencies:
   ```bash
   npm install
   ```

3. Start the Next.js development server:
   ```bash
   npm run dev
   ```

4. Open your web browser and go to:
   ```
   http://localhost:3000
   ```

---

## API Endpoints

### Predict Disease
- **Endpoint**: `POST /predict`
- **Content-Type**: `multipart/form-data`
- **Body**: `file` (Image file: JPG, PNG)

**Example Response**:
```json
{
  "image_path": "static/sample_leaf.jpg",
  "prediction": "Tomato___Late_blight",
  "confidence": 98.42
}
```

---

## License

This project is licensed under the MIT License.

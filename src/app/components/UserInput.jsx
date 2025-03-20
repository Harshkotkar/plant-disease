"use client"

import { useEffect, useState } from "react"
import { Upload, MapPin } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function UserInput({ setUserData, setFile, file }) {
 
  const [preview, setPreview] = useState(null)
  const [placeLocation, setPlaceLocation] = useState("");
  const [diseaseName, setDiseaseName] = useState("");

 
  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0] || null
    setFile(selectedFile)

    if (selectedFile) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setPreview(e.target?.result)
      }
      reader.readAsDataURL(selectedFile)
    } else {
      setPreview(null)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    const droppedFile = e.dataTransfer.files[0]
    setFile(droppedFile)

    if (droppedFile) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setPreview(e.target?.result)
      }
      reader.readAsDataURL(droppedFile)
    }
  }

  const handleDragOver = (e) => {
    e.preventDefault()
  }


  const handleAnalyze = () => {
    const formData = new FormData();
    formData.append("file", file);

    // Step 1: Plant Analysis
    fetch("http://127.0.0.1:5000/predict", {
        method: "POST",
        body: formData
    })
        .then(response => response.json())
        .then(data => {
            console.log("Plant Analysis Data:", data);
            setDiseaseName(data.prediction);
            console.log("Detected Disease:", diseaseName);

            // Step 2: Get Coordinates for the Location
            return fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(placeLocation)}&format=json`);
        })
        .then(response => response.json())
        .then(locationData => {
            if (!locationData || locationData.length === 0) {
                throw new Error("Location not found");
            }

            const { lat, lon } = locationData[0];
            console.log(`Coordinates for ${placeLocation}:`, { lat, lon });

            // Step 3: Fetch Weather Data (Using Coordinates)
            const currentDate = new Date().toISOString().split('T')[0];
            const pastDate = new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

            return fetch(`https://api.worldweatheronline.com/premium/v1/past-weather.ashx?key=d2af227ed68348f99de201856251603&q=${lat},${lon}&date=${pastDate}&enddate=${currentDate}&format=json`);
        })
        .then(response => response.json())
        .then(weatherData => {
            if (!weatherData?.data?.weather) {
                throw new Error("Weather data not found for the given coordinates.");
            }

            console.log("Weather Data for the Past 10 Days:", weatherData);

            // Step 4: Calculate Average Values for the Past 10 Days
            const avgData = weatherData.data.weather.reduce((acc, day) => {
                acc.tempMax += parseFloat(day.maxtempC);
                acc.tempMin += parseFloat(day.mintempC);
                acc.humidity += parseFloat(day.hourly.reduce((sum, hour) => sum + parseFloat(hour.humidity), 0) / day.hourly.length);
                acc.windSpeed += parseFloat(day.hourly.reduce((sum, hour) => sum + parseFloat(hour.windspeedKmph), 0) / day.hourly.length);
                return acc;
            }, { tempMax: 0, tempMin: 0, humidity: 0, windSpeed: 0 });

            const totalDays = weatherData.data.weather.length;
            const averagedData = {
                avgTempMax: (avgData.tempMax / totalDays).toFixed(2),
                avgTempMin: (avgData.tempMin / totalDays).toFixed(2),
                avgHumidity: (avgData.humidity / totalDays).toFixed(2),
                avgWindSpeed: (avgData.windSpeed / totalDays).toFixed(2)
            };

            console.log("Averaged Weather Data:", averagedData);
            // Step 5: Call Gemini API for Plant Disease Analysis
            return analyzePlantDisease(
                placeLocation,
                averagedData.avgHumidity,
                averagedData.avgTempMax,
                averagedData.avgTempMin,
                diseaseName
            );
        })
        .then(analysisResult => {
            console.log("Gemini Analysis Result:", analysisResult);
            setUserData(analysisResult);
        })
        .catch(error => console.error("Error in the process:", error));
};

const analyzePlantDisease = async (placeLocation, avgHumidity, avgTempMax, avgTempMin, diseaseName) => {
  console.log("Analyzing plant disease for location:", placeLocation);
  const apiKey = "AIzaSyBWEhilw2TATGtVaBxVEDA5HlObyyJKtmQ";
  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

  const prompt = `
  Analyze the given environmental data and plant disease information to provide insights on the disease's cause, prevention methods, and treatment options.

  Input Details:
  - Location Name: ${placeLocation}
  - Average Humidity: ${avgHumidity}%
  - Average Maximum Temperature: ${avgTempMax}°C
  - Average Minimum Temperature: ${avgTempMin}°C
  - Plant Disease Name: ${diseaseName}

  **Output Format (in JSON, without markdown formatting):**
  {
    "diseaseName": "<Disease Name>",
    "cause": "<Detailed cause of the disease>",
    "prevention": "<Prevention method>",
    "treatment": "<Treatment method>",
    "location": "<location name from prompt>"
  }

  Ensure the JSON is valid and does not include markdown code block markers like \`\`\`.
  `;

  const requestBody = {
      contents: [
          {
              parts: [{ text: prompt }]
          }
      ]
  };

  try {
      const response = await fetch(apiUrl, {
          method: "POST",
          headers: {
              "Content-Type": "application/json"
          },
          body: JSON.stringify(requestBody)
      });

      const data = await response.json();

      // Extract text response and clean unnecessary characters
      const jsonString = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

      // Remove potential backticks and code block markers
      const cleanJsonString = jsonString
          .replace(/```json/g, '') // Removes ```json
          .replace(/```/g, '')     // Removes remaining ```
          .trim();

      const parsedData = JSON.parse(cleanJsonString);

      console.log("Parsed JSON Data:", parsedData);
      return parsedData;
  } catch (error) {
      console.error("Error in fetching data:", error);
  }
};

 

  return (
    <div className="h-auto   flex items-start justify-center p-4">
      <div className="w-full">
        <div className="mb-6">
          <h1 className="text-5xl font-bold text-green-800 mb-2">Plant Disease Prediction</h1>
          <p className="text-gray-600 text-lg">
            Get instant diagnosis for your plant's health issues. Upload an image of your diseased plant, provide your
            location, and receive professional recommendations for treatment.
          </p>
        </div>

        <Card className="shadow-lg border-0 rounded-3xl overflow-hidden">
          <CardContent className="p-6">
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-medium mb-2">Upload Plant Image</h2>
                <div
                  className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-colors
                    ${preview ? "border-green-500 bg-green-50" : "border-green-200 hover:border-green-400"}`}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onClick={() => document.getElementById("file-upload")?.click()}
                >
                  {preview ? (
                    <div className="flex flex-col items-center">
                      <img
                        src={preview || "/placeholder.svg"}
                        alt="Plant preview"
                        className="max-h-40 max-w-full mb-2 rounded-lg"
                      />
                      <p className="text-sm text-green-600">Click to change image</p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center">
                      <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-2">
                        <Upload className="h-6 w-6 text-green-600" />
                      </div>
                      <p className="text-gray-500">Drag and drop your image here or click to browse</p>
                    </div>
                  )}
                  <input type="file" id="file-upload" className="hidden" accept="image/*" onChange={handleFileChange} />
                </div>
              </div>

              <div>
                <h2 className="text-lg font-medium mb-2">Your Location</h2>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <Input
                    placeholder="Enter your location"
                    className="pl-10 py-6 rounded-full border-gray-200"
                    value={placeLocation}
                    onChange={(e) => setPlaceLocation(e.target.value)}
                  />
                </div>
              </div>

              <Button
                className="w-full py-6 rounded-full text-base font-medium bg-green-600 hover:bg-green-700"
                disabled={!file || !placeLocation}
                onClick={handleAnalyze}
              >
                Analyze Plant
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
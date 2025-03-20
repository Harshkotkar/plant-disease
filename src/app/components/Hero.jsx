"use client"

import React, { useState } from 'react'
import UserInput from './UserInput'
import Prediction from './Prediction'

const Hero = () => {
  const [userData, setUserData] = useState({});
  const [file, setFile] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [placeLocation, setPlaceLocation] = useState("");
  const [diseaseName, setDiseaseName] = useState("");

  const handleLanguageChange = (language) => {
    setSelectedLanguage(language);
    // If we have existing data, trigger a new analysis with the new language
    if (userData && Object.keys(userData).length > 0) {
      // Reuse the existing data to trigger a new analysis
      const formData = new FormData();
      formData.append("file", file);
      
      // Step 1: Plant Analysis (reuse existing prediction)
      fetch("http://127.0.0.1:5000/predict", {
        method: "POST",
        body: formData
      })
      .then(response => response.json())
      .then(data => {
        setDiseaseName(data.prediction);
        return fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(placeLocation)}&format=json`);
      })
      .then(response => response.json())
      .then(locationData => {
        if (!locationData || locationData.length === 0) {
          throw new Error("Location not found");
        }

        const { lat, lon } = locationData[0];
        
        // Step 3: Fetch Weather Data
        const currentDate = new Date().toISOString().split('T')[0];
        const pastDate = new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

        return fetch(`https://api.worldweatheronline.com/premium/v1/past-weather.ashx?key=d2af227ed68348f99de201856251603&q=${lat},${lon}&date=${pastDate}&enddate=${currentDate}&format=json`);
      })
      .then(response => response.json())
      .then(weatherData => {
        if (!weatherData?.data?.weather) {
          throw new Error("Weather data not found for the given coordinates.");
        }

        // Step 4: Calculate Average Values
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

        // Step 5: Call Gemini API with new language
        return analyzePlantDisease(
          placeLocation,
          averagedData.avgHumidity,
          averagedData.avgTempMax,
          averagedData.avgTempMin,
          diseaseName,
          language
        );
      })
      .then(analysisResult => {
        setUserData(analysisResult);
      })
      .catch(error => console.error("Error in the process:", error));
    }
  };

  const analyzePlantDisease = async (placeLocation, avgHumidity, avgTempMax, avgTempMin, diseaseName, language) => {
    const apiKey = "AIzaSyBWEhilw2TATGtVaBxVEDA5HlObyyJKtmQ";
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

    const prompt = `
    Analyze the given environmental data and plant disease information to provide insights on the disease's cause, prevention methods, and treatment options.
    Please provide the response in ${language} language.

    Input Details:
    - Location Name: ${placeLocation}
    - Average Humidity: ${avgHumidity}%
    - Average Maximum Temperature: ${avgTempMax}°C
    - Average Minimum Temperature: ${avgTempMin}°C
    - Plant Disease Name: ${diseaseName}

    **Output Format (in JSON, without markdown formatting):**
    {
      "diseaseName": "<Disease Name>",
      "cause": "<Detailed cause of the disease in ${language}>",
      "prevention": "<Prevention method in ${language}>",
      "treatment": "<Treatment method in ${language}>",
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
      const jsonString = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
      const cleanJsonString = jsonString
        .replace(/```json/g, '')
        .replace(/```/g, '')
        .trim();

      return JSON.parse(cleanJsonString);
    } catch (error) {
      console.error("Error in fetching data:", error);
      return null;
    }
  };

  return (
    <div className="flex h-auto items-center justify-center px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-6 items-start w-full max-w-[2000px]">
        <div className="w-full lg:w-1/2">
          <UserInput 
            setUserData={setUserData} 
            setFile={setFile} 
            file={file}
            selectedLanguage={selectedLanguage}
            setPlaceLocation={setPlaceLocation}
            setDiseaseName={setDiseaseName}
            placeLocation={placeLocation}
          />
        </div>
        <div className="w-full lg:w-1/2">
          <Prediction 
            userData={userData} 
            file={file} 
            onLanguageChange={handleLanguageChange}
          />
        </div>
      </div>
    </div>
  )
}

export default Hero
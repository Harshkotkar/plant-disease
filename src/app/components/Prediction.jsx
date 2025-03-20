"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Printer, Share2, Download } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState, useEffect } from "react";

export default function Prediction({ userData, file, onLanguageChange }) {
  const [selectedLanguage, setSelectedLanguage] = useState("en");

  useEffect(() => {
    // When language changes, trigger a new analysis
    if (userData && Object.keys(userData).length > 0) {
      onLanguageChange(selectedLanguage);
    }
  }, [selectedLanguage]);

  const handleLanguageChange = (value) => {
    setSelectedLanguage(value);
  };

  // Sample data - in a real app, this would come from an API or props
  const result = {
    diseaseName: userData.diseaseName || "",
    location: userData.location || "",
    uploadDate: new Date().toLocaleDateString(),
    severity: "Severe",
    type: "Fungal",
    imageUrl: userData.diseaseName 
      ? URL.createObjectURL(file) 
      : "/placeholder.svg",
    cause:
      userData.cause || "",
    prevention:
      userData.prevention || "",
    treatment:
      userData.treatment || "",
  };

  return (
    <div className="h-auto flex items-center justify-center p-4">
      <Card className="w-full shadow-lg border-0 rounded-3xl overflow-hidden">
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-green-800">
              Analysis Results
            </h1>
            <Select value={selectedLanguage} onValueChange={handleLanguageChange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select Language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="es">Spanish</SelectItem>
                <SelectItem value="fr">French</SelectItem>
                <SelectItem value="de">German</SelectItem>
                <SelectItem value="hi">Hindi</SelectItem>
                <SelectItem value="bn">Bengali</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Disease info section */}
          <div className="flex flex-col md:flex-row gap-6 mb-6">
            <div className="w-full md:w-1/3 bg-white rounded-xl p-4 shadow-sm">
              <img
                src={result.imageUrl || "/globe.svg"}
                alt="Plant with disease"
                className="w-full h-auto rounded-lg object-cover"
              />
            </div>

            <div className="w-full md:w-2/3">
              <h2 className="text-xl font-bold mb-2">{result.diseaseName}</h2>
              <p className="text-gray-600 mb-1">Location: {result.location}</p>
              <p className="text-gray-600 mb-3">
                Uploaded: {result.uploadDate}
              </p>

              {/* <div className="flex gap-2">
                <Badge
                  variant="outline"
                  className="bg-red-100 text-red-800 hover:bg-red-200 border-red-200"
                >
                  {result.severity}
                </Badge>
                <Badge
                  variant="outline"
                  className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200 border-yellow-200"
                >
                  {result.type}
                </Badge>
              </div> */}
            </div>
          </div>

          {/* Accordion sections */}
          <Accordion
            type="single"
            collapsible
            className="mb-6"
          >
            <AccordionItem
              value="cause"
              className="border rounded-xl mb-3 bg-green-50 border-green-100"
            >
              <AccordionTrigger className="px-4 py-3 text-green-800 font-medium hover:no-underline">
                Cause
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-3 text-gray-700 max-h-40 overflow-y-auto whitespace-pre-wrap break-words custom-scrollbar">
                {result.cause}
              </AccordionContent>   
            </AccordionItem>

            <AccordionItem
              value="prevention"
              className="border rounded-xl mb-3 bg-green-50 border-green-100"
            >
              <AccordionTrigger className="px-4 py-3 text-green-800 font-medium hover:no-underline">
                Prevention
              </AccordionTrigger>
              <AccordionContent className="custom-scrollbar px-4 pb-3 text-gray-700 max-h-40 overflow-y-auto whitespace-pre-wrap break-words">
                {result.prevention}
              </AccordionContent>
            </AccordionItem>

            <AccordionItem
              value="treatment"
              className="border rounded-xl bg-green-50 border-green-100"
            >
              <AccordionTrigger className="px-4 py-3 text-green-800 font-medium hover:no-underline">
                Treatment & Pesticides
              </AccordionTrigger>
              <AccordionContent className="custom-scrollbar px-4 pb-3 text-gray-700 max-h-40 overflow-y-auto whitespace-pre-wrap break-words">
                {result.treatment}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
}

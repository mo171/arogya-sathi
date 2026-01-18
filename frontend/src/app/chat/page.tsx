"use client";

import { useState, useRef, useEffect } from "react";
import {
  Mic,
  User,
  Heart,
  Leaf,
  MapPin,
  Phone,
  AlertCircle,
  Camera,
  Bot,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Sidebar from "@/components/Sidebar";

interface Message {
  id: string;
  type: "user" | "ai";
  content?: string;
  cards?: {
    type: "problem" | "remedy" | "doctor";
    data: any;
  }[];
}

export default function ChatPage() {
  const [isListening, setIsListening] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "ai",
      content:
        "नमस्ते! मैं आपकी स्वास्थ्य सहायक हूँ। कृपया अपनी समस्या के बारे में बताएं।",
    },
  ]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isThinking]);

  const handleMicPress = () => {
    setIsListening(true);

    // Simulate voice recording
    setTimeout(() => {
      setIsListening(false);
      setIsThinking(true);

      // Add user message
      const userMessage: Message = {
        id: Date.now().toString(),
        type: "user",
        content: "मुझे बुखार और सिरदर्द है, पिछले 2 दिनों से।",
      };

      setMessages((prev) => [...prev, userMessage]);

      // Simulate AI processing
      setTimeout(() => {
        setIsThinking(false);

        // Add AI response with cards
        const aiResponse: Message = {
          id: (Date.now() + 1).toString(),
          type: "ai",
          cards: [
            {
              type: "problem",
              data: {
                title: "Possible Diagnosis",
                symptoms: [
                  "बुखार (Fever)",
                  "सिरदर्द (Headache)",
                  "2 दिन से समस्या",
                ],
                severity: "medium",
                description:
                  "Common viral infection or seasonal flu. Symptoms suggest a mild to moderate condition.",
              },
            },
            {
              type: "remedy",
              data: {
                title: "Home Remedies",
                remedies: [
                  {
                    name: "तुलसी और अदरक की चाय",
                    description:
                      "Boil tulsi leaves and ginger in water. Drink 2-3 times daily.",
                    duration: "3-5 days",
                  },
                  {
                    name: "हल्दी दूध",
                    description:
                      "Warm milk with turmeric before bed. Helps reduce inflammation.",
                    duration: "Daily",
                  },
                  {
                    name: "आराम और पानी",
                    description: "Rest and drink 8-10 glasses of water daily.",
                    duration: "Ongoing",
                  },
                ],
              },
            },
            {
              type: "doctor",
              data: {
                suggestion:
                  "If symptoms persist for more than 3 days, please consult a doctor.",
                doctors: [
                  {
                    name: "Dr. Rajesh Kumar",
                    specialty: "General Physician",
                    distance: "2.3 km",
                    rating: 4.8,
                    available: "Today, 4:00 PM",
                  },
                  {
                    name: "Dr. Priya Sharma",
                    specialty: "Family Medicine",
                    distance: "3.1 km",
                    rating: 4.9,
                    available: "Tomorrow, 10:00 AM",
                  },
                  {
                    name: "Dr. Amit Patel",
                    specialty: "Internal Medicine",
                    distance: "4.5 km",
                    rating: 4.7,
                    available: "Today, 6:00 PM",
                  },
                ],
              },
            },
          ],
        };

        setMessages((prev) => [...prev, aiResponse]);
      }, 2000);
    }, 2000);
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar />

      <div className="flex-1 overflow-y-auto bg-gradient-to-b from-green-50/50 to-white flex flex-col relative w-full">
        {/* Top Bar */}
        <div className="sticky top-0 z-50 bg-white border-b shadow-sm">
          <div className="w-full px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10 bg-primary">
                <AvatarFallback className="bg-primary text-white">
                  <Bot className="h-5 w-5" />
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="font-semibold text-gray-900">
                  Health Assistant
                </div>
                <div className="text-xs text-gray-500">Always here to help</div>
              </div>
            </div>

            <Button variant="ghost" size="icon" className="text-gray-600">
              <Camera className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-8 space-y-8 scroll-smooth pb-32">
          <div className="max-w-3xl mx-auto space-y-8">
            {messages.map((message) => (
              <div key={message.id}>
                {message.type === "user" ? (
                  <div className="flex justify-end animate-in slide-in-from-bottom-2 duration-300">
                    <div className="bg-primary text-white rounded-2xl rounded-tr-sm px-6 py-3 max-w-md shadow-lg shadow-primary/20">
                      <p className="text-lg">{message.content}</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6 animate-in slide-in-from-bottom-2 duration-500">
                    {message.content && (
                      <div className="flex justify-start">
                        <div className="bg-white border rounded-2xl rounded-tl-sm px-6 py-4 max-w-md shadow-sm">
                          <p className="text-gray-800 text-lg leading-relaxed">
                            {message.content}
                          </p>
                        </div>
                      </div>
                    )}

                    {message.cards?.map((card, idx) => (
                      <div
                        key={idx}
                        className="animate-in fade-in zoom-in-95 duration-500 delay-100"
                      >
                        {card.type === "problem" && (
                          <Card className="border-2 border-amber-200 bg-gradient-to-br from-amber-50 to-white shadow-md overflow-hidden">
                            <CardContent className="p-6 space-y-4">
                              <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-amber-500 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm">
                                  <AlertCircle className="h-6 w-6 text-white" />
                                </div>
                                <div className="flex-1">
                                  <h3 className="font-bold text-xl text-amber-900 leading-tight">
                                    {card.data.title}
                                  </h3>
                                  <p className="text-amber-800 mt-2 font-medium">
                                    {card.data.description}
                                  </p>
                                </div>
                              </div>
                              <div className="space-y-3 pt-2">
                                <p className="text-sm font-bold text-amber-900 uppercase tracking-wide">
                                  Symptoms Detected:
                                </p>
                                <div className="flex flex-wrap gap-2">
                                  {card.data.symptoms.map(
                                    (symptom: string, i: number) => (
                                      <span
                                        key={i}
                                        className="px-4 py-1.5 bg-amber-100 text-amber-800 rounded-full text-sm font-medium border border-amber-200"
                                      >
                                        {symptom}
                                      </span>
                                    ),
                                  )}
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        )}

                        {card.type === "remedy" && (
                          <Card className="border-2 shadow-sm overflow-hidden">
                            <CardContent className="p-5 space-y-4">
                              <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0">
                                  <Leaf className="h-5 w-5 text-white" />
                                </div>
                                <h3 className="font-medium text-lg">
                                  {card.data.title}
                                </h3>
                              </div>

                              <div className="space-y-3">
                                {card.data.remedies.map(
                                  (remedy: any, i: number) => (
                                    <div
                                      key={i}
                                      className="bg-white rounded-xl p-4 border border-green-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)]"
                                    >
                                      <div className="flex items-start gap-3">
                                        <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                          <span className="text-green-800 text-xs font-bold">
                                            {i + 1}
                                          </span>
                                        </div>
                                        <div className="flex-1 -mt-1">
                                          <h4 className="font-bold text-gray-900 text-sm mb-1">
                                            {remedy.name}
                                          </h4>
                                          <p className="text-gray-600 text-xs leading-relaxed">
                                            {remedy.description}
                                          </p>
                                          <div className="mt-2">
                                            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-green-100 text-green-800">
                                              Duration: {remedy.duration}
                                            </span>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  ),
                                )}
                              </div>
                            </CardContent>
                          </Card>
                        )}

                        {card.type === "doctor" && (
                          <Card className="border-2 border-primary/10 shadow-md overflow-hidden bg-white">
                            <CardContent className="p-6 space-y-6">
                              <div className="flex items-start gap-3 border-b border-gray-100 pb-4">
                                <MapPin className="h-6 w-6 text-primary mt-1" />
                                <div>
                                  <h3 className="font-bold text-xl text-gray-900">
                                    Nearest Doctors
                                  </h3>
                                  <p className="text-sm text-gray-500 mt-1">
                                    {card.data.suggestion}
                                  </p>
                                </div>
                              </div>

                              <div className="space-y-4">
                                {card.data.doctors.map(
                                  (doctor: any, i: number) => (
                                    <div
                                      key={i}
                                      className="bg-white rounded-xl p-4 border border-gray-100 hover:border-primary/30 hover:shadow-md transition-all group"
                                    >
                                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                        <div className="flex-1 space-y-1">
                                          <h4 className="font-bold text-gray-900 group-hover:text-primary transition-colors">
                                            {doctor.name}
                                          </h4>
                                          <p className="text-sm font-medium text-gray-500">
                                            {doctor.specialty}
                                          </p>
                                          <div className="flex items-center gap-3 mt-2 text-sm text-gray-500">
                                            <span className="flex items-center gap-1">
                                              <MapPin className="h-3 w-3" />
                                              {doctor.distance}
                                            </span>
                                            <span className="text-amber-500 font-medium">
                                              ★ {doctor.rating}
                                            </span>
                                            <span className="text-green-600 font-medium bg-green-50 px-2 py-0.5 rounded">
                                              {doctor.available}
                                            </span>
                                          </div>
                                        </div>
                                        <Button className="bg-primary hover:bg-primary/90 shadow-md shadow-primary/20 shrink-0">
                                          <Phone className="h-4 w-4 mr-2" />
                                          Book Now
                                        </Button>
                                      </div>
                                    </div>
                                  ),
                                )}
                              </div>
                            </CardContent>
                          </Card>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {isThinking && (
              <div className="flex justify-start animate-pulse">
                <div className="bg-white border rounded-2xl rounded-tl-sm px-6 py-4 shadow-sm flex items-center gap-3">
                  <div className="relative">
                    <Heart className="h-6 w-6 text-red-500" />
                    <div className="absolute inset-0 bg-red-400 rounded-full animate-ping opacity-20"></div>
                  </div>
                  <span className="text-gray-600 font-medium">
                    Analyzing your symptoms...
                  </span>
                </div>
              </div>
            )}
            <div ref={scrollRef} />
          </div>
        </div>

        {/* Bottom Bar with Mic Button */}
        <div className="sticky bottom-0 bg-white/80 backdrop-blur-md border-t shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
          <div className="max-w-3xl mx-auto px-4 py-6">
            <div className="flex flex-col items-center justify-center gap-4">
              <div className="relative group">
                {isListening && (
                  <>
                    <div className="absolute inset-0 bg-red-500 rounded-full animate-ping opacity-20 scale-150"></div>
                    <div className="absolute inset-0 bg-red-500 rounded-full animate-pulse opacity-30 scale-125"></div>
                  </>
                )}
                <Button
                  size="lg"
                  className={`rounded-full w-20 h-20 shadow-2xl transition-all duration-300 z-10 relative flex items-center justify-center ${
                    isListening
                      ? "bg-red-500 hover:bg-red-600 scale-110"
                      : "bg-primary hover:bg-primary/90 hover:scale-105"
                  }`}
                  onClick={handleMicPress}
                  disabled={isThinking}
                >
                  <Mic
                    className={`h-8 w-8 text-white ${isListening ? "animate-bounce" : ""}`}
                  />
                </Button>
              </div>
              <p
                className={`text-center text-sm font-medium transition-colors ${
                  isListening ? "text-red-500 animate-pulse" : "text-gray-500"
                }`}
              >
                {isListening ? "Listening..." : "Tap to Speak"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

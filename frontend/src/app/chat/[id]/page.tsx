"use client";

import { useState, useRef, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Mic,
  Heart,
  Leaf,
  MapPin,
  Phone,
  AlertCircle,
  Camera,
  Bot,
  Loader2,
  ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { api } from "@/lib/axios";
import Sidebar from "@/components/Sidebar";
import { AudioRecorder } from "@/lib/audioRecorder";
import { uploadAudioToCloudinary } from "@/lib/cloudinary";
import { Message } from "@/types/chat";

export default function ChatSessionPage() {
  const params = useParams();
  const router = useRouter();
  const sessionId = params.id as string;

  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [error, setError] = useState<string | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);
  const audioRecorderRef = useRef<AudioRecorder | null>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isProcessing]);

  useEffect(() => {
    // Initialize audio recorder
    audioRecorderRef.current = new AudioRecorder();
  }, []);

  const handleMicPress = async () => {
    if (!audioRecorderRef.current) return;

    try {
      if (isListening) {
        // Stop recording
        setIsListening(false);
        setIsProcessing(true);

        // Get the audio blob
        const audioBlob = await audioRecorderRef.current.stopRecording();

        // Add user message (placeholder)
        const userMessage: Message = {
          id: Date.now().toString(),
          type: "user",
          content: "🎤 Recording sent...",
        };
        setMessages((prev) => [...prev, userMessage]);

        // Upload to Cloudinary
        const audioUrl = await uploadAudioToCloudinary(audioBlob);
        console.log("Audio uploaded to:", audioUrl);

        // Send to backend
        const response = await api.post(`/api/v1/sessions/${sessionId}`, {
          audio_url: audioUrl,
        });

        console.log("Backend response:", response.data);

        const backendData = response.data;
        const doctors = backendData.call_to_action?.recommended_doctors || [];

        // Create AI response with cards
        const aiResponse: Message = {
          id: (Date.now() + 1).toString(),
          type: "ai",
          cards: [
            {
              type: "problem",
              data: {
                title: backendData.main_problem || "Health Analysis",
                symptoms: [], // Backend doesn't return symptoms array
                severity: "medium",
                description:
                  backendData.response || backendData.cause_of_problem || "",
              },
            },
            ...(backendData.preventive_measures &&
            backendData.preventive_measures.length > 0
              ? [
                  {
                    type: "remedy" as const,
                    data: {
                      title: "Preventive Measures",
                      remedies: backendData.preventive_measures.map(
                        (measure: string, index: number) => ({
                          name: `Measure ${index + 1}`,
                          description: measure,
                          duration: "As needed",
                        }),
                      ),
                    },
                  },
                ]
              : []),
            ...(doctors && doctors.length > 0
              ? [
                  {
                    type: "doctor" as const,
                    data: {
                      suggestion:
                        backendData.bot_recommendation ||
                        "If symptoms persist, please consult a doctor.",
                      doctors: doctors.map((doc: any) => ({
                        name: doc.name,
                        specialty: doc.specialization,
                        distance: "N/A", // Backend doesn't return distance
                        rating: doc.rating || 0,
                        available: "Contact for availability",
                      })),
                    },
                  },
                ]
              : []),
          ],
        };

        setMessages((prev) => [...prev, aiResponse]);
        setError(null);
      } else {
        // Start recording
        setIsListening(true);
        await audioRecorderRef.current.startRecording();
      }
    } catch (err) {
      console.error("Error handling recording:", err);
      setError(
        err instanceof Error
          ? err.message
          : "An error occurred. Please try again.",
      );
      setIsListening(false);
      setIsProcessing(false);

      // Cancel recording if it was started
      if (audioRecorderRef.current) {
        audioRecorderRef.current.cancelRecording();
      }
    } finally {
      if (!isListening) {
        setIsProcessing(false);
      }
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar />

      <div className="flex-1 overflow-y-auto bg-gradient-to-b from-green-50/50 to-white flex flex-col relative w-full">
        {/* Top Bar */}
        <div className="sticky top-0 z-50 bg-white border-b shadow-sm">
          <div className="w-full px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => router.push("/chat")}
                className="mr-2"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <Avatar className="h-10 w-10 bg-primary">
                <AvatarFallback className="bg-primary text-white">
                  <Bot className="h-5 w-5" />
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="font-semibold text-gray-900">
                  Health Assistant
                </div>
                <div className="text-xs text-gray-500">
                  Session: {sessionId.slice(0, 8)}...
                </div>
              </div>
            </div>

            <Button variant="ghost" size="icon" className="text-gray-600">
              <Camera className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mx-4 mt-4">
            <Card className="border-red-200 bg-red-50">
              <CardContent className="p-4 flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-red-900">Error</p>
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-8 space-y-8 scroll-smooth pb-32">
          <div className="max-w-3xl mx-auto space-y-8">
            {messages.length === 0 && (
              <div className="text-center py-12">
                <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <Mic className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Ready to Listen
                </h3>
                <p className="text-gray-600">
                  Tap the microphone button below to describe your symptoms
                </p>
              </div>
            )}

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
                              {card.data.symptoms &&
                                card.data.symptoms.length > 0 && (
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
                                )}
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

            {isProcessing && (
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
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <Loader2 className="h-8 w-8 text-white animate-spin" />
                  ) : (
                    <Mic
                      className={`h-8 w-8 text-white ${
                        isListening ? "animate-bounce" : ""
                      }`}
                    />
                  )}
                </Button>
              </div>
              <p
                className={`text-center text-sm font-medium transition-colors ${
                  isListening
                    ? "text-red-500 animate-pulse"
                    : isProcessing
                      ? "text-gray-400"
                      : "text-gray-500"
                }`}
              >
                {isListening
                  ? "Listening... (Tap to stop)"
                  : isProcessing
                    ? "Processing..."
                    : "Tap to Speak"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

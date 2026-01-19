"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Loader2, MessageSquare } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import { api } from "@/lib/axios";
import { supabase } from "@/lib/supabase";

export default function ChatLandingPage() {
  const [isCreating, setIsCreating] = useState(false);
  const router = useRouter();

  const handleCreateSession = async () => {
    try {
      setIsCreating(true);

      // Get current user from Supabase
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        alert("Please log in to create a session");
        return;
      }
      console.log(user.id);

      // Call backend API to create session
      const response = await api.post("/api/v1/sessions/new", {
        user_id: user.id,
      });

      const { session_id } = response.data;

      // Navigate to the chat session
      router.push(`/chat/${session_id}`);
    } catch (error) {
      console.error("Error creating session:", error);
      alert("Failed to create session. Please try again.");
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar />

      <div className="flex-1 overflow-y-auto bg-gradient-to-b from-green-50/50 to-white flex flex-col items-center justify-center p-8">
        <Card className="max-w-2xl w-full shadow-lg border-2 border-primary/10">
          <CardHeader className="text-center space-y-4 pb-8">
            <div className="mx-auto w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
              <MessageSquare className="h-10 w-10 text-primary" />
            </div>
            <CardTitle className="text-3xl font-bold text-gray-900">
              Health Assistant
            </CardTitle>
            <p className="text-gray-600 text-lg">
              Start a new conversation to get personalized health advice, home
              remedies, and doctor recommendations.
            </p>
          </CardHeader>

          <CardContent className="space-y-6">
            <Button
              onClick={handleCreateSession}
              disabled={isCreating}
              className="w-full h-14 text-lg bg-primary hover:bg-primary/90 shadow-md"
              size="lg"
            >
              {isCreating ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  Creating Session...
                </>
              ) : (
                <>
                  <Plus className="h-5 w-5 mr-2" />
                  Create New Session
                </>
              )}
            </Button>

            <div className="pt-6 border-t">
              <h3 className="font-semibold text-gray-900 mb-3">
                How it works:
              </h3>
              <ol className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="font-bold text-primary">1.</span>
                  <span>
                    Click &quot;Create New Session&quot; to start a new health
                    consultation
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold text-primary">2.</span>
                  <span>
                    Describe your symptoms by recording your voice in your
                    preferred language
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold text-primary">3.</span>
                  <span>
                    Get instant analysis, home remedies, and nearby doctor
                    recommendations
                  </span>
                </li>
              </ol>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Loader2, MessageSquare } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import { api } from "@/lib/axios";
import { useUser } from "@/context/AuthContext";
import { toast } from "sonner";
import { useTranslation } from "@/lib/i18n/LanguageContext";

export default function ChatLandingPage() {
  const [isCreating, setIsCreating] = useState(false);
  const router = useRouter();
  const { user, loading } = useUser();
  const { t } = useTranslation();

  const handleCreateSession = async () => {
    if (!user) {
      toast.error(t.chatPage.loginToCreate);
      return;
    }

    try {
      setIsCreating(true);

      // Call backend API to create session
      const response = await api.post("/api/v1/sessions/new", {
        user_id: user.id,
      });

      const { session_id } = response.data;

      if (session_id) {
        // Navigate to the chat session immediately
        router.push(`/chat/${session_id}`);
      } else {
        throw new Error("No session ID received");
      }
    } catch (error: any) {
      console.error("Error creating session:", error);

      if (error.code === "ECONNABORTED") {
        toast.error(t.chatPage.requestTimeout);
      } else if (error.response?.status === 500) {
        toast.error(t.chatPage.serverError);
      } else {
        toast.error(t.chatPage.sessionFailed);
      }
    } finally {
      setIsCreating(false);
    }
  };

  // Show loading state while auth is being determined
  if (loading) {
    return (
      <div className="flex h-screen bg-gray-50 overflow-hidden">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

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
              {t.chatPage.healthAssistant}
            </CardTitle>
            <p className="text-gray-600 text-lg">
              {t.chatPage.startConversation}
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
                  {t.chatPage.creatingSession}
                </>
              ) : (
                <>
                  <Plus className="h-5 w-5 mr-2" />
                  {t.chatPage.createNewSession}
                </>
              )}
            </Button>

            <div className="pt-6 border-t">
              <h3 className="font-semibold text-gray-900 mb-3">
                {t.chatPage.howItWorks}
              </h3>
              <ol className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="font-bold text-primary">1.</span>
                  <span>{t.chatPage.step1}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold text-primary">2.</span>
                  <span>{t.chatPage.step2}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold text-primary">3.</span>
                  <span>{t.chatPage.step3}</span>
                </li>
              </ol>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

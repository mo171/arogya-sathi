"use client";

import { Mic, Leaf, Calendar, Phone, Globe, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUser } from "@/context/AuthContext";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ImageWithFallback } from "@/components/figma/ImageWithFallback";
import { useRouter } from "next/navigation";

export default function LandingPage() {
  const router = useRouter();
  const { user } = useUser();

  const handleNavigateToLogin = () => {
    if (user) {
      router.push("/dashboard");
    } else {
      router.push("/login");
    }
  };

  const handleStartSpeaking = () => {
    if (user) {
      router.push("/chat");
    } else {
      router.push("/login"); // Or signup
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="relative">
              <Leaf className="h-8 w-8 text-primary" strokeWidth={2.5} />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-secondary rounded-full" />
            </div>
            <span className="text-xl font-bold text-primary">GraminSeva</span>
          </div>

          <div className="flex items-center gap-4">
            <Select defaultValue="hi">
              <SelectTrigger className="w-[160px] border-primary/20">
                <Globe className="h-4 w-4 mr-2 text-primary" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="hi">हिन्दी</SelectItem>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="ta">தமிழ்</SelectItem>
                <SelectItem value="te">తెలుగు</SelectItem>
                <SelectItem value="bn">বাংলা</SelectItem>
                <SelectItem value="mr">मराठी</SelectItem>
              </SelectContent>
            </Select>
            <Button
              onClick={handleNavigateToLogin}
              variant="outline"
              className="border-primary text-primary hover:bg-primary hover:text-white"
            >
              {user ? "Dashboard" : "Login"}
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-accent via-white to-secondary/10" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-block px-4 py-2 bg-secondary/10 rounded-full border border-secondary/30">
                <span className="text-sm font-semibold text-secondary">
                  🌾 Rural Healthcare Reimagined
                </span>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight">
                आपकी भाषा,
                <br />
                आपका स्वास्थ्य
              </h1>
              <p className="text-lg md:text-xl text-gray-600 max-w-xl">
                Talk to our AI to understand your health, get home remedies, or
                book a doctor instantly.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  onClick={handleStartSpeaking}
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-white text-lg px-8 py-6"
                >
                  <Mic className="mr-2 h-5 w-5" />
                  Start Speaking
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-primary text-primary hover:bg-primary/5 text-lg px-8 py-6"
                >
                  Learn More
                </Button>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500 pt-4">
                <Shield className="h-5 w-5 text-primary" />
                <span>
                  100% Secure & Private - Your health data stays with you
                </span>
              </div>
            </div>

            <div className="relative">
              <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl border-8 border-white">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1629038152911-f899dbf8d639?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx8fDE3Njg2OTY3ODR8MA&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Rural healthcare"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-xl shadow-lg border-2 border-primary/10">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <Mic className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-gray-900">
                      15+ Languages
                    </div>
                    <div className="text-xs text-gray-500">Voice Support</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Section */}
      <section className="py-20 bg-gradient-to-b from-white to-accent/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
              Healthcare In Your Hands
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Bridging traditional wisdom with modern medicine, accessible in
              your native language
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <Card className="border-2 border-primary/10 hover:border-primary/30 transition-all hover:shadow-xl">
              <CardContent className="p-8 space-y-4">
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center">
                  <Mic className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">
                  Audio Diagnosis
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Speak in your native tongue. Our AI understands 15+ regional
                  languages and dialects to help diagnose your symptoms
                  accurately.
                </p>
                <div className="pt-4 flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-accent text-primary text-sm rounded-full">
                    Hindi
                  </span>
                  <span className="px-3 py-1 bg-accent text-primary text-sm rounded-full">
                    Tamil
                  </span>
                  <span className="px-3 py-1 bg-accent text-primary text-sm rounded-full">
                    Bengali
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Feature 2 */}
            <Card className="border-2 border-secondary/20 hover:border-secondary/40 transition-all hover:shadow-xl">
              <CardContent className="p-8 space-y-4">
                <div className="w-16 h-16 bg-secondary/10 rounded-2xl flex items-center justify-center">
                  <Leaf className="h-8 w-8 text-secondary" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">
                  Traditional Remedies
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Dadi-Nani's wisdom verified by AI. Get safe, time-tested home
                  remedies for common ailments with step-by-step guidance.
                </p>
                <div className="aspect-video rounded-lg overflow-hidden mt-4">
                  <ImageWithFallback
                    src="https://images.unsplash.com/photo-1738907692230-ed72b94e83f1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxheXVydmVkaWMlMjBoZXJicyUyMHRyYWRpdGlvbmFsfGVufDF8fHx8MTc2ODY5Njc4NHww&ixlib=rb-4.1.0&q=80&w=1080"
                    alt="Traditional herbs"
                    className="w-full h-full object-cover"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Feature 3 */}
            <Card className="border-2 border-primary/10 hover:border-primary/30 transition-all hover:shadow-xl">
              <CardContent className="p-8 space-y-4">
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center">
                  <Calendar className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">
                  Instant Doctor Booking
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Find the nearest doctors, check availability in real-time, and
                  book appointments instantly. All from one conversation.
                </p>
                <div className="aspect-video rounded-lg overflow-hidden mt-4">
                  <ImageWithFallback
                    src="https://images.unsplash.com/photo-1659353887222-630895f23cc5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBkb2N0b3IlMjBoZWFsdGhjYXJlfGVufDF8fHx8MTc2ODY5Njc4NHww&ixlib=rb-4.1.0&q=80&w=1080"
                    alt="Doctor consultation"
                    className="w-full h-full object-cover"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary to-primary/80 text-white">
        <div className="container mx-auto px-4 text-center space-y-8">
          <h2 className="text-3xl md:text-5xl font-bold">
            Ready to take control of your health?
          </h2>
          <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto">
            Join thousands of rural families who trust GraminSeva for their
            healthcare needs
          </p>
          <Button
            onClick={handleNavigateToLogin}
            size="lg"
            className="bg-white text-primary hover:bg-gray-100 text-lg px-10 py-6"
          >
            <Mic className="mr-2 h-5 w-5" />
            Get Started Now
          </Button>
        </div>
      </section>
  
      {/* Footer */}
      <footer className="bg-gray-50 border-t py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Leaf className="h-6 w-6 text-primary" />
                <span className="font-bold text-primary">GraminSeva</span>
              </div>
              <p className="text-sm text-gray-600">
                Making healthcare accessible in every village, every language.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4 text-gray-900">Quick Links</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>
                  <a href="#" className="hover:text-primary">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary">
                    How It Works
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary">
                    Languages
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4 text-gray-900">Support</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>
                  <a href="#" className="hover:text-primary">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary">
                    Terms & Conditions
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary">
                    Privacy Policy
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4 text-gray-900">Emergency</h4>
              <div className="space-y-3">
                <a
                  href="tel:108"
                  className="flex items-center gap-2 text-destructive hover:text-destructive/80"
                >
                  <Phone className="h-4 w-4" />
                  <span className="font-semibold">108 - Ambulance</span>
                </a>
                <a
                  href="tel:102"
                  className="flex items-center gap-2 text-destructive hover:text-destructive/80"
                >
                  <Phone className="h-4 w-4" />
                  <span className="font-semibold">102 - Health Helpline</span>
                </a>
              </div>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t text-center text-sm text-gray-500">
            <p>
              © 2026 GraminSeva. All rights reserved. Built with ❤️ for Rural
              India.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
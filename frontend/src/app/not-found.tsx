import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft } from "lucide-react";
import MobileNavbar from "@/components/MobileNavbar";


export default function NotFound() {
  return (
    <div className="min-h-screen bg-white">
      <MobileNavbar />
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] px-4 text-center">
        <div className="space-y-6 max-w-md">
          <div className="text-6xl md:text-8xl font-bold text-primary/20">404</div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Page Not Found
          </h1>
          <p className="text-gray-600 text-base md:text-lg">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild className="bg-primary hover:bg-primary/90">
              <Link href="/">
                <Home className="h-4 w-4 mr-2" />
                Go Home
              </Link>
            </Button>
            <Button variant="outline" onClick={() => window.history.back()}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go Back
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
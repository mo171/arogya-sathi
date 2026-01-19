"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Menu,
  X,
  Leaf,
  Globe,
  LayoutDashboard,
  MessageSquare,
  Users,
  LogOut,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUser } from "@/context/AuthContext";

interface MobileNavbarProps {
  showNavItems?: boolean;
}

export default function MobileNavbar({ showNavItems = false }: MobileNavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useUser();

  const handleNavigateToLogin = () => {
    if (user) {
      router.push("/dashboard");
    } else {
      router.push("/login");
    }
    setIsOpen(false);
  };

  const handleLogout = async () => {
    await logout();
    router.push("/");
    setIsOpen(false);
  };

  const navItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      labelHindi: "डैशबोर्ड",
      icon: LayoutDashboard,
      description: "Appointments & Records",
      href: "/dashboard",
    },
    {
      id: "chat",
      label: "Health Chat",
      labelHindi: "स्वास्थ्य चैट",
      icon: MessageSquare,
      description: "Talk to AI Assistant",
      href: "/chat",
    },
    {
      id: "community",
      label: "Community",
      labelHindi: "समुदाय",
      icon: Users,
      description: "Search Remedies",
      href: "/community",
    },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="relative">
            <Leaf className="h-8 w-8 text-primary" strokeWidth={2.5} />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-secondary rounded-full" />
          </div>
          <span className="text-xl font-bold text-primary">GraminSeva</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-4">
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
          
          {user && showNavItems && (
            <nav className="flex items-center gap-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.id}
                    href={item.href}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all text-sm font-medium ${
                      isActive
                        ? "bg-primary text-white"
                        : "text-gray-700 hover:bg-accent hover:text-primary"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          )}

          <Button
            onClick={handleNavigateToLogin}
            variant="outline"
            className="border-primary text-primary hover:bg-primary hover:text-white"
          >
            {user ? "Dashboard" : "Login"}
          </Button>

          {user && (
            <Button
              onClick={handleLogout}
              variant="ghost"
              size="sm"
              className="text-gray-600 hover:text-red-600"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Mobile Menu */}
        <div className="md:hidden">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="p-2">
                <Menu className="h-6 w-6 text-primary" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <div className="flex flex-col h-full">
                {/* Header */}
                <div className="flex items-center justify-between pb-4 border-b">
                  <div className="flex items-center gap-2">
                    <Leaf className="h-6 w-6 text-primary" />
                    <span className="font-bold text-primary">GraminSeva</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsOpen(false)}
                    className="p-2"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>

                {/* Language Selector */}
                <div className="py-4 border-b">
                  <Select defaultValue="hi">
                    <SelectTrigger className="w-full border-primary/20">
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
                </div>

                {/* Navigation Items */}
                {user && showNavItems && (
                  <nav className="flex-1 py-4 space-y-2">
                    {navItems.map((item) => {
                      const Icon = item.icon;
                      const isActive = pathname === item.href;
                      return (
                        <Link
                          key={item.id}
                          href={item.href}
                          onClick={() => setIsOpen(false)}
                          className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                            isActive
                              ? "bg-primary text-white"
                              : "text-gray-700 hover:bg-accent hover:text-primary"
                          }`}
                        >
                          <Icon className="h-5 w-5" />
                          <div className="flex-1 text-left">
                            <div className="font-medium">{item.label}</div>
                            <div className={`text-xs ${isActive ? "text-white/80" : "text-gray-500"}`}>
                              {item.description}
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                  </nav>
                )}

                {/* Bottom Actions */}
                <div className="pt-4 border-t space-y-3">
                  <Button
                    onClick={handleNavigateToLogin}
                    className="w-full bg-primary hover:bg-primary/90 text-white"
                  >
                    {user ? "Go to Dashboard" : "Login / Sign Up"}
                  </Button>
                  
                  {user && (
                    <Button
                      onClick={handleLogout}
                      variant="outline"
                      className="w-full border-red-200 text-red-600 hover:bg-red-50"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </Button>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
"use client";

import {
  LayoutDashboard,
  MessageSquare,
  Users,
  ChevronLeft,
  ChevronRight,
  LogOut,
  User,
} from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useUser } from "@/context/AuthContext";
import { useTranslation } from "@/lib/i18n/LanguageContext";

export default function Sidebar() {
  const pathname = usePathname();
  const { user, profile, signOut } = useUser();
  const { t } = useTranslation();

  const [isCollapsed, setIsCollapsed] = useState(false);

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
    <div
      className={`bg-white border-r shadow-sm transition-all duration-300 ${
        isCollapsed ? "w-20" : "w-72"
      } flex flex-col relative`}
    >
      {/* Toggle Button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-6 z-10 h-6 w-6 rounded-full border bg-white shadow-md hover:bg-accent"
      >
        {isCollapsed ? (
          <ChevronRight className="h-4 w-4" />
        ) : (
          <ChevronLeft className="h-4 w-4" />
        )}
      </Button>

      {/* Logo Section */}
      <div className="p-6 border-b">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="w-6 h-6 text-white"
            >
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
          </div>
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <h2 className="font-bold text-primary truncate">Arogya Sathi</h2>
              <p className="text-xs text-gray-500 truncate">
                {t.sidebar.ruralHealth}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.id}
              href={item.href}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                isActive
                  ? "bg-primary text-white shadow-md"
                  : "text-gray-700 hover:bg-accent hover:text-primary"
              } ${isCollapsed ? "justify-center" : ""}`}
            >
              <Icon
                className={`flex-shrink-0 ${isCollapsed ? "h-6 w-6" : "h-5 w-5"}`}
              />
              {!isCollapsed && (
                <div className="flex-1 text-left min-w-0">
                  <div className="font-medium truncate">
                    {t.navbar[item.id as keyof typeof t.navbar]}
                  </div>
                  <div
                    className={`text-xs truncate ${isActive ? "text-white/80" : "text-gray-500"}`}
                  >
                    {item.id === "dashboard"
                      ? t.navbar.appointmentsRecords
                      : item.id === "chat"
                        ? t.navbar.talkToAI
                        : t.navbar.searchRemedies}
                  </div>
                </div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* User Profile & Logout */}
      <div className="p-4 border-t">
        {!isCollapsed && profile && (
          <div className="flex items-center gap-3 mb-4 p-3 bg-gray-50 rounded-lg">
            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
              <User className="h-4 w-4 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {profile.name || profile.full_name || "User"}
              </p>
              <p className="text-xs text-gray-500 truncate">{user?.email}</p>
            </div>
          </div>
        )}

        <Button
          onClick={signOut}
          variant="outline"
          className={`border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 ${
            isCollapsed ? "w-full p-2" : "w-full"
          }`}
        >
          <LogOut className={`${isCollapsed ? "h-5 w-5" : "h-4 w-4 mr-2"}`} />
          {!isCollapsed && t.navbar.logout}
        </Button>
      </div>

      {/* Help Section */}
      {!isCollapsed && (
        <div className="p-4 border-t">
          <div className="bg-accent/50 rounded-lg p-4 space-y-2">
            <p className="text-sm font-semibold text-gray-900">
              {t.sidebar.needHelp}
            </p>
            <p className="text-xs text-gray-600">{t.sidebar.contactSupport}</p>
            <Button
              variant="outline"
              size="sm"
              className="w-full text-xs border-primary/20 hover:bg-primary/5"
            >
              {t.sidebar.getSupport}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

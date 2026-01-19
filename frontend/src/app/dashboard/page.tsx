"use client";

import { useState } from "react";
import { useUser } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Calendar,
  Clock,
  FileText,
  Activity,
  MapPin,
  Phone,
  Download,
  CheckCircle,
  AlertCircle,
  Eye,
  FileCheck,
  LogOut,
  User,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Sidebar from "@/components/Sidebar";

export default function Dashboard() {
  const { user, profile, loading, signOut } = useUser();
  const router = useRouter();

  // Mock Data
  const [appointments] = useState([
    {
      id: 1,
      doctor: "Dr. Rajesh Kumar",
      specialization: "General Physician",
      date: "20 Jan 2026",
      time: "4:00 PM",
      location: "City Hospital, 2.3 km",
      status: "upcoming",
    },
    {
      id: 2,
      doctor: "Dr. Priya Sharma",
      specialization: "Family Medicine",
      date: "15 Jan 2026",
      time: "10:00 AM",
      location: "Rural Clinic, 3.1 km",
      status: "completed",
    },
  ]);

  const [medicalReports] = useState([
    {
      id: 1,
      title: "X-Ray Report",
      type: "Radiology",
      date: "15/1/2026",
      doctor: "Dr. Rajesh Kumar",
      status: "Normal",
      findings: "No abnormalities detected in chest X-ray",
      fileSize: "2.4 MB",
      reportId: "XR-2026-001",
    },
    {
      id: 2,
      title: "Blood Test",
      type: "Laboratory",
      date: "10/1/2026",
      doctor: "Dr. Priya Sharma",
      status: "Reviewed",
      findings: "Hemoglobin: 12.5 g/dL, Blood Sugar: 95 mg/dL - Normal ranges",
      fileSize: "1.8 MB",
      reportId: "BT-2026-002",
    },
    {
      id: 3,
      title: "Skin Condition Assessment",
      type: "Dermatology",
      date: "8/1/2026",
      doctor: "Dr. Amit Patel",
      status: "Follow-up Required",
      findings: "Mild eczema - prescribed topical treatment",
      fileSize: "3.1 MB",
      reportId: "SK-2026-003",
    },
  ]);

  const [prescriptions] = useState([
    {
      id: 1,
      doctor: "Dr. Priya Sharma",
      date: "15 January 2026",
      diagnosis: "Viral Fever",
      medicines: ["Paracetamol 500mg - 3x daily", "Vitamin C - 1x daily"],
    },
    {
      id: 2,
      doctor: "Dr. Amit Patel",
      date: "5 January 2026",
      diagnosis: "Upper Respiratory Infection",
      medicines: ["Cough Syrup - 2x daily", "Antibiotic - As prescribed"],
    },
  ]);

  if (loading) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar />

      <div className="flex-1 ml-72 p-8 bg-white text-black">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-500 mt-1">
                Your health records and appointments
              </p>
            </div>
            
            {/* User Profile & Logout */}
            <div className="flex items-center gap-4">
              {profile && (
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">
                      {profile.name || profile.full_name || "User"}
                    </p>
                    <p className="text-xs text-gray-500">
                      {user?.email}
                    </p>
                  </div>
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                </div>
              )}
              <Button
                onClick={signOut}
                variant="outline"
                className="border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Upcoming Appointments */}
            <Card className="shadow-sm border-gray-100 hover:shadow-md transition-shadow">
              <CardContent className="flex items-center gap-4 p-6">
                <div className="p-3 bg--50 text-green-600 rounded-xl">
                  <Calendar className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">1</h3>
                  <p className="text-sm font-medium text-gray-500">
                    Upcoming Appointments
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Medical Reports */}
            <Card className="shadow-sm border-gray-100 hover:shadow-md transition-shadow">
              <CardContent className="flex items-center gap-4 p-6">
                <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                  <FileText className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">3</h3>
                  <p className="text-sm font-medium text-gray-500">
                    Medical Reports
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Prescriptions */}
            <Card className="shadow-sm border-gray-100 hover:shadow-md transition-shadow">
              <CardContent className="flex items-center gap-4 p-6">
                <div className="p-3 bg-green-50 text-green-600 rounded-xl">
                  <FileText className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">2</h3>
                  <p className="text-sm font-medium text-gray-500">
                    Prescriptions
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Appointments Section */}
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Calendar className="h-5 w-5 text-gray-500" />
              Appointments
            </h2>

            <div className="space-y-4">
              {appointments.map((apt) => (
                <Card
                  key={apt.id}
                  className="shadow-sm hover:shadow-md transition-all border-gray-100"
                >
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      {/* Left: Doctor Info */}
                      <div className="flex gap-4">
                        {/* <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                          <User className="h-6 w-6 text-gray-500" />
                        </div> */}
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-bold text-gray-900 text-lg">
                              {apt.doctor}
                            </h3>
                            <Badge
                              variant="secondary"
                              className={
                                apt.status === "upcoming"
                                  ? "bg-green-100 text-green-700 hover:bg-green-100"
                                  : "bg-gray-100 text-gray-600 hover:bg-gray-100"
                              }
                            >
                              {apt.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-500">
                            {apt.specialization}
                          </p>
                          <div className="flex items-center gap-4 text-sm text-gray-500 pt-1">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              {apt.date}
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {apt.time}
                            </div>
                            <div className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              {apt.location}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Right: Actions */}
                      <div className="flex items-center gap-3">
                        {apt.status === "upcoming" ? (
                          <>
                            <Button
                              variant="outline"
                              className="border-gray-200 text-gray-700 hover:bg-gray-50 bg-white"
                            >
                              Reschedule
                            </Button>
                            <Button className="bg-green-700 hover:bg-green-800 text-white gap-2">
                              <Phone className="h-4 w-4" />
                              Call
                            </Button>
                          </>
                        ) : (
                          <Button
                            variant="outline"
                            className="border-gray-200 text-gray-700 bg-white"
                          >
                            View Details
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Medical Reports & Documents */}
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Activity className="h-5 w-5 text-gray-500" />
              Medical Reports & Documents
            </h2>
            <div className="grid grid-cols-1 gap-4">
              {medicalReports.map((report) => (
                <Card
                  key={report.id}
                  className="border-gray-100 shadow-sm hover:shadow-md transition-all group bg-white"
                >
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                      {/* Left: Report Info */}
                      <div className="flex gap-4 flex-1">
                        <div className="p-3 bg-blue-50 text-blue-600 rounded-xl shrink-0">
                          {report.type === "Radiology" && <Activity className="h-6 w-6" />}
                          {report.type === "Laboratory" && <FileCheck className="h-6 w-6" />}
                          {report.type === "Dermatology" && <Eye className="h-6 w-6" />}
                        </div>
                        <div className="space-y-2 flex-1">
                          <div className="flex items-center gap-3">
                            <h3 className="font-bold text-gray-900 text-lg">
                              {report.title}
                            </h3>
                            <Badge
                              variant="secondary"
                              className={
                                report.status === "Normal"
                                  ? "bg-green-100 text-green-700 hover:bg-green-100"
                                  : report.status === "Reviewed"
                                  ? "bg-blue-100 text-blue-700 hover:bg-blue-100"
                                  : "bg-orange-100 text-orange-700 hover:bg-orange-100"
                              }
                            >
                              {report.status === "Normal" && <CheckCircle className="h-3 w-3 mr-1" />}
                              {report.status === "Follow-up Required" && <AlertCircle className="h-3 w-3 mr-1" />}
                              {report.status}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span className="font-medium">{report.type}</span>
                            <span>•</span>
                            <span>{report.date}</span>
                            <span>•</span>
                            <span>Dr. {report.doctor.split(' ').slice(-2).join(' ')}</span>
                            <span>•</span>
                            <span>{report.fileSize}</span>
                          </div>
                          <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                            <span className="font-medium">Findings: </span>
                            {report.findings}
                          </p>
                          <div className="flex items-center gap-2 text-xs text-gray-400">
                            <span>Report ID: {report.reportId}</span>
                          </div>
                        </div>
                      </div>

                      {/* Right: Actions */}
                      <div className="flex items-center gap-3 shrink-0">
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-gray-200 text-gray-700 hover:bg-gray-50 bg-white"
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-gray-200 text-gray-700 hover:bg-gray-50 bg-white"
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Doctor's Prescriptions */}
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <FileText className="h-5 w-5 text-green-600" />
              Doctor's Prescriptions
            </h2>
            <Card className="border-gray-100 shadow-sm bg-white">
              <div className="divide-y divide-gray-100">
                {prescriptions.map((script) => (
                  <div key={script.id} className="p-6">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                      <div className="space-y-2">
                        <div>
                          <h3 className="font-bold text-gray-900 text-lg">
                            {script.doctor}
                          </h3>
                          <p className="text-sm text-gray-500">{script.date}</p>
                        </div>
                        <div className="flex gap-2 text-sm">
                          <span className="text-gray-500">Diagnosis:</span>
                          <span className="text-green-600 font-medium">
                            {script.diagnosis}
                          </span>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-medium text-gray-700">
                            Medicines:
                          </p>
                          <ul className="list-disc list-inside text-sm text-gray-600 ml-1">
                            {script.medicines.map((med, idx) => (
                              <li key={idx}>{med}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        className="border-gray-200 text-gray-700 hover:bg-gray-50 bg-white shrink-0"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download PDF
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

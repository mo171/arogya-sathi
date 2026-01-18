"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea"; // Assuming you might add this component or just use Input for now
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { toast } from "sonner";
import { useUser } from "@/context/AuthContext";
import { User, Stethoscope, Save } from "lucide-react";

export default function CompleteProfile() {
  const router = useRouter();
  const { user } = useUser();
  const [loading, setLoading] = useState(false);

  const [userType, setUserType] = useState<"patient" | "doctor">("patient");

  // Unified form state - we'll pick what we need based on userType
  const [formData, setFormData] = useState({
    // Common
    name: "",
    phone: "",
    location: "", // String for simple input (Village/City)

    // Patient Specific
    language: "hi",
    allergies: "", // Comma separated string -> convert to Array
    emergencyContactName: "",
    emergencyContactPhone: "",

    // Doctor Specific
    specialization: "",
    languagesSpoken: "", // Comma separated string -> convert to Array
    clinicAddress: "",
    consultationFee: "",
    workingHoursStart: "09:00",
    workingHoursEnd: "17:00",
    contactEmail: "",
    contactPhone: "",
    verified: false, // Usually admin sets this, but default false
  });

  useEffect(() => {
    if (user) {
      // Pre-fill from Auth Metadata if available
      const meta = user.user_metadata;
      setFormData((prev) => ({
        ...prev,
        name: meta?.full_name || prev.name,
        phone: meta?.phone_number || prev.phone,
        contactEmail: user.email || prev.contactEmail,
      }));
    }
  }, [user]);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!user) return;
    setLoading(true);

    try {
      let error;

      if (userType === "patient") {
        // Prepare data for 'users' table
        const patientData = {
          id: user.id,
          phone_number: formData.phone,
          preferred_language: formData.language,
          location: { address: formData.location }, // Storing as JSONB
          allergies: formData.allergies
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean), // Array
          emergency_contact: {
            name: formData.emergencyContactName,
            phone: formData.emergencyContactPhone,
          }, // JSONB
          updated_at: new Date().toISOString(),
        };

        const result = await supabase.from("users").upsert(patientData);
        error = result.error;
      } else {
        // Prepare data for 'doctors' table
        const doctorData = {
          id: user.id,
          name: formData.name,
          specialization: formData.specialization,
          location: { address: formData.clinicAddress }, // JSONB
          rating: 0, // Default
          working_hours: {
            start: formData.workingHoursStart,
            end: formData.workingHoursEnd,
          }, // JSONB
          contact_info: {
            email: formData.contactEmail,
            phone: formData.contactPhone || formData.phone,
          }, // JSONB
          languages: formData.languagesSpoken
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean), // Array
          verified: false,
          created_at: new Date().toISOString(), // Assuming new record
        };

        const result = await supabase.from("doctors").upsert(doctorData);
        error = result.error;
      }

      if (error) throw error;

      toast.success("Profile updated successfully!");
      window.location.href = "/dashboard";
    } catch (err: any) {
      toast.error(err.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl shadow-xl">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-3xl font-bold text-primary">
            Complete Your Profile
          </CardTitle>
          <CardDescription>
            Tell us a bit more about yourself to get the best{" "}
            {userType === "doctor" ? "practice" : "healthcare"} experience.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* User Type Selection */}
          <div className="grid grid-cols-2 gap-4">
            <div
              className={`cursor-pointer rounded-xl border-2 p-4 flex flex-col items-center gap-3 transition-all ${userType === "patient" ? "border-primary bg-primary/5" : "border-gray-200 hover:border-gray-300"}`}
              onClick={() => setUserType("patient")}
            >
              <div
                className={`p-3 rounded-full ${userType === "patient" ? "bg-primary text-white" : "bg-gray-100 text-gray-500"}`}
              >
                <User className="h-6 w-6" />
              </div>
              <span
                className={`font-semibold ${userType === "patient" ? "text-primary" : "text-gray-600"}`}
              >
                I am a Patient
              </span>
            </div>

            <div
              className={`cursor-pointer rounded-xl border-2 p-4 flex flex-col items-center gap-3 transition-all ${userType === "doctor" ? "border-primary bg-primary/5" : "border-gray-200 hover:border-gray-300"}`}
              onClick={() => setUserType("doctor")}
            >
              <div
                className={`p-3 rounded-full ${userType === "doctor" ? "bg-primary text-white" : "bg-gray-100 text-gray-500"}`}
              >
                <Stethoscope className="h-6 w-6" />
              </div>
              <span
                className={`font-semibold ${userType === "doctor" ? "text-primary" : "text-gray-600"}`}
              >
                I am a Doctor
              </span>
            </div>
          </div>

          <div className="space-y-6">
            {/* Common Fields if needed, mostly patient Name is in Auth but Doctor needs explicit Name in table */}
            {userType === "doctor" && (
              <div className="space-y-2">
                <Label htmlFor="docName">Doctor Name *</Label>
                <Input
                  id="docName"
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  placeholder="Dr. John Doe"
                />
              </div>
            )}

            {/* PATIENT FORM */}
            {userType === "patient" && (
              <div className="grid md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4">
                <div className="space-y-2">
                  <Label htmlFor="location">Location (City/Village) *</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => handleChange("location", e.target.value)}
                    placeholder="e.g. Rampur"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="language">Preferred Language</Label>
                  <Select
                    value={formData.language}
                    onValueChange={(val) => handleChange("language", val)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hi">Hindi (हिन्दी)</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="ta">Tamil (தமிழ்)</SelectItem>
                      <SelectItem value="te">Telugu (తెలుగు)</SelectItem>
                      <SelectItem value="bn">Bengali (বাংলা)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                    placeholder="+91..."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="allergies">Allergies (comma separated)</Label>
                  <Input
                    id="allergies"
                    value={formData.allergies}
                    onChange={(e) => handleChange("allergies", e.target.value)}
                    placeholder="Peanuts, Dust..."
                  />
                </div>

                <div className="col-span-2 space-y-4 border-t pt-4">
                  <h3 className="font-semibold text-gray-900">
                    Emergency Contact
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="ecName">Contact Name</Label>
                      <Input
                        id="ecName"
                        value={formData.emergencyContactName}
                        onChange={(e) =>
                          handleChange("emergencyContactName", e.target.value)
                        }
                        placeholder="Relative Name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="ecPhone">Contact Phone</Label>
                      <Input
                        id="ecPhone"
                        value={formData.emergencyContactPhone}
                        onChange={(e) =>
                          handleChange("emergencyContactPhone", e.target.value)
                        }
                        placeholder="+91..."
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* DOCTOR FORM */}
            {userType === "doctor" && (
              <div className="grid md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4">
                <div className="space-y-2">
                  <Label htmlFor="specialization">Specialization *</Label>
                  <Input
                    id="specialization"
                    value={formData.specialization}
                    onChange={(e) =>
                      handleChange("specialization", e.target.value)
                    }
                    placeholder="General Physician, Cardiologist..."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="clinicAddress">
                    Clinic Location/Address *
                  </Label>
                  <Input
                    id="clinicAddress"
                    value={formData.clinicAddress}
                    onChange={(e) =>
                      handleChange("clinicAddress", e.target.value)
                    }
                    placeholder="Full Clinic Address"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="languages">
                    Languages Spoken (comma separated)
                  </Label>
                  <Input
                    id="languages"
                    value={formData.languagesSpoken}
                    onChange={(e) =>
                      handleChange("languagesSpoken", e.target.value)
                    }
                    placeholder="English, Hindi..."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="docPhone">Contact Phone</Label>
                  <Input
                    id="docPhone"
                    value={formData.contactPhone}
                    onChange={(e) =>
                      handleChange("contactPhone", e.target.value)
                    }
                    placeholder="+91..."
                  />
                </div>

                <div className="col-span-2 space-y-4 border-t pt-4">
                  <h3 className="font-semibold text-gray-900">Working Hours</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Start Time</Label>
                      <Input
                        type="time"
                        value={formData.workingHoursStart}
                        onChange={(e) =>
                          handleChange("workingHoursStart", e.target.value)
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>End Time</Label>
                      <Input
                        type="time"
                        value={formData.workingHoursEnd}
                        onChange={(e) =>
                          handleChange("workingHoursEnd", e.target.value)
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <Button
            className="w-full h-12 text-lg"
            onClick={handleSubmit}
            disabled={loading}
          >
            <Save className="mr-2 h-5 w-5" />
            {loading ? "Saving Profile..." : "Save & Continue"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

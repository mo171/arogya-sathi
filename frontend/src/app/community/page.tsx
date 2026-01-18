"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import {
  Search,
  Filter,
  Share2,
  ThumbsUp,
  MessageSquare,
  Bookmark,
  ShieldCheck,
  Leaf,
  Clock,
  User,
} from "lucide-react";

export default function CommunityPage() {
  const [searchQuery, setSearchQuery] = useState("");

 

  const remedies = [
    {
      id: 1,
      title: "तुलसी और अदरक की चाय - बुखार के लिए",
      description:
        "Traditional remedy for fever and cold. Used by our grandmothers for generations.",
      tags: ["#fever", "#cold", "#Immunity"],
      verified: true,
      ingredients: [
        "तुलसी के पत्ते (10-12)",
        "अदरक (1 inch)",
        "शहद (1 चम्मच)",
        "पानी (2 cup)",
      ],
      method: [
        "पानी को उबालें",
        "तुलसी के पत्ते और कटा हुआ अदरक डालें",
        "5-7 मिनट उबलने दें",
        "छान लें और शहद मिलाएं",
        "गर्म-गर्म पिएं",
      ],
      author: "रमेश शर्मा",
      likes: 342,
      comments: 45,
    },
    {
      id: 2,
      title: "हल्दी दूध - सर्दी और खांसी",
      description: "Golden milk - anti-inflammatory and immunity booster.",
      tags: ["#cough", "#cold", "#Inflammation"],
      verified: true,
      ingredients: [
        "दूध (1 cup)",
        "हल्दी पाउडर (1/2 चम्मच)",
        "काली मिर्च (चुटकी भर)",
        "शहद (स्वाद अनुसार)",
      ],
      method: [
        "दूध को गर्म करें",
        "हल्दी और काली मिर्च मिलाएं",
        "2-3 मिनट उबलने दें",
        "थोड़ा ठंडा करें और शहद मिलाएं",
        "सोने से पहले पिएं",
      ],
      author: "प्रिया देवी",
      likes: 528,
      comments: 67,
    },
  ];

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar />

      <div className="flex-1 overflow-y-auto">
        <div className="p-8 max-w-7xl mx-auto space-y-8">
          {/* Header Section */}
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-gray-900">
              Community Solutions
            </h1>
            <p className="text-gray-500 text-lg">
              Search and share traditional remedies
            </p>
          </div>

          {/* Search and Filters */}
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  placeholder="Search remedies.. (e.g. बुखार, fever, cough)"
                  className="pl-10 h-12 bg-white border-gray-200 text-base"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button
                variant="outline"
                className="h-12 px-6 gap-2 bg-white border-gray-200 text-gray-700"
              >
                <Filter className="h-4 w-4" />
                All Remedies
              </Button>
            </div>

           
          </div>

          {/* Action Bar */}
          <div className="flex items-center justify-between pt-2">
            <p className="text-gray-500">{remedies.length} remedies found</p>
            <Button className="text-white gap-2 shadow-sm">
              <Leaf className="h-4 w-4" />
              Share Your Remedy
            </Button>
          </div>

          {/* Remedie Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {remedies.map((remedy) => (
              <Card
                key={remedy.id}
                className="border border-gray-100 shadow-sm hover:shadow-md transition-shadow bg-white overflow-hidden flex flex-col"
              >
                <CardHeader className="p-6 pb-4 space-y-2">
                  <div className="flex justify-between items-start gap-4">
                    <CardTitle className="text-xl font-bold text-gray-900 leading-tight">
                      {remedy.title}
                    </CardTitle>
                    {remedy.verified && (
                      <Badge className=" gap-1 pl-1 pr-2 shrink-0">
                        <ShieldCheck className="h-3 w-3" />
                        Verified
                      </Badge>
                    )}
                  </div>
                  <CardDescription className="text-gray-500 text-sm">
                    {remedy.description}
                  </CardDescription>
                  <div className="flex gap-2 pt-2 flex-wrap">
                    {remedy.tags.map((tag, i) => (
                      <Badge
                        key={i}
                        variant="outline"
                        className="bg-green-50 text-green-700 border-green-100 font-normal"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardHeader>

                <CardContent className="p-6 pt-0 flex-1 space-y-6">
                  {/* Ingredients */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-green-800 font-semibold">
                      <Leaf className="h-4 w-4" />
                      <h3>सामग्री (Ingredients):</h3>
                    </div>
                    <ul className="list-disc list-inside space-y-1 text-gray-600 text-sm ml-1">
                      {remedy.ingredients.map((ing, i) => (
                        <li key={i}>{ing}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Method */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-green-800 font-semibold">
                      <Clock className="h-4 w-4" />
                      <h3>विधि (Method):</h3>
                    </div>
                    <ol className="list-decimal list-inside space-y-2 text-gray-600 text-sm ml-1">
                      {remedy.method.map((step, i) => (
                        <li key={i}>{step}</li>
                      ))}
                    </ol>
                  </div>
                </CardContent>

                <CardFooter className="p-6 border-t bg-gray-50 flex justify-between items-center text-gray-500 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-700 flex items-center gap-2">
                      By {remedy.author}
                    </span>
                  </div>
                  <div className="flex items-center gap-6">
                    <button className="flex items-center gap-1.5 hover:text-green-700 transition-colors">
                      <ThumbsUp className="h-4 w-4" />
                      <span>{remedy.likes}</span>
                    </button>
                    <button className="flex items-center gap-1.5 hover:text-green-700 transition-colors">
                      <MessageSquare className="h-4 w-4" />
                      <span>{remedy.comments}</span>
                    </button>
                    <button className="hover:text-green-700 transition-colors">
                      <Bookmark className="h-4 w-4" />
                    </button>
                    <button className="hover:text-green-700 transition-colors">
                      <Share2 className="h-4 w-4" />
                    </button>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

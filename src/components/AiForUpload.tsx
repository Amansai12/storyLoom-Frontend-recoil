import { useState } from "react";

import { ClipboardCheck, Copy, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";

import axios from "axios";
import { BACKEND_URL } from "@/config";

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";

const AISummaryDrawer2 = ({
  isOpen,
  onOpenChange,
}: {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}) => {
  const [query, setQuery] = useState("");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const jwt = localStorage.getItem("jwt");

  const handleCopySummary = () => {
    navigator.clipboard.writeText(summary).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleSummarizeRequest = async () => {
    const q = query
    try {
      setLoading(true);
      const response = await axios.post(
        `${BACKEND_URL}/api/v1/chat`,
        {
          message : q
        },
        {
          headers: {
            'Authorization': jwt,
            "Content-Type": "application/json",
          },
        }
      );
      setSummary(response.data.message);
      console.log(response)
    } catch (error) {
      console.error("Error fetching AI summary:", error);
      setSummary("Unable to generate summary. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Drawer open={isOpen} onOpenChange={onOpenChange}>
      <DrawerContent className="min-h-[450px]">
        <DrawerHeader>
          <DrawerTitle className="flex items-center space-x-2">
            <Sparkles className="text-purple-500" />
            <span>AI Blog helper</span>
          </DrawerTitle>
          <DrawerDescription>
            Get insights or suggestions for your blog
          </DrawerDescription>
        </DrawerHeader>

        <div className="px-4 space-y-4 flex flex-col items-center">
          <Textarea
                  value={query}
                  className="mt-4 h-48 pr-12"
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Ask a specific question about the blog or improvisations"
                  cols={20}
                />

          {summary && (
           <>
           <h1 className="self-start text-xl font-bold text-purple-600">Result : </h1>
           <div className="relative w-full">
                <Textarea
                  value={summary}
                  readOnly
                  className="mt-4 h-48 pr-12"
                  placeholder="Summary will appear here"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleCopySummary}
                  className="absolute top-6 right-2 hover:bg-gray-100"
                >
                  {copied ? (
                    <ClipboardCheck className="h-5 w-5 text-green-500" />
                  ) : (
                    <Copy className="h-5 w-5 text-gray-500" />
                  )}
                </Button>
              </div>
           </>
          )}

          <div className="w-1/2 flex gap-3 justify-center pt-3">
          <Button
            onClick={handleSummarizeRequest}
            disabled={loading}
            className="w-full bg-purple-950 hover:bg-purple-600"
          >
            {loading ? "Generating Response..." : "Get AI Response"}
          </Button>
          <DrawerClose className="w-full">
            <Button variant="outline" className="w-full bg-black hover:bg-gray-600 hover:text-white text-white">
              Close
            </Button>
          </DrawerClose>
          </div>
        </div>

        <DrawerFooter>
          
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default AISummaryDrawer2;

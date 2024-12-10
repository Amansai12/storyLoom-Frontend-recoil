import React, { useState, ChangeEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronDown, ChevronUp, ImageIcon, Sparkles } from "lucide-react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import Navbar from "./Navbar";
import axios from "axios";
import { BACKEND_URL } from "@/config";
import UploadLoader from "./UploadLoader";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import AISummaryDrawer2 from "./AiForUpload";

// Define tag type
type Tag = {
  value: string;
  label: string;
};

const BlogUploadPage: React.FC = () => {
  // State with explicit type definitions
  const [isAISummaryOpen, setIsAISummaryOpen] = useState(false);
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const [stage, setStage] = useState<
    "preparing" | "uploading" | "processing" | "finalizing"
  >("preparing");
  const jwt = localStorage.getItem("jwt");
  const navigate = useNavigate();
  if (!jwt) {
    navigate("/signin");
  }

  // Categories as a constant array
  const categories: string[] = [
    "Science",
    "Technology",
    "Health",
    "Personal Development",
    "Environment",
    "Business",
    "Culture",
    "Travel",
    "Education",
  ];

  
  const availableTags: Tag[] = [
    { value: 'web-development', label: 'Web Development' },
    { value: 'machine-learning', label: 'Machine Learning' },
    { value: 'data-science', label: 'Data Science' },
    { value: 'artificial-intelligence', label: 'Artificial Intelligence' },
    { value: 'cybersecurity', label: 'Cybersecurity' },
    { value: 'mobile-development', label: 'Mobile Development' },
    { value: 'cloud-computing', label: 'Cloud Computing' },
    { value: 'blockchain', label: 'Blockchain' },
    { value: 'ux-design', label: 'UX Design' },
    { value: 'digital-marketing', label: 'Digital Marketing' },
    { value: 'e-commerce', label: 'E-commerce' },
    { value: 'game-development', label: 'Game Development' },
    { value: 'robotics', label: 'Robotics' },
    { value: 'big-data', label: 'Big Data' },
    { value: 'virtual-reality', label: 'Virtual Reality' },
    { value: 'augmented-reality', label: 'Augmented Reality' },
    { value: 'internet-of-things', label: 'Internet of Things (IoT)' },
    { value: 'product-management', label: 'Product Management' },
    { value: 'business-analytics', label: 'Business Analytics' },
    { value: 'finance-and-investment', label: 'Finance and Investment' },
    { value: 'supply-chain-management', label: 'Supply Chain Management' },
    { value: 'renewable-energy', label: 'Renewable Energy' },
    { value: 'biotechnology', label: 'Biotechnology' },
    { value: 'healthcare-technology', label: 'Healthcare Technology' },
    { value: 'self-driving-cars', label: 'Self-Driving Cars' },
    { value: 'quantum-computing', label: 'Quantum Computing' },
    { value: 'aerospace', label: 'Aerospace' },
    { value: 'graphic-design', label: 'Graphic Design' },
    { value: 'content-creation', label: 'Content Creation' },
    { value: 'environmental-science', label: 'Environmental Science' },
    { value: 'space-exploration', label: 'Space Exploration' },
    { value: 'photography', label: 'Photography' },
    { value: 'food-technology', label: 'Food Technology' },
    { value: 'psychology', label: 'Psychology' },
    { value: 'linguistics', label: 'Linguistics' },
    { value: 'education-technology', label: 'Education Technology' },
    { value: 'law-and-legal-tech', label: 'Law and Legal Tech' }
];
const [showAllTags, setShowAllTags] = useState(false);
const toggleTagVisibility = () => {
  setShowAllTags(!showAllTags);
};

const displayedTags = showAllTags ? availableTags : availableTags.slice(0, 12);

  // Image upload handler with type definition
  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle tag selection
  const handleTagChange = (tagValue: string) => {
    setSelectedTags(prev => 
      prev.includes(tagValue)
        ? prev.filter(tag => tag !== tagValue)
        : [...prev, tagValue]
    );
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!image) return alert("Please select an image to upload.");
    setLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 1000));

    const formData = new FormData();
    formData.append("image", image);
    formData.append("title", title);
    formData.append("content", content);
    formData.append("category", category);
    
    // Append tags to formData
    selectedTags.forEach((tag, index) => {
      formData.append(`tags[${index}]`, tag);
    });
    setStage("uploading");
    await new Promise((resolve) => setTimeout(resolve, 1000));
    try {
      setStage("processing");
      await axios.post(
        `${BACKEND_URL}/api/v1/blog`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: jwt,
          },
        }
      );
      toast({
        title: "Blog Uploaded successfully",
        className: "bg-gray-800 text-white",
      });
      navigate('/blogs')
      setLoading(false);
    } catch (error) {
      toast({
        title: "Something went wrong",
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  // Quill editor modules and formats configuration with type definitions
  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ script: "sub" }, { script: "super" }],
      [{ indent: "-1" }, { indent: "+1" }],
      ["link", "image"],
      [{ color: [] }, { background: [] }],
      [{ font: [] }],
      [{ align: [] }],
      ["clean"],
    ],
  };

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "list",
    "bullet",
    "script",
    "indent",
    "link",
    "image",
    "color",
    "background",
    "font",
    "align",
  ];

  // Framer Motion variants
  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    in: { opacity: 1, y: 0 },
    out: { opacity: 0, y: -20 }
  };

  const pageTransition = {
    type: "tween",
    ease: "anticipate",
    duration: 0.5
  };

  return (
    <>
      <Navbar onSearch={() => {}} />
      <AnimatePresence>
        {loading ? (
          <UploadLoader stage={stage} />
        ) : (
          <motion.div 
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
            className="w-full bg-gray-50 flex flex-col items-center justify-center p-6 min-h-screen"
          >
            <Card className="w-full max-w-[1500px] shadow-2xl border-2 border-gray-200 rounded-xl overflow-hidden">
              <CardHeader className="bg-gray-100 border-b border-gray-200 py-6 px-8">
                <CardTitle className="text-2xl w-full font-semibold text-gray-800 flex items-center justify-between">
                  <motion.h1
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    Create New Blog Post
                  </motion.h1>
                  <div className="flex gap-2">
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      <Button
                        onClick={() => setIsAISummaryOpen(true)}
                        variant="outline"
                        className="flex items-center bg-gray-800 text-white hover:bg-gray-700 hover:text-gray-100 transition-colors duration-300"
                      >
                        <Sparkles className="mr-2 text-white" />
                        Get AI Help
                      </Button>
                    </motion.div>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <form
                  onSubmit={handleSubmit}
                  className="flex flex-col-reverse gap-6 md:flex-row"
                >
                  {/* Left Column - Form Details */}
                  <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="space-y-6 w-full md:w-5/12"
                  >
                    {/* Title Input */}
                    <div className="space-y-2">
                      <Label htmlFor="title" className="text-md text-gray-700">
                        Blog Title
                      </Label>
                      <Input
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Enter your blog post title"
                        className="text-lg border-gray-300 focus:border-gray-500 focus:ring-0"
                        required
                      />
                    </div>

                    {/* Category Dropdown */}
                    <div className="space-y-2">
                      <Label htmlFor="category" className="text-md text-gray-700">
                        Category
                      </Label>
                      <Select
                        value={category}
                        onValueChange={setCategory}
                        required
                      >
                        <SelectTrigger className="border-gray-300 focus:border-gray-500">
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((cat) => (
                            <SelectItem key={cat} value={cat}>
                              {cat}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Tags Checkboxes */}
                    <div className="space-y-2">
        <Label className="text-md text-gray-700">
          Tags
        </Label>
        <div className="grid grid-cols-2 gap-2">
          {displayedTags.map((tag) => (
            <motion.div 
              key={tag.value} 
              className="flex items-center space-x-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Checkbox
                id={tag.value}
                checked={selectedTags.includes(tag.value)}
                onCheckedChange={() => handleTagChange(tag.value)}
                className="border-gray-400"
              />
              <Label 
                htmlFor={tag.value} 
                className="text-sm font-normal text-gray-700 cursor-pointer"
              >
                {tag.label}
              </Label>
            </motion.div>
          ))}
        </div>
        
        {/* Show More/Less Button */}
        {availableTags.length > 12 && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-2 flex justify-center"
          >
            <Button
              type="button"
              variant="outline"
              onClick={toggleTagVisibility}
              className="flex items-center text-sm text-gray-600 mt-2 hover:text-gray-800"
            >
              {showAllTags ? (
                <>
                  <ChevronUp className="mr-2 h-4 w-4" /> Show Less
                </>
              ) : (
                <>
                  <ChevronDown className="mr-2 h-4 w-4" /> Show More
                </>
              )}
            </Button>
          </motion.div>
        )}
      </div>

                    {/* Image Upload */}
                    <div className="space-y-2">
                      <Label htmlFor="image" className="text-md text-gray-700">
                        Featured Image
                      </Label>
                      <div className="flex items-center space-x-4">
                        <Input
                          id="image"
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                        <motion.label
                          htmlFor="image"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="flex items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-500 transition-colors"
                        >
                          {imagePreview ? (
                            <img
                              src={imagePreview}
                              alt="Preview"
                              className="max-h-full max-w-full object-cover rounded-lg"
                            />
                          ) : (
                            <div className="text-center text-gray-500">
                              <ImageIcon className="mx-auto mb-2 w-12 h-12 text-gray-400" />
                              <p>Click to upload featured image</p>
                            </div>
                          )}
                        </motion.label>
                      </div>
                    </div>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                    >
                      <Button
                        onClick={(e) => handleSubmit(e)}
                        type="submit"
                        className="w-full z-50 text-md mt-4 bg-gray-800 text-white hover:bg-gray-700 transition-colors duration-300"
                      >
                        Publish Blog
                      </Button>
                    </motion.div>
                  </motion.div>

                  {/* Right Column - Quill Editor */}
                  <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="space-y-2 w-full md:w-7/12"
                  >
                    <Label htmlFor="content" className="text-md text-gray-700">
                      Blog Content
                    </Label>
                    <ReactQuill
                      value={content}
                      onChange={setContent}
                      modules={modules}
                      formats={formats}
                      theme="snow"
                      placeholder="Write your blog post content here..."
                      className="md:h-[650px]  rounded-lg"
                    />
                  </motion.div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <AISummaryDrawer2
        isOpen={isAISummaryOpen}
        onOpenChange={setIsAISummaryOpen}
      />
    </>
  );
};

export default BlogUploadPage;

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Clock, ArrowRight, Loader2, FilePenLine } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { LikeToggleButton } from "./LikeToggleButton";
import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import axios from "axios";
import { BACKEND_URL } from "@/config";
import { useToast } from "@/hooks/use-toast";
import { Input } from "./ui/input";
import { useUser } from "@/context/UserContext";


interface Post {
  id: string;
  title: string;
  content: string;
  category: string;
  author: {
    username: string;
    id: string;
    role : string,
    profileImage : string
  };
  createdAt: string;
  likeBy: user[];
  postImage: string;
}

type user = {
  id: string;
};
interface EditPostDialogProps {
  post: {
    id: string;
    title: string;
    content: string;
  };
  onSave: (updatedContent: string,title : string) => Promise<void>;
}

export const EditPostDialog: React.FC<EditPostDialogProps> = ({ post, onSave }) => {
  const [content, setContent] = useState(post.content);
  const [title, setTitle] = useState(post.title);
  const [isOpen, setIsOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave(content,title);
      setIsOpen(false);
    } catch (error) {
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <FilePenLine 
          className="cursor-pointer text-gray-500 hover:text-blue-600 transition-colors" 
          onClick={() => setIsOpen(true)} 
          size={20}
        />
      </DialogTrigger>
      <DialogContent className="sm:max-w-[725px] max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Edit Post</DialogTitle>
        </DialogHeader>

        <div>
          <label htmlFor="" className="font-semibold pb-2">Title</label>
          <Input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>
        
        <div className="flex-grow overflow-y-auto">
          <ReactQuill 
            theme="snow"
            value={content}
            onChange={setContent}
            className="h-[400px] mb-12"
            modules={{
              toolbar: [
                [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                ['bold', 'italic', 'underline', 'strike'],
                [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                ['link', 'image'],
                ['clean']
              ]
            }}
          />
        </div>
        
        <div className="flex justify-end space-x-2 mt-4">
          <Button 
            variant="outline" 
            onClick={() => setIsOpen(false)} 
            disabled={isSaving}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSave} 
            disabled={isSaving}
          >
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const BlogCards = ({
  id,
  title,
  content,
  category,
  author,
  createdAt,
  likeBy,
  postImage,
  onUnlike
}: Post & {onUnlike?: () => void}) => {
  const currentUserId = localStorage.getItem("userId");
  const {auth} = useUser()
  const {toast} = useToast()
  const initialLiked = likeBy.some((user) => user.id === currentUserId);
  const jwt = localStorage.getItem('jwt')
  const [matter, setMatter] = useState(content)
  const [head, setHeading] = useState(title)
  const [text, setText] = useState('')

  useEffect(() => {
    const data = parser.parseFromString(matter, 'text/html')
    const t = data.body.textContent;
    setText(t ? t : "");
  }, [matter])

  function calculateReadTime(content: string) {
    const words = content.trim().split(/\s+/).length;
    const wordsPerMinute = 200;
    const readTime = Math.ceil(words / wordsPerMinute);
    return `${readTime} min read`;
  }

  function timeAgo(date: string) {
    const now = new Date();
    const diffInSeconds = Math.floor(
      (now.getTime() - new Date(date).getTime()) / 1000
    );

    const timeIntervals = {
      year: 31536000,
      month: 2592000,
      week: 604800,
      day: 86400,
      hour: 3600,
      minute: 60,
    };

    for (const [unit, secondsInUnit] of Object.entries(timeIntervals)) {
      const interval = Math.floor(diffInSeconds / secondsInUnit);
      if (interval >= 1) {
        return `${interval} ${unit}${interval > 1 ? "s" : ""} ago`;
      }
    }

    return "just now";
  }

  const handlePostUpdate = async (updatedContent: string, updatedTitle: string) => {
    try {
      await axios.put(`${BACKEND_URL}/api/v1/blog`, {
        content: updatedContent,
        id: id,
        title: updatedTitle
      }, {
        headers: {
          Authorization: jwt
        }
      })

      setMatter(updatedContent)
      setHeading(updatedTitle)
      toast({
        title: 'Updated successfully',
        className: 'bg-green-800 text-white'
      })
    } catch (e) {
      toast({
        title: "Something went wrong",
        variant: 'destructive'
      })
    }
  };

  const parser = new DOMParser()

  const handleLikeToggle = async (isLiked: boolean) => {
    try {
      if (isLiked && onUnlike) {
        onUnlike();
      }
    } catch (error) {
      toast({
        title: "Error updating like status",
        variant: 'destructive'
      });
    }
  };

  return (
    <div className="group relative bg-white shadow-lg rounded-xl overflow-hidden transition-all duration-300 hover:shadow-xl border border-gray-100 flex flex-col md:flex-row-reverse">
      {/* Image Section - Now on the right */}
      <div className="md:w-4/12 lg:w-5/12 relative overflow-hidden">
        <img 
          src={postImage} 
          alt={title} 
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {/* Category Overlay */}
        <div className="absolute top-4 left-4 bg-primary text-white px-3 py-1 rounded-full text-xs font-medium">
          {category}
        </div>
      </div>

      {/* Content Section */}
      <div className="md:w-8/12 lg:w-7/12 p-6 flex flex-col justify-between">
        {/* Author Info */}
        <div className="flex items-center mb-4">
          <Avatar className="mr-3 border-2 border-primary/20">
            <AvatarImage
              src={author.id == currentUserId ? auth?auth.profileImage : author.profileImage : author.profileImage}
              alt={author.username}
              className="object-cover"
            />
            <AvatarFallback className="bg-primary/10 text-primary">
              {author.username
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div>
            <Link
              to={`/profile/${author.id}`}
              className="font-semibold text-gray-800 hover:text-primary transition-colors hover:underline cursor-pointer"
            >
              {author.username}
            </Link>
            <p className="text-xs text-gray-500">{author.role}</p>
          </div>
        </div>

        {/* Blog Post Details */}
        <div className="flex-grow">
          <Link 
            to={`/blog/${id}`} 
            className="block text-2xl font-bold mb-3 text-gray-800 hover:text-primary transition-colors line-clamp-2"
          >
            {head}
          </Link>
          <p className="text-gray-600 mb-4 line-clamp-3">{text}</p>
        </div>

        {/* Meta Information */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3 text-gray-500">
            <div className="flex items-center space-x-1">
              <Clock size={16} className="text-primary" />
              <span className="text-sm">{calculateReadTime(text)}</span>
            </div>
            <LikeToggleButton
              postId={id}
              initialLiked={initialLiked}
              likeCount={likeBy.length}
              onToggle={handleLikeToggle}
            />
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-2">
            {author.id === currentUserId && (
              <EditPostDialog 
                post={{ id, title, content }}
                onSave={handlePostUpdate}
              />
            )}
            <Button 
              asChild 
              variant="outline" 
              className="group/read hover:bg-primary hover:text-white transition-colors"
            >
              <Link className="flex items-center" to={`/blog/${id}`}>
                Read more 
                <ArrowRight 
                  className="ml-2 transition-transform group-hover/read:translate-x-1" 
                  size={16} 
                />
              </Link>
            </Button>
          </div>
        </div>

        {/* Timestamp */}
        <div className="text-xs text-gray-400 text-right mt-2">
          {timeAgo(createdAt)}
        </div>
      </div>
    </div>
  );
};

export default BlogCards;

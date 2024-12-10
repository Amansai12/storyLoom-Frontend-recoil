import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Heart } from 'lucide-react';
import { cn } from "@/lib/utils";
import axios from 'axios';
import { BACKEND_URL } from '@/config';

interface LikeToggleButtonProps {
  postId: string;
  initialLiked?: boolean;
  likeCount?: number;
  className?: string;
  onToggle?: (isLiked: boolean) => void;
  
}

export const LikeToggleButton: React.FC<LikeToggleButtonProps> = ({
  postId,
  initialLiked = false,
  likeCount = 0,
  className,
  onToggle
  
}) => {
  const [liked, setLiked] = useState(initialLiked);
  const [count, setCount] = useState(likeCount);
  const jwt = localStorage.getItem('jwt');

  useEffect(() => {
    setLiked(initialLiked);
    setCount(likeCount);
  }, [initialLiked, likeCount]);

  const handleToggle = async () => {
    if (!jwt) {
      alert("You are not loggedin")
      return;
    }

    try {
        if(liked){
            setLiked(false)
            if(onToggle){
              onToggle(liked)
            }
            setCount((prev) => prev - 1)
            const response = await axios.get(`${BACKEND_URL}/api/v1/blog/dislike/${postId}`, {
                headers: { Authorization: jwt }
              });
              
        }else{
            setLiked(true)
            setCount((prev) => prev + 1)
            const response = await axios.get(`${BACKEND_URL}/api/v1/blog/like/${postId}`, {
                headers: { Authorization: jwt }
              });
        }
    

    //   if (response.data.success) {
    //     // Toggle liked state
    //     setLiked(!liked);
    //     // Update like count based on backend response
    //     //setCount(response.data.likeCount || (liked ? count - 1 : count + 1));
    //   }
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };
  
  return (
    <Button 
      variant="ghost" 
      size="sm" 
      onClick={handleToggle}
      className={cn(
        "flex items-center space-x-2 hover:bg-red-50 group", 
        className
      )}
    >
      <Heart 
        className={cn(
          "transition-all duration-300 group-hover:scale-110",
          liked 
            ? "fill-red-500 text-red-500" 
            : "text-gray-400 hover:text-red-500"
        )}
        size={20} 
      />
      <span 
        className={cn(
          "text-sm transition-colors", 
          liked ? "text-red-500" : "text-gray-600"
        )}
      >
        {count}
      </span>
    </Button>
  );
};

export default LikeToggleButton;
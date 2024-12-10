import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Share2, Clock, User, Hash, ListTodo, ArrowRight, Sparkles } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { BACKEND_URL } from '@/config';
import LikeToggleButton from './LikeToggleButton';
import Loader from './Loader';
import { ScrollArea } from '@/components/ui/scroll-area';
import './scrollbar.css'
import Navbar from './Navbar';
import AISummaryDrawer from './AiBot';

// Interfaces
interface Author {
  username: string;
  role: string;
  about?: string;
  id: string,
  profileImage : string
}

interface Post {
  id: string;
  title: string;
  content: string;
  category: string;
  readTime?: number;
  views?: number;
  postImage?: string;
  author: Author;
  createdAt: string;
  likedBy?: string[];
}



// Utility Functions
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

// Table of Contents Component
const TableOfContents = ({ content }: { content: string }) => {
  const [headings, setHeadings] = useState<{ text: string; id: string }[]>([]);

  useEffect(() => {
    const extractHeadings = () => {
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = content;

      // Find all potential heading elements
      const headingElements = tempDiv.querySelectorAll('strong, h1, h2, h3, h4, h5, h6');
      
      const extractedHeadings = Array.from(headingElements).map((el, index) => {
        const id = `heading-${index}`;
        el.setAttribute('id', id);
        return {
          text: el.textContent?.trim() || '',
          id: id
        };
      });

      setHeadings(extractedHeadings);
    };

    if (content) {
      extractHeadings();
    }
  }, [content]);

  
  return (
    <Card className="w-full bg-gray-100">
      <CardHeader className="flex flex-row items-center space-x-2 pb-2">
        <ListTodo className="text-green-500" />
        <h3 className="font-semibold">Table of Contents</h3>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-64">
          {headings.length > 0 ? (
            <div className="space-y-2">
              {headings.map(({ text, id }) => (
                <motion.div
                  key={id}
                  whileHover={{ x: 5 }}
                  className="flex items-center space-x-2 hover:bg-white p-2 rounded-lg cursor-pointer"
                >
                  <Hash size={16} className="text-gray-400" />
                  <span className="text-sm">{text}</span>
                </motion.div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">No headings found</p>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

// Author Profile Component
const AuthorProfile = ({ author }: { author: Author }) => {
  return (
    <Card className="w-full bg-gray-100">
      <CardHeader className="flex flex-col items-center text-center p-6">
        <Avatar className="w-24 h-24 mb-4 border-4 border-primary">
          <AvatarImage src={author.profileImage} alt={author.username} />
          <AvatarFallback className="text-3xl">
            {author.username.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div>
          <h3 className="text-xl font-bold">{author.username}</h3>
          <p className="text-sm text-gray-500">{author.role}</p>
        </div>
      </CardHeader>
      <CardContent className="text-center">
        
        <Button variant={'outline'} className="w-full bg-black text-white hover:bg-gray-600 hover:text-white">
          <Link to={`/profile/${author.id}`} >View profile</Link> <ArrowRight className="ml-2" size={16} />
        </Button>
      </CardContent>
    </Card>
  );
};

// Read Time Calculation Function
function calculateReadTime(content: string | "") {
  const words = content.trim().split(/\s+/).length;
  const wordsPerMinute = 200;
  const readTime = Math.ceil(words / wordsPerMinute);
  return `${readTime} min(s) read`;
}

// Main Blog Post Viewer Component
const BlogPostViewer: React.FC = () => {
  const currentUserId = localStorage.getItem('userId');
  const [isLiked, setIsLiked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [post, setPost] = useState<Post | null>(null);
  const jwt = localStorage.getItem('jwt');
  const navigate = useNavigate()
  const [isAISummaryOpen, setIsAISummaryOpen] = useState(false);
  
  // Redirect if no JWT token
  if(!jwt){
    navigate('/')
  }
  
  const handleShareBlog= () => {
    navigator.clipboard.writeText(window.location.href)
      .then(() => alert("Blog link copied!"))
      .catch(err => console.error('Failed to copy: ', err));
  };
  const { id } = useParams();

  // Fetch Post Data
  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${BACKEND_URL}/api/v1/blog/${id}`, {
          headers: {
            Authorization: jwt
          }
        });
        setPost(res.data.blog);
        const x = res.data.blog.likedBy.some((user: { id: string }) => user.id == currentUserId);
        if (x) {
          setIsLiked(true);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    fetchPost();
  }, [id, jwt, currentUserId]);

  return (
    <>
    <Navbar onSearch={() => {}} />
    {loading ? (
      <div className='flex items-center' style={{height:'80vh'}}>
        <Loader />
      </div>
    ) : (
      <div className="container mx-auto py-8 max-w-[1500px]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Content Column */}
          <div className="lg:col-span-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <TooltipProvider>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="mx-auto px-2"
                >
                  <Card className="overflow-hidden shadow-2xl border-none">
                    {/* Cover Image */}
                    {post?.postImage && (
                      <img
                        src={post.postImage}
                        alt={post?.title}
                        className="w-full h-[500px]"
                        style={{objectFit:'cover'}}
                      />
                    )}

                    {/* Post Header */}
                    <CardHeader className="space-y-6 p-8  relative z-10 -mt-16 shadow-lg bg-gray-100">
                      {/* Category and Metadata */}
                      <div className="flex justify-between items-center">
                        <Badge variant="secondary" className="mb-2 bg-gray-300">
                          {post?.category}
                        </Badge>

                        <div className="flex items-center space-x-4 text-gray-600">
                          <Tooltip>
                            <TooltipTrigger>
                              <div className="flex items-center space-x-1">
                                <Clock size={16} />
                                <span>
                                  {calculateReadTime(post?.content || "")}
                                </span>
                              </div>
                            </TooltipTrigger>
                            <TooltipContent>Estimated reading time</TooltipContent>
                          </Tooltip>
                        </div>
                      </div>

                      {/* Title */}
                      <h1 className="text-4xl font-bold text-gray-900 leading-tight">
                        {post?.title}
                      </h1>
                    

                      {/* Author and Interaction Section */}
                      <div className="flex items-center justify-between">
                        <div className="flex flex-col text-center md:text-left md:flex-row items-center space-x-4">
                          <Avatar className="w-16 h-16 border-2 border-primary">
                            <AvatarImage src={post?.author.profileImage} alt={post?.author.username} />
                            <AvatarFallback className="text-2xl">
                              {post?.author.username.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>

                          <div>
                            <p className="font-semibold text-xl text-gray-800">
                              {post?.author.username}
                            </p>
                            <p className="text-sm text-gray-500">
                              {formatDate(post?.createdAt || "")}
                            </p>
                          </div>
                        </div>

                        

                        {/* Social Interactions */}
                        <div className="flex flex-col md:flex-row items-center space-x-3">
                          <LikeToggleButton 
                            initialLiked={isLiked} 
                            likeCount={post?.likedBy?.length} 
                            postId={post?.id || ""} 
                          />
                          
                          <motion.div whileHover={{ scale: 1.1 }}>
                            <Button variant="outline" size="sm" onClick={handleShareBlog}>
                              <Share2 className="mr-2" size={16} />
                              Share
                            </Button>
                          </motion.div>
                        </div>
                      </div>
                    </CardHeader>

                    <Separator className="my-2" />

                    {/* Post Content */}
                    <CardContent 
                      style={{maxHeight:'70vh'}} 
                      className="prose lg:prose-xl p-8 bg-gray-50 rounded-b-xl overflow-y-scroll hide-scrollbar"
          
                    >
                      <div
                        dangerouslySetInnerHTML={{ __html: post?.content || "" }}
                        className="blog-content"
                      />
                    </CardContent>
                  </Card>
                </motion.div>
              </TooltipProvider>
            </motion.div>
          </div>

          {/* Sidebar Column */}
          <div className="lg:col-span-4 space-y-6 px-2">
            {post?.author && <AuthorProfile author={post.author} />}
            <div className="mt-4 flex w-full">
                  <Button 
                    onClick={() => setIsAISummaryOpen(true)} 
                    variant="outline" 
                    className="flex items-center space-x-2 w-full bg-gray-100"
                  >
                    <Sparkles className="mr-2 text-purple-500" />
                    Get AI Summary
                  </Button>
                </div>
            {post?.content && <TableOfContents content={post.content} />}
            
            {post?.author.about && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-8 bg-gray-100 p-6 rounded-xl shadow-lg border"
              >
                
                <div className="flex items-center space-x-4">
                  <User className="text-primary" size={24} />
                  <h2 className="text-xl font-semibold">About the Author</h2>
                </div>
                <Separator className="my-4 bg-black" />
                <p className="text-gray-600">{post.author.about}</p>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    )}
    {post && (
      <AISummaryDrawer
        blogContent={post.content} 
        isOpen={isAISummaryOpen}
        onOpenChange={setIsAISummaryOpen}
      />
    )}
    </>
  );
};

export default BlogPostViewer;
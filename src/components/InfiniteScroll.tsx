import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Button } from './ui/button';
import BlogCards from './BlogCard';
import { BACKEND_URL } from '@/config';
import BlogPostSkeleton from './BlogPostSkeleton';
interface Post {
    id: string;
    title: string;
    content: string;
    category: string;
    published: boolean;
    author: {
      username: string,
      id : string,
      role : string,
      profileImage : string
    },
    createdAt : string;
    likedBy : user[],
    postImage : string
  }
  type user = {
    id : string,
  }
  
  interface InfiniteScrollProps {
    searchQuery?: string;
  }

const InfiniteScroll: React.FC<InfiniteScrollProps> = ({ searchQuery = '' }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const currentUserId = localStorage.getItem('userId')

  const LIMIT = 5;

  const fetchPosts = useCallback(async () => {
    if (!hasMore) return;
    
    setLoading(true);
    try {
      const response = await axios.get(`${BACKEND_URL}/api/v1/bulk/${currentUserId}`, {
        params: {
          search: searchQuery,
          limit: LIMIT,
          page: page
        }
      });
      
      const newPosts = response.data.posts || [];
      
      setPosts(prevPosts => 
        page === 1 
          ? newPosts 
          : [...prevPosts, ...newPosts]
      );
      
      setHasMore(newPosts.length === LIMIT);
    } catch (error) {
      console.error('Error fetching posts:', error);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }, [page, searchQuery, hasMore]);

  useEffect(() => {
    fetchPosts();
  }, [page, fetchPosts]);

  useEffect(() => {
    setPosts([]);
    setPage(1);
    setHasMore(true);
  }, [searchQuery]);

  const handleLoad = () => {
    setPage(prevPage => prevPage + 1);
  }

  return (
    <div className="space-y-6">
      {posts.length === 0 && !loading ? (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12 bg-white rounded-lg shadow-subtle"
        >
          <p className="text-xl text-gray-500">
            No posts found. Try a different search or category.
          </p>
        </motion.div>
      ) : (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ staggerChildren: 0.1 }}
          className="space-y-6"
        >
          {posts.map((post) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <BlogCards 
                id={post.id} 
                title={post.title} 
                content={post.content} 
                category={post.category} 
                author={post.author}
                createdAt={post.createdAt}
                likeBy={post.likedBy}
                postImage = {post.postImage}
              />
            </motion.div>
          ))}
        </motion.div>
      )}

      <div className="flex justify-center mt-8">
        {loading ? (
          <div className='w-full'><BlogPostSkeleton />
          <BlogPostSkeleton />
          <BlogPostSkeleton /></div>
        ) : hasMore ? (
          <Button 
            onClick={handleLoad}
            className="px-8 py-3 bg-black hover:bg-gray-700 transition-colors duration-300"
          >
            Load More Posts
          </Button>
        ) : posts.length > 0 ? (
          <p className="text-gray-500 text-center">
            You've reached the end of our current posts.
          </p>
        ) : null}
      </div>
    </div>
  );
};

export default InfiniteScroll;
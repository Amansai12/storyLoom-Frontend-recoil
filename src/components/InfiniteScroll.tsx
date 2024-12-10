import React, { useState, useEffect, useCallback} from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Button } from './ui/button';
import BlogCards from './BlogCard';
import { BACKEND_URL } from '@/config';
import BlogPostSkeleton from './BlogPostSkeleton';
import { useRecoilState } from 'recoil';
import { blogsAtom } from '@/store/blogsAtom';

interface Post {
  id: string;
  title: string;
  content: string;
  category: string;
  published: boolean;
  author: {
    username: string,
    id: string,
    role: string,
    profileImage: string
  },
  createdAt: string;
  likedBy: user[],
  postImage: string
}

type user = {
  id: string,
}

interface InfiniteScrollProps {
  searchQuery?: string;
}

const InfiniteScroll: React.FC<InfiniteScrollProps> = ({ searchQuery = '' }) => {
  const [blogs, setBlogs] = useRecoilState<Record<string, { 
    posts: Post[], 
    page: number, 
    hasMore: boolean, 
    lastFetchTime: number 
  }>>(blogsAtom);
  const [loading, setLoading] = useState(false);
  const currentUserId = localStorage.getItem('userId');

  const LIMIT = 2;
  const REFRESH_INTERVAL = 580000; 
  const cacheKey = searchQuery === '' ? 'home' : searchQuery;
//console.log(blogs)
  const fetchPosts = useCallback(async (pageToFetch: number) => {
    
    if (blogs[cacheKey]?.hasMore === false) return;

  
    const currentTime = Date.now();
    
    if(pageToFetch == 1 && blogs[cacheKey]){
      
      setBlogs(prevBlogs => {
        const updatedBlogs = { ...prevBlogs };
        delete updatedBlogs[cacheKey];
        return updatedBlogs;
      });
    }
    setLoading(true);
    try {
      console.log(pageToFetch)
      const response = await axios.get(`${BACKEND_URL}/api/v1/bulk/${currentUserId}`, {
        params: {
          search: searchQuery,
          limit: LIMIT,
          page: pageToFetch
        }
      });
      const newPosts = response.data.posts || [];

      setBlogs(prevBlogs => ({
        ...prevBlogs,
        [cacheKey]: {
          posts: pageToFetch === 1 
            ? newPosts 
            : [...(prevBlogs[cacheKey]?.posts || []), ...newPosts],
          page: pageToFetch,
          hasMore: newPosts.length === LIMIT,
          lastFetchTime: currentTime
        }
      }));

    } catch (error) {
      console.error('Error fetching posts:', error);
      
      // Update hasMore to false in case of error
      setBlogs(prevBlogs => ({
        ...prevBlogs,
        [cacheKey]: {
          ...(prevBlogs[cacheKey] || {}),
          hasMore: false
        }
      }));
    } finally {
      setLoading(false);
    }
  }, [searchQuery, currentUserId, blogs, cacheKey, REFRESH_INTERVAL]);

  useEffect(() => {
    // Fetch initial posts if not cached or data is stale
    const currentTime = Date.now();
    const lastFetchTime = blogs[cacheKey]?.lastFetchTime || 0;
    const isStale = currentTime - lastFetchTime > REFRESH_INTERVAL;
    

    if (!blogs[cacheKey] || isStale) {
      fetchPosts(1);
    }
  }, [searchQuery, fetchPosts, blogs, cacheKey]);

  const handleLoad = () => {
    // Fetch the next page
    const nextPage = (blogs[cacheKey]?.page || 1) + 1;
    fetchPosts(nextPage);
  };

  // Get posts for current search query
  const currentPosts = blogs[cacheKey]?.posts || [];
  const hasMore = blogs[cacheKey]?.hasMore ?? true;

  return (
    <div className="space-y-6">
      {currentPosts.length === 0 && !loading ? (
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
          {currentPosts.map((post) => (
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
                postImage={post.postImage}
              />
            </motion.div>
          ))}
        </motion.div>
      )}

      <div className="flex justify-center mt-8">
        {loading ? (
          <div className='w-full'>
            <BlogPostSkeleton />
            <BlogPostSkeleton />
            <BlogPostSkeleton />
          </div>
        ) : hasMore ? (
          <Button 
            onClick={handleLoad}
            className="px-8 py-3 bg-black hover:bg-gray-700 transition-colors duration-300"
          >
            Load More Posts
          </Button>
        ) : currentPosts.length > 0 ? (
          <p className="text-gray-500 text-center">
            You've reached the end of our current posts.
          </p>
        ) : null}
      </div>
    </div>
  );
};

export default InfiniteScroll;
import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import BlogCards from '@/components/BlogCard'
import Loader from '@/components/Loader'
import Navbar from '@/components/Navbar'
import { BACKEND_URL } from '@/config'
import axios from 'axios'
import { Heart, BookOpen } from 'lucide-react'

type Post = {
    category: string;
    content: string;
    createdAt: string;
    title: string;
    postImage: string;
    id: string;
    author: {
      username: string;
      id : string,
      role : string,
      profileImage : string
    };
    likedBy: {id : string}[];
};

function Favourites() {
    const [posts, setPosts] = useState<Post[] | []>([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        const jwt = localStorage.getItem('jwt');
        const fetchPosts = async () => {
            setLoading(true)
            try {
                const res = await axios.get(`${BACKEND_URL}/api/v1/blog/favourites`, {
                    headers: {
                        Authorization: jwt
                    }
                })
                setPosts(res.data.likedPosts)
            } catch(e) {
                console.error("Error fetching favourite posts", e)
            } finally {
                setLoading(false)
            }
        }
        fetchPosts()
    }, [])

    // Function to remove a post from favourites
    const handleRemovePost = (postId: string) => {
        setPosts(prevPosts => prevPosts.filter(post => post.id !== postId));
    }

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { 
            opacity: 1,
            transition: { 
                delayChildren: 0.2,
                staggerChildren: 0.1 
            }
        }
    }

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { 
            y: 0, 
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 100
            }
        },
        exit: { 
            x: -50, 
            opacity: 0,
            transition: { duration: 0.3 }
        }
    }

    return (
        <div className="min-h-screen bg-gray-100 mb-4">
            <Navbar onSearch={() => {}} />
            
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="container mx-auto px-4 py- max-w-[1550px]"
            >
                <div className="text-center mb-12">
                    <motion.h1 
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: "spring", stiffness: 100 }}
                        className="font-bold text-4xl text-gray-800 my-6 flex items-center justify-center gap-3"
                    >
                        <Heart className="text-red-500" fill="currentColor" />
                        My Favourites
                        <BookOpen className="text-blue-500" />
                    </motion.h1>
                    <p className='text-gray-500 text-xl'>Blogs you've loved and cherished</p>
                </div>
                
                {loading ? (
                    <Loader />
                ) : (
                    <AnimatePresence>
                        {posts.length === 0 ? (
                            <motion.div 
                                initial={{ opacity: 0, y: 50 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-center text-gray-400 py-12 bg-white rounded-xl shadow-md"
                            >
                                <Heart 
                                    className="mx-auto mb-4 text-gray-300" 
                                    size={64} 
                                    strokeWidth={1} 
                                />
                                <p className="text-2xl">No favourite posts yet</p>
                                <p className="text-sm mt-2">Start exploring and liking blogs!</p>
                            </motion.div>
                        ) : (
                            <motion.div 
                                variants={containerVariants}
                                initial="hidden"
                                animate="visible"
                                className='flex flex-wrap gap-3 justify-center  mx-auto w-full'
                            >
                                {posts.map((post) => (
                                    <motion.div 
                                        key={post.id} 
                                        variants={itemVariants}
                                        layout
                                        exit="exit"
                                        className="max-w-[750px] w-full"
                                    >
                                        <BlogCards 
                                            {...post} 
                                            likeBy={post.likedBy} 
                                            onUnlike={() => handleRemovePost(post.id)}
                                        />
                                    </motion.div>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                )}
            </motion.div>
        </div>
    )
}

export default Favourites
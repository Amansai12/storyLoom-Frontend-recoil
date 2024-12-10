import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Flame, 
  Rocket,
  Heart,
  Star,
  TreePine,
  Briefcase,
  Plane,
  BookOpen,
  Activity,
  ChevronDown,
  ChevronUp,
  Home,
  Info,
  Users
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

interface CategoryProps {
  onSearch: (query: string) => void;
}

const RecommendedCategories: React.FC<CategoryProps> = ({ onSearch }) => {
  const [expandedCategories, setExpandedCategories] = useState(false);

  const categories = [
    { 
      name: 'Trending', 
      icon: <Flame className="mr-3 h-5 w-5 text-orange-500" />, 
      searchType: 'trending'
    },
    { 
      name: 'For You ( Followee Posts )', 
      icon: <Heart className="mr-3 h-5 w-5 text-pink-500" />, 
      searchType: 'for you'
    },
    { 
      name: 'Popular', 
      icon: <Star className="mr-3 h-5 w-5 text-yellow-500" />, 
      searchType: 'popular'
    },
    { 
      name: 'Technology', 
      icon: <Rocket className="mr-3 h-5 w-5 text-blue-500" />, 
      searchType: 'technology'
    },
    { 
      name: 'Science', 
      icon: <Activity className="mr-3 h-5 w-5 text-teal-500" />, 
      searchType: 'science'
    },
    { 
      name: 'Health', 
      icon: <Activity className="mr-3 h-5 w-5 text-green-500" />, 
      searchType: 'health'
    },
    { 
      name: 'Personal Development', 
      icon: <BookOpen className="mr-3 h-5 w-5 text-indigo-500" />, 
      searchType: 'personal-development'
    },
    { 
      name: 'Environment', 
      icon: <TreePine className="mr-3 h-5 w-5 text-emerald-600" />, 
      searchType: 'environment'
    },
    { 
      name: 'Business', 
      icon: <Briefcase className="mr-3 h-5 w-5 text-gray-700" />, 
      searchType: 'business'
    },
    { 
      name: 'Culture', 
      icon: <BookOpen className="mr-3 h-5 w-5 text-purple-500" />, 
      searchType: 'culture'
    },
    { 
      name: 'Travel', 
      icon: <Plane className="mr-3 h-5 w-5 text-cyan-500" />, 
      searchType: 'travel'
    },
    { 
      name: 'Education', 
      icon: <BookOpen className="mr-3 h-5 w-5 text-amber-500" />, 
      searchType: 'education'
    }
  ];

  return (
    <Card className="w-full max-w-md shadow-2xl rounded-xl bg-white border-none">
      <CardHeader className="bg-white text-black rounded-t-md p-6">
        <CardTitle className="text-2xl font-bold  flex items-center justify-between">
          <span>Explore Categories</span>
          <span className="text-sm font-normal text-gray-500 bg-gray-100 px-3 py-1 rounded-full shadow-sm">
            Personalize Your Feed
          </span>
        </CardTitle>
      </CardHeader>
      <Separator className="bg-gray-200" />
      <CardContent className="pt-6 pb-4">
        <motion.div 
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="space-y-2"
        >
          <AnimatePresence>
            {categories.slice(0, 6).map((category) => (
              <motion.div 
                key={category.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                onClick={() => onSearch(category.searchType)}
                className="flex items-center group hover:bg-gray-50 p-3 rounded-lg transition-all duration-300 cursor-pointer shadow-sm hover:shadow-md"
              >
                {category.icon}
                <span className="text-sm font-medium text-gray-700 group-hover:text-black transition-colors">
                  {category.name}
                </span>
              </motion.div>
            ))}
          </AnimatePresence>

          {expandedCategories && (
            <AnimatePresence>
              {categories.slice(6).map((category) => (
                <motion.div 
                  key={category.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                  onClick={() => onSearch(category.searchType)}
                  className="flex items-center group hover:bg-blue-50 p-3 rounded-lg transition-all duration-300 cursor-pointer shadow-sm hover:shadow-md"
                >
                  {category.icon}
                  <span className="text-sm font-medium text-gray-700 group-hover:text-blue-600 transition-colors">
                    {category.name}
                  </span>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </motion.div>

        <div className="mt-4 text-center">
          <Button 
            variant="outline" 
            onClick={() => setExpandedCategories(!expandedCategories)}
            className="w-full flex items-center justify-center gap-2 border-black hover:bg-gray-50 text-black"
          >
            {expandedCategories ? (
              <>
                <ChevronUp className="h-4 w-4" />
                Hide Categories
              </>
            ) : (
              <>
                <ChevronDown className="h-4 w-4" />
                Show All Categories
              </>
            )}
          </Button>
        </div>

        <Separator className="my-6 bg-gray-200" />

        <div className="bg-gray-100 rounded-lg p-4 space-y-4">
          <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <Users className="h-5 w-5 text-gray-500" />
            Quick Explore
          </h3>
          <div className="space-y-3">
            <div 
              onClick={() => onSearch('Your posts')} 
              className="flex items-center gap-3 cursor-pointer bg-white p-3 rounded-lg hover:shadow-md transition-all duration-300 hover:bg-black hover:text-white"
            >
              <Users className="h-5 w-5 text-green-500" />
              <span className="text-md">My Posts</span>
            </div>
            <Link
              to={'/about'}
              className="flex items-center gap-3 bg-white p-3 rounded-lg hover:shadow-md transition-all duration-300 hover:bg-black hover:text-white"
            >
              <Info className="h-5 w-5 text-purple-500" />
              <span className="text-md  ">About Us</span>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RecommendedCategories;
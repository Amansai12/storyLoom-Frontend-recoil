import React, { useState, useEffect } from 'react';
import { Tabs, TabsList, TabsTrigger} from '@/components/ui/tabs';
import InfiniteScroll from "@/components/InfiniteScroll"
import RecommendedCategories from "@/components/RecommendedCategories"
import Navbar from "@/components/Navbar"
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { useCategories } from '@/context/CategoriesContext';
import { Search} from 'lucide-react';

const Blogs: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('home');
  const [tabs, setTabs] = useState([{ id: 'home', name: 'Home' }]);
  const navigate = useNavigate();
  const { toast } = useToast();
  const jwt = localStorage.getItem('jwt');
  const { userCategories } = useCategories();

  useEffect(() => {
    const cat = [{ id: 'home', name: 'Home' }];
    const objectsArray = userCategories.map((value) => ({
      id: "pref-" + value,
      name: value,
    }));
    
    setTabs([...cat, ...objectsArray]);
  }, [jwt, userCategories]);

  // Check authentication
  if (!jwt) {
    toast({
      title: "Please Login to continue",
      variant: 'destructive',
      duration: 500
    });
    navigate('/');
    return null;
  }

  // Handle tab change
  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    setSearchQuery(tabId === 'home' ? '' : tabId);
  };

  return (
    <div className="min-h-[105vh] bg-gray-50">
      <Navbar onSearch={setSearchQuery} />
      
      <div className="container mx-auto px-4 py-8 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-8"
        >
          <div className="lg:col-span-2">
            {/* Sticky Tabs Container with Added Top Margin */}
            <div className="sticky top-2 z-20 bg-gray-200 backdrop-blur-md shadow-sm rounded-xl mb-6">
              {userCategories && (
                <Tabs 
                  defaultValue="home" 
                  value={activeTab}
                  onValueChange={handleTabChange}
                >
                  <ScrollArea className="w-full whitespace-nowrap">
                    <TabsList className="inline-flex w-full justify-start bg-transparent px-0 py-2">
                      {tabs.map((tab) => (
                        <TabsTrigger 
                          key={tab.id}
                          value={tab.id}
                          className={`
                            px-4 mx-1 py-1 rounded-lg transition-all 
                            ${activeTab === tab.id 
                              ? 'bg-blue-500 text-white' 
                              : 'text-gray-600 hover:bg-gray-100'}
                            font-medium text-sm
                          `}
                        >
                          {tab.name}
                        </TabsTrigger>
                      ))}
                    </TabsList>
                    <ScrollBar orientation="horizontal" />
                  </ScrollArea>
                </Tabs>
              )}
            </div>

            {/* Search and Filter Header */}
            {searchQuery && searchQuery !== 'home' && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center justify-between mb-6 p-4 bg-white rounded-xl shadow-sm"
              >
                <div>
                  <h2 className="text-2xl font-bold text-gray-500 flex items-center">
                    <Search className="mr-3 text-gray-500" size={24} />
                    Browsing: 
                    <span className="text-black ml-2">{searchQuery.startsWith('pref-')?searchQuery.substring(5):searchQuery}</span>
                  </h2>
                </div>
               
              </motion.div>
            )}
            
            {/* Infinite Scroll Content */}
            <div className="space-y-6">
              <InfiniteScroll searchQuery={searchQuery} />
            </div>
          </div>
          
          {/* Recommended Categories Sidebar */}
          <div className="hidden lg:block">
            <div className="sticky top-8">
              <RecommendedCategories onSearch={setSearchQuery} />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Blogs;
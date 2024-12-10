import React, { useState } from 'react';
import { 
  Search, 
  PenSquare, 
  User, 
  Star, 
  LogOut,
  Home
} from 'lucide-react';

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast"
import { Link, useNavigate } from 'react-router-dom';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { useUser } from '@/context/UserContext';

interface NavbarProps {
  onSearch: (query: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ onSearch } : NavbarProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const {toast} = useToast();
  const currentUserId = localStorage.getItem('userId')
  const navigate = useNavigate()
  const {auth,setAuth} = useUser()
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default form submission
    navigate('/blogs')
    onSearch(searchQuery);
  }

  const logout = () => {
    localStorage.removeItem('jwt')
    localStorage.removeItem('userId')
    localStorage.removeItem('profileImage')
    setAuth(null)
    toast({
        title : "Logged out successfully",
        className:"bg-green-800 text-white"
    })
    navigate('/')
  }

  return (
    <nav className="w-full  bg-white shadow-sm">
      <div className="container max-w-[1500px] mx-auto px-4 py-3 flex items-center justify-between">
        {/* Home Button */}
        <div className="flex items-center space-x-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" onClick={() => navigate('/blogs')}>
                  <Home size={20} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Home</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {/* Search Bar (Desktop) */}
          <form onSubmit={handleSearch} className="hidden md:flex items-center relative ml-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input 
              type="text" 
              placeholder="Search..." 
              className="pl-10 pr-3 py-2 w-64 rounded-md border"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button type="submit" className="ml-2" size="sm">
              <Search />
            </Button>
          </form>
        </div>

        {/* Centered Website Name */}
        <div className="absolute left-1/2 transform -translate-x-1/2">
          <Link to={'/blogs'} className="text-2xl font-bold text-gray-800">StoryLoom</Link>
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center space-x-4">
          {/* Mobile Search Toggle */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <Search size={20} />
          </Button>

          {/* Compose/Create Button */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link to={'/blog/upload'}>
                <Button variant="outline" size="icon">
                  <span><PenSquare size={20} /></span>
                </Button>
                </Link>
              </TooltipTrigger>
              <TooltipContent>
                <p>Create Blog</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {/* Profile Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Avatar>
                  <AvatarImage src={auth?.profileImage} alt="Profile" />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <Link className='cursor-pointer' to={`/profile/${currentUserId}`} >
                <DropdownMenuItem className='cursor-pointer'>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
              </Link>
              <Link className='cursor-pointer' to={`/blog/favourites`} >
                <DropdownMenuItem className='cursor-pointer'>
                  <Star className="mr-2 h-4 w-4" />
                  <span>Favourites</span>
                </DropdownMenuItem>
              </Link>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout} className='cursor-pointer'>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Mobile Search Overlay */}
      {isMenuOpen && (
        <form onSubmit={handleSearch} className="md:hidden absolute left-0 w-full bg-white p-4 shadow-md z-50">
          <div className="flex items-center relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input 
              type="text" 
              placeholder="Search..." 
              className="pl-10 pr-3 py-2 w-full rounded-md border"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button type="submit" className="ml-2">Search</Button>
          </div>
        </form>
      )}
    </nav>
  );
};

export default Navbar;
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { BACKEND_URL } from "@/config";

// Shadcn UI Components
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Share2, 
  UserPlus, 
  MessageCircle, 
  Briefcase, 
  Loader2,
  Users,
  UserCog,
  MessageSquare
} from "lucide-react";

// Components
import Navbar from "@/components/Navbar";
import Loader from "@/components/Loader";
import BlogCard from "@/components/BlogCard";
import { useNavigate, useParams } from "react-router-dom";
import BlogPostSkeleton from "@/components/BlogPostSkeleton";
import EditProfileDialog from "@/components/EditProfileDialog";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";


// Types
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



type SubUser = {
  username: string;
  about: string;
  role: string;
  id: string;
  profileImage : string;
};

type User = {
  username: string;
  about: string;
  role: string;
  profileImage : string,
  followers: SubUser[];
  following: SubUser[];
};


function UserListItem({ user }: { user: SubUser }) {
  const navigate = useNavigate();

  const handleProfileNavigation = (profileId: string) => {
    // Close any open dialogs
    
    // Navigate to the new profile
    navigate(`/profile/${profileId}`);
  };

  return (
    <div 
      className="flex flex-col sm:flex-row items-center justify-between p-4 
                bg-gray-100
                 hover:bg-gray-100 transition-colors 
                 rounded-lg border border-transparent 
                 hover:border-primary/20 hover:shadow-sm 
                 group w-full max-w-4xl mx-auto"
    >
      <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4 w-full">
        <div className="flex items-center space-x-4 w-full sm:w-auto justify-center sm:justify-start">
          <Avatar className="w-12 h-12 sm:w-14 sm:h-14 border-2 border-primary/10 group-hover:border-primary/30">
            <AvatarImage 
              src={user.profileImage} 
              alt={user.username} 
              className="object-cover"
            />
            <AvatarFallback className="bg-primary/10 text-primary">
              {user?.username?.split(' ').map(n => n[0]).join('').toUpperCase()}
            </AvatarFallback>
          </Avatar>
          
          <div className="sm:hidden flex flex-col items-center">
            <h3 className="font-semibold text-base group-hover:text-primary transition-colors">
              {user.username}
            </h3>
            <Badge variant="outline" className="text-xs">
              {user.role}
            </Badge>
          </div>
        </div>
        
        <div className="flex-grow flex flex-col sm:flex-row items-center justify-between w-full">
          <div className="hidden sm:block text-center sm:text-left w-full">
            <div className="flex items-center space-x-2 justify-center sm:justify-start">
              <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                {user.username}
              </h3>
              <Badge variant="outline" className="text-xs">
                {user.role}
              </Badge>
            </div>
            <p className="text-muted-foreground max-w-[250px] text-sm truncate text-center sm:text-left">
              {user.about || "No bio available"}
            </p>
          </div>
          
          <div className="mt-2 sm:mt-0 sm:ml-4">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => handleProfileNavigation(user.id)}
              className="w-full sm:w-auto"
            >
              <MessageSquare className="mr-2 h-4 w-4" /> View Profile
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ViewProfile() {
    const [loading, setLoading] = useState(false);
    const [fLoading,setFloading] = useState(false)
    const [posts, setPosts] = useState<Post[]>([]);
    const [user, setUser] = useState<User>();
    const [isFollowing, setIsFollowing] = useState(false);
    const {toast} = useToast()
    const { id } = useParams();
    const jwt = localStorage.getItem('jwt')
    const navigate = useNavigate()
    if(!jwt){
        navigate('/')
    }
    const currentUserId = localStorage.getItem('userId');
    //console.log("rendering")

    const [key, setKey] = useState(id);
   useEffect(()=>{
    
   },[user])
    
  useEffect(() => {
   setPosts([])
    if (id) {
      setKey(id)
      const jwt = localStorage.getItem('jwt');
      const fetchPosts = async () => {
        try {
          setLoading(true);
          const res = await axios.get(`${BACKEND_URL}/api/v1/user/auth/${id}`, {
            headers: {
              Authorization: jwt
            }
          });
          setPosts([...res.data.posts]);
          setUser(res.data.user);
          
          const x = res.data.user.followers.find((u : SubUser)=> u.id == currentUserId)
          if(x){
              setIsFollowing(true)
          }
        } catch (e) {
          console.error(e);
          // Optionally, show an error toast
          toast({
            title: "Failed to load profile",
            description: "Could not retrieve user information",
            variant: "destructive"
          });
        } finally {
          setLoading(false);
        }
      };
      fetchPosts();
    }
  }, [id,jwt,currentUserId,toast]);

  

  const handleFollowToggle = async () => {
    try {
      setFloading(true);
      if (isFollowing) {
        // Unfollow
        await axios.get(`${BACKEND_URL}/api/v1/user/auth/unfollow/${id}`, {
          headers: {
            Authorization: jwt
          }
        });
        
        // Update local state
        if (user) {
          const updatedFollowers = user.followers.filter(
            (follower) => follower.id !== currentUserId
          );
          setUser({
            ...user,
            followers: updatedFollowers
          });
        }
        setIsFollowing(false);
      } else {
        // Follow
        const res = await axios.get(`${BACKEND_URL}/api/v1/user/auth/follow/${id}`, {
          headers: {
            Authorization: jwt
          }
        });
        
        // Update local state
        if (user) {
          const newFollower = {
            id: currentUserId || res.data.user.id,
            username: res.data.user.username,
            about: res.data.user.about,
            role: res.data.user.role,
            profileImage : res.data.user.profileImage
          };
          setUser({
            ...user,
            followers: [...user.followers, newFollower]
          });
        }
        setIsFollowing(true);
      }
    } catch (error) {
     toast({
      title : "Request Failed",
      variant :'destructive'
     })
    } finally {
      setFloading(false);
    }
  };

  
            


  const handleShareProfile = () => {
    navigator.clipboard.writeText(window.location.href)
      .then(() => alert("Profile link copied!"))
      .catch(err => console.error('Failed to copy: ', err));
  };

  return (
    <div className="bg-gray-50 min-h-[105vh]">
      <Navbar onSearch={() => {}} />
        
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-[1500px] container mx-auto px-4 py-8 grid md:grid-cols-3 gap-8"
      >
        {/* Sidebar Profile Section */}
        {loading ? <div className="flex items-center justify-center" style={{minHeight:'50vh'}}>
            <Loader />
        </div> : <Card className="md:col-span-1 h-fit max-w-[95vw]">
          <CardHeader className="flex flex-col items-center space-y-4 relative">
          {id === currentUserId ? (
  <div className="absolute top-3 right-3">
    {user && (
      <EditProfileDialog
        user={{
          username: user.username,
          about: user.about || '',
          role: user.role,
          profileImage : user.profileImage
        }}
        onProfileUpdate={(updatedUser) => {
          
          if (user) {
            console.log(updatedUser)
            setUser({
              ...user,
              ...updatedUser
            });
          }
        }}
      />
    )}
  </div>
) : null}
            <Avatar className="w-40 h-40 border-4 border-primary">
              <AvatarImage 
                src={user?.profileImage} 
                alt={user?.username} 
                className="object-cover"
              />
              <AvatarFallback>
                {user?.username.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            
            <div className="text-center">
              <h2 className="text-2xl font-bold">{user?.username}</h2>
              <Badge variant="secondary" className="mt-2">
                <Briefcase className="mr-2 h-4 w-4" />
                {user?.role}
              </Badge>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="text-center">
              <p className="font-semibold text-lg">{user?.followers.length}</p>
              <p className="text-muted-foreground text-sm">Followers</p>
            </div>
            <Separator orientation="vertical" />
            <div className="text-center">
              <p className="font-semibold text-lg">{user?.following.length}</p>
              <p className="text-muted-foreground text-sm">Following</p>
            </div>
          </div>

          <Separator />

          <p className="text-muted-foreground text-center">
            {user?.about || "No bio available"}
          </p>

          <div className="flex space-x-4">
            {/* Only show follow/unfollow if not viewing own profile */}
            {currentUserId !== id && (
              <Button 
                className="w-full" 
                variant="default"
                onClick={handleFollowToggle}
                disabled={fLoading}
              >
                {fLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <><UserPlus className="mr-2 h-4 w-4" /> 
                {isFollowing ? 'Unfollow' : 'Follow'}</>}
              </Button>
            )}
            <Button 
              className="w-full" 
              variant="outline"
              onClick={handleShareProfile}
            >
              <Share2 className="mr-2 h-4 w-4" /> Share
            </Button>
          </div>
        </CardContent>
        </Card>}

        {/* Content Section */}
        <Card key={key} className="md:col-span-2 max-w-[95vw]">
          
          <Tabs defaultValue="posts">
            <TabsList className="w-full justify-start bg-transparent border-b">
              <TabsTrigger 
                value="posts" 
                className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary"
              >
                
                
                <MessageCircle className="mr-2 h-4 w-4" />
                Posts
              </TabsTrigger>
              
              <TabsTrigger 
                        value="followers" 
                        className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary"
                    >
                        <Users className="mr-2 h-4 w-4" />
                        Followers
                    </TabsTrigger>
              {currentUserId === id && (
                    <>
                    <TabsTrigger 
                        value="following" 
                        className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary"
                    >
                        <Users className="mr-2 h-4 w-4" />
                        Following
                    </TabsTrigger>
                    </>
                )}
            </TabsList>

            <TabsContent key={`${id}-${user?.about}`} value="posts" className="p-4 overflow-y-scroll" style={{maxHeight:'100vh'}}>
            
              {loading ? <>
              
                <div className='w-full'><BlogPostSkeleton />
                <BlogPostSkeleton />
                <BlogPostSkeleton /></div>
              </> : (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ staggerChildren: 0.1 }}
                  className="space-y-4"
                >
                  
                  {posts.length > 0 ? posts.map((post) => (
                    <motion.div
                      key={post.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
        
                      <BlogCard 
                        id={post.id}
                        category={post.category}
                        content={post.content}
                        title={post.title}
                        createdAt={post.createdAt}
                        author={post.author}
                        likeBy={post.likedBy}
                        postImage={post.postImage}
                      />
                    </motion.div>
                  )) : <p className="text-gray-400 text-center">NO POSTS</p>}
                </motion.div>
              )}
            </TabsContent>

            <TabsContent value="followers" className="p-4">
                        <Card className="bg-white border-primary/10 shadow-sm">
                        <CardContent className="p-6">
                            <h3 className="text-2xl font-bold mb-6 flex items-center text-primary">
                            <Users className="mr-3 h-6 w-6" />
                            Followers 
                            <span className="ml-2 text-muted-foreground text-base">
                                ({user?.followers.length || 0})
                            </span>
                            </h3>
                            
                            {user?.followers.length === 0 ? (
                            <div className="text-center py-8 bg-gray-50 rounded-lg">
                                <Users className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                                <p className="text-muted-foreground">
                                    No followers yet. Keep creating amazing content!
                                </p>
                            </div>
                            ) : (
                            <ScrollArea className="h-[500px] w-full pr-4">
                                <div className="space-y-3">
                                {user?.followers.map((follower) => (
                                    <UserListItem 
                                      key={follower.id} 
                                      user={follower} 
                                      
                                     
                                    />
                                ))}
                                </div>
                            </ScrollArea>
                            )}
                        </CardContent>
                        </Card>
                    </TabsContent>

            {currentUserId === id && (
                    <>
                    
                    <TabsContent value="following" className="p-4">
                        <Card className="bg-white border-primary/10 shadow-sm">
                        <CardContent className="p-6">
                         
                        
                            <h3 className="text-2xl font-bold mb-6 flex items-center text-primary">
                            <UserCog className="mr-3 h-6 w-6" />
                            Following 
                            <span className="ml-2 text-muted-foreground text-base">
                                ({user?.following.length || 0})
                            </span>
                            </h3>
                            
                            {user?.following.length === 0 ? (
                            <div className="text-center py-8 bg-gray-50 rounded-lg">
                                <UserCog className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                                <p className="text-muted-foreground">
                                    You're not following anyone yet. Explore more users!
                                </p>
                            </div>
                            ) : (
                            <ScrollArea className="h-[500px] w-full pr-4">
                                <div className="space-y-3">
                                {user?.following.map((following) => (
                                    <UserListItem 
                                      key={following.id} 
                                      user={following} 
                                     
                                      
                                    />
                                ))}
                                </div>
                            </ScrollArea>
                            )}
                        </CardContent>
                        </Card>
                    </TabsContent>
                    </>
                )}
          </Tabs>
        </Card>
      </motion.div>
    </div>
  );
}

export default ViewProfile;
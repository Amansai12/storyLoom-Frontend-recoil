import { Route, Routes } from "react-router-dom";
import { useEffect} from "react";


import Signin from "./pages/Signin";
import Signup from "./pages/Signup";
import Blogs from "./pages/Blogs";
import Home from "./pages/Home";
import PageNotFound from "./pages/PageNotFound";
import ViewProfile from "./pages/ViewProfile";
import BlogPostViewer from "./components/BlogPostViewer";
import BlogUploadPage from "./components/PostUpload";
import AboutPage from "./pages/About";
import { useUser } from "./context/UserContext";
import Favourites from "./pages/Favourites";
import axios from "axios";
import { BACKEND_URL } from "./config";
import { useCategories } from "./context/CategoriesContext";

function App() {
  const {setUserCategories} = useCategories()
  const {setAuth} = useUser()
  useEffect(() => {
    const userId = localStorage.getItem('userId')
    const jwt = localStorage.getItem('jwt')
    const profileImage = localStorage.getItem('profileImage')
    if(userId && profileImage){
      setAuth({id : userId,profileImage : profileImage})
    }
    const fetch = async () => {
      const res = await axios.get(`${BACKEND_URL}/api/v1/user/auth`,{
        headers :{
          Authorization : jwt
        }
      })
      setAuth({id : res.data.id,profileImage:res.data.profileImage})
      setUserCategories(res.data.interested)
    }
    fetch()
    
  }, []);

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/blogs" element={<Blogs />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/blog/favourites" element={<Favourites />} />
        <Route path="/profile/:id" element={<ViewProfile />} />
        <Route path="/blog/upload" element={<BlogUploadPage />} />
        <Route path="/blog/:id" element={<BlogPostViewer />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </>
  );
}

export default App;
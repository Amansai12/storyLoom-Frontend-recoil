import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { z } from 'zod'
import { useToast } from "@/hooks/use-toast"
import axios from 'axios'
import { BACKEND_URL } from '@/config'
import { Eye, EyeOff, BookOpen, Pen, Globe } from 'lucide-react'
import { jwtDecode } from 'jwt-decode'
import { useUser } from '@/context/UserContext'
import { useCategories } from '@/context/CategoriesContext'
import { useSetRecoilState } from 'recoil'
import { blogsAtom } from '@/store/blogsAtom'
import { userAtom } from '@/store/userAtom'
// type post = {

// }
// type user = {
//     id : string,
//     username : string,
//     about : string,
//     role : string,
//     posts : post[],
//     followers : user[]
//     following : user[],
//     profileImage : string,
//     interested : string[]
// }
function Signin() {
    const navigate = useNavigate()
    const setUsers = useSetRecoilState(userAtom)
    const setBlogs = useSetRecoilState(blogsAtom)
    
    const {toast} = useToast()
    const [showPassword, setShowPassword] = useState(false)
    const {setAuth} = useUser()
    type User = {
        email : string,
        password : string
    }

    const FormSchema = z.object({
        email : z.string().email({message: "Email is Invalid"}),
        password : z.string().min(1,{message : "Password must not be empty"}),
    })

    const [inputs,setInputs] = useState<User>({email:"",password:""});
    const [loading,setLoading] = useState(false)
    const {setUserCategories} = useCategories()
    const handleSubmit = async () => {
        const res = FormSchema.safeParse(inputs)
        if(res.success){
            setLoading(true)
            try{
                const result = await axios.post(`${BACKEND_URL}/api/v1/user/signin`,res.data);
                
                setLoading(false)
                localStorage.setItem("jwt",result.data.jwt);
                localStorage.setItem("profileImage",result.data.profileImage)
                setUserCategories(result.data.interested)
                const decode = jwtDecode(result.data.jwt)
                setUsers({[result.data.user.id] : result.data.user})
                setBlogs({["Your posts"] :{posts : result.data.user.posts,hasMore : false,page : 2,lastFetchTime : Date.now()}})
                //@ts-ignore
                setAuth({id : decode.id ,profileImage : result.data.profileImage})
                //@ts-ignore
                localStorage.setItem("userId",decode.id)
                navigate('/blogs')
                toast({
                    title:"Logged in successfully",
                    className : "bg-green-800 text-white"
                })
            }catch(e : any){
                console.log(e)
                setLoading(false)
                toast({
                    title: "Uh oh! Something went wrong.",
                    description: e.response?.data?.error,
                    variant:'destructive'
                })
            }
        }else{
            toast({
                title: "Uh oh! Something went wrong.",
                description: res.error.issues[0].message,
                variant :'destructive'
            })
        }
    }

    return (
        <div className="min-h-screen flex bg-gradient-to-br from-white to-gray-50">
            <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12">
                <div className="w-full max-w-md space-y-8">
                    <div className="text-center">
                        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
                            Welcome Back
                        </h1>
                        <p className="mt-3 text-lg text-gray-600">
                            Continue your writing journey
                        </p>
                    </div>
                    <div className="bg-white shadow-xl rounded-2xl p-8 space-y-6">
                        <div className="space-y-4">
                            <div>
                                <Label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                    Email Address
                                </Label>
                                <Input 
                                    type="email" 
                                    id="email" 
                                    placeholder="you@example.com" 
                                    className="w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 transition duration-300"
                                    onChange={(e) => setInputs({...inputs, email: e.target.value})} 
                                />
                            </div>
                            <div>
                                <Label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                                    Password
                                </Label>
                                <div className="relative">
                                    <Input 
                                        type={showPassword ? "text" : "password"} 
                                        id="password" 
                                        placeholder="Enter your password" 
                                        className="w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 transition duration-300 pr-10"
                                        onChange={(e) => setInputs({...inputs, password: e.target.value})} 
                                    />
                                    <button 
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700 transition"
                                    >
                                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>
                                {/* <div className="text-right mt-2">
                                    <Link 
                                        to="/forgot-password" 
                                        className="text-sm text-blue-600 hover:text-blue-500 transition"
                                    >
                                        Forgot Password?
                                    </Link>
                                </div> */}
                            </div>
                        </div>
                        <Button 
                            disabled={loading} 
                            onClick={handleSubmit} 
                            className="w-full bg-black hover:bg-gray-700 text-white rounded-lg py-3 transition duration-300 ease-in-out transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        >
                            {loading ? "Logging In..." : "Sign In"}
                        </Button>
                        <div className="text-center">
                            <p className="text-sm text-gray-600">
                                Don't have an account? {' '}
                                <Link 
                                    to="/signup" 
                                    className="font-semibold text-black hover:text-gray-500 transition"
                                >
                                    Sign up
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="hidden lg:block lg:w-1/2 bg-cover bg-center relative" style={{
                backgroundImage: 'linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url("https://tse1.mm.bing.net/th?id=OIG3.BbvmAa4HuO1sgObH6mVb&pid=ImgGn")'
            }}>
                <div className="absolute inset-0 flex items-center justify-center p-16">
                    <div className="text-white text-center max-w-md">
                        <div className="flex justify-center mb-8 space-x-4">
                            <div className="bg-white/10 p-4 rounded-full">
                                <BookOpen className="w-12 h-12 text-white" />
                            </div>
                            <div className="bg-white/10 p-4 rounded-full">
                                <Pen className="w-12 h-12 text-white" />
                            </div>
                            <div className="bg-white/10 p-4 rounded-full">
                                <Globe className="w-12 h-12 text-white" />
                            </div>
                        </div>
                        <h2 className="text-5xl font-bold mb-6 leading-tight drop-shadow-lg">
                            Explore. Write. Share.
                        </h2>
                        <p className="text-xl text-gray-300 leading-relaxed mb-8 drop-shadow-md">
                            Your thoughts have power. Transform ideas into stories, connect with readers, and leave your mark on the world.
                        </p>
            
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Signin
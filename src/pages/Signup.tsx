import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { z } from 'zod'
import { useToast } from "@/hooks/use-toast"
import axios from 'axios'
import { BACKEND_URL } from '@/config'
import { Eye, EyeOff, BookOpen, Pen, Globe, ChevronUp, ChevronDown } from 'lucide-react'
import { motion } from 'framer-motion'
import { jwtDecode } from 'jwt-decode'
import { Checkbox } from '@/components/ui/checkbox'
import { useCategories } from '@/context/CategoriesContext'
import { useUser } from '@/context/UserContext'
import { useSetRecoilState } from 'recoil'
import { userAtom } from '@/store/userAtom'


function Signup() {
    const navigate = useNavigate()
    const {toast} = useToast()
    const [showPassword, setShowPassword] = useState(false)
    const {setAuth} = useUser()
    // Categories for selection
    const CATEGORIES = [
        { value: 'web-development', label: 'Web Development' },
        { value: 'machine-learning', label: 'Machine Learning' },
        { value: 'data-science', label: 'Data Science' },
        { value: 'artificial-intelligence', label: 'Artificial Intelligence' },
        { value: 'cybersecurity', label: 'Cybersecurity' },
        { value: 'mobile-development', label: 'Mobile Development' },
        { value: 'cloud-computing', label: 'Cloud Computing' },
        { value: 'blockchain', label: 'Blockchain' },
        { value: 'ux-design', label: 'UX Design' },
        { value: 'digital-marketing', label: 'Digital Marketing' },
    
        // Additional Sectors
        { value: 'e-commerce', label: 'E-commerce' },
        { value: 'game-development', label: 'Game Development' },
        { value: 'robotics', label: 'Robotics' },
        { value: 'big-data', label: 'Big Data' },
        { value: 'virtual-reality', label: 'Virtual Reality' },
        { value: 'augmented-reality', label: 'Augmented Reality' },
        { value: 'internet-of-things', label: 'Internet of Things (IoT)' },
        { value: 'product-management', label: 'Product Management' },
        { value: 'business-analytics', label: 'Business Analytics' },
        { value: 'finance-and-investment', label: 'Finance and Investment' },
        { value: 'supply-chain-management', label: 'Supply Chain Management' },
        { value: 'renewable-energy', label: 'Renewable Energy' },
        { value: 'biotechnology', label: 'Biotechnology' },
        { value: 'healthcare-technology', label: 'Healthcare Technology' },
        { value: 'self-driving-cars', label: 'Self-Driving Cars' },
        { value: 'quantum-computing', label: 'Quantum Computing' },
        { value: 'aerospace', label: 'Aerospace' },
        { value: 'graphic-design', label: 'Graphic Design' },
        { value: 'content-creation', label: 'Content Creation' },
        { value: 'environmental-science', label: 'Environmental Science' },
        { value: 'space-exploration', label: 'Space Exploration' },
        { value: 'photography', label: 'Photography' },
        { value: 'food-technology', label: 'Food Technology' },
        { value: 'psychology', label: 'Psychology' },
        { value: 'linguistics', label: 'Linguistics' },
        { value: 'education-technology', label: 'Education Technology' },
        { value: 'law-and-legal-tech', label: 'Law and Legal Tech' }
    ];
    
    type User = {
        username: string,
        email: string,
        password: string,
        about: string,
        profession: string,
        interestedCategories: string[]
    }
    
    const FormSchema = z.object({
        username: z.string().min(4, {
          message: "Username must be at least 4 characters.",
        }),
        email: z.string().email({message: "Email is Invalid"}),
        password: z.string().min(6,{message:"Password must be at least 6 characters"}),
        about: z.string().max(500, {message: "About section must be 500 characters or less"}),
        profession: z.string().min(2, {message: "Profession must be at least 2 characters"}).max(50, {message: "Profession must be 50 characters or less"}),
        interestedCategories: z.array(z.string()).min(1, {message: "Select at least one interested category"})
    })

   const setUsers = useSetRecoilState(userAtom)
    const [showAllCategories, setShowAllCategories] = useState(false)
    const [inputs, setInputs] = useState<User>({
        username: "",
        email: "",
        password: "",
        about: "",
        profession: "",
        interestedCategories: []
    });
    const [loading, setLoading] = useState(false)
    const handleCategoryToggle = (category: string) => {
        setInputs(prev => {
            const currentCategories = prev.interestedCategories;
            const newCategories = currentCategories.includes(category)
                ? currentCategories.filter(c => c !== category)
                : [...currentCategories, category];
            return { ...prev, interestedCategories: newCategories };
        });
    }
    const {setUserCategories} = useCategories()
    const handleSubmit = async () => {
        const res = FormSchema.safeParse(inputs)
        if(res.success){
            setLoading(true)
            try{
                const result = await axios.post(`${BACKEND_URL}/api/v1/user/signup`, res.data);
                setLoading(false)
                localStorage.setItem("jwt", result.data.jwt);
                localStorage.setItem("profileImage",result.data.profileImage)
                const decode = jwtDecode(result.data.jwt)
                setUserCategories(result.data.interested)
                setUsers({[result.data.user.id] : result.data.user})
                //@ts-ignore
                setAuth({id : decode.id,profileImage : result.data.profileImage})
                //@ts-ignore
                localStorage.setItem("userId", decode.id)
                navigate('/blogs')
                toast({
                    title: "Signed up successfully",
                    className: "bg-green-800 text-white"
                })
            }catch(e : any){
                setLoading(false)
                toast({
                    title: "Uh oh! Something went wrong.",
                    description: e.response.data.error,
                    variant: 'destructive'
                })
            }
        }else{
            toast({
                title: "Uh oh! Something went wrong.",
                description: res.error.issues[0].message,
                variant: 'destructive'
            })
        }
    }
    
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
                stiffness: 300,
                damping: 24
            }
        }
    }

    const backgroundVariants = {
        hidden: { opacity: 0, scale: 0.95 },
        visible: { 
            opacity: 1, 
            scale: 1,
            transition: {
                duration: 0.5,
                ease: "easeInOut"
            }
        }
    }
    
    return (
        <div className="min-h-screen flex bg-gradient-to-br from-white to-gray-50">
            <motion.div 
                initial="hidden"
                animate="visible"
                variants={backgroundVariants}
                className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12"
            >
                <motion.div 
                    variants={containerVariants}
                    className="w-full max-w-md space-y-8"
                >
                    <motion.div 
                        variants={itemVariants} 
                        className="text-center"
                    >
                        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
                            Create Your Account
                        </h1>
                        <p className="mt-3 text-lg text-gray-600">
                            Start your writing journey today
                        </p>
                    </motion.div>
                    <motion.div 
                        variants={itemVariants}
                        className="bg-white shadow-xl rounded-2xl p-8 space-y-6"
                    >
                        <motion.div 
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            className="space-y-4"
                        >
                            <motion.div variants={itemVariants}>
                                <Label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                                    Username
                                </Label>
                                <Input 
                                    type="text" 
                                    id="username" 
                                    placeholder="At least 4 characters" 
                                    className="w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 transition duration-300"
                                    onChange={(e) => setInputs({...inputs, username: e.target.value})} 
                                />
                            </motion.div>
                            <motion.div variants={itemVariants}>
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
                            </motion.div>
                            <motion.div variants={itemVariants}>
                                <Label htmlFor="profession" className="block text-sm font-medium text-gray-700 mb-2">
                                    Profession
                                </Label>
                                <Input 
                                    type="text" 
                                    id="profession" 
                                    placeholder="e.g., Web Developer, Designer, Writer" 
                                    className="w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 transition duration-300"
                                    onChange={(e) => setInputs({...inputs, profession: e.target.value})} 
                                />
                            </motion.div>
                            <motion.div variants={itemVariants}>
                                <Label htmlFor="about" className="block text-sm font-medium text-gray-700 mb-2">
                                    About You
                                </Label>
                                <Textarea 
                                    id="about" 
                                    placeholder="Tell us a bit about yourself (max 500 characters)" 
                                    className="w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 transition duration-300"
                                    onChange={(e) => setInputs({...inputs, about: e.target.value})} 
                                />
                            </motion.div>
                            <motion.div variants={itemVariants}>
                        <Label className="block text-sm font-medium text-gray-700 mb-2">
                            Interested Categories
                        </Label>
                        <div className="grid grid-cols-2 gap-2 border rounded-lg p-4">
                            {CATEGORIES.slice(0, showAllCategories ? undefined : 10).map((category) => (
                                <div key={category.value} className="flex items-center space-x-2">
                                    <Checkbox 
                                        id={category.value}
                                        checked={inputs.interestedCategories.includes(category.value)}
                                        onCheckedChange={() => handleCategoryToggle(category.value)}
                                    />
                                    <Label 
                                        htmlFor={category.value}
                                        className="text-sm font-normal"
                                    >
                                        {category.label}
                                    </Label>
                                </div>
                            ))}
                        </div>
                        {CATEGORIES.length > 10 && (
                            <div className="flex justify-center mt-2">
                                <Button 
                                    variant="ghost" 
                                    onClick={() => setShowAllCategories(!showAllCategories)}
                                    className="flex items-center text-sm text-gray-600 hover:text-gray-900"
                                >
                                    {showAllCategories ? (
                                        <>
                                            Show Less <ChevronUp className="ml-2 h-4 w-4" />
                                        </>
                                    ) : (
                                        <>
                                            Show More <ChevronDown className="ml-2 h-4 w-4" />
                                        </>
                                    )}
                                </Button>
                            </div>
                        )}
                    </motion.div>
                            <motion.div variants={itemVariants}>
                                <Label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                                    Password
                                </Label>
                                <div className="relative">
                                    <Input 
                                        type={showPassword ? "text" : "password"} 
                                        id="password" 
                                        placeholder="At least 6 characters" 
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
                            </motion.div>
                        </motion.div>
                        <motion.div variants={itemVariants}>
                            <Button 
                                disabled={loading} 
                                onClick={handleSubmit} 
                                className="w-full bg-black hover:bg-gray-700 text-white rounded-lg py-3 transition duration-300 ease-in-out transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                            >
                                {loading ? "Creating Account..." : "Sign Up"}
                            </Button>
                        </motion.div>
                        <motion.div variants={itemVariants} className="text-center">
                            <p className="text-sm text-gray-600">
                                Already have an account? {' '}
                                <Link 
                                    to="/signin" 
                                    className="font-semibold text-black hover:text-gray-500 transition"
                                >
                                    Log in
                                </Link>
                            </p>
                        </motion.div>
                    </motion.div>
                </motion.div>
            </motion.div>
            <div 
                className="hidden lg:block lg:w-1/2 bg-cover bg-center relative" 
                style={{
                    backgroundImage: 'linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url("https://tse1.mm.bing.net/th?id=OIG3.BbvmAa4HuO1sgObH6mVb&pid=ImgGns")'
                }}
            >
                <div className="absolute inset-0 flex items-center justify-center p-16">
                    <div className="text-white text-center max-w-md overflow-hidden">
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
                            Write. Connect. Inspire.
                        </h2>
                        <p className="text-xl text-gray-300 leading-relaxed mb-8 drop-shadow-md">
                            Your unique voice matters. Join a community of writers, share your stories, and make an impact through words.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Signup
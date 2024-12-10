
import LandingPage from "@/components/Hero"
import HomeNav from "@/components/HomeNav"
import { useEffect } from "react"
import { useNavigate } from "react-router-dom"

function Home() {
  
  const navigate = useNavigate()
  useEffect(()=>{
    const jwt = localStorage.getItem('jwt')
    if(jwt){
      navigate('/blogs')
      return
    }
  },[])
  return (
    <>
    <HomeNav />
    <LandingPage />
    </>
  )
}

export default Home
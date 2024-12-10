
import { useNavigate } from 'react-router-dom'
import { Button } from './ui/button'

function HomeNav() {
    const navigate = useNavigate();
  return (
    <div className='bg-gray-100 shadow-black px-8' style={{borderBottom:'1px solid black'}}>
        <div className=' flex justify-between items-center py-4 mx-auto' style={{maxWidth:"1300px"}}>
        <h1 className='text-3xl font-bold'>StoryLoom</h1>
        <Button onClick={() => navigate('/signin')}>Login</Button>
    </div>
    </div>
  )
}

export default HomeNav
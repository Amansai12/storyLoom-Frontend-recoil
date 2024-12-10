
import { lineSpinner } from 'ldrs'
function Loader() {
    

    lineSpinner.register()
    
    // Default values shown
    return <div className='w-full flex items-center justify-center p-3'>
        <l-line-spinner
      size="25"
      stroke="3"
      speed="1" 
      color="black" 
    ></l-line-spinner>
    </div>
}

export default Loader
import Login from './pages/Login';
import { backendIsInitialized } from './API/Patient';
import { useEffect, useState } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';




function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initialized()
  }, []); 

  async function initialized() {
    const status=await backendIsInitialized();
    if(status===200){
      setLoading(false);
    }
  }

  return (
    <>
   
    
    <div className=' relative' >
      
      <Login/>
      {loading && <div className="flex absolute top-0 left-0 right-0 bottom-0 items-center justify-center   min-h-screen min-w-screen bg-gray-800 opacity-70 z-50">
        <div className="w-10 h-10 rounded-full bg-green-400 animate-ping"></div>
      </div>}

    </div>
       <ToastContainer />
    </>
  )
}

export default App

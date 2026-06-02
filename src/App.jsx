import { backendIsInitialized } from './API/Patient';
import { useQuery } from '@tanstack/react-query';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const { data, isLoading } = useQuery({
    queryKey: ['backendStatus'],
    queryFn: async () => {
      const status = await backendIsInitialized();
      return status;
    },
    enabled: true,
    staleTime: Infinity,
  });

  const loading = isLoading || data !== 200;

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <div className='relative'>
        {loading && <div className="flex absolute top-0 left-0 right-0 bottom-0 items-center justify-center   min-h-screen min-w-screen bg-gray-800 opacity-70 z-50">
          <div className="w-10 h-10 rounded-full bg-green-400 animate-ping"></div>
        </div>}
      </div>
    </>
  )
}

export default App

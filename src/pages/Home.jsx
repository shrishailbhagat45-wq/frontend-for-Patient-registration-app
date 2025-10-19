import SearchBar from '../components/SearchBar';
import RegisterButton from '../components/RegisterButton';
import Navbar from '../components/Navbar';

const Home = () => {
    return (
        <div>
            <Navbar />
            <div className='absolute top-20 right-10 z-10'>
                <RegisterButton />
            </div>
            <div className=" flex flex-col items-center justify-center h-screen w-full bg-gray-100 space-y-40">
                
                <SearchBar  />
                
            </div>
        </div>
    );
};

export default Home;
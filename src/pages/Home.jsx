import SearchBar from '../components/SearchBar';
import RegisterButton from '../components/RegisterButton';
import Navbar from '../components/Navbar';

const Home = () => {
    return (
        <div className=" flex flex-col items-center justify-center h-screen w-full bg-gray-100 space-y-40">
            <Navbar />
            <SearchBar  />
            <RegisterButton />
        </div>
    );
};

export default Home;
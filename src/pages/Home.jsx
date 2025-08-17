import SearchBar from '../components/SearchBar';
import RegisterButton from '../components/RegisterButton';

const Home = () => {
    return (
        <div className=" flex flex-col items-center justify-center min-h-screen min-w-screen bg-gray-100 space-y-40">
            <SearchBar />
            <RegisterButton />
        </div>
    );
};

export default Home;
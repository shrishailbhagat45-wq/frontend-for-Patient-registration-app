import SearchBar from '../components/SearchBar';
import Navbar from '../components/Navbar';
import { useQuery } from '@tanstack/react-query';
import { getQueuedPatients } from '../API/Patient';
import { FiUsers, FiClock, FiUserPlus, FiActivity } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const navigate = useNavigate();
    
    // Fetch queued patients for stats
    const { data: queue = [] } = useQuery({
        queryKey: ['queuedPatients'],
        queryFn: getQueuedPatients,
    });

    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar />
            
            {/* Main Content */}
            <div className="pt-20 px-4 md:px-8 lg:px-12 pb-8">
                {/* Header Section */}
                <div className="max-w-6xl mx-auto mb-6">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-semibold text-slate-800 mb-1">
                            Patient Management
                        </h1>
                        <p className="text-sm text-slate-500">Search for existing patients or register new ones</p>
                    </div>
                </div>

                {/* Quick Stats Dashboard */}
                <div className="max-w-6xl mx-auto mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Total Patients in Queue */}
                        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-5 hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-slate-500 font-medium">Patients in Queue</p>
                                    <p className="text-3xl font-bold text-slate-800 mt-2">{queue?.length || 0}</p>
                                </div>
                                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                                    <FiUsers className="text-blue-600 text-2xl" />
                                </div>
                            </div>
                        </div>

                        {/* Average Wait Time */}
                        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-5 hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-slate-500 font-medium">Status</p>
                                    <p className="text-xl font-semibold text-green-600 mt-2">
                                        {queue?.length > 0 ? 'Active' : 'No Patients'}
                                    </p>
                                </div>
                                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                                    <FiActivity className="text-green-600 text-2xl" />
                                </div>
                            </div>
                        </div>                        {/* Quick Action */}
                        <div 
                            onClick={() => navigate('/register')}
                            className="bg-gradient-to-br from-blue-600 to-teal-500 rounded-lg shadow-sm p-5 hover:shadow-md transition-all cursor-pointer transform hover:scale-105"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-blue-100 font-medium">Quick Actions</p>
                                    <p className="text-lg font-semibold text-white mt-2">Register Patient</p>
                                </div>
                                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                                    <FiUserPlus className="text-white text-2xl" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Search Bar Section */}
                <div className="max-w-6xl mx-auto">
                    <SearchBar />
                </div>
            </div>
        </div>
    );
};

export default Home;
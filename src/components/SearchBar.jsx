import React, { useState } from 'react';
import { getPatients } from '../API/Patient';
import { Link } from 'react-router';

const SearchBar = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredPatients, setFilteredPatients] = useState([]);
    const [selectedPatient, setSelectedPatient] = useState(null);

    const handleSearchChange = async(event) => {
        const value = event.target.value;
        setSearchTerm(value);

        if (value.trim() === '') {
            setFilteredPatients([]);
        } else {
            const matches = await getPatients(value);
            console.log("Search matches:", matches);
            setFilteredPatients(matches.data);
        }
        setSelectedPatient(null);
    };

    const handleSelectPatient = (patient) => {
        setSelectedPatient(patient);
        setSearchTerm(patient.name);
        setFilteredPatients([]);
    };

    return (
        <div className="relative w-full max-w-2xl px-4">
            <form onSubmit={e => e.preventDefault()}>
                <input
                    type="text"
                    placeholder="Search for existing patients..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="min-w-full px-4 py-2 text-lg border border-gray-800 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 text-black bg-gray-300"
                    autoComplete="off"
                />
            </form>
            {filteredPatients.length > 0 && (
                <ul className="absolute left-0 right-0 bg-white border border-gray-300 rounded mt-1 z-10 max-h-60 overflow-y-auto text-black">
                    {filteredPatients.map(patient => (
                        <Link to={`/patient/${patient.id}`} className='decoration-none '>
                        <li
                            key={patient.id}
                            className="px-4 py-2 cursor-pointer hover:bg-blue-100"
                            onClick={() => handleSelectPatient(patient)}
                        >
                            {patient.name}
                        </li>
                        </Link>))}
                </ul>
            )}
        </div>
    );
};

export default SearchBar;
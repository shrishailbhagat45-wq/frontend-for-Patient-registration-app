import React from 'react';
import { Link } from 'react-router';

const RegisterButton = () => {

    return (
        <Link to="/register" className='decoration-none '>    
        <button className=" w-full max-w-sm text-white bg-gradient-to-r from-indigo-400 via-indigo-500 to-indigo-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-indigo-300 dark:focus:ring-indigo-800 shadow-lg shadow-indigo-500/50 dark:shadow-lg dark:shadow-indigo-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 ">
            Register New Patient
        </button>
        </Link>
    );
};

export default RegisterButton;
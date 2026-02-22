import React from 'react';
import { Link } from 'react-router';

const RegisterButton = () => {

    return (
        <Link to="/register" className='decoration-none'>    
        <button className="px-5 py-2 text-white bg-blue-600 hover:bg-blue-700 font-medium rounded-lg text-sm transition-all shadow-sm">
            Register New Patient
        </button>
        </Link>
    );
};

export default RegisterButton;
import React from 'react';
import { Link } from 'react-router';

const RegisterButton = () => {

    return (
        <Link to="/register" className='decoration-none '>    
        <button className=" w-full max-w-sm px-6 py-3 bg-black rounded-lg  text-white font-semibold ">
            Register New Patient
        </button>
        </Link>
    );
};

export default RegisterButton;
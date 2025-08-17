import React from 'react';
import { Link } from 'react-router';

const RegisterButton = () => {

    return (
        <Link to="/register" className='decoration-none '>    
        <button className=" w-lg text-white">
            Register New Patient
        </button>
        </Link>
    );
};

export default RegisterButton;
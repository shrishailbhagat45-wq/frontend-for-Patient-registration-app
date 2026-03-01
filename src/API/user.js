import axios from "axios";
import axiosRetry from 'axios-retry';
axiosRetry(axios, { retries: 60 });
const token="Bearer "+localStorage.getItem("token");
const headers ={
        
        'Content-Type': 'application/json',
        'Authorization': token
      }
const url=import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';


//Login
export async function login(email,password) {
    try{
        const res=await axios.post(`${url}/auth/login`,{email,password});
        return res.data.data;
    }
    catch{
        toast.error("Invalid credential")
    }
    
}

//Receptionist api's

export async function addReceptionist(receptionistData) {
    const data = {
        ...receptionistData,
        doctorId: localStorage.getItem("doctorId")
    }
    const res= await axios.post(`${url}/user/addReceptionist`,data,{
            headers: headers
        });
    if(res.status!==201){
        throw new Error('Failed to add user', res.statusText);
    }
    return res.data;;
}

export async function getReceptionist(){
    const doctorId= localStorage.getItem("doctorId");
    const res= await axios.get(`${url}/user/receptionists/${doctorId}`,{
            headers: headers
        });
    return res.data;
}

export async function getUserById(id) {
    let response= null;
    try {
        response = await axios.get(`${url}/user/${id}`, { headers: headers });
    } catch (error) {
        console.error("Error fetching user by ID:", error);
    }
    return response?.data;
}

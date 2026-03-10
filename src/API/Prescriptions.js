import axios from "axios";
import axiosRetry from 'axios-retry';
axiosRetry(axios, { retries: 60 });
const token="Bearer "+localStorage.getItem("token");
const headers ={
        
        'Content-Type': 'application/json',
        'Authorization': token
      }
const url=import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

export async function getPrescriptionsByPatientId(id) {
    let response= null; 
    try {
         response = await axios.get(`${url}/prescriptions/patient/${id}`);
         console.log("Fetched prescriptions response:", response);
        if (response.status !== 200) {
           
            throw new Error('Failed to fetch prescriptions', response.statusText);
        }   
    } catch (error) {
        console.error('Error fetching prescriptions:', error);
        throw error;
    }
    return response.data;
}


export async function createPrescription(id,prescriptionData) {
    console.log("Creating prescription with data:", prescriptionData);
    let response= null;
    try {
         response = await axios.post(`${url}/prescriptions/add/${id}`, {...prescriptionData} );
         
         if (response.status !== 201) {
           
            throw new Error('Failed to fetch prescriptions', response.statusText);
        }   
    } catch (error) {
        console.error('Error fetching prescriptions:', error);
        throw error;
    }
    console.log("Response data:", response.data);
    return response.data;
}

export async function updatePrescription(id, prescriptionData) {
    console.log("Updating prescription", id, prescriptionData);
    let response = null;
    try {
        response = await axios.put(`${url}/prescriptions/${id}`, { ...prescriptionData });
        if (response.status !== 200) {
            throw new Error('Failed to update prescription', response.statusText);
        }
    } catch (error) {
        console.error('Error updating prescription:', error);
        throw error;
    }
    return response.data;
}

// get drug suggestions
export async function getDrugSuggestions(name){
    const res= await axios.post(`${url}/drugs`,{name});
    return res.data;
}
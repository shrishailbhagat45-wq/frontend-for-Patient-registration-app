import axios from "axios";
import axiosRetry from 'axios-retry';

axiosRetry(axios, { retries: 60 });
const token="Bearer "+localStorage.getItem("token");
const headers ={
        
        'Content-Type': 'application/json',
        'Authorization': token
      }
const url=import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

// Crate a new patient
export async function createPatient(patientData) {

    const data = {
        name:patientData.name,
        gender: patientData.gender,
        age: parseInt(patientData.age),
        phoneNumber: patientData.phoneNumber,
        weight: parseInt(patientData.weight),
        doctorId: localStorage.getItem("doctorId")
    }
    let response= null;
    try {
        response = await axios.post(`${url}/patient/create`, JSON.stringify(data) , {
        headers: headers
        });
        if (response.status !== 201) {
            console.log("Response status:", response.status);
            throw new Error('Failed to create patient', response.statusText);
        }
    } catch (error) {
        console.error('Error creating patient:', error);
        throw error;
    }
    console.log("Response data:", response);

    return response.data;
    
}


// Get patients by name (search)
export async function getPatients(name) {
    const data = { name: name.trim(), doctorId: localStorage.getItem("doctorId") };
        const response = await axios.post(`${url}/patient/getPatient`,data,{
            headers: headers
        });
        return response.data;
}

export async function getPatientById(id) {
    let response= null;
    try {
         response = await axios.get(`${url}/patient/${id}`,{
            headers: headers
        });
         console.log("Fetched patient response:", response);
        if (response.status !== 200) {

            throw new Error('Failed to fetch patient', response.statusText);
        }
    } catch (error) {
        console.error('Error fetching patient:', error);
        throw error;
    }

    return response.data;
    
}   

export async function getPrescriptionById(id) {
    let response= null;
    try {
            response = await axios.get(`${url}/prescriptions/${id}`,{
            headers: headers
        });
        if (response.status !== 200) {
            throw new Error('Failed to fetch prescription', response.statusText);
        }
    }
    catch (error) {
        console.error('Error fetching prescription:', error);
        throw error;
    }
    return response.data;
}

// patient queue api's

export async function addPatientToQueue(patient){
    console.log("Adding patient to queue:", patient);
    const res= await axios.post(`${url}/patient-queue`,{patient});
    if(res.status!==201){
        throw new Error('Failed to add patient to queue', res.statusText);
    }
    return res.data;
}

export async function getQueuedPatients(){
    const res= await axios.get(`${url}/patient-queue`);
    return res.data;
}

export async function removeFromQueueById(id){
    const res= await axios.delete(`${url}/patient-queue/${id}`);
    return res.data;
}

// Function to initialize the backend
export async function backendIsInitialized() {
    let response= null;
    try {
         response = await axios.get(`${url}`);
        if (response.status !== 200) {
            console.log("Response status:", response.status);
            throw new Error('Failed to fetch status', response.statusText);
        }
    } catch (error) {
        console.error('Error fetching status:', error);
        throw error;
    }
    console.log("Response data:", response);

    return response.status;
    
}


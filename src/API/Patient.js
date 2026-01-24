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
        userId: localStorage.getItem("id")
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
    const data = { name: name.trim() };
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

//Login
export async function login(email,password) {
    try{
        const res=await axios.post(`${url}/auth/login`,{email,password});
        return res.data;
    }
    catch{
        toast.error("Invalid credential")
    }
    
}


// Billing api's

export async function getBillingItems() {
    const res= await axios.get(`${url}/billing`);
    console.log("Billing items response:", res);
    return res.data;
}

export async function addItem(item) {
    const res = await axios.post(`${url}/billing`,item);
    if(res.status!==201){
        throw new Error('Failed to add item', res.statusText);
    }
    return res.data;
}

export async function updateItem(id,item){
    const res=await axios.put(`${url}/billing/${id}`,item)
    if(res.status!==200){
        throw new Error('Failed to add item', res.statusText);
    }
    return res.data;
}

export async function deleteItem(id) {
    await axios.delete(`${url}/billing/${id}`);
}

export async function createBill(billData) {
    console.log("Creating bill with data:", billData);
    const res= await axios.post(`${url}/patient-bills`,{billData});
    if(res.status!==201){
        throw new Error('Failed to create bill', res.statusText);
    }
    return res.data;
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

//Receptionist api's

export async function addReceptionist(receptionistData) {
    const data = {
        ...receptionistData,
        doctorId: localStorage.getItem("id")
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
    const doctorId= localStorage.getItem("id");
    const res= await axios.get(`${url}/user/receptionists/${doctorId}`,{
            headers: headers
        });
    return res.data;
}

// get drug suggestions
export async function getDrugSuggestions(name){
    const res= await axios.post(`${url}/drugs`,{name});
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


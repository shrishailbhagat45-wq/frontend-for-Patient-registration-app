import axios from "axios";
import axiosRetry from 'axios-retry';
axiosRetry(axios, { retries: 60 });
const token="Bearer "+localStorage.getItem("token");
const headers ={
        
        'Content-Type': 'application/json',
        'Authorization': token
      }
const url=import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000';

// Billing api's

export async function getBillingItems() {
    const res= await axios.get(`${url}/billing/${localStorage.getItem("doctorId")}`);
    console.log("Billing items response:", res);
    return res.data;
}

export async function addItem(item) {
    const res = await axios.post(`${url}/billing/${localStorage.getItem("doctorId")}`,item);
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
    
    const res= await axios.post(`${url}/patient-bills`,{billData});
    if(res.status!==201){
        throw new Error('Failed to create bill', res.statusText);
    }
    return res.data;
}

export async function getPatientBills({ doctorId, date, month }) {
    // date: YYYY-MM-DD, month: YYYY-MM
    const params = {};
    if (doctorId) params.doctorId = doctorId;
    if (date) params.date = date;
    if (month) params.month = month;
    const res = await axios.get(`${url}/patient-bills`, { params });
    if (res.status !== 200) {
        throw new Error('Failed to fetch bills', res.statusText);
    }
    console.log("Fetched bills response:", res);
    return res.data;
}
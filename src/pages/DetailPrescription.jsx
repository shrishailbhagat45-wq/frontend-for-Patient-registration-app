import { GiCaduceus } from "react-icons/gi";
import { FaPrescription } from "react-icons/fa";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getPatientById, getPrescriptionById } from '../API/Patient';

export default function DetailPrescription() {

  const [patientData, setPatientData] = useState({});
  const [prescriptionData, setPrescriptionData] = useState({});

  useEffect(() => { 
    fetchData();
  }, []);

  const { patientId, prescriptionId } = useParams();
  

  async function fetchData() {
    
    const patient = await getPatientById(patientId);
    const prescription = await getPrescriptionById(prescriptionId);
    if (!patient||!prescription) {
      console.error("Error fetching data");
    }
    console.log("Fetched prescription data:", prescription.data);
    setPatientData(patient.data);
    setPrescriptionData(prescription.data);
  }

 return (
    <div className="pt-8 pr-[10%] pl-[10%] min-h-screen min-w-screen font-semibold">
        <div className="mb-10 pl-4 relative">
            <div className="pt-2 pb-0.5 text-2xl">Doctor's Name</div>
            <div>Specialty </div>
            <div className="text-7xl absolute z-10 top-0 right-4 text-blue-800 "><GiCaduceus /></div>
        </div>
        <div className=" border-2 border-blue-500 border-solid "></div>
        <div>
            <div className="mt-4 mb-4 flex gap-6">
              <div>Patient's Name: <input type="text" className=" border-2 border-white border-b-black w-xl md:w-70 text-lg pl-2" value={patientData.name} disabled readOnly />
              </div>
              <div className="">Date: <input type="text" className=" border-2 border-white border-b-black md:w-30 text-lg pl-2 " value={prescriptionData.createdAt
                    ? prescriptionData.createdAt.toString().split("T")[0]
                    : ""}  disabled readOnly /></div>
            </div>
            <div className="mb-4 flex gap-10">
                <div >Age <input type="text" className=" border-2 border-white border-b-black w-60 md:w-30 text-lg pl-2" readOnly value={patientData.age} /></div>
                <div >Gender <input type="text" className=" border-2 border-white border-b-black w-60 md:w-30 text-lg pl-2" value={patientData.gender} disabled readOnly /></div>
                <div >Weight <input type="text" className=" border-2 border-white border-b-black w-60 md:w-30 text-lg pl-2" value={patientData.weight} disabled readOnly/></div>
            </div>
            <div className="mb-4">
                <div className="">Diagnosis: <input type="text" className=" border-2 border-white border-b-black w-[80%] text-lg pl-2" disabled readOnly /></div>
            </div>
            <div className="text-7xl pt-6"><FaPrescription /></div>
            <div className="pt-20 pb-20 px-10 flex place-content-center">
              <table className="w-screen table-fixed ">
                <thead className=" text-lg bg-blue-50 border-b border-gray-400">
                  <tr>
                    <th className="w-[60%]"></th>
                    <th className="w-[20%]">Quantity</th>
                    <th className="w-[20%]">Duration</th>
                  </tr>
                </thead>
              {prescriptionData.drug && prescriptionData.drug.map((drug, idx) => (
                <tr key={idx} className=" text-lg">
                  <td className="p-4 font-semibold font-mono italic break-words">{drug.name}{drug.strength}</td>
                  <td className="p-4 font-semibold font-sans ">{drug.quantity}</td>
                  <td className="p-4 font-semibold font-sans ">{drug.frequency}</td>
                </tr>
                
              ))}
              </table>
            </div>

            <div className=" border-2 border-blue-500 border-solid "></div>
            <div> Lorem, ipsum dolor sit amet consectetur adipisicing elit. Sunt aspernatur voluptatem, excepturi quidem, molestias amet debitis autem esse deserunt ad corporis ea exercitationem, necessitatibus eius quia aliquid quo odio est?</div>
        </div>
    </div>
  )
}

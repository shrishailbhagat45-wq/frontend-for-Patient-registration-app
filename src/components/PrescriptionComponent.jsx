import { useState } from "react";
import { GiCaduceus } from "react-icons/gi";
import { FaPrescription } from "react-icons/fa";
import Navbar from "./Navbar";
import PrintButton from '../components/PrintButton';


export default function ({patientData,prescriptionData}) {
  return (
    <div> 
      <Navbar  />
      <div className='mt-20 mr-2'>
              <PrintButton />
       </div>
    <div className="print-container pt-2 px-[10%] lg:px-[20%]  min-h-screen min-w-full font-semibold">
        <div className="mb-4 pl-4 relative">
            <div className="pt-2 pb-0.5 text-2xl">Doctor's Name</div>
            <div>Specialty </div>
            <div className="text-7xl absolute z-10 top-0 right-4 text-blue-800 "><GiCaduceus /></div>
        </div>
        <div className=" border-2 border-blue-500 border-solid "></div>
        <div>
            <div className="mt-4 mb-4 flex justify-between gap-2">
              <div className="">Name: <input type="text" className=" border-2 border-white border-b-black w-50 md:w-72 lg:w-lg " value={patientData.name} disabled readOnly />
              </div>
              <div className="">Date: <input type="text" className=" border-2 border-white border-b-black w-28" value={prescriptionData.createdAt
                    ? prescriptionData.createdAt.toString().split("T")[0]
                    : ""}  disabled readOnly /></div>
            </div>
            <div className="mb-4 flex justify-between gap-4">
                <div >Age <input type="text" className=" border-2 border-white border-b-black w-20 md:w-30 lg:w-40" disabled readOnl value={patientData.age} /></div>
                <div >Gender <input type="text" className=" border-2 border-white border-b-black w-20 md:w-30 lg:w-40" value={patientData.gender} disabled readOnly /></div>
                <div >Weight <input type="text" className=" border-2 border-white border-b-black w-20 md:w-30 lg:w-40" value={patientData.weight} disabled readOnly/></div>
            </div>
            <div className="mb-4">
                <div className="">Diagnosis: <input type="text" className=" border-2 border-white border-b-black w-[80%] sm:text-md md:text-lg pl-2" disabled readOnly /></div>
            </div>
            <div className=" lg:text-7xl text-4xl pt-6"><FaPrescription /></div>
            <div className="overflow-x-auto py-8">
              <table className="w-full min-w-[320px] text-xs sm:text-base">
                <thead className="bg-blue-50">
                  <tr>
                    <th className="p-2">Drug</th>
                    <th className="p-2">Quantity</th>
                    <th className="p-2">Duration</th>
                  </tr>
                </thead>
                <tbody>
                  {prescriptionData.drug?.map((drug, idx) => (
                    <tr key={idx}>
                      <td className="p-2">{drug.name} {drug.strength}</td>
                      <td className="p-2 text-center">{drug.quantity}</td>
                      <td className="p-2 text-center">{drug.frequency}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className=" border-2 border-blue-500 border-solid "></div>
            <div className="p-10 flex"><p className="font-bold">Address:</p> <p className="px-2">Jivaji Mandir, Near, Kolhapur Road, Jawaharnagar, Ichalkaranji, Maharashtra 416115</p> </div>
        </div>
    </div>
    </div>
  )
}

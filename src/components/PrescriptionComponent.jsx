import { useState } from "react";
import { GiCaduceus } from "react-icons/gi";
import { FaPrescription } from "react-icons/fa";

export default function ({patientData,prescriptionData}) {
  return (
    <div className="pt-8 px-[10%] lg:px-[20%]  min-h-screen min-w-screen font-semibold">
        <div className="mb-10 pl-4 relative">
            <div className="pt-2 pb-0.5 text-2xl">Doctor's Name</div>
            <div>Specialty </div>
            <div className="text-7xl absolute z-10 top-0 right-4 text-blue-800 "><GiCaduceus /></div>
        </div>
        <div className=" border-2 border-blue-500 border-solid "></div>
        <div>
            <div className="mt-4 mb-4 flex gap-6">
              <div>Patient's Name: <input type="text" className=" border-2 border-white border-b-black w-60  lg:w-xl text-lg pl-2" value={patientData.name} disabled readOnly />
              </div>
              <div className="">Date: <input type="text" className=" border-2 border-white border-b-black w-30 md:w-40 text-lg pl-2 " value={prescriptionData.createdAt
                    ? prescriptionData.createdAt.toString().split("T")[0]
                    : ""}  disabled readOnly /></div>
            </div>
            <div className="mb-4 flex gap-10">
                <div >Age <input type="text" className=" border-2 border-white border-b-black lg:w-50 w-30 text-lg pl-2" disabled readOnl value={patientData.age} /></div>
                <div >Gender <input type="text" className=" border-2 border-white border-b-black lg:w-50 w-30 text-lg pl-2" value={patientData.gender} disabled readOnly /></div>
                <div >Weight <input type="text" className=" border-2 border-white border-b-black lg:w-50 w-30 text-lg pl-2" value={patientData.weight} disabled readOnly/></div>
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
                <tbody>
              {prescriptionData.drug && prescriptionData.drug.map((drug, idx) => (
                <tr key={idx} className=" text-lg">
                  <td className="p-4 font-semibold font-mono italic break-words">{drug.name}{drug.strength}</td>
                  <td className="p-4 font-semibold font-sans text-center ">{drug.quantity}</td>
                  <td className="p-4 font-semibold font-sans text-center ">{drug.frequency}</td>
                </tr>
                
              ))}
              </tbody>
              </table>
            </div>

            <div className=" border-2 border-blue-500 border-solid "></div>
            <div className="p-10 flex"><p className="font-bold">Address:</p> <p className="px-2">Jivaji Mandir, Near, Kolhapur Road, Jawaharnagar, Ichalkaranji, Maharashtra 416115</p> </div>
        </div>
    </div>
  )
}

import React from 'react'
import { Link } from 'react-router'

export default function ListPrescription({prescription, idx}) {
  return (
     <div
            key={idx}
            className="bg-indigo-100 shadow rounded-2xl h-50  items-center px-6 text-black relative "
          >
            {console.log("list:",prescription.drug)}
            <div className='flex gap-8 justify-between w-full p-2 font-semibold font-sans '>
              <h2>Name: {  (prescription.patientName).toUpperCase()}</h2>
              <h2>Date: {prescription.createdAt.toString().split("T")[0]}</h2> 
            </div>
            <div className='flex justify-center '>
               <table className="table-fixed ">
                <thead className=" border-b border-gray-400">
                  <tr className=''>
                    <th className='p-4'>Drug</th>
                    <th className='p-4'>Quantity</th>
                    <th className='p-4'>Frequency</th>
                  </tr>
                </thead>
                <tbody>
                  {prescription.drug.slice(0, 2).map((drug, idx) => (
                <tr key={idx} className='p-4'> 
                  <td className=''>{drug.name} {drug.strength} </td>
                  <td className='text-center'>{drug.quantity}</td>
                  <td className='text-center'>{drug.frequency}</td>
                </tr>
                 ))}
                </tbody>
              </table>
              </div>
            
            <Link to={`/prescription/${prescription._id}`}> <button className='bg-black text-white mt-4 py-1 px-4 rounded-md absolute bottom-4 left-1/2 transform -translate-x-1/2'>Read More</button></Link>
    </div>
  )
}

import React from 'react'

export default function ListPrescription({prescription, idx}) {
  return (
     <div
            key={idx}
            className="bg-gray-300 rounded-2xl h-50  items-center px-6 text-black relative"
          >
            {console.log("list:",prescription)}
            <div className='flex gap-8 justify-between w-full'>
              <h2>Patient Name: {prescription.patient.name}</h2>
              <h2>Date: {prescription.createdAt.toString().split("T")[0]}</h2>
            </div>
            
            <button className='bg-black text-white py-1 px-4 rounded-md absolute bottom-4 left-1/2 transform -translate-x-1/2'>Read More</button>
    </div>
  )
}

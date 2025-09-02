import React from 'react'

export default function ListPrescription() {
  return (
     <div
            key={idx}
            className="bg-gray-300 rounded-2xl h-50  items-center px-6 text-black"
          >
            <div className='flex gap-8 justify-between w-full'>
              <h2>Patient Name: {prescription.patient.name}</h2>
              <h2>Date: {prescription.createdAt.toString().split("T")[0]}</h2>
            </div>
            
            <button className='bg-black text-white py-1 px-4 rounded-md '>Read More</button>
    </div>
  )
}

import React from 'react'

export default function ListPrescription({prescription, idx}) {
  return (
     <div
            key={idx}
            className="bg-gray-300 rounded-2xl h-50  items-center px-6 text-black relative "
          >
            {console.log("list:",prescription.drug)}
            <div className='flex gap-8 justify-between w-full'>
              <h2>Patient Name: {prescription.patientName}</h2>
              <h2>Date: {prescription.createdAt.toString().split("T")[0]}</h2> 
            </div>
            <div className='flex gap-16 mt-4 font-bold border-b-2 pb-2'>
              <div>Name</div>
              <div>Quantity</div>
              <div>Frequency</div>
            </div>
            {prescription.drug.slice(0, 2).map((drug, idx) => (
                <div key={idx} className='flex gap-16 mt-4 font-bold border-b-2 pb-2'> 
                  <div className=''>{drug.name} {drug.strength} </div>
                  <div className=''>{drug.quantity}</div>
                  <div className=''>{drug.frequency}</div>
                </div>
              ))}
            
            <button className='bg-black text-white py-1 px-4 rounded-md absolute bottom-4 left-1/2 transform -translate-x-1/2'>Read More</button>
    </div>
  )
}

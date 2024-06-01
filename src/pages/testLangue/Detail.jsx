import React from 'react'
import { Carousel } from "@material-tailwind/react";
import carousel from '@material-tailwind/react';
const Detail = () => {
  return (
    <div className='bg-hero bg-cover bg-[1px] h-[80vh]'>
        <nav className='bg-transparent w-screen px-[10%] py-2 text-3xl font-bold text-prim'>
      <h1 className=''>
      Tolkin
      </h1>

      </nav>
      <div className="text-center py-[4%]">
      <h1 className='font-bold text-xl underline underline-offset-4'>Nos services</h1>
      <p className='mt-5 px-[10%] text-gray-500'><span className='font-bold text-prim'>Tolkin</span> vous offre la possibilité de vous preparer en simulant un test de connaissance de la langue
      francaise qui se rapproche le plus possible du test officiel! vous pouvez vous exercer sur : </p>
      </div>
      
    </div>
  )
}

export default Detail

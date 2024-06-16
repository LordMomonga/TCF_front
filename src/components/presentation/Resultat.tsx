import { useState, useEffect, useRef } from 'react';


function Resultat() {
  

  return (
    <>
      <div className='w-full'>
        <nav className='px-5 py-5 flex items-center bg-prim'>
          <span className='font-bold text-3xl text-white'>Tolkin</span>
        </nav>
      
        <div className='mt-5'>
          <h1 className='text-center text-2xl text-gray-500 font-bold underline underline-offset-2'>
Resultat du Test de connaissance du Francais         
 </h1>
        </div>
      
        <div className='w-full flex justify-center mt-5'>
          <div className='w-[55%] px-10 rounded-xd'>
          <div className="w-full flex justify-left">
  <table className="table-auto w-full mt-8">
    <thead>
      <tr>
        <th className="px-4 py-2 text-left text-prim">Type de l'épreuve</th>
        <th className="px-4 py-2 text-left text-prim">Score</th>
        <th className="px-4 py-2 text-left text-prim">Niveau</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td className="border px-4 py-2">Comprehension Orale</td>
        <td className="border px-4 py-2">85</td>
        <td className="border px-4 py-2 font-bold text-gray-600">C1</td>
      </tr>
      <tr>
        <td className="border px-4 py-2">Comprehension Ecrite</td>
        <td className="border px-4 py-2">75</td>
        <td className="border px-4 py-2 font-bold text-gray-600">B2</td>
      </tr>
      <tr>
        <td className="border px-4 py-2">Expression Ecrite</td>
        <td className="border px-4 py-2">80</td>
        <td className="border px-4 py-2 font-bold text-gray-600">C1</td>
      </tr>
      <tr>
        <td className="border px-4 py-2">Expression Orale</td>
        <td className="border px-4 py-2 text-[12px] text-gray-500">en attente ...</td>
        <td className="border px-4 py-2 text-[12px] text-gray-500">en attente...</td>
      </tr>
    </tbody>
  </table>
</div>

          </div>
        </div>
      
        <footer className='absolute bottom-3 w-full'>
          <div className='flex justify-between px-10'>
            <button className='bg-red-500 px-2 py-1 text-white font-bold rounded-md'>Quitter</button>
            <button className='p-2 px-3 bg-transparent border-2 border-gray-500 rounded-md font-bold'>suivant  </button>
          </div>
        </footer>
      </div>
    </>
  );
}

export default Resultat;
 
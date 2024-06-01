import React from 'react'
import { BiAlarmExclamation } from 'react-icons/bi'
import { BiQuestionMark } from 'react-icons/bi'
import { BiError } from 'react-icons/bi'
import { BiExit } from 'react-icons/bi'
import { BiSkipNext } from 'react-icons/bi'
import { NavLink, Outlet } from 'react-router-dom';
import {Question} from './constant'
const CE = () => {
  return (
    <div className='w-screen relative'>
      <nav className=' px-5 py-5 flex items-center bg-prim '>
        <span className=' font-bold text-3xl text-white'>Tolkin</span>
        </nav>
        
       <div className='z-10 fixed left-0 px-2 bg-prim h-[80%]'>
           <span className='mt-8 block font-bold  text-sm uppercase text-white '>comprehension Ecrite </span>
            <div className='mt-5 px-1 bg-white  py-2'>
              
                <ol className='text-white'>{Object.keys(Question).map((Question)=>(
                    <li  className="py-1 text-sm text-white font-bold text-center px-5 bg-gray-500 rounded-xl mt-1 " key={Question}>{Question}</li>
                ))} </ol>
            </div>
            <div className="bg-white text-gray-500 mt-5 mb-5 rounded-md px-5 py-2">
                    <div className='text-sm font-bold flex items-center gap-3 '> <BiQuestionMark className=' text-white bg-blue-500 rounded-full font-bold  '></BiQuestionMark><span> restant:</span> </div>
                    <div className='mt-2 text-sm font-bold flex items-center gap-3 '><BiAlarmExclamation className=' text-white bg-green-500 rounded-full font-bold  '></BiAlarmExclamation><span> repondu :</span></div>
                    <div className='mt-2 text-sm font-bold flex items-center gap-3 '><BiError className=' text-white bg-red-500 rounded-full font-bold  '></BiError><span>Aucune  :</span></div>
                </div>
        </div>      
        <div className=' z-10 fixed right-0 px-4 bg-prim h-[80%]'>
              <div className='bg-white px-5  text-gray-600  text-sm text-center rounded-md py-2'>
                <h1 className='font-bold underline underline-offset-4 '>Mon profil</h1>
                <div className=' py-3 text-left'>
                    <span className='font-bold'>Nom : <span className='text-prim font-bolder'>john Doe</span></span>
                    <span className='block mt-2 font-bold'>Adresse :</span>
                    <span className='block mt-2 font-bold'>Partie : Comprehension Ecrite</span>
                    <span className='block mt-2 font-bold'>Durée : 45min</span>

                </div>
              </div>
              
            <div className="bg-white text-gray-500 mt-[30%] mb-5 rounded-md px-5 py-2">
                    <div className='text-[13px] font-bold flex items-center gap-3 '> <BiQuestionMark className=' text-white bg-blue-500 rounded-full font-bold  '></BiQuestionMark><span> Temps : 0min </span> </div>
                    <div className='mt-2 text-[13px] font-bold flex items-center gap-3 '><BiAlarmExclamation className=' text-white bg-green-500 rounded-full font-bold  '></BiAlarmExclamation><span>Temps restant :</span></div>
                </div>
        </div>      
        <div className='z-10 fixed bottom-0 bg-prim w-screen flex justify-between py-5 px-[10%] '>
        <div className='bg-white text-gray-600 px-5 py-2 rounded-xl font-bold flex gap-2 items-center'><NavLink to='/Eorale' className='flex items-center gap-2'><BiSkipNext className='text-md bg-green-500 text-white'></BiSkipNext>skip this test</NavLink></div>
        <div className='bg-white text-gray-600 px-5 py-2 rounded-xl font-bold flex gap-2 items-center '><NavLink to='/home'className='flex items-center gap-2'><BiExit className='text-md bg-red-500 text-white'></BiExit>quit the examination</NavLink></div></div>
       
        <div className='bg-white h-[80%] w-[68%] py-2 left-[14%] px-5 text-gray-700 fixed z-0'>
        <div className="text-sm font-bold text-center">
                lisez le test et  Choisissez la bonne réponse en cochant sur la bonne reponse. 
            </div>
            <div className='w-full relative'>
                <div className='flex justify-center'>
                <img className=' w-[30%] ' src="images/image1.png" alt="" />
                </div>
                <div className='pl-[15%] justify-center '>
                <span className='block  mb-5 font-bold'>
                    1- De qui il s'agit dans le text 
                </span>
                <div className='flex gap-5 mb-2'>
                    <input type="radio" />
                    <label htmlFor="">a- Du père de monsieur Frederick</label>
                </div>
                <div className='flex gap-5 mb-2'>
                    <input type="radio" />
                    <label htmlFor="">b- Du voisin de monsieur Frederick</label>
                </div>
                <div className='flex gap-5 mb-2'>
                    <input type="radio" />
                    <label htmlFor="">c- Du voisin de monsieur Frederick</label>
                </div>
                <div className='flex gap-5 mb-2'>
                    <input type="radio" />
                    <label htmlFor="">d- Du voisin de monsieur Frederick</label>
                </div>
                </div>

            </div>
           
            
        </div>
    
    </div>

  )
}

export default CE

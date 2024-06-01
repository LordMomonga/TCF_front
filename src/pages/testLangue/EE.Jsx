import React, { useState } from 'react';
import { BiAlarmExclamation } from 'react-icons/bi'
import { BiQuestionMark } from 'react-icons/bi'
import { Question } from './constant'
import { BiError } from 'react-icons/bi'
import { BiExit } from 'react-icons/bi'
import { BiSkipNext } from 'react-icons/bi'
import { NavLink, Outlet } from 'react-router-dom';
import { useNavigate } from 'react-router-dom'

const ConfirmationDialog = ({ message, onConfirm, onCancel }) => {
  return (
    <div className=' text-gray-700 fixed inset-0 flex items-center justify-center bg-black bg-opacity-50'>
      <div className='bg-white p-5 rounded-md text-center'>
        <p className='mb-4'>{message}</p>
        <div className='flex justify-center gap-4'>
          <button
            onClick={onConfirm}
            className='bg-red-500 text-white px-4 py-2 rounded-md'
          >
            Oui
          </button>
          <button
            onClick={onCancel}
            className='bg-gray-300 text-gray-700 px-4 py-2 rounded-md'
          >
            Non
          </button>
        </div>
      </div>
    </div>
  );
};


const EE = () => {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmationAction, setConfirmationAction] = useState(null);
  const [selectedTask, setSelectedTask] = useState('tache1'); // default task
  const navigate = useNavigate(); 
  const handleSkipTest = () => {
    setShowConfirmation(true);
    setConfirmationAction(() => () => navigate('/Eorale'));
  };

  const handleQuitExam = () => {
    setShowConfirmation(true);
    setConfirmationAction(() => () => navigate('/home'));
  };

  const handleConfirm = () => {
    if (confirmationAction) {
      confirmationAction();
    }
    setShowConfirmation(false);
  };

  const handleCancel = () => {
    setShowConfirmation(false);
    setConfirmationAction(null);
  };
  const renderTaskContent = () => {
    switch (selectedTask) {
      case 'tache1':
        return <div>
          <h1 className='text-center font-bold text-xl'>Tache 1</h1>
          
          <p className='w-[100%] text-center mt-5'>Ecrire une lettre a votre amis pour le prevenir que vous viendrez le voir dans une semaine pour participer a un festival 
            <span className='block mt-2 font-bold '>ecrivez une lettre pour inviter votre ami  </span></p> 
            <div>
              <textarea name="" id="" placeholder='ecrivez votre redaction ici' className=' mx-[5%] min-h-[240px] mt-10 text-center w-[90%] border-[1px] border-gray-500 '>
                écrivez votre redaction
              </textarea>
            </div>
            </div>;
      case 'tache2':
        return <div>
        <h1 className='text-center font-bold text-xl'>Tache 2</h1>
        
        <p className='w-[100%] text-center mt-5'>il y'a un evenement traditionnelle dans votre village et vous avez eu a participer a cette evenement 
          <span className='block mt-2 font-bold '> Raconter et decrire l'evenement </span></p> 
          <div>
            <textarea name="" id="" placeholder='ecrivez votre redaction ici' className=' mx-[5%] min-h-[240px] mt-10 text-center w-[90%] border-[1px] border-gray-500 '>
              écrivez votre redaction
            </textarea>
          </div>
          </div>;
      case 'tache3':
        return <div>
        <h1 className='text-center font-bold text-xl'>Tache 3</h1>
        
        <p className='w-[100%] text-center mt-5'> L'éducation en ligne est-elle une solution viable pour l'avenir de l'enseignement 
          <span className='block mt-2 font-bold text-sm '>Vous rédigerez un texte argumentatif en présentant votre point de vue sur l'éducation en ligne. Vous discuterez des avantages et des inconvénients de cette méthode d'enseignement, et conclurez en donnant votre opinion sur son potentiel pour remplacer ou compléter l'éducation traditionnelle. </span></p> 
          <div>
            <textarea name="" id="" placeholder='ecrivez votre redaction ici' className=' mx-[5%] min-h-[240px] mt-10 text-center w-[90%] border-[1px] border-gray-500 '>
              écrivez votre redaction
            </textarea>
          </div>
          </div>;
      default:
        return <div>Veuillez sélectionner une tâche.</div>;
    }
  };

  return (
    <div className='bg-white '>
     <nav className=' px-5 py-5 flex items-center bg-prim '>
        <span className=' font-bold text-3xl'>Tolkin</span>
        </nav>
        <div className='z-10 fixed left-0 px-5 bg-prim h-[80%]'>
           <span className='mt-8 block font-bold  text-sm uppercase '>expression Ecrite </span>
            
            <div className= {`mt-[30%]  text-gray-700 text-center rounded-md py-1 cursor-pointer ${selectedTask === 'tache1' ? 'bg-blue-500 text-white border-white border-[1px]' : 'bg-white'}`}
             onClick={() => setSelectedTask('tache1')}>
              tache 1 
            </div>
            <div className={`mt-[30%]  text-gray-700 text-center rounded-md py-1 cursor-pointer ${selectedTask === 'tache2' ? 'bg-blue-500 text-white  border-white border-[1px]' : 'bg-white '}`}
             onClick={() => setSelectedTask('tache2')}>
              tache 2 
            </div>
            <div className={`mt-[30%]  text-gray-700 text-center rounded-md py-1 cursor-pointer ${selectedTask === 'tache3' ? 'bg-blue-500 text-white  border-white border-[1px]' : 'bg-white'}`}
             onClick={() => setSelectedTask('tache3')}>
              tache 3 
            </div>
          
        </div>  
        <div className='z-10 fixed right-0 px-4 bg-prim h-[80%]'>
              <div className='bg-white px-5  text-gray-600  text-sm text-center rounded-md py-2'>
                <h1 className='font-bold underline underline-offset-4 '>Mon profil</h1>
                <div className=' py-3 text-left'>
                    <span className='font-bold'>Nom : <span className='text-prim font-bolder'>john Doe</span></span>
                    <span className='block mt-2 font-bold'>Adresse :</span>
                    <span className='block mt-2 font-bold'>Partie : Expression Ecrite</span>
                    <span className='block mt-2 font-bold'>Durée : 45min</span>

                </div>
              </div>
              
            <div class="bg-white text-gray-500 mt-[30%] mb-5 rounded-md px-5 py-2">
                    <div className='text-[13px] font-bold flex items-center gap-3 '> <BiQuestionMark className=' text-white bg-blue-500 rounded-full font-bold  '></BiQuestionMark><span> Temps : 0min </span> </div>
                    <div className='mt-2 text-[13px] font-bold flex items-center gap-3 '><BiAlarmExclamation className=' text-white bg-green-500 rounded-full font-bold  '></BiAlarmExclamation><span>Temps restant :</span></div>
                </div>
        </div>      
       
        <div className=' z-10 fixed bottom-0 bg-prim w-screen flex justify-between py-3 px-[10%] '>
        <div className='bg-white text-gray-600 px-5 py-2 rounded-xl font-bold flex gap-2 items-center' onClick={handleSkipTest}><div to='/Eorale' className='flex items-center gap-2'><BiSkipNext className='text-md bg-green-500 text-white'></BiSkipNext>skip this test</div></div>
        <div className='bg-white text-gray-600 px-5 py-2 rounded-xl font-bold flex gap-2 items-center ' onClick={handleQuitExam}><div to='/home'className='flex items-center gap-2'><BiExit className='text-md bg-red-500 text-white'></BiExit>quit the examination</div></div></div>
       

        <div className='bg-white h-[80%] w-[70%] py-2 left-[12%] px-5 text-gray-700 fixed z-0'>
          <div className='mt-5'>{renderTaskContent()}</div>
        </div>

        {showConfirmation && (
        <ConfirmationDialog
          message="Are you sure you want to proceed?"
          onConfirm={handleConfirm}
          onCancel={handleCancel}
        />
      )}
    </div>
  )
}

export default EE

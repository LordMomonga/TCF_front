import React, { useState, useEffect, useContext }  from 'react';
import './passexam-content.css';

import StudentLayout from '../../../components/StudentLayout/StudentLayout';

import { EditCourseContentModal, DeleteModal  } from '../../../components';
import UploadAssessmentSolutionModal from '../../../components/students/UploadAssessmentSolutionModal/UploadAssessmentSolution';
import {  BsPencilSquare } from 'react-icons/bs';
import { NavLink, Outlet } from 'react-router-dom';
import { BiBlock } from 'react-icons/bi';
import { IoMdCloudDownload } from 'react-icons/io';
import { AiFillEye } from 'react-icons/ai';
import { toast } from 'react-toastify';
import { BiPlus } from 'react-icons/bi'
import { BiPlay } from 'react-icons/bi'
import Tippy from '@tippyjs/react';
import { BiBook } from 'react-icons/bi';
import 'tippy.js/dist/tippy.css';
import { ImCancelCircle } from 'react-icons/im';
import { getAcceptedClasses, getStudentsClasses, studentGetPassExams } from '../../../services/student';

import BeatLoader from "react-spinners/BeatLoader";

import moment from 'moment';
import { getTotalAssessments, studentGetAssessments } from '../../../services/assessment';
import { VideoPlayerModal } from '../../../components';
import { getPassExamContents } from '../../../services/passExams';
import { convertDate } from '../../../utils/date';
import AcademicYearContext from '../../../contexts/AcademicYearContext';
import { getStudentApplications } from '../../../services/student';
import { BiTime } from 'react-icons/bi';
const override = {
    marginTop: '20px'
  };


 
  const MessageValidation = ({pageUrl, message, onClose}: any) => {

    return(
        <div className='absolute bg-white left-[25%] text-center  top-1 px-10 py-5 rounded-md'>
            <div className='relative w-full text-center'>
            <p className='block mt-5'>{message}</p>  
          <span className='font-bold mt-2 text-[13px] text-gray-500  '>veuillez vous munir d'un ordinateur pour une meilleur simulation</span>
          <div className='w-full justify-between flex mt-5 '>
            <button onClick={onClose} className='bg-red-500 px-2 py-1  rounded-md text-white'> annuler </button>
            < NavLink to={pageUrl}><button  className='bg-green-500 px-3 py-1 text-white rounded-md'>Demarrer</button></NavLink>
          </div>
         
            </div>
          
        </div>
    )
  }



function Index() {
    const [ showAddModal, setShoowAddModal ] = useState(false);
    const [passexams, setPassExams] = useState([]);
    let [showTest, setShowTest] = useState({});
    const [showVideoModal, setShowVideoModal] = useState(false);
    const {activeAcademyYear, setActiveAcademyYear} = useContext<any>(AcademicYearContext);
    const [existed, setExisted] = useState(false);
    const [videoUrl, setVideoUrl] = useState('');
    const [isStartingCo, setIsStartingcO] = useState(false);
    const [isStartingCe, setIsStartingce] = useState(false);
    const [isStartingEo, setIsStartingEo] = useState(false);
    const [isStartingEe, setIsStartingEe] = useState(false);

    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(false);

    const toggleAddModal = () => {
        setShoowAddModal(!showAddModal);
    }

    const handleVerify = () =>{
        getStudentApplications().then((res:any) => {
            setShowTest(res.data.data[0].status);
           console.log('bien recupéré',showTest)
        }).catch((error:any) => {
            console.log('error a la recuperation')
        })
    }  
    const handleExisted = ()=> {
        setLoading(true)
        handleVerify();
        if(showTest === "pending"){
            setLoading(false)
            setExisted(false)
        }else if(showTest === "accepted"){
            setExisted(true)
            setLoading(false)
            console.log('accepted')
        }else{
            console.log("error sur l'existence")
            setLoading(false)
        }
       
    }
    
    const handleGetClasses = ()  => {

        setClasses([]);
        setPassExams([]);
        
        getAcceptedClasses().then((res: any) => {
            if(res.ok) {
                setClasses(res.data.data);
            }
        }).catch(err => {
            console.log('error: ', err);
        })
    }

    const toggleVideoModal = () => {
        setShowVideoModal(!showVideoModal);
    }

    const handleSetVideoUrl = (url: any) =>  {
        setVideoUrl(url);
        toggleVideoModal();
    }  

    const handleContentAdded = ()  => {
        toggleAddModal();
    }



   

    useEffect(() => {
        handleExisted()
        console.log('USER EFFECT RAN')
    });

    return (
        <StudentLayout title="Pass Simulations And Solutions" pageTitle="Pass Exam">
            {loading && <div className='section'>
                <div className="parent-con">
                    <div className="data-table">
                        <div className="top">
                        <div className="table-con">
                    <div style={{textAlign: 'center',}}>
                        <BeatLoader
                                color="#623d91" 
                                loading={loading}
                                cssOverride={override}
                        />
                    </div>
                       </div>
                        </div>
                    </div>
                </div>
                
                </div>}
                {!loading && <>
      {existed  && <div className="section">
            <div className="parent-con">
                <div className="data-table">
                    <div className="top">
                   

                       
                      <div className="flex gap-2">
                        <div className='bg-gray-900 mx-auto mb-2 w-[80%] md:w-[220px] relative h-[120px] md:h-[130px] text-gray-500   px-2 md:px-5 py-3 md:py-5 rounded-md'>
<h1 className=' text-center font-bold uppercase  text-sm md:text-2md text-white'>Comprehension Orale</h1>
      <div className='flex text-white justify-between mt-5 '>
      <button className='test-[12px] md:test-md font-bold bg-blue-500 p-2 rounded-md absolute bottom-2 left-3 ' onClick={() => setIsStartingcO(true)}><BiPlay className="text-white"></BiPlay></button>
      <span className='text-[12px] font-bold  text-white'> Durée : 45min</span>

      <button className=' test-[12px] md:test-md font-bold bg-green-500 p-2  rounded-md absolute bottom-2 right-3 text-white'><BiBook></BiBook> </button>
      </div> 

                        </div>
                        <div className='bg-gray-900 mx-auto mb-2 w-[80%] md:w-[220px] relative h-[120px] md:h-[130px] text-white   px-2 md:px-5 py-3 md:py-5 rounded-md'>
<h1 className=' text-center font-bold uppercase  text-sm md:text-2md text-white '>Comprehension Ecrite</h1>
      <div className='flex text-white justify-between mt-5 '>
      <button className='test-[12px] md:test-md font-bold bg-blue-500 p-2 rounded-md absolute bottom-2 left-3 ' onClick={() => setIsStartingce(true)}><BiPlay className="text-white"></BiPlay></button>
      <span className='text-[12px] font-bold  text-white'> Durée : 45min</span>

      <button className=' test-[12px] md:test-md font-bold bg-green-500 p-2  rounded-md absolute bottom-2 right-3 text-white'><BiBook></BiBook> </button>
      </div> 

                        </div>
                        <div className='bg-gray-900 mx-auto mb-2 w-[80%] md:w-[220px] relative h-[120px] md:h-[130px] text-gray-500   px-2 md:px-5 py-3 md:py-5 rounded-md'>
<h1 className=' text-center font-bold uppercase text-white  text-sm md:text-2md '>Expression Ecrite</h1>
      <div className='flex text-white justify-between mt-5 '>
      <button className='test-[12px] md:test-md font-bold bg-blue-500 p-2 rounded-md absolute text-white bottom-2 left-3 ' onClick={() => setIsStartingEe(true)}><BiPlay className="text-white"></BiPlay></button>
      <span className='text-[12px] font-bold  text-white'> Durée : 45min</span>

      <button className=' test-[12px] md:test-md font-bold bg-green-500 p-2  rounded-md absolute bottom-2 right-3 text-white'><BiBook></BiBook> </button>
      </div> 

                        </div>
                        <div className='bg-gray-900 mx-auto mb-2 w-[80%] md:w-[220px] relative h-[120px] md:h-[130px] text-gray-500   px-2 md:px-5 py-3 md:py-5 rounded-md'>
<h1 className=' text-center font-bold uppercase  text-sm md:text-2md text-white'>Expression orale</h1>
      <div className='flex text-white justify-between mt-5 '>
      <button className='test-[12px] md:test-md font-bold bg-blue-500 p-2 rounded-md absolute bottom-2 left-3 'onClick={() => setIsStartingEo(true)}><BiPlay className="text-white"></BiPlay></button>
      <span className='text-[12px] font-bold   text-white'> Durée : 45min</span>

      <button className=' test-[12px] md:test-md font-bold bg-green-500 p-2 text-white rounded-md absolute bottom-2 right-3'><BiBook></BiBook> </button>
      </div> 

                        </div>
                        </div>               
                  
                      </div>
                      <div className='bg-gray-900 mx-auto mb-2 w-[80%] md:w-[220px] relative h-[120px] md:h-[130px] text-gray-500   px-2 md:px-5 py-3 md:py-5 rounded-md'>
<h1 className=' text-center font-bold uppercase  text-sm md:text-2md '>Simulation Complete</h1>
      <div className='flex text-white justify-between mt-5 '>
      <button className='test-[12px] md:test-md font-bold bg-blue-500 p-2 rounded-md absolute bottom-2 left-3 '><NavLink to='/presentation'><BiPlay className="text-white"></BiPlay></NavLink></button>
      <span className='text-[12px] font-bold  text-prim'> Durée : </span>

      <button className=' test-[12px] md:test-md font-bold bg-green-500 p-2  rounded-md absolute bottom-2 right-3'><BiBook></BiBook> </button>
      </div> 

                        </div>

                  
                </div>
            </div>
        </div>
}</>}
{isStartingCo && <MessageValidation  pageUrl='/play-co-video' message='voulez vous demarrer cette simulation de comprehension orale ?' onClose={() => setIsStartingcO(!isStartingCo)} />}
{isStartingCe && <MessageValidation  pageUrl='/play-video' message='voulez vous demarrer cette simulation de comprehension ecrite ?' onClose={() => setIsStartingce(!isStartingCe)} />}
{isStartingEe && <MessageValidation  pageUrl='/play-ee-video' message="voulez vous demarrer cette simulation d'expression ecrite ?" onClose={() => setIsStartingEe(!isStartingEe)} />}
{isStartingEo && <MessageValidation  pageUrl='/play-eo-video' message="voulez vous demarrer cette simulation d'expression orale ?" onClose={() => setIsStartingEo(!isStartingEo)} />}

{!loading && <>{!existed && <div className='section'>
    <div className="parent-con">
        <div className="data-table">
            <div className="top">
                 <span className='text-3xl font-bold text-red-500 text-center w-[100%] flex gap-5 '>
                   Désolé Votre candidature n'a pas été validée !!! <BiBlock size={34}></BiBlock>
                 </span>
            </div>

        </div>

    </div>
    
    </div>} </>
}         </StudentLayout>
    );
}

export default Index;
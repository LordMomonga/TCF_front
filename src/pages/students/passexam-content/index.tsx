import { BsStopwatch } from "react-icons/bs"; 
import { AiOutlineStop } from "react-icons/ai"; 
import { MdOutlineNotStarted } from "react-icons/md"; 
import { AiFillMeh } from "react-icons/ai"; 
import { RiEmotionSadLine } from "react-icons/ri"; 
import React, { useState, useEffect, useContext }  from 'react';
import './passexam-content.css';
import { motion } from 'framer-motion';
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
import { moveItemToFirst } from "../../../services/assessment";
import BeatLoader from "react-spinners/BeatLoader";

import moment from 'moment';
import { getTotalAssessments, studentGetAssessments } from '../../../services/assessment';
import { VideoPlayerModal } from '../../../components';
import { getPassExamContents } from '../../../services/passExams';
import { convertDate } from '../../../utils/date';
import AcademicYearContext from '../../../contexts/AcademicYearContext';
import { getStudentApplications } from '../../../services/student';
import { BiTime } from 'react-icons/bi';
import { Option } from "lucide-react";
import { log } from "console";
const override = {
    marginTop: '20px'
  };


 
  const MessageValidation = ({pageUrl, message, onClose, spec}: any) => {

    return(
        <div className='absolute bg-white left-2  md:left-[25%] text-center border-gray-500 shadow-md shadow-gray-500   top-1 px-10 py-5 rounded-md'>
            <div className='relative w-full text-center'>
            <p className='block mt-5 p-2 text-gray-500 uppercase font-bold'>{message}  </p>  
          <span className='font-bold mt-2 text-[13px] text-blue-500 flex items-center gap-1 justify-center'>NB:<AiFillMeh className="text-2xl text-blue-500"/>veuillez vous munir d'un ordinateur pour une meilleur simulation</span>
          <div className='w-full justify-between flex mt-5 '>
            <button onClick={onClose} className='bg-red-400 px-2 py-1  uppercase text-sm rounded-md text-white flex items-center gap-2'> <AiOutlineStop className="text-xl" />annuler </button>
            < NavLink to={pageUrl} state={{ spec }} ><button  className='bg-green-400 px-3 py-1 text-white text-sm rounded-md flex items-center gap-2 uppercase'><MdOutlineNotStarted className="text-xl" />Demarrer</button></NavLink>
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
    const [spec, setSpec] = useState<any>();
    const [isStartingCo, setIsStartingcO] = useState(false);
    const [isStartingCe, setIsStartingce] = useState(false);
    const [isStartingEo, setIsStartingEo] = useState(false);
    const [isStartingEe, setIsStartingEe] = useState(false);
     const [applications, setApplications] = useState([]);
    const [classes, setClasses] = useState([]);
    const [avoir, setAvoir] = useState<any[]>([]);  

    const [pb, setPb] = useState(0); // Initialisation de la variable pb
    const [errorMessage, setErrorMessage] = useState(''); // Message d'erreur

    const [loading, setLoading] = useState(false);

    const toggleAddModal = () => {
        setShoowAddModal(!showAddModal);
    }

    const handleVerify = () =>{
        setLoading(true)

        getStudentApplications().then((res:any) => {
            setShowTest(res.data.data[0].status);
            setAvoir(res.data.data)
        }).catch((error:any) => {
            setLoading(false)

        })
    }  
    const handleExisted = ()=> {
        handleVerify();
        if(showTest === "pending"){
            setExisted(false)
        }else if(showTest === "accepted"){
            setExisted(true)
            console.log('accepted')
        }else{
            console.log("error sur l'existence")
            setLoading(false)

        }
       
    }

   
      const handleGetApplications = ()  => {
            setLoading(true);
            setApplications([]);
            getStudentApplications().then((res: any) => {
    
                if(res.ok) {
                    setApplications(res.data.data);
                }
                setLoading(false);
            }).catch(err => {
                setLoading(false);
            })
        }

        useEffect(() => {
        handleGetApplications();
          },[]);

const moveToFirstItem = (data:any) => {
    console.log('la data que je veux voir ', data);
    const valeur = {
        data
    }
    setLoading(true)
    
    moveItemToFirst(valeur).then((res:any) => {
        if(res.ok) {
           setLoading(false)
        } 
    }).catch(err => {
        console.log('error: ', err);
        setLoading(false)
    })
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


    const verification = avoir.filter((av)  => av?.status === "accepted" ).length
   
 //debut de la gestion du message d'erreur 
 useEffect(() => {
    const timer = setTimeout(() => {
      if (verification === 0) {
        setErrorMessage("Désolé Votre compte n'a pas été activé");
      }
    }, 15000); // 30 secondes

    // Nettoyage du timer au cas où le composant se démonte
    return () => clearTimeout(timer);
  }, [verification]);

  //fin de la gestion

    useEffect(() => {
        handleExisted()
        console.log('USER ', avoir);
    });

    return (
        <StudentLayout title="Pass Simulations " pageTitle="Pass Simulation">
           
      {existed  && <div className="section">
            <div className="parent-con">
                <div className="data-table">
                    <div className="my-5">
                        
                        <select name="" id="" className="px-2 select-field" onChange={(e: any) => setSpec(e.target.value)} value={spec}>
                            <option value="all" >Selectionner Votre test</option>
                            {applications.map((data:any, index:any)=> 
                            data?.status ==='accepted' && ( <option value={data?.speciality_id?._id} className="text-white">{data?.speciality_id?.name}</option>)
                            )}
                        </select>
                    </div>
                    <div className="top ">
                       
                      <div className="flex gap-2 justify-center w-full">
                        <div className='bg-gray-900 mx-auto mb-2 w-[80%] md:w-[220px] relative h-[120px] md:h-[130px] text-gray-500   px-2 md:px-5 py-3 md:py-5 rounded-md'>
<h1 className=' text-center font-bold uppercase  text-sm md:text-[11px] text-white'>Comprehension Orale</h1>
      <div className='flex text-white justify-between mt-5 '>
      <button className='test-[12px] md:test-md font-bold bg-blue-500 p-2 rounded-md absolute bottom-2 left-3 ' onClick={() => setIsStartingcO(true)}><BiPlay className="text-white"></BiPlay></button>
      <span className='text-[12px] font-bold  text-white flex items-center gap-2'> <BsStopwatch className="text-[15px] "/> : 40min</span>

      <button className=' test-[12px] md:test-md font-bold bg-green-500 p-2  rounded-md absolute bottom-2 right-3 text-white'><BiBook></BiBook> </button>
      </div> 

                        </div>
 <div className='bg-gray-900 mx-auto mb-2 w-[80%] md:w-[220px] relative h-[120px] md:h-[130px] text-white   px-2 md:px-5 py-3 md:py-5 rounded-md'>
<h1 className=' text-center font-bold uppercase  text-[11px] md:text-2md text-white '>Comprehension Ecrite</h1>
<div className='flex text-white justify-between mt-5 items-center  '>
      <button className='test-[11px] md:test-md font-bold bg-blue-500 p-2 rounded-md absolute bottom-2 left-3 ' onClick={() => setIsStartingce(true)}><BiPlay className="text-white"></BiPlay></button>
      <div className='text-[11px] font-bold block text-white flex items-center gap-2'> <BsStopwatch className="text-[15px] "/> : 60min</div>

      <button className=' test-[11px] md:test-md font-bold bg-green-500 p-2  rounded-md absolute bottom-2 right-3 text-white'><BiBook></BiBook> </button>
      </div> 

                        </div>
                        <div className='bg-gray-900 mx-auto mb-2 w-[80%] md:w-[220px] relative h-[120px] md:h-[130px] text-gray-500   px-2 md:px-5 py-3 md:py-5 rounded-md'>
<h1 className=' text-center font-bold uppercase text-white  text-sm md:text-[11px] '>Expression Ecrite</h1>
      <div className='flex text-white justify-between mt-5 '>
      <button className='test-[12px] md:test-md font-bold bg-blue-500 p-2 rounded-md absolute text-white bottom-2 left-3 ' onClick={() => setIsStartingEe(true)}><BiPlay className="text-white"></BiPlay></button>
      <span className='text-[12px] font-bold  text-white flex items-center gap-2'> <BsStopwatch className="text-[15px] "/> : 1h</span>

      <button className=' test-[12px] md:test-md font-bold bg-green-500 p-2  rounded-md absolute bottom-2 right-3 text-white'><BiBook></BiBook> </button>
      </div> 

                        </div>
                        <div className='bg-gray-900 mx-auto mb-2 w-[80%] md:w-[220px] relative h-[120px] md:h-[130px] text-gray-500   px-2 md:px-5 py-3 md:py-5 rounded-md'>
<h1 className=' text-center font-bold uppercase  text-sm md:text-[11px] text-white'>Expression orale</h1>
      <div className='flex text-white justify-between mt-5 '>
      <button className='test-[12px] md:test-md font-bold bg-blue-500 p-2 rounded-md absolute bottom-2 left-3 'onClick={() => setIsStartingEo(true)}><BiPlay className="text-white"></BiPlay></button>
      <span className='text-[12px] font-bold   text-white flex items-center gap-2'> <BsStopwatch className="text-[15px] "/> : 15min</span>

      <button className=' test-[12px] md:test-md font-bold bg-green-500 p-2 text-white rounded-md absolute bottom-2 right-3'><BiBook></BiBook> </button>
      </div> 

                        </div>
                        </div>               
                  
                      </div>
                   

                  
                </div>
            </div>
        </div>
}
{isStartingCo && <MessageValidation  pageUrl='/play-co-video' message='voulez vous demarrer cette simulation de comprehension orale ?' spec={spec} onClose={() => setIsStartingcO(!isStartingCo)} />}
{isStartingCe && <MessageValidation  pageUrl='/play-video' message='voulez vous demarrer cette simulation de comprehension ecrite ?'  spec={spec} onClose={() => setIsStartingce(!isStartingCe)} />}
{isStartingEe && <MessageValidation  pageUrl='/play-ee-video' message="voulez vous demarrer cette simulation d'expression ecrite ?" spec={spec}  onClose={() => setIsStartingEe(!isStartingEe)} />}
{isStartingEo && <MessageValidation  pageUrl='/play-eo-video' message="voulez vous demarrer cette simulation d'expression orale ?" spec={spec}  onClose={() => setIsStartingEo(!isStartingEo)} />}

{!existed && <div className='section'>
    
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
            {!existed && <span className='text-3xl font-bold text-red-500 text-center w-[100%] flex-block gap-5 items-center '>
            <div style={{textAlign: 'center'}} className='block'>
                        <BeatLoader
                                color="#623d91" 
                                loading={true}
                                cssOverride={override}
                        />
                       
                    </div>
                    <span className='flex items-center text-gray-500 text-center justify-center gap-5'>  {errorMessage !== '' ? <span className="text-red-500 flex items-center gap-5">{errorMessage} <RiEmotionSadLine /></span> :  <span>En cours... </span> }   </span>
                    
                 </span>}
        </div>

    </div>
    
    </div>}

         </StudentLayout>
    );
}

export default Index;
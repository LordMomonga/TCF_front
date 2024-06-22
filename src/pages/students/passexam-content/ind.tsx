import React, { useState, useEffect, useContext }  from 'react';
import './passexam-content.css';

import StudentLayout from '../../../components/StudentLayout/StudentLayout';
import SchoolLayout from '../../../components/SchoolLayout/SchoolLayout';
import { EditCourseContentModal, DeleteModal  } from '../../../components';
import UploadAssessmentSolutionModal from '../../../components/students/UploadAssessmentSolutionModal/UploadAssessmentSolution';
import {  BsPencilSquare } from 'react-icons/bs';
import { NavLink, Outlet } from 'react-router-dom';
import AddExpressionEcrite from '../../../components/students/UploadAssessmentSolutionModal/AddExpressionEcrite';
import AddExpressionOrale from '../../../components/students/UploadAssessmentSolutionModal/AddExpressionOrale';
import { IoMdCloudDownload } from 'react-icons/io';
import { AiFillEye } from 'react-icons/ai';
import { toast } from 'react-toastify';
import { BiPlus } from 'react-icons/bi'
import { BiPlay } from 'react-icons/bi'
import Tippy from '@tippyjs/react';
import { BiBook } from 'react-icons/bi';
import 'tippy.js/dist/tippy.css';

import { getAcceptedClasses, getStudentsClasses, studentGetPassExams } from '../../../services/student';

import BeatLoader from "react-spinners/BeatLoader";

import moment from 'moment';
import { getTotalAssessments, studentGetAssessments } from '../../../services/assessment';
import { VideoPlayerModal } from '../../../components';
import { getPassExamContents } from '../../../services/passExams';
import { convertDate } from '../../../utils/date';
import AcademicYearContext from '../../../contexts/AcademicYearContext';

const rows: any = [
    {
        label: '#',
        name: 'num'
    },
    {
        label: 'Title',
        name: 'name'
    },
    {
        label: 'Question File',
        name: 'name'
    },
    {
        label: 'Answer Pdf',
        name: 'name'
    },
    {
        label: 'Answer Video',
        name: 'name'
    },
    {
        label: 'Publish Date',
        name: 'name'
    },
    {
        label: 'Created Date',
        name: 'name'
    },
    {
        label: 'Action',
        name: 'action'
    }
]


const override = {
    marginTop: '20px'
  };



function Ind() {
    const [ showAddModal, setShoowAddModal ] = useState(false);
    const [passexams, setPassExams] = useState([]);
    const [showVideoModal, setShowVideoModal] = useState(false);
    const {activeAcademyYear, setActiveAcademyYear} = useContext<any>(AcademicYearContext);

    const [videoUrl, setVideoUrl] = useState('');
    const [addAudio, setAddAudio] = useState(false);
    const [addEE, setAddEE] = useState(false);
    const [addEO, setAddEO]= useState(false);


    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(false);

    const toggleAddModal = () => {
        setShoowAddModal(!showAddModal);
    }
    
    const toggleAddAudio = () =>{
        setAddAudio(!addAudio)
    }

    const toggleAddEO = () => {
        setAddEO(!addEO)
    }
    const toggleAddEE= ()=>{
        setAddEE(!addEE)

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
    const handleContentEE = ()  => {
        toggleAddEE()
    }
    const handleContentEO = ()  => {
        toggleAddEO()
    }


    const handleGetPassExamContents = (classId: any) => {
        setLoading(true);
        studentGetPassExams(classId).then((res: any) => {
            console.log("PASS EXAMS RES: ",res);
            setLoading(false);
            setPassExams(res.data.data);
        }).catch((err: any) => {
            console.log('Error: ', err);
            setLoading(false);
        })
    }

    const handleClassSelected = (value: any) => {
        try {
            console.log('CLASS ID:' , value)
            if(value == 'all') {
                setPassExams([]);
                return;
            }

            handleGetPassExamContents(value);
        } catch (error) {
            console.log('error: ', error)
        }
    }


    useEffect(() => {
        console.log('USER EFFECT RAN')
        handleGetClasses();
    },[activeAcademyYear]);

    return (
        <SchoolLayout title="Add new test element" pageTitle="test element">
      <div className="section">
            <div className="parent-con">
                <div className="data-table">
                    <div className="top">
                       
                      <div className="flex gap-2">
                        <div className='bg-gray-900 mx-auto mb-2 w-[80%] md:w-[260px] relative h-[120px] md:h-[130px] text-gray-500   px-2 md:px-5 py-3 md:py-5 rounded-md'>
<h1 className=' text-center font-bold uppercase  text-sm md:text-2md text-white'>Comprehension Orale & Ecrite</h1>
      <div className='flex text-white justify-between mt-5 '>
      <button className='test-[12px] md:test-md font-bold bg-blue-500 p-2 rounded-md absolute bottom-2 left-3 ' onClick={()=>{
setShoowAddModal(true)
      }}><BiPlus className="text-white"  size={30} color="#FFFFFF"></BiPlus></button>

      </div> 

                        </div>
                                               <div className='bg-gray-900 mx-auto mb-2 w-[80%] md:w-[220px] relative h-[120px] md:h-[130px] text-gray-500   px-2 md:px-5 py-3 md:py-5 rounded-md'>
<h1 className=' text-center font-bold uppercase text-white  text-sm md:text-2md '>Expression Ecrite</h1>
      <div className='flex text-white justify-between mt-5 '>
      <button className='test-[12px] md:test-md font-bold bg-blue-500 p-2 rounded-md absolute text-white bottom-2 left-3 'onClick={()=>{
setAddEE(true)
      }}><BiPlus size={30} className="text-white" color="#FFFFFF"></BiPlus></button>
      <span className='text-[12px] font-bold  text-white'> Durée : 45min</span>

      </div> 

                        </div>
                        <div className='bg-gray-900 mx-auto mb-2 w-[80%] md:w-[220px] relative h-[120px] md:h-[130px] text-gray-500   px-2 md:px-5 py-3 md:py-5 rounded-md'>
<h1 className=' text-center font-bold uppercase  text-sm md:text-2md text-white'>Expression orale</h1>
      <div className='flex text-white justify-between mt-5 '>
      <button className='test-[12px] md:test-md font-bold bg-blue-500 p-2 rounded-md absolute bottom-2 left-3 flex justify-center'onClick={()=>{
setAddEO(true)
      }}><BiPlus className="text-white" size={30} color="#FFFFFF"></BiPlus></button>
      <span className='text-[12px] font-bold   text-white'> Durée : 45min</span>

      </div> 

                        </div>
                        
                           </div>               
                  
                      </div>
                    

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

        {showAddModal &&  <UploadAssessmentSolutionModal onContentAdded={handleContentAdded} onClose={toggleAddModal} />}
        {addAudio && <div></div>}
        {addEE && <AddExpressionEcrite onContentAdded={handleContentEE} onClose={toggleAddEE} />}
        {addEO && <AddExpressionOrale onContentAdded={handleContentEO} onClose={toggleAddEO} />}
        {showVideoModal && <VideoPlayerModal video={videoUrl} onClose={toggleVideoModal}/>}
        </SchoolLayout>
    );
}

export default Ind;
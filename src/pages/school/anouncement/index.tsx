import React, { useState, useEffect, useContext }  from 'react';
import './anouncement.css';

import StudentLayout from '../../../components/StudentLayout/StudentLayout';

import { EditCourseContentModal, DeleteModal, MakeAnnouncementModal  } from '../../../components';
import UploadAssessmentSolutionModal from '../../../components/students/UploadAssessmentSolutionModal/UploadAssessmentSolution';
import {  BsPencilSquare } from 'react-icons/bs';

import { IoMdCloudDownload } from 'react-icons/io';
import { AiFillEye } from 'react-icons/ai';
import { TfiAnnouncement } from 'react-icons/tfi';

import { toast } from 'react-toastify';

import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';

import { deletePassExamContent } from '../../../services/passExams';
import { getStudentSolutions, getStudentsClasses } from '../../../services/student';

import BeatLoader from "react-spinners/BeatLoader";

import moment from 'moment';
import { getTotalAssessments } from '../../../services/assessment';
import { VideoPlayerModal } from '../../../components';
import { convertDate } from '../../../utils/date';
import SchoolLayout from '../../../components/SchoolLayout/SchoolLayout';
import { schoolGetAllAnnouncement } from '../../../services/school';
import AcademicYearContext from '../../../contexts/AcademicYearContext';

const rows: any = [
    {
        label: '#',
        name: 'num'
    },
    {
        label: 'Subject',
        name: 'name'
    },
    {
        label: 'Message',
        name: 'name'
    },
    {
        label: 'Speciality\'s',
        name: 'name'
    },
    {
        label: 'Created Date',
        name: 'name'
    },
    {
        label: 'Action',
        name: 'name'
    },
]


const override = {
    marginTop: '20px'
  };



function Index() {
    const [ showAddModal, setShoowAddModal ] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false); 
    const [deleteModal, setShowDeleteModal] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const [assessments, setAssessments] = useState([]);
    const [showVideoModal, setShowVideoModal] = useState(false);
    const {activeAcademyYear, setActiveAcademyYear} = useContext<any>(AcademicYearContext);
    const [editData, setEditData] = useState(null);

    const [videoUrl, setVideoUrl] = useState('');

    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(false);

    const toggleAddModal = () => {
        setShoowAddModal(!showAddModal);
    }

    const handleGetAnnouncement = ()  => {
        setLoading(true);
        schoolGetAllAnnouncement().then((res: any) => {
            if(res.ok) {
                setClasses(res.data.data);
                setLoading(false);
            }
            setLoading(false);
        }).catch(err => {
            setLoading(false);
            console.log('error: ', err);
        })
    }

    const handleContentAdded = ()  => {
        handleGetAnnouncement();
        toggleAddModal();
    }



    useEffect(() => {
        console.log('USER EFFECT RAN')
        handleGetAnnouncement();
    },[activeAcademyYear]);

    return (
        <SchoolLayout title="Anouncement" pageTitle="Anouncement">
      <div className="section">
            <div className="parent-con">
                <div className="data-table">
                    <div className="top">
                        <div className="span">
                            {/* <select name="" id="" onChange={(e: any) => handleClassSelected(e.target.value)} className="select-field school-student-select">
                                <option value="all">Select Speciality</option>
                                {classes.map((classData: any, index: any) => <option key={index} value={classData.class_id._id}>{classData.class_id.name}</option>)}
                            </select> */}
                        </div>
                
                        <button onClick={toggleAddModal} className="btn btn-primary btn-add school-button">Create Anouncement  <i> <TfiAnnouncement /> </i></button>
                    </div>
                    <div className="table-con">
                    <div style={{textAlign: 'center',}}>
                        <BeatLoader
                                color="#623d91" 
                                loading={loading}
                                cssOverride={override}
                        />
                    </div>
                        <table>
                            <thead>
                                <tr>
                                    {rows.map((row: any, index: any) => <th key={index} className={row.name}>{row.label}</th>)}
                                    
                                </tr>
                            </thead>
                        
                            <tbody>
                                {classes?.map((data: any, index: any) => <tr>
                                    <td className="flex-center">{index + 1}</td>
                                    <td className="flex-start">
                                        <p>{data?.subject}</p>
                                    </td>
                                    <td className="flex-start">
                                      {data?.message}
                                    </td>
                    
                                    <td className="flex-start">
                                        <p>{data?.specialities?.map((val: any) => `${val.name}, ` )}</p>
                                    </td>


                                    <td className="flex-start">
                                        <p>{convertDate(data?.createdAt)}</p>
                                    </td>

                                

                                    <td className="flex-center">
                                        <div className="action">
                                        <a onClick={() => {
                                                
                                            }} className="see"><AiFillEye onClick={() => null} size={14}/></a>
                                      
                                        </div>
                                    </td>
                                </tr> )}
                            </tbody>
                        </table>
                    </div>

                </div>
            </div>
        </div>

        {showAddModal &&  <MakeAnnouncementModal onContentAdded={handleContentAdded} onClose={toggleAddModal} />}
        </SchoolLayout>
    );
}

export default Index;
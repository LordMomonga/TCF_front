import React, { useState, useEffect, useContext }  from 'react';
import './announcements.css';

import StudentLayout from '../../../components/StudentLayout/StudentLayout';

import { EditCourseContentModal, DeleteModal  } from '../../../components';
import UploadAssessmentSolutionModal from '../../../components/students/UploadAssessmentSolutionModal/UploadAssessmentSolution';
import {  BsPencilSquare } from 'react-icons/bs';

import { IoMdCloudDownload } from 'react-icons/io';
import { AiFillEye } from 'react-icons/ai';

import { toast } from 'react-toastify';

import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';

import { deletePassExamContent } from '../../../services/passExams';
import { getStudentSolutions, getStudentsClasses, getAcceptedClasses, getStudentTimetables, getStudentAnnouncements } from '../../../services/student';

import BeatLoader from "react-spinners/BeatLoader";

import moment from 'moment';
import { getTotalAssessments } from '../../../services/assessment';
import { VideoPlayerModal } from '../../../components';
import { convertDate } from '../../../utils/date';
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
    const [showVideoModal, setShowVideoModal] = useState(false);
    const {activeAcademyYear, setActiveAcademyYear} = useContext<any>(AcademicYearContext);


    const [announcements, setAnnouncements] = useState([]);
    const [loading, setLoading] = useState(false);

    const toggleAddModal = () => {
        setShoowAddModal(!showAddModal);
    }

    const handleGetAnnouncement = ()  => {
        setLoading(true);

        setAnnouncements([]);

        getStudentAnnouncements().then((res: any) => {
            if(res.ok) {
                setAnnouncements(res.data.data);
            }
            setLoading(false);
        }).catch(err => {
            setLoading(false);
            console.log('error: ', err);
        })
    }

    const handleContentAdded = ()  => {
        toggleAddModal();
    }

    useEffect(() => {
        handleGetAnnouncement();
    },[activeAcademyYear]);

    return (
        <StudentLayout title="Announcements" pageTitle="Announcements">
      <div className="section">
            <div className="parent-con">
                <div className="data-table">
                    <div className="top">
                        <div className="span">

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
                        <table>
                            <thead>
                                <tr>
                                    {rows.map((row: any, index: any) => <th key={index} className={row.name}>{row.label}</th>)}
                                    
                                </tr>
                            </thead>
                        
                            <tbody>
                                {announcements?.map((data: any, index: any) => <tr>
                                    <td className="flex-center">{index + 1}</td>
                                    <td className="flex-start">
                                        <p>{data?.subject}</p>
                                    </td>
                                    <td>
                                        <p>{data?.message}</p>
                                    </td>
                                    {/* <td className="flex-start">{data?.active_to}</td> */}
                                
                                    <td className="flex-start">
                                        <p>{convertDate(data?.createdAt)}</p>
                                    </td>
                                     
            
                                    <td className="flex-center">
                                        <div className="action">
                                        <a onClick={() => {
                                               
                                            }} className="see" href={data?.file_url} target="_blank" download>  <Tippy  content="Preview Timetable"  animation="fade">
                                            <AiFillEye onClick={() => null} size={14}/>
                                        </Tippy></a>
                                    </div>
                                    </td>

                                </tr> )}
                            </tbody>
                        </table>
                    </div>

                </div>
            </div>
        </div>

       
        </StudentLayout>
    );
}

export default Index;
import React, { useState, useEffect, useContext }  from 'react';
import './assignment.css';

import StudentLayout from '../../../components/StudentLayout/StudentLayout';

import { EditCourseContentModal, DeleteModal  } from '../../../components';
import SubmitAssignmentModal from '../../../components/students/SubmitAssignmentModal/SubmitAssignmentModal';
import {  BsPencilSquare } from 'react-icons/bs';

import { IoMdCloudDownload } from 'react-icons/io';
import { AiFillEye } from 'react-icons/ai';

import { toast } from 'react-toastify';

import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';

import { deletePassExamContent } from '../../../services/passExams';
import { getStudentSolutions, getStudentsClasses, getAcceptedClasses } from '../../../services/student';

import BeatLoader from "react-spinners/BeatLoader";

import moment from 'moment';
import { getTotalAssessments } from '../../../services/assessment';
import { VideoPlayerModal } from '../../../components';
import { convertDate } from '../../../utils/date';
import { getTotalAssignments } from '../../../services/assignment';
import AcademicYearContext from '../../../contexts/AcademicYearContext';

const rows: any = [
    {
        label: '#',
        name: 'num'
    },
    {
        label: 'Class',
        name: 'name'
    },
    {
        label: 'Name',
        name: 'name'
    },
    {
        label: 'Teacher',
        name: 'name'
    },
    {
        label: 'Solution File',
        name: 'name'
    },
    {
        label: 'Question File',
        name: 'name'
    },
    {
        label: 'Created Date',
        name: 'name'
    },
    {
        label: 'Sumission Deadline',
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
    const [assignments, setAssignments] = useState([]);
    const [showVideoModal, setShowVideoModal] = useState(false);
    const {activeAcademyYear, setActiveAcademyYear} = useContext<any>(AcademicYearContext);


    const [editData, setEditData] = useState(null);

    const [videoUrl, setVideoUrl] = useState('');

    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(false);

    const toggleAddModal = () => {
        setShoowAddModal(!showAddModal);
    }

    const handleGetClasses = ()  => {

        setClasses([])
        setAssignments([]);

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


    const handleGetAssignments = (classId: any) => {
        setLoading(true);
        getTotalAssignments(classId).then((res: any) => {
            console.log("STUDENT assignments RES: ",res);
            setLoading(false);
            setAssignments(res.data.data);
        }).catch((err: any) => {
            console.log('Error: ', err);
            setLoading(false);
        })
    }

    const handleClassSelected = (value: any) => {
        try {
            console.log('CLASS ID:' , value)
            if(value == 'all') {
                setAssignments([]);
                return;
            }

            handleGetAssignments(value);
        } catch (error) {
            console.log('error: ', error)
        }
    }



    useEffect(() => {
        console.log('USER EFFECT RAN')
        handleGetClasses();
    },[activeAcademyYear]);

    return (
        <StudentLayout title="Assignments" pageTitle="Assignments">
      <div className="section">
            <div className="parent-con">
                <div className="data-table">
                    <div className="top">
                        <div className="span">
                            <select name="" id="student-select-new" onChange={(e: any) => handleClassSelected(e.target.value)} className="select-field student-select">
                                <option value="all">Select Class</option>
                                {classes.map((classData: any, index: any) => <option key={index} value={classData?._id}>{classData?.name}</option>)}
                            </select>
                        </div>
                        {/* <form className="search">
                            <input type="search" name="" id="" placeholder="Find ..." />
                            <button type="submit"><i className="fa fa-search" aria-hidden="true"></i></button>
                        </form> */}
                        <button onClick={toggleAddModal} className="btn btn-primary btn-add student-button"> Upload Solution <i className="fas fa-plus"></i></button>
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
                                {assignments?.map((data: any, index: any) => <tr>
                                    <td className="flex-center">{index + 1}</td>
                                    <td className="flex-start">
                                        <p>{data?.class_room_id?.name}</p>
                                    </td>
                                    <td className="flex-start">
                                      {data?.title}
                                    </td>
                                    <td className="flex-start">
                                      {data?.teacher_id?.username}
                                    </td>
                    
                                  {data?.answers_file.length > 2 &&  <td className="flex-start"><a>Available</a></td>}

                                  {data?.answers_file.length < 2 &&  <td className="flex-start"><a>Not Available</a></td>}
                                    
                                    <td className="flex-start"><a href={data?.assignment_file} target="_blank" download>Questions</a></td>
                                
                                    <td className="flex-start">
                                        <p>{convertDate(data?.createdAt)}</p>
                                    </td>

                                     
                                    <td className="flex-start">
                                        <p>{data?.publish_answers_date}</p>
                                    </td>

                                   <td className="flex-center">
                                        <div className="action">
                                       {data?.answers_file.length > 2 &&  <>{data?.answers_file_type == 'video' && <Tippy content="View Video Solution"  animation="fade">
                                            <a onClick={() => {
                                                handleSetVideoUrl(data.answers_file)
                                            }} className="see"><AiFillEye onClick={() => null} size={14}/></a>
                                            </Tippy>}
                                          {data?.answers_file_type == 'others' &&  <Tippy content="Download Solution File"  animation="fade">
                                            <a target="_blank" download href={data.answers_file} className="see"><IoMdCloudDownload onClick={() => null} size={14}/></a>
                                            </Tippy>}</>}
                                            
                                            {data?.assignment_file?.length > 2 &&  <Tippy content="Download Assignment File"  animation="fade">
                                            <a href={data?.assignment_file} target="_blank" download className="see orange"><IoMdCloudDownload onClick={() => null} size={14}/></a>
                                            </Tippy>}
                                        </div>
                                    </td>
                                </tr> )}
                            </tbody>
                        </table>
                    </div>

                </div>
            </div>
        </div>

        {showAddModal &&  <SubmitAssignmentModal onContentAdded={handleContentAdded} onClose={toggleAddModal} />}
        {showVideoModal && <VideoPlayerModal video={videoUrl} onClose={toggleVideoModal}/>}
        </StudentLayout>
    );
}

export default Index;
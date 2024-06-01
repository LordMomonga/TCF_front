import React, { useState, useEffect, useContext }  from 'react';
import './/assignment-submissions.css';

import StudentLayout from '../../../components/StudentLayout/StudentLayout';

import { AssessmentModal, EditCourseContentModal, DeleteModal, PassExammodal  } from '../../../components';
import UploadAssignmentSolutionModal from '../../../components/students/UploadFollowupSolutionModal/UploadFollowupSolutionModal';
import { IoMdCloudDownload } from 'react-icons/io';
import {  BsPencilSquare } from 'react-icons/bs';

import { toast } from 'react-toastify';

import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';

import { getClasses, deleteClass } from '../../../services/classroom';
import { getPassExamContents, deletePassExamContent } from '../../../services/passExams';
import { getStudentSolutions, getStudentsClasses, getAcceptedClasses } from '../../../services/student';

import BeatLoader from "react-spinners/BeatLoader";

import moment from 'moment';
import { convertDate } from '../../../utils/date';
import { getStudentsAssessmentSolutions } from '../../../services/assessment';
import { getStudentsAssignmentSolutions } from '../../../services/assignment';
import AcademicYearContext from '../../../contexts/AcademicYearContext';

const rows: any = [
    {
        label: '#',
        name: 'num'
    },
    {
        label: 'Class Name',
        name: 'name'
    },
    {
        label: 'Assignment Title',
        name: 'name'
    },
    {
        label: 'Comment',
        name: 'name'
    },
    {
        label: 'Solution File',
        name: 'name'
    },
    {
        label: 'Score',
        name: 'name'
    },
    {
        label: 'Total Score',
        name: 'name'
    },
    {
        label: 'Marked Script',
        name: 'name'
    },
    {
        label: 'Submitted Date',
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
    const [deleteModal, setShowDeleteModal] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const [solutions, setSolutions] = useState([]);
    const {activeAcademyYear, setActiveAcademyYear} = useContext<any>(AcademicYearContext);


    const [editData, setEditData] = useState(null);

    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(false);


    const toggleDeleteModal = () => {
        setShowDeleteModal(!deleteModal);
    }

    const handleGetClasses = ()  => {
        setClasses([])

        getAcceptedClasses().then((res: any) => {
            if(res.ok) {
                setClasses(res.data.data);
            }
        }).catch(err => {
            console.log('error: ', err);
        })
    }




    const handleGetSolutions = () => {
        setLoading(true);
        getStudentsAssignmentSolutions().then((res: any) => {
            console.log("STUDENT SOLUTIONS RES: ",res);
            setLoading(false);
            setSolutions(res.data.data);
        }).catch((err: any) => {
            console.log('Error: ', err);
            setLoading(false);
        })
    }

    useEffect(() => {
        console.log('USER EFFECT RAN')
        handleGetSolutions();
        handleGetClasses();
    },[activeAcademyYear]);

    return (
        <StudentLayout title="Assignment Submissions" pageTitle="Assignment Submissions">
      <div className="section">
            <div className="parent-con">
                <div className="data-table">
                    <div className="top">
                        <div className="span">
                            <select name="" id="student-select-new" className="select-field student-select">
                                <option value="all">All</option>
                                {classes.map((classData: any, index: any) => <option key={index} value={classData?._id}>{classData?.name}</option>)}
                            </select>
                        </div>
                        {/* <form className="search">
                            <input type="search" name="" id="" placeholder="Find ..." />
                            <button type="submit"><i className="fa fa-search" aria-hidden="true"></i></button>
                        </form> */}
                      
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
                                {solutions?.map((data: any, index: any) => <tr>
                                    <td className="flex-center">{index + 1}</td>
                                    <td className="flex-start">
                                        <p>{data?.classroom_id?.name}</p>
                                    </td>
                                    <td className="flex-start">
                                      {data?.assignment_id?.title}
                                    </td>
                                    <td className="flex-start">
                                      {data?.comment}
                                    </td>
                    
                                    <td className="flex-start"><a href={data?.document_url} target="_blank" download>Your Solution File</a></td>
                                    
                                    <td className="flex-start">{data?.score ? data?.score : 'Not Yet'}</td>
                                    
                                    <td className="flex-start">{data?.total_score ? data?.total_score : 'Not Yet'}</td>
                                   
                                    <td className="flex-start">{data?.marked_script_file?.length > 2 ? "Available" : 'Not Yet'}</td>
                           
                    
                                    <td className="flex-start">
                                        <p>{convertDate(data?.createdAt)}</p>
                                    </td>
                                    
                                    <td className="flex-center">
                                        <div className="action">
                                        {data?.document_url?.length > 2 &&  <Tippy content="Download Question File"  animation="fade">
                                            <a href={data?.document_url} target="_blank" download className="see"><IoMdCloudDownload onClick={() => null} size={14}/></a>
                                        </Tippy>}
                                        {data?.marked_script_file?.length > 2 &&  <Tippy content="Download Marked Script "  animation="fade">
                                            <a href={data?.marked_script_file} target="_blank" download className="see orange"><IoMdCloudDownload onClick={() => null} size={14}/></a>
                                        </Tippy>}
                                        {data?.document_url?.length > 2 &&  <Tippy content="Download Your Solution "  animation="fade">
                                            <a href={data?.document_url} target="_blank" download className="see"><IoMdCloudDownload onClick={() => null} size={14}/></a>
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

        </StudentLayout>
    );
}

export default Index;
import React, { useState, useEffect, useContext }  from 'react';
import './assignment-submissions.css';

import Layout from '../../../components/Layout/Layout';

import { AddCourseContentModal, EditCourseContentModal, DeleteModal, AssessmentScoreModal } from '../../../components';

import { AiFillEye } from 'react-icons/ai';
import {  BsPencilSquare } from 'react-icons/bs';
import { IoMdCloudDownload } from 'react-icons/io';

import { toast } from 'react-toastify';

import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';

import { getClasses, deleteClass } from '../../../services/classroom';
import { deleteCourseContent, getCourseContents, getClassCourseContents } from '../../../services/courseContent';
import { getAllStudentSolutions } from '../../../services/student';
import { getAllAssessmentSolutions, getClassAssessments } from '../../../services/assessment';

import { FollowUpScoreModal } from '../../../components';
import BeatLoader from "react-spinners/BeatLoader";

import moment from 'moment';
import { convertDate } from '../../../utils/date';
import { useTranslation } from 'react-i18next';
import { getAllAssignmentSolutions, getClassAssignments } from '../../../services/assignment';
import AcademicYearContext from '../../../contexts/AcademicYearContext';

const rows: any = [
    {
        label: '#',
        name: 'num'
    },
    {
        label: 'Student Name',
        name: 'name'
    },
    {
        label: 'Submission',
        name: 'name'
    },
    {
        label: 'Comment',
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
        label: 'Submitted Date',
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



function Index() {
    const [classes, setClasses] = useState([]);
    const [contents, setContents] = useState([]);
    const [solutions, setSolutions] = useState([]);
    const [seletedClass, setSelectedClass] = useState('all');
    const [seletedContent, setSelectedContent] = useState('all');
    const [loading, setLoading] = useState(false);
    const [showAssessmentScoreModal, setShowAssessmentScoreModal] = useState(false);
    const [selectedSolutionId, setSelectedSolutionId] = useState(null);

    const [submissionVals, setSubmissionVals] = useState(null);

    const {activeAcademyYear, setActiveAcademyYear} = useContext<any>(AcademicYearContext);

    const { t, i18n } = useTranslation();

    const rows: any = [
        {
            label: '#',
            name: 'num'
        },
        {
            label: (`${t('assessment_submission.data_table.title')}`),
            name: 'name'
        },
        {
            label: (`${t('assessment_submission.data_table.student_name')}`),
            name: 'name'
        },
        {
            label: (`${t('assessment_submission.data_table.question_file')}`),
            name: 'name'
        },
        {
            label: (`${t('assessment_submission.data_table.answer_pdf')}`),
            name: 'name'
        },
        {
            label: (`${t('assessment_submission.data_table.submitted_date')}`),
            name: 'name'
        },
        {
            label: (`${t('assessment_submission.data_table.created_date')}`),
            name: 'name'
        },
        {
            label: 'Action',
            name: 'action'
        }
    ]

    const handleGetClasses = ()  => {
        setSolutions([]);
        setSelectedContent('all')
        setSelectedClass('all');
        setClasses([]);
        setContents([]);

        getClasses().then((res: any) => {
            if(res.ok) {
                setClasses(res.data.data);
            }
        }).catch(err => {
            console.log('error: ', err);
        })
    }

    const handleGetContent = (classId: any) => {
        // setLoading(true);
        setSolutions([]);
        setSelectedContent('all')

        if(classId == 'all') {
            setSelectedClass('all');
            setContents([]);
            setSolutions([]);
            setSelectedContent('all')
            return;
        }
        setSelectedClass(classId)
        // CHANGE TO GET CLASS ASSESSMENTS
        getClassAssignments(classId).then((res: any) => {
            // console.log("CLASSS COURSE CONTENT RES: ",res);
            // setLoading(false);
            // console.log(res);
            if(res.ok) {
                setContents(res.data.data);
            }
        }).catch((err: any) => {
            console.log('Error: ', err);
            // setLoading(false);
        })
    }

    const getSolutions = (contentId: any) => {
        setLoading(true);

        getAllAssignmentSolutions(contentId).then((res: any) => {
            // console.log('All Solutions', res)
            setSolutions(res.data.data)
            setLoading(false);
        }).catch(err => {
            console.log('ERROR')
            setLoading(false);
        })
    }

    const handleGetAssignmentSubs = (contentId: any) => {
        // console.log('GET SUBS');
        // console.log('CONTENT ID: ', contentId)

        if(contentId == 'all') {
            setSelectedContent('all');
            setSolutions([]);
            return;
        }
        setSelectedContent(contentId);
        getSolutions(contentId);
    }

    const toggleScoreModal = () => {
        setShowAssessmentScoreModal(!showAssessmentScoreModal)
    }

    const handleSetSelectedId = (id: any, data: any) => {
        setSelectedSolutionId(id);
        if(data?.score) {
            setSubmissionVals(data);
        }
        toggleScoreModal();
    }

    const scoreSubmited = () => {
        getSolutions(seletedContent);
        setShowAssessmentScoreModal(false);
    }


    useEffect(() => {
        console.log('USER EFFECT RAN')
        handleGetClasses();
    },[activeAcademyYear]);

    return (
        <Layout title="Assignment Submissions" pageTitle="Assignment Submissions">
      <div className="section">
            <div className="parent-con">
                <div className="data-table">
                    <div className="top">
                        <div className="span">
                            <select value={seletedClass} onChange={(e: any) => handleGetContent(e.target.value)} className="select-field">
                                <option  value="all">Select Class</option>
                                {classes.map((classData: any, index: any) => <option key={index} value={classData._id}>{classData.name}</option>)}
                            </select>
                            <select value={seletedContent} onChange={(e: any) => handleGetAssignmentSubs(e.target.value)}  className="select-field">
                                <option value="all">Select Assignment</option>
                                {contents.map((contentData: any, index: any) => <option key={index} value={contentData._id}>{contentData.title}</option>)}
                            </select>
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
                                {solutions?.map((data: any, index: any) => <tr>
                                    <td className="flex-center">{index + 1}</td>
                                    <td className="flex-start">
                                        <p>{data?.student_id?.username}</p>
                                    </td>
                            
                                    <td className="flex-start"><a href={data?.document_url} target="_blank" download>Submission File</a></td>
                                    <td className="flex-start">{data?.comment}</td>

                                    <td className="flex-start">{data?.score ? data?.score : 'Not Yet'}</td>
                                    <td className="flex-start">{data?.total_score ? data?.total_score : 'Not Yet'}</td>
                           

                                    <td className="flex-start">
                                        <p>{convertDate(data?.createdAt)}</p>
                                    </td>

                                    <td className="flex-center">
                                        <div className="action">
                                        
                                            <Tippy content="Enter Score"  animation="fade">
                                                <a className="see"><BsPencilSquare onClick={() => handleSetSelectedId(data?._id, data)} size={16}/></a>
                                            </Tippy>
                                            <Tippy content="Download  Submission"  animation="fade">
                                            <a target="_blank" download href={data?.document_url} className="see"><IoMdCloudDownload size={16}/></a>
                                            </Tippy>
                                        </div>
                                    </td>
                                </tr> )}
                            </tbody>
                        </table>
                    </div>

                </div>
            </div>
        </div>
        {showAssessmentScoreModal && <AssessmentScoreModal onContentAdded={scoreSubmited} values={submissionVals} assessMentSolId={selectedSolutionId} onClose={toggleScoreModal}/>}
        </Layout>
    );
}

export default Index;
import React, { useState, useEffect, useContext }  from 'react';
import './reports.css';

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
import { getStudentSolutions, getStudentsClasses } from '../../../services/student';

import BeatLoader from "react-spinners/BeatLoader";

import moment from 'moment';
import { getTotalAssessments } from '../../../services/assessment';
import { VideoPlayerModal } from '../../../components';
import { convertDate } from '../../../utils/date';
import SchoolLayout from '../../../components/SchoolLayout/SchoolLayout';
import { getSchoolSpecialitis } from '../../../services/specialities';
import { schoolGetReoports } from '../../../services/school';
import AcademicYearContext from '../../../contexts/AcademicYearContext';

const rows: any = [
    {
        label: '#',
        name: 'num'
    },
    {
        label: 'Student\'s Name',
        name: 'name'
    },
    {
        label: 'Speciality',
        name: 'name'
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
    }
]


const override = {
    marginTop: '20px'
  };



function Index() {
    const [reports, setReports] = useState([]);

    // GOOD
    const [schoolSpecialities, setSchoolSpecialites] = useState([]);
    const [loading, setLoading] = useState(false);
    const {activeAcademyYear, setActiveAcademyYear} = useContext<any>(AcademicYearContext);

    const handleGetSpecialities = ()  => {
        setSchoolSpecialites([]);
        getSchoolSpecialitis().then((res: any) => {
            console.log('RESPONSE GET: ', res);
            if(res.ok) {
                setSchoolSpecialites(res.data.data);
            }
        }).catch(err => {
            console.log('error: ', err);
        })
    }




    const handleGetReports = () => {
        setLoading(true);
        setReports([]);
        schoolGetReoports().then((res: any) => {
            console.log("STUDENT REPORTS RES: ",res);
            setLoading(false);
            setReports(res.data.data);
        }).catch((err: any) => {
            console.log('Error: ', err);
            setLoading(false);
        })
        setLoading(false);
    }


    useEffect(() => {
        console.log('USER EFFECT RAN')
        handleGetSpecialities();
        handleGetReports();
    },[activeAcademyYear]);

    return (
        <SchoolLayout title="All Reports" pageTitle="Reports">
      <div className="section">
            <div className="parent-con">
                <div className="data-table">
                    <div className="top">
                        <div className="span">
                        <select name="" id="" onChange={(e: any) => null} className="select-field school-student-select">
                                <option value="all">filtrer par spécialité</option>
                               {schoolSpecialities?.map((sp: any) => <option value={sp._id}>{sp?.name}</option>)}
                            </select>
                        </div>
                
                        
                    </div>
                    <div className="table-con">
                    <div style={{textAlign: 'center',}}>
                        <BeatLoader
                                color="#484848" 
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
                                {reports?.map((data: any, index: any) => <tr>
                                    <td className="flex-center">{index + 1}</td>
                                    <td className="flex-start">
                                        <p>{data?.student_id?.username}</p>
                                    </td>
                                    <td className="flex-start">
                                      {data?.speciality?.name}
                                    </td>

                                    <td className="flex-start">
                                      {data?.subject}
                                    </td>

                                    <td className="flex-start">
                                      {data?.message}
                                    </td>
       
                                    <td className="flex-start">
                                        <p>{convertDate(data?.createdAt)}</p>
                                    </td>

                        
                                </tr> )}
                            </tbody>
                        </table>
                    </div>

                </div>
            </div>
        </div>

        </SchoolLayout>
    );
}

export default Index;
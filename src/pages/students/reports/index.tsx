import React, { useState, useEffect, useContext }  from 'react';
import './reports.css';

import StudentLayout from '../../../components/StudentLayout/StudentLayout';
import { StudensReportmodal } from '../../../components/index';

import { AiFillEye } from 'react-icons/ai';

import { toast } from 'react-toastify';

import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';


import {  getStudentReports, getStudentTimetables } from '../../../services/student';

import BeatLoader from "react-spinners/BeatLoader";


import { convertDate } from '../../../utils/date';
import AcademicYearContext from '../../../contexts/AcademicYearContext';
import { FaTrash } from 'react-icons/fa';

const rows: any = [
    {
        label: '#',
        name: 'num'
    },
    {
        label: 'Schhol\'s Name',
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
    const {activeAcademyYear, setActiveAcademyYear} = useContext<any>(AcademicYearContext);


    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(false);

    const toggleAddModal = () => {
        setShoowAddModal(!showAddModal);
    }


    const handleGetReports = ()  => {
        setLoading(true);

        setReports([]);

        getStudentReports().then((res: any) => {
            if(res.ok) {
                setReports(res.data.data);
            }
            setLoading(false);
        }).catch(err => {
            setLoading(false);
            console.log('error: ', err);
        })
    }

    const handleContentAdded = ()  => {
        toggleAddModal();
        handleGetReports();
    }

    useEffect(() => {
        handleGetReports();
    },[activeAcademyYear]);

    return (
        <StudentLayout title="All Reports" pageTitle="Reports">
      <div className="section">
            <div className="parent-con">
                <div className="data-table">
                    <div className="top">
                        <div className="span">

                        </div>

                        <button onClick={() => toggleAddModal()} className="btn btn-primary btn-add student-button"> New Report <i className="fas fa-plus"></i></button>
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
                                {reports?.map((data: any, index: any) => <tr>
                                    <td className="flex-center">{index + 1}</td>
                                    <td className="flex-start">
                                        <p>{data?.school_id?.username}</p>
                                    </td>
                                    <td>
                                        <p>{data?.speciality?.name}</p>
                                    </td>
                                    <td className="flex-start">{data?.subject}</td>

                                    <td className="flex-start">{data?.message}</td>
                                
                                    <td className="flex-start">
                                        <p>{convertDate(data?.createdAt)}</p>
                                    </td>
                                     
            
                                    <td className="flex-center">
                                        <div className="action">
                                        <a onClick={() => {
                                               
                                            }} className="delete">  <Tippy  content="Delete Report"  animation="fade">
                                            <FaTrash onClick={() => null} size={14}/>
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

        {showAddModal &&  <StudensReportmodal onReportSubmitted={handleContentAdded} onClose={toggleAddModal} />}
        </StudentLayout>
    );
}

export default Index;
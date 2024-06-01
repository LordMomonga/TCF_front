import React, { useState, useEffect, useContext } from 'react';
import './landing.css';

import Layout from '../../../components/Layout/Layout';
import StudentLayout from '../../../components/StudentLayout/StudentLayout';
import { AddClassModal, DeleteModal } from '../../../components';
import JoinClassModal from '../../../components/students/JoinClassModal/JoinClassModal';
import AcademicYearContext from '../../../contexts/AcademicYearContext';

import { AiOutlineCopy } from 'react-icons/ai';

import { toast } from 'react-toastify';

import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';

import { getStudentApplications, getStudentsClasses, joinClass } from '../../../services/student';

import BeatLoader from "react-spinners/BeatLoader";
import {convertDate} from '../../../utils/date';

import moment from 'moment';

const rows: any = [
    {
        label: '#',
        name: 'num'
    },
    {
        label: ' Name',
        name: 'name'
    },
    {
        label: 'Speciality',
        name: 'name'
    },
    {
        label: 'Academic Year',
        name: 'name'
    },
    {
        label: 'Fees Paid',
        name: 'name'
    },
    {
        label: 'Total Fees',
        name: 'name'
    },
    {
        label: 'Status',
        name: 'name'
    },
    {
        label: 'Submited Date',
        name: 'name'
    },
]


const override = {
    marginTop: '20px'
  };


function Index() {
    const [ showJoinModal, setShowJoinModal ] = useState(false);
    const {activeAcademyYear, setActiveAcademyYear} = useContext<any>(AcademicYearContext);
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(false);

    const toggleAddModal = () => {
        setShowJoinModal(!showJoinModal);
    }


    const handleGetApplications = ()  => {
        setLoading(true);
        setApplications([]);
        getStudentApplications().then((res: any) => {
            console.log('RESPONSE GET: ', res);
            if(res.ok) {
                setApplications(res.data.data);
            }
            setLoading(false);
        }).catch(err => {
            console.log('error: ', err);
            setLoading(false);
        })
    }

 

    const handleClassAdded = ()  => {
        handleGetApplications();
        toggleAddModal();
    }

    useEffect(() => {
        handleGetApplications();
    },[activeAcademyYear]);

    return (
        <StudentLayout title="Spécialité" pageTitle="Home">
              <div className="section">
                        <div className="parent-con">
                            <div className="data-table">
                                <div className="top">
                                    <div className="span">
                                        <h1>Academic Years</h1>
                                    </div>
                                    {/* <form className="search">
                                        <input type="search" name="" id="" placeholder="Find ..." />
                                        <button type="submit"><i className="fa fa-search" aria-hidden="true"></i></button>
                                    </form> */}
                                    <button onClick={toggleAddModal} className="btn btn-primary btn-add student-button">Abonnement  <i className="fas fa-plus"></i></button>
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
                                          {applications.map((data: any, index: any) => <tr key={index}>
                                                <td className="flex-center">{index + 1}</td>

                                                <td className="flex-start">
                                                    <p>{data?.school_id?.username}</p>
                                                </td>

                                                <td className="flex-start">
                                                    <p>{data?.speciality_id?.name}</p>
                                                </td>
                                    
                                                <td className="flex-start">{data?.academic_year?.title}</td>
                                                
                                                <td className="flex-start">{data?.fees_paid}</td>

                                                <td className="flex-start">{data?.total_fees}</td>
                                                
                                                <td className="flex-start">{data?.status}</td>

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

                    {showJoinModal &&  <JoinClassModal onClassAdded={handleClassAdded} onClose={toggleAddModal} />}
        </StudentLayout>
    );
}

export default Index;
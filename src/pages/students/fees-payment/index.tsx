import React, { useState, useEffect, useContext }  from 'react';
import './fees-payment.css';

import StudentLayout from '../../../components/StudentLayout/StudentLayout';
import { StudensReportmodal } from '../../../components/index';

import { AiFillEye } from 'react-icons/ai';

import { toast } from 'react-toastify';

import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';


import {  getStudentReports, getStudentTimetables, studentGetReceipts } from '../../../services/student';

import BeatLoader from "react-spinners/BeatLoader";


import { convertDate } from '../../../utils/date';
import AcademicYearContext from '../../../contexts/AcademicYearContext';
import { FaTrash } from 'react-icons/fa';
import UploadPaymentReceipt from '../../../components/students/UploadPaymentReceipt/UploadPaymentReceipt';

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
        label: 'Amount',
        name: 'name'
    },
    {
        label: 'Status',
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


    const [receipts, setReceipts] = useState([]);
    const [loading, setLoading] = useState(false);

    const toggleAddModal = () => {
        setShoowAddModal(!showAddModal);
    }


    const handleGetReceipts = ()  => {
        setLoading(true);

        setReceipts([]);

        studentGetReceipts().then((res: any) => {
            if(res.ok) {
                setReceipts(res.data.data);
            }
            setLoading(false);
        }).catch(err => {
            setLoading(false);
            console.log('error: ', err);
        })
    }

    const handleContentAdded = ()  => {
        handleGetReceipts();
        toggleAddModal();
    }

    useEffect(() => {
        handleGetReceipts();
    },[activeAcademyYear]);

    return (
        <StudentLayout title="Payment Receipts" pageTitle="Payments">
      <div className="section">
            <div className="parent-con">
                <div className="data-table">
                    <div className="top">
                        <div className="span">

                        </div>

                        <button onClick={() => toggleAddModal()} className="btn btn-primary btn-add student-button">Upload Payment Receipts <i className="fas fa-plus"></i></button>
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
                                {receipts?.map((data: any, index: any) => <tr>
                                    <td className="flex-center">{index + 1}</td>
                                    <td className="flex-start">
                                        <p>{data?.school_id?.username}</p>
                                    </td>
                                    <td>
                                        <p>{data?.speciality?.name}</p>
                                    </td>
                                    <td className="flex-start">{data?.amount}</td>

                                    <td className="flex-start">{data?.status}</td>
                                
                                    <td className="flex-start">
                                        <p>{convertDate(data?.createdAt)}</p>
                                    </td>
                                     
            
                                    <td className="flex-center">
                                        <div className="action">
                                        <Tippy  content="View Receipt File"  animation="fade">
                                        <a onClick={() => {
                                               
                                            }} className="see">
                                            <AiFillEye onClick={() => null} size={14}/>
                                            </a>
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

        {showAddModal &&  <UploadPaymentReceipt contentAdded={handleContentAdded} onClose={toggleAddModal} />}
        </StudentLayout>
    );
}

export default Index;
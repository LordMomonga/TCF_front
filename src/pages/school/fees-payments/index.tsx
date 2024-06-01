import React, { useState, useEffect, useContext }  from 'react';
import './fees-payments.css';

import StudentLayout from '../../../components/StudentLayout/StudentLayout';

import {  BsPencilSquare } from 'react-icons/bs';

import { IoMdCloudDownload } from 'react-icons/io';
import { AiFillEye } from 'react-icons/ai';

import { toast } from 'react-toastify';

import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';

import { deletePassExamContent } from '../../../services/passExams';
import { getStudentSolutions, getStudentsClasses } from '../../../services/student';

import BeatLoader from "react-spinners/BeatLoader";
import { BsPatchCheckFill } from 'react-icons/bs';
import { MdCancel } from 'react-icons/md';
import moment from 'moment';
import { DeleteModal, VideoPlayerModal } from '../../../components';
import { convertDate } from '../../../utils/date';
import SchoolLayout from '../../../components/SchoolLayout/SchoolLayout';
import CreateBankInfoModal from '../../../components/school/CreateBankInfoModal/CreateBankInfoModal';
import { schoolGetBankInfos } from '../../../services/bankInfo';
import { FaTrash } from 'react-icons/fa';
import { schooolAcceptReceipts, schooolGetReceipts, schooolRejectReceipts } from '../../../services/school';
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
        label: 'Amount',
        name: 'name'
    },
    {
        label: 'Bank',
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
    const [selectedFeesId, setSelectedFeesId] = useState(null);
    const [showAcceptFeesModal, setShowAcceptFeesModal] = useState(false);
    const [showRejectFeesModal, setShowRejectFeesModal] = useState(false);
    const {activeAcademyYear, setActiveAcademyYear} = useContext<any>(AcademicYearContext);
    const [loading, setLoading] = useState(false);

    // NEW
    const [receipts, setReceipts] = useState([]);


    const toggleAcceptFessModal = () => {
        setShowAcceptFeesModal(!showAcceptFeesModal);
    }


    const handleFeesAccepted = ()  => {

        schooolAcceptReceipts(selectedFeesId).then((res: any) => {
            if(res.ok) {
                handleGetReceipts();
                toggleAcceptFessModal();
                toast.success(res.data.message, {
                    pauseOnHover: false,
                    closeOnClick: true,
                })
          
            }else {
                toast.error(res.data.message, {
                    pauseOnHover: false,
                    closeOnClick: true,
                })
            }
        }).catch(err => {
            toast.error("ERROR", {
                pauseOnHover: false,
                closeOnClick: true,
            })
        })

       
    }


    const toggleRejectFessModal = () => {
        setShowRejectFeesModal(!showRejectFeesModal);
    }


    const handleFeesRejected = ()  => {
        schooolRejectReceipts(selectedFeesId).then((res: any) => {
            if(res.ok) {
                handleGetReceipts();
                toggleRejectFessModal();
                toast.success(res.data.message, {
                    pauseOnHover: false,
                    closeOnClick: true,
                })
          
            }else {
                toast.error(res.data.message, {
                    pauseOnHover: false,
                    closeOnClick: true,
                })
            }
        }).catch(err => {
            toast.error("ERROR", {
                pauseOnHover: false,
                closeOnClick: true,
            })
        })

    }



    const handleGetReceipts = ()  => {
        setLoading(true);

        setReceipts([]);

        schooolGetReceipts().then((res: any) => {
            if(res.ok) {
                setReceipts(res.data.data);
            }
            setLoading(false);
        }).catch(err => {
            setLoading(false);
            console.log('error: ', err);
        })
    }


    useEffect(() => {
        console.log('USER EFFECT RAN')
        handleGetReceipts();
    },[activeAcademyYear]);

    return (
        <SchoolLayout title="School Fees Payments" pageTitle="Fees">
      <div className="section">
            <div className="parent-con">
                <div className="data-table">
                    <div className="top">
                        <div className="span">
                       
                        </div>
                
                        {/* <button onClick={toggleAddModal} className="btn btn-primary btn-add school-button"> Add Bank Info <i className="fas fa-plus"></i></button> */}
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
                                        <p>{data?.student_id?.username}</p>
                                    </td>
                                    <td>
                                        <p>{data?.speciality?.name}</p>
                                    </td>
                                    <td className="flex-start">{data?.amount}</td>

                                    <td className="flex-start">{data?.account?.name}</td>

                                    <td className="flex-start">{data?.status}</td>
                                
                                    <td className="flex-start">
                                        <p>{convertDate(data?.createdAt)}</p>
                                    </td>

                                    <td className="flex-center">
                                        <div className="action">
                                            <Tippy content="View Receipt"  animation="fade">
                                            <a onClick={() => {
                                                // handleSetVideoUrl(data.answers_file)
                                            }} className="see" href={data?.file_url} target="_blank" download><IoMdCloudDownload onClick={() => null} size={14}/></a>
                                            </Tippy>
                                            <Tippy content="Accept"  animation="fade">
                                            <a onClick={() => {
                                                setSelectedFeesId(data?._id)
                                                toggleAcceptFessModal();
                                            }} className="see"><BsPatchCheckFill onClick={() => null} size={14}/></a>
                                            </Tippy>
                                            <Tippy content="Reject"  animation="fade">
                                            <a onClick={() => {
                                                 setSelectedFeesId(data?._id)
                                                 toggleRejectFessModal();
                                                // handleSetVideoUrl(data.answers_file)
                                            }} className="delete"><MdCancel onClick={() => null} size={14}/></a>
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

        {showAcceptFeesModal && <DeleteModal color={'#605E5A'} title="Are you sure you  want to confirm receipt ?" onAccept={handleFeesAccepted} onCancel={toggleAcceptFessModal} />}
        
        {showRejectFeesModal && <DeleteModal color={'#605E5A'} title="Are you sure you  want to reject receipt ?" onAccept={handleFeesRejected} onCancel={toggleRejectFessModal} />}
        </SchoolLayout>
    );
}

export default Index;
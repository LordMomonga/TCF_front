import React, { useState, useEffect, useContext }  from 'react';
import './fees-deadlines.css';

import StudentLayout from '../../../components/StudentLayout/StudentLayout';

import { toast } from 'react-toastify';

import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';

import { MdDangerous } from 'react-icons/md';

import BeatLoader from "react-spinners/BeatLoader";

import moment from 'moment';
import { CreateFeesDeadlineModal, DeleteModal, VideoPlayerModal } from '../../../components';
import { convertDate } from '../../../utils/date';
import SchoolLayout from '../../../components/SchoolLayout/SchoolLayout';
import { FaTrash } from 'react-icons/fa';
import AcademicYearContext from '../../../contexts/AcademicYearContext';
import { feesSuspendStudents, schoolDeleteDeadline, schoolGetDeadlines } from '../../../services/instalments';
import { schoolSuspendStudent } from '../../../services/student';

const rows: any = [
    {
        label: '#',
        name: 'num'
    },
    {
        label: 'Title',
        name: 'name'
    },
    {
        label: 'Deadline Date',
        name: 'name'
    },
    {
        label: 'Must Have Paid',
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
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showSuspendModal, setShowSuspendeModal] = useState(false);

    const [selectedId, setSelectedId] = useState(null);
    const [deadlines, setDeadlines] = useState([]);
    const {activeAcademyYear, setActiveAcademyYear} = useContext<any>(AcademicYearContext);
    
    const [loading, setLoading] = useState(false);

    const toggleAddModal = () => {
        setShoowAddModal(!showAddModal);
    }

    const handleDeleteDeadline  = () => {
        schoolDeleteDeadline(selectedId).then((res: any) => {
            if(res.ok) {
                toast.success(res.data.message, {
                    pauseOnHover: false,
                    closeOnClick: true,
                })
                handleGetFeesDeadlines();
            }

            toggleDeleteModal();
        }).catch((error: any)=> {
            toggleDeleteModal();
            toast.error("ERROR", {
                pauseOnHover: false,
                closeOnClick: true,
            })
        })
    }

    const handleSuspendStudents  = () => {
        // alert(selectedId);
        // return;
        feesSuspendStudents(selectedId).then((res: any) => {
            if(res.ok) {
                toast.success(res.data.message, {
                    pauseOnHover: false,
                    closeOnClick: true,
                })
            }

            toggleSuspendModal();
        }).catch((error: any)=> {
            toggleSuspendModal();
            toast.error("ERROR", {
                pauseOnHover: false,
                closeOnClick: true,
            })
        })
    }




    const handleContentAdded = ()  => {
        handleGetFeesDeadlines();
        toggleAddModal();
    }

    const toggleDeleteModal = () => {
        setShowDeleteModal(!showDeleteModal)
    }

    const toggleSuspendModal = () => {
        setShowSuspendeModal(!showSuspendModal)
    }



    const handleGetFeesDeadlines = () => {
        setDeadlines([]);
        setLoading(true);
        schoolGetDeadlines().then((res: any) => {
            console.log("STUDENT deadlines RES: ",res);
            setLoading(false);
            setDeadlines(res.data.data);
        }).catch((err: any) => {
            console.log('Error: ', err);
            setLoading(false);
        })
    }


    useEffect(() => {
        console.log('USER EFFECT RAN')
        handleGetFeesDeadlines();
    },[]);

    return (
        <SchoolLayout title="Fees Deadline Dates" pageTitle="Deadline">
      <div className="section">
            <div className="parent-con">
                <div className="data-table">
                    <div className="top">
                        <div className="span">
                        {/* <button onClick={toggleAddModal} className="btn btn-danger btn-add school-button-delete"> Suspend Students Owing<i><MdDangerous size={25}/></i></button> */}
                        </div>
                
                        <button onClick={toggleAddModal} className="btn btn-primary btn-add school-button"> Add Deadline <i className="fas fa-plus"></i></button>
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
                                {deadlines?.map((data: any, index: any) => <tr>
                                    <td className="flex-center">{index + 1}</td>
                                    <td className="flex-start">
                                        <p>{data?.title}</p>
                                    </td>
                                    <td className="flex-start">
                                      {data?.date}
                                    </td>

                                    <td>
                                      {data?.amount_percent}%
                                    </td>
                      
                                    <td className="flex-start">
                                        <p>{convertDate(data?.createdAt)}</p>
                                    </td>

                                    <td className="flex-center">
                                        <div className="action">
                                        <Tippy content="Suspend Students"  animation="fade">
                                            <a onClick={() => {
                                                setSelectedId(data._id)
                                                toggleSuspendModal();
                                            }} className="delete"><MdDangerous onClick={() => null} size={14}/></a>
                                            </Tippy>

                                            <Tippy content="Delete Info"  animation="fade">
                                            <a onClick={() => {
                                                setSelectedId(data._id)
                                                toggleDeleteModal();
                                            }} className="delete"><FaTrash onClick={() => null} size={14}/></a>
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
        {showDeleteModal && <DeleteModal onAccept={handleDeleteDeadline} onCancel={toggleDeleteModal} />}
        {showSuspendModal && <DeleteModal onAccept={handleSuspendStudents} title="Suspend all students owing fees for this deadline ?" onCancel={toggleSuspendModal} />}
        {showAddModal &&  <CreateFeesDeadlineModal onContentAdded={handleContentAdded} onClose={toggleAddModal} />}
        </SchoolLayout>
    );
}

export default Index;
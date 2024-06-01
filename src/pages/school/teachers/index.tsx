import React, { useState, useEffect, useContext } from 'react';
import './teachers.css';

import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';

import { AiOutlineCheckSquare } from 'react-icons/ai';
import { MdOutlineCancelPresentation } from 'react-icons/md';

import { DeleteModal } from '../../../components';

import BeatLoader from "react-spinners/BeatLoader";
import {convertDate} from '../../../utils/date';
import { toast } from 'react-toastify';

import SchoolLayout from '../../../components/SchoolLayout/SchoolLayout';
import { getTeachersClassReq } from '../../../services/classroom';
import AcademicYearContext from '../../../contexts/AcademicYearContext';
import { schoolAcceptTeachersRequest, schoolRejectTeachersRequest } from '../../../services/school';

const rows: any = [
    {
        label: '#',
        name: 'num'
    },
    {
        label: 'Teachers Name',
        name: 'name'
    },
    {
        label: 'Specialities',
        name: 'name'
    },
    {
        label: 'Status',
        name: 'name'
    },
    {
        label: 'Requested Date',
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
    const [ showAcceptModal, setShowAcceptModal ] = useState(false);
    const [ showRejectModal, setShowRejectModal ] = useState(false);


    const [teachersRequests, setTeachersRequests] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedId, setSelectedId] = useState<any>(null);
    const {activeAcademyYear, setActiveAcademyYear} = useContext<any>(AcademicYearContext);

    const toggleAcceptModal = () => {
        setShowAcceptModal(!showAcceptModal);
    }

    const toggleRejectModal = () => {
        setShowRejectModal(!showRejectModal);
    }

    const handleRejected = () => {
        schoolRejectTeachersRequest(selectedId).then((res: any) => {
            if(res.ok) {
                toast.success(res.data.message, {
                    pauseOnHover: false,
                    closeOnClick: true,
                })
                handleGetTeachersReq();
            }else {
                toast.error(res.data.message, {
                    pauseOnHover: false,
                    closeOnClick: true,
                })
            }
        }).catch((error: any) => {
            console.log('Error: ', error);
            toast.error("ERROR", {
                pauseOnHover: false,
                closeOnClick: true,
            })
        })
        toggleRejectModal();
    }

    const handleAccepted = () => {
        schoolAcceptTeachersRequest(selectedId).then((res: any) => {
            if(res.ok) {
                toast.success(res.data.message, {
                    pauseOnHover: false,
                    closeOnClick: true,
                })
                handleGetTeachersReq();
            }else {
                toast.error(res.data.message, {
                    pauseOnHover: false,
                    closeOnClick: true,
                })
            }
        }).catch((error: any) => {
            console.log('Error: ', error);
            toast.error("ERROR", {
                pauseOnHover: false,
                closeOnClick: true,
            })
        })
        
        toggleAcceptModal();
    }


    const handleGetTeachersReq = ()  => {
        setLoading(true);

        getTeachersClassReq().then((res: any) => {
            console.log('RESPONSE GET: ', res);
            if(res.ok) {
                setTeachersRequests(res.data.data);
            }
            setLoading(false);
        }).catch(err => {
            console.log('error: ', err);
            setLoading(false);
        })
    }



    useEffect(() => {
        handleGetTeachersReq();
    },[activeAcademyYear]);

    return (
        <SchoolLayout title="School Teachers" pageTitle="Home">
              <div className="section">
                        <div className="parent-con">
                            <div className="data-table">
                                <div className="top">
                                    <div className="span">
                                        <h1>You have : {teachersRequests.length} Teachers</h1>
                                    </div>

                                    <div className="span">
                                        <select name="" id="" onChange={(e: any) => null} className="select-field school-student-select">
                                            <option value="all">Select Status</option>
                                            <option value="active">Active</option>
                                            <option value="pending">Pending</option>
                                            <option value="rejected">Rejected</option>

                                        </select>
                                    </div>
                                    {/* <form className="search">
                                        <input type="search" name="" id="" placeholder="Find ..." />
                                        <button type="submit"><i className="fa fa-search" aria-hidden="true"></i></button>
                                    </form> */}
                                    {/* <button onClick={toggleAddModal} className="btn btn-primary btn-add student-button">Add Speciality  <i className="fas fa-plus"></i></button> */}
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
                                          {teachersRequests.map((data: any, index: any) => <tr key={index}>
                                                <td className="flex-center">{index + 1}</td>

                                                <td className="flex-start">
                                                    <p>{data?.teacher_id?.username}</p>
                                                </td>

                                                <td className="flex-start">
                                                    <p>{data?.specialities?.map((sp: any) => `${sp.name},` )}</p>
                                                </td>
                                       
                            
                                                
                                                <td className="flex-start">{data?.status}</td>

                                                <td className="flex-start">
                                                    <p>{convertDate(data?.createdAt)}</p>
                                                </td>

                                                <td className="flex-center">

                                                <div className="action">
                                                {data?.status != 'accepted' &&    <Tippy content="Accept"  animation="fade">
                                                                <a className="see" onClick={() => {
                                                                    setSelectedId(data?._id);
                                                                    toggleAcceptModal();
                                                                }}><AiOutlineCheckSquare size={14}/></a>
                                                                </Tippy>  }
                                                {data?.status != 'rejected' &&     <Tippy content="Reject"  animation="fade">
                                                        <a onClick={() => {
                                                             setSelectedId(data?._id);
                                                             toggleRejectModal();
                                                        }} className="delete"><MdOutlineCancelPresentation /></a>
                                                    </Tippy> }
            
                                                    </div>
                                            </td>

                                    
                                            </tr> )}
                                        </tbody>
                                    </table>
                                </div>


                            </div>
                        </div>
                    </div>

                    {showRejectModal && <DeleteModal color={'#605E5A'} title="Are you sure you  want to reject request ?" onAccept={handleRejected} onCancel={toggleRejectModal} />}

                    {showAcceptModal && <DeleteModal color={'#605E5A'} title="Are you sure you  want to accept request ?" onAccept={handleAccepted} onCancel={toggleAcceptModal} />}
        </SchoolLayout>
    );
}

export default Index;
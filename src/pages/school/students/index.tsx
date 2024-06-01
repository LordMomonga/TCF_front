import React, { useState, useEffect, useContext }  from 'react';
import './students.css';


import { toast } from 'react-toastify';

import { AiOutlineCheckSquare } from 'react-icons/ai';
import { MdOutlineCancelPresentation } from 'react-icons/md';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';

import { DeleteModal } from '../../../components';

import { schoolAcceptStudent, schoolGetStudents, schoolRejectStudent, schoolSuspendStudent } from '../../../services/student';

import BeatLoader from "react-spinners/BeatLoader";


import { getTotalAssessments } from '../../../services/assessment';
import { convertDate } from '../../../utils/date';
import SchoolLayout from '../../../components/SchoolLayout/SchoolLayout';
import AcademicYearContext from '../../../contexts/AcademicYearContext';
import { getSchoolSpecialitis } from '../../../services/specialities';

const rows: any = [
    {
        label: '#',
        name: 'num'
    },
    {
        label: 'Name',
        name: 'name'
    },
    {
        label: 'Speciality',
        name: 'name'
    },
    {
        label: 'Email',
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
        label: 'Applied Date',
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
    const [schoolStudents, setSchoolStudents] = useState([]);
    const [ showAcceptModal, setShowAcceptModal ] = useState(false);
    const [ showRejectModal, setShowRejectModal ] = useState(false);
    const [ showSuspendedModal, setShowSuspendedModal ] = useState(false);
    const {activeAcademyYear, setActiveAcademyYear} = useContext<any>(AcademicYearContext);
    const [schoolSpecialities, setSchoolSpecialites] = useState([]);

    const [selectedId, setSelectedId] = useState<any>(null);

    const [loading, setLoading] = useState(false);

    const handleGetStudents = ()  => {
        setLoading(true);
        setSchoolStudents([]);

        schoolGetStudents().then((res: any) => {
            if(res.ok) {
                console.log('DATA: ', res.data.data);
                setSchoolStudents(res.data.data);
            }
            setLoading(false)
        }).catch(err => {
            console.log('error: ', err);
            setLoading(false)
        })
    }

    const toggleAcceptModal = () => {
        setShowAcceptModal(!showAcceptModal);
    }

    const toggleRejectModal = () => {
        setShowRejectModal(!showRejectModal);
    }

    const toggleSuspendModal = () => {
        setShowSuspendedModal(!showSuspendedModal);
    }

    const handleSuspend = () => {
        schoolSuspendStudent(selectedId).then((res: any) => {
            if(res.ok) {
                toggleSuspendModal();
                handleGetStudents();
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

    const handleRejected = () => {
        schoolRejectStudent(selectedId).then((res: any) => {
            if(res.ok) {
                toggleRejectModal();
                handleGetStudents();
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

    const handleAccepted = () => {
        schoolAcceptStudent(selectedId).then((res: any) => {
            if(res.ok) {
                toggleAcceptModal();
                handleGetStudents();
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




    useEffect(() => {
        console.log('USER EFFECT RAN')
        handleGetStudents();
        handleGetSpecialities();
    },[activeAcademyYear]);

    return (
        <SchoolLayout title="Students" pageTitle="Students">
      <div className="section">
            <div className="parent-con">
                <div className="data-table">
                    <div className="top">
                        <div className="span">
                            <select name="" id="" onChange={(e: any) => null} className="select-field school-student-select">
                                <option value="all">Fillter Status</option>
                                <option value='active'>Active</option>
                                <option value='pending'>Pending</option>
                                <option value='suspended'>Suspended</option>
                            </select>
                            <select name="" id="" onChange={(e: any) => null} className="select-field school-student-select">
                                <option value="all">Fillter By Speciality</option>
                               {schoolSpecialities?.map((sp: any) => <option value={sp._id}>{sp?.name}</option>)}
                            </select>
                        </div>
                
                        {/* <button onClick={toggleAddModal} className="btn btn-primary btn-add student-button"> Upload Solution <i className="fas fa-plus"></i></button> */}
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
                                {schoolStudents?.map((data: any, index: any) => <tr>
                                    <td className="flex-center">{index + 1}</td>
                                    <td className="flex-start">
                                        <p>{data?.student_id?.username}</p>
                                    </td>
                                    <td className="flex-start">
                                      {data?.speciality_id?.name}
                                    </td>
                                    <td className="flex-start">
                                      {data?.student_id?.email}
                                    </td>

                                    <td className="flex-start">
                                      {data?.fees_paid}
                                    </td>

                                    <td className="flex-start">
                                      {data?.total_fees}
                                    </td>

                                    <td className="flex-start">
                                      {data?.status ? data?.status : 'Pending'}
                                    </td>

                                    <td className="flex-start">
                                        <p>{convertDate(data?.createdAt)}</p>
                                    </td>

                                    

                                    <td className="flex-center">
                                        <div className="action">
                                        
                                       {data.status != 'accepted' &&    <Tippy content="Activate"  animation="fade">
                                                    <a className="see" onClick={() => {
                                                        setSelectedId(data?._id);
                                                        toggleAcceptModal();
                                                    }}><AiOutlineCheckSquare size={14}/></a>
                                                    </Tippy>}

                                          {data.status == 'pending' &&   <Tippy content="Reject"  animation="fade">
                                            <a onClick={() => {
                                                    setSelectedId(data?._id);
                                                    toggleRejectModal();
                                            }} className="delete"><MdOutlineCancelPresentation /></a>
                                        </Tippy>}

                                       {data.status == 'accepted' &&  <Tippy content="Suspend"  animation="fade">
                                            <a onClick={() => {
                                                    setSelectedId(data?._id);
                                                    toggleSuspendModal();
                                            }} className="delete"><MdOutlineCancelPresentation /></a>
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

        {showRejectModal && <DeleteModal color={'#605E5A'} title="Are you sure you  want to reject request ?" onAccept={handleRejected} onCancel={toggleRejectModal} />}
        
        {showSuspendedModal && <DeleteModal color={'#605E5A'} title="Are you sure you  want to suspend student ?" onAccept={handleSuspend} onCancel={toggleSuspendModal} />}

        {showAcceptModal && <DeleteModal color={'#605E5A'} title="Are you sure you  want to activate student ?" onAccept={handleAccepted} onCancel={toggleAcceptModal} />}
        </SchoolLayout>
    );
}

export default Index;
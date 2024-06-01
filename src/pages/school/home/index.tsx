import React,{ useContext, useEffect, useState } from 'react';
import SchoolLayout from '../../../components/SchoolLayout/SchoolLayout';
import './home.css';

import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';

import { RxCross2 } from 'react-icons/rx';
import { BsCheck2Square } from 'react-icons/bs';

import BeatLoader from "react-spinners/BeatLoader";

import moment from 'moment';
import { CreateAcademicYearModal, DeleteModal } from '../../../components';
import { toast } from 'react-toastify';
import { schoolGetAcademicYears, schoolGetAcceptedStudents, schoolGetAcceptedTeachers, schoolGetAllAnnouncement, schoolStopAcademicYear } from '../../../services/school';
import { getSchoolSpecialitis } from '../../../services/specialities';
import AcademicYearContext from '../../../contexts/AcademicYearContext';
import { getTeachersClassReq } from '../../../services/classroom';

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
        label: 'Start',
        name: 'name'
    },
    {
        label: 'End',
        name: 'name'
    },
    {
        label: 'Status',
        name: 'name'
    },
    {
        label: 'Created At',
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
    const [teachers, setTeachers] = useState([]);
    const [students, setStudents] = useState([]);
    const [specialities, setSpecialities] = useState([]);
    const [anouncements, setAnouncements] = useState([]);
    const [loading, setLoading] = useState(false);
    const {activeAcademyYear, setActiveAcademyYear} = useContext<any>(AcademicYearContext);

    const [showCreateModal, setShowCreateModal] = useState(false);
    const [academicYears, setAcademicYears] = useState([]);

    const [selectedId, setSelectedId] = useState<any>(null);
    const [showConfirmAcceptModal, setShowConfirmAcceptModal] = useState(false);
    const [showRejectModal, setShowRejectModal] = useState(false);


    const handleGetData = ()  => {
        schoolGetAcceptedStudents().then((res: any) => {
         
            if(res.ok) {
                setStudents(res?.data?.data)
            }
        })

        schoolGetAllAnnouncement().then((res: any) => {
            if(res.ok) {
                setAnouncements(res?.data?.data)
            }
        })

        getTeachersClassReq().then((res: any) => {
            if(res.ok) {
                setTeachers(res?.data?.data)
            }
        })

        getSchoolSpecialitis().then((res: any) => {
            if(res.ok) {
                setSpecialities(res?.data?.data)
            }
        })

    }

    const handleGetAcademicYears = () => {
        try {
            schoolGetAcademicYears().then((res: any) => {
                if(res.ok) {
                    setAcademicYears(res?.data?.data)
                }
            })
        } catch (error) {
            console.log(error);
        }
    }




    const toggleCreateModal = ()  => {
        setShowCreateModal(!showCreateModal);
    }

    const handleContentAdded = () => {
        // CALL METHOD TO GET ALL ACADEMIC YEARS
        toggleCreateModal();
        handleGetAcademicYears();
      
    }   
    
    // Accept
    const handleSetSelectedId = (id: any) => {
        setSelectedId(id);
        toggleStopAcademicYearModal();
       
    }


    const toggleStopAcademicYearModal = () => {
        setShowRejectModal(!showRejectModal);
    }

    const handleStopAcademicYear = async () => {
        try {
            toggleStopAcademicYearModal();
            schoolStopAcademicYear(selectedId).then((res: any) => {
                if(res.ok) {
                    handleGetAcademicYears();
                    toast.success(res.data.message, {
                        pauseOnHover: false,
                        closeOnClick: true,
                    })
                }
            })

            
        } catch (error) {
            toast.error("ERROR", {
                pauseOnHover: false,
                closeOnClick: true,
            })
        }
    }


    useEffect(() => {
        handleGetData();
    },[activeAcademyYear]);

    useEffect(() => {
        handleGetAcademicYears();
    }, [])

    return (
        <SchoolLayout title="Dashboard" pageTitle="Home">
            <div>
            <div className="flex-4">
                    
                    <a className="stat-card">
                        <div className="stat-name">Total Utilisateurs</div>
                        <div className="stat-value">{students.length}</div>
                    </a>
                    <a className="stat-card">
                        <div className="stat-name">Total spécialité</div>
                        <div className="stat-value">{specialities?.length}</div>
                    </a>
                    <a className="stat-card">
                        <div className="stat-name">Total Anouncements</div>
                        <div className="stat-value">{ anouncements?.length }</div>
                    </a>
                </div>
                <br />
                <br />
                <div className="section">
                        <div className="parent-con">
                            <div className="data-table">
                                <div className="top">
                                    <div className="span">
                                        <h1>Academic Years</h1>
                                    </div>

                                    <button onClick={toggleCreateModal} className="btn btn-primary btn-add school-create-button">Create Academic Year <i className="fas fa-plus"></i></button>
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
                                          {academicYears.map((data: any, index: any) => <tr>
                                                <td className="flex-center">{index + 1}</td>
                                                <td className="flex-start">
                                                    <p>{data?.title}</p>
                                                </td>
                                       
                                
                                                <td className="flex-start">{data?.start}</td>

                                                <td className="flex-start">{data?.end}</td>

                                                <td className="flex-start">{data?.status}</td>
                                                
                                                <td className="flex-start">
                                                    <p>{moment(new Date(data?.createdAt)).format('MMMM d, YYYY')}</p>
                                                </td>

                                                <td className="flex-center">
                                                    <div className="action">
                                                        <Tippy content="End Academic Year"  animation="fade">
                                                            <a onClick={() => handleSetSelectedId(data._id)} className="delete"><RxCross2 size={14} /></a>
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
                        
            </div>
            {showCreateModal &&  <CreateAcademicYearModal onContentAdded={handleContentAdded} onClose={toggleCreateModal} />}
            {showRejectModal && <DeleteModal  color={'#605E5A'}  title={'Are you sure you want to end academic year ?'} onAccept={handleStopAcademicYear} onCancel={toggleStopAcademicYearModal} />}
        </SchoolLayout>
    );
}

export default Index;

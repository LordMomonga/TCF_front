import React,{ useContext, useEffect, useState } from 'react';
import Layout from '../../../components/Layout/Layout';

import { getClasses, getTeachersSchools } from '../../../services/classroom';
import { getCourseContents } from '../../../services/courseContent';
import { getAllApplications, acceptApplication, rejectApplication } from '../../../services/applications';

import { useTranslation } from 'react-i18next';

import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';

import { RxCross2 } from 'react-icons/rx';
import { BsCheck2Square } from 'react-icons/bs';

import BeatLoader from "react-spinners/BeatLoader";

import moment from 'moment';
import { DeleteModal } from '../../../components';
import { toast } from 'react-toastify';
import AcademicYearContext from '../../../contexts/AcademicYearContext';


const override = {
    marginTop: '20px'
};


function Index() {
    const [classes, setClasses] = useState([]);
    const [schools, setSchools] = useState([]);
    const [courseContents, setCourseContents] = useState([]);
    const [studentsApplicatins, setStudentsApplications] = useState([]);
    const [loading, setLoading] = useState(false);

    const { t, i18n } = useTranslation();

    const {activeAcademyYear, setActiveAcademyYear} = useContext<any>(AcademicYearContext);

    const [selectedId, setSelectedId] = useState<any>(null);
    const [showConfirmAcceptModal, setShowConfirmAcceptModal] = useState(false);
    const [showRejectModal, setShowRejectModal] = useState(false);
    const rows: any = [
        {
            label: '#',
            name: 'num'
        },
        {
            label: "Admin name",
            name: 'name'
        },
        {
            label: "Admin Email",
            name: 'name'
        },
        {
            label: "Role",
            name: 'name'
        },
    ]


    const handleGetClasses = ()  => {
        getClasses().then((res: any) => {
            if(res.ok) {
                setClasses(res?.data?.data)
            }
        })
    }

    const handleGetTeacherSchools = () => {
        getTeachersSchools().then((res: any) => {
            if(res.ok) {
                console.log('RESPONSE: ', res);
                setSchools(res?.data?.data);
            }
        })
    }

    const handleGetCourseContents = () => {
        getCourseContents().then((res: any) => {
            if(res.ok) {
                setCourseContents(res?.data?.data);
            }
        })
    }

    const handleGetStudentsApplications = () => {
        getAllApplications().then((res: any) => {
            if(res.ok) {
                console.log('RESPONSE: ', res);
                setStudentsApplications(res.data.data);
            }
        })
    }


    // Accept
    const handleSetSelectedId = (id: any, type: any) => {
        setSelectedId(id);
        if(type == 'accepted') {
            toggleAcceptModal();
        }else {
            toggleRejectModal();
        }
       
    }

    const toggleAcceptModal = () => {
        setShowConfirmAcceptModal(!showConfirmAcceptModal);
    }

    const toggleRejectModal = () => {
        setShowRejectModal(!showRejectModal);
    }

    const handleAcceptApplications = async () => {
        try {
            toggleAcceptModal();
            await acceptApplication(selectedId);

            handleGetStudentsApplications();

            toast.success("Application Accepted", {
                pauseOnHover: false,
                closeOnClick: true,
            })
        } catch (error) {
            toast.error("ERROR", {
                pauseOnHover: false,
                closeOnClick: true,
            })
        }
    }

    const handleRejectApplications = async () => {
        try {
            toggleRejectModal();
            await rejectApplication(selectedId);

            handleGetStudentsApplications();

            toast.success("Application Rejected", {
                pauseOnHover: false,
                closeOnClick: true,
            })
        } catch (error) {
            toast.error("ERROR", {
                pauseOnHover: false,
                closeOnClick: true,
            })
        }
    }


    useEffect(() => {
        handleGetClasses();
        handleGetCourseContents();
        handleGetStudentsApplications();
        handleGetTeacherSchools();
    }, [activeAcademyYear])

    return (
        <Layout title={t('landing.data_table.layout_title')}>
            <div>
            <div className="flex-4">
                    <a className="stat-card">
                        <div className="stat-name">{t('landing.cards.stat_card_classroom')}</div>
                        <div className="stat-value">{classes.length}</div>
                    </a>
                    <a className="stat-card">
                        <div className="stat-name">{t('landing.cards.stat_card_course_content')}</div>
                        <div className="stat-value">{courseContents.length}</div>
                    </a>
                    <a className="stat-card">
                        <div className="stat-name">Total School</div>
                        <div className="stat-value">{schools?.length}</div>
                    </a>
                    <a className="stat-card">
                        <div className="stat-name">{t('landing.cards.stat_card_assessments')}</div>
                        <div className="stat-value">0</div>
                    </a>
                </div>
                <br />
                <br />
                <div className="section">
                        <div className="parent-con">
                            <div className="data-table">
                                <div className="top">
                                    <div className="span">
                                        <h1>Schools</h1>
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
                                          {schools.map((data: any, index: any) => <tr>
                                                <td className="flex-center">{index + 1}</td>
                                                <td className="flex-start">
                                                    <p>{data?.username}</p>
                                                </td>
                                      
                                                <td className="flex-start">
                                                    <p>{data?.email}</p>
                                                </td>

                                                <td className="flex-start">
                                                    <p>Teacher</p>
                                                </td>
                                            </tr> )}
                                        </tbody>
                                    </table>
                                </div>


                            </div>
                        </div>
                    </div>
                        
            </div>
            {showConfirmAcceptModal && <DeleteModal title={'Are you sure you want to accept application ?'} onAccept={handleAcceptApplications} onCancel={toggleAcceptModal} />}
            {showRejectModal && <DeleteModal title={'Are you sure you want to reject application ?'} onAccept={handleRejectApplications} onCancel={toggleRejectModal} />}
        </Layout>
    );
}

export default Index;
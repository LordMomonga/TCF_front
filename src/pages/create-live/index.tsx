import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout/Layout';

import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';

import { RxCross2 } from 'react-icons/rx';
import { BsCheck2Square } from 'react-icons/bs';
import { GoDeviceCameraVideo } from  'react-icons/go';
import { AiFillEye } from 'react-icons/ai';
import { BsFillCameraVideoOffFill } from 'react-icons/bs';

import moment from 'moment';

import { CreateSessionModal, DeleteModal } from '../../components';
import { BsCameraVideoFill } from 'react-icons/bs';

import { toast } from 'react-toastify';
import BeatLoader from "react-spinners/BeatLoader";

import { getAllSessions, endSession } from '../../services/liveSession';
import {useTranslation} from "react-i18next";
import AcademicYearContext from '../../contexts/AcademicYearContext';
import { SITE_URL } from '../../utils/constants';


const override = {
    marginTop: '20px'
};


function Index() {
    const [showCreateSessionModal, setShowCreateSessionModal] = useState(false);
    const [showEndSessionModal, setShowEndSessionModal] = useState(false);

    const [roomCode, setRoomCode] = useState('');
    const navigate = useNavigate();
    const [meetings, setMeetings] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedSessionId, setSelectedSessionid] = useState<any>(null);

    const { t, i18n } = useTranslation();

    const {activeAcademyYear, setActiveAcademyYear} = useContext<any>(AcademicYearContext);

    const rows: any = [
        {
            label: '#',
            name: 'num'
        },
        {
            label: (`${t('create_live.data_table.meeting_code')}`),
            name: 'name'
        },
        {
            label: (`${t('create_live.data_table.class')}`),
            name: 'name'
        },
        {
            label: (`${t('create_live.data_table.participants')}`),
            name: 'name'
        },
        {
            label: (`${t('create_live.data_table.status')}`),
            name: 'name'
        },
        {
            label: (`${t('create_live.data_table.session_date')}`),
            name: 'name'
        },
        {
            label: 'Action',
            name: 'name'
        },
    ]

    const handleFetchAllSessions = () => {
        // GET ALL TEACHER SESSIONS
        getAllSessions().then((res: any) => {
            if(res.ok) {
                console.log('SESSIONS: ', res)
                setMeetings(res.data.data);
            }else {
                // SET ERROR
                console.log(res.data.message);
            }
        }).catch(err => {
            console.log('ERROR GETTING SESSIONS');
            toast.error("Error", {
                pauseOnHover: false,
                closeOnClick: true,
            })
        })
    }

    const toggleCreateSessionModal = () => {
        setShowCreateSessionModal(!showCreateSessionModal);
    }

    const handleSessionCreated = () => {
        toggleCreateSessionModal();
        handleFetchAllSessions();
    }

    const handleJoinMeeting = (meetingCode: any) => {
        window.open(`${SITE_URL}/live-session/${meetingCode}`, '_blank');
    }

    const endLiveSession = () => {
  
        let data = {
            id: selectedSessionId
        }

        endSession(data).then((res: any) => {
            if(res.ok) {
                setShowEndSessionModal(false);
                toast.success(res.data.message, {
                    pauseOnHover: false,
                    closeOnClick: true,
                })
                handleFetchAllSessions();
            }else {
                toast.error(res.data.message, {
                    pauseOnHover: false,
                    closeOnClick: true,
                })
            }
        }).catch(err => {
            console.log('ERROR: ', err)
        })
    }

    const toggleEndSessionModal = () => {
        setShowEndSessionModal(!showEndSessionModal);
    }

    const handleEndSession = (id: any) => {
        toggleEndSessionModal();
        setSelectedSessionid(id);
    }

    useEffect(() => {
        handleFetchAllSessions();
    }, [activeAcademyYear])

    return (
        <Layout title={t('create_live.data_table.layout_title')}
>
            <div className="section">
                        <div className="parent-con">
                            <div className="data-table">
                                <div className="top">
                                    <div className="span">
                                        <h1>{t('create_live.data_table.heading')}</h1>
                                    </div>
                                    <button onClick={() => toggleCreateSessionModal()} className="btn btn-primary btn-add">{t('create_live.data_table.button')} <i className="fas"><GoDeviceCameraVideo size={16}/></i></button>
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
                                          {meetings.map((data: any, index: any) => <tr key={index}>
                                                <td className="flex-center">{index + 1}</td>
                                                <td className="flex-start">
                                                    <p>{data?.meeting_code}</p>
                                                </td>
                                       
                                
                                                <td className="flex-start">{data?.classroom_id?.name}</td>

                                                <td className="flex-start">{data?.participants?.length}</td>
                                                
                                                <td className="flex-start">{data?.status}</td>
                                                
                                                <td className="flex-start">
                                                    <p>{moment(new Date(data?.createdAt)).format('MMMM d, YYYY')}</p>
                                                </td>

                                                <td className="flex-center">
                                                    <div className="action">
                                                        {data?.status == 'Active' && <Tippy content="Enter Meeting"  animation="fade">
                                                            <a onClick={() => handleJoinMeeting(data?.meeting_code)} className="see"><BsCameraVideoFill size={16} /></a>
                                                        </Tippy>}
                                                        <Tippy content="View Participants"  animation="fade">
                                                        <a className="see"><AiFillEye onClick={() => null} size={16}/></a>
                                                        </Tippy>
                                                       {data?.status == 'Active' && <Tippy content="End Session"  animation="fade">
                                                            <a onClick={() => handleEndSession(data._id)} className="delete"><BsFillCameraVideoOffFill size={16} /></a>
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
                {showCreateSessionModal && <CreateSessionModal onSessionCreated={handleSessionCreated} onClose={toggleCreateSessionModal}/>}
                {showEndSessionModal && <DeleteModal title="Are you sure you want to end session ?" onAccept={endLiveSession} onCancel={toggleEndSessionModal} />}
        </Layout>
    );
}


export default Index; 
import React, { useState, useEffect, useContext }  from 'react';
import './joinllive.css';

import StudentLayout from '../../../components/StudentLayout/StudentLayout';

import { toast } from 'react-toastify';
import { GoDeviceCameraVideo } from 'react-icons/go';

import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';

import BeatLoader from "react-spinners/BeatLoader";
import Button from '../../../components/ButtonHome/Button';

import { joinSession, studentsGetAllSessions } from '../../../services/liveSession';
import ErrorMessage from '../../../components/form/components/ErrorMessage/ErrorMessage';
import {useTranslation} from "react-i18next";

import moment from 'moment';
import AcademicYearContext from '../../../contexts/AcademicYearContext';
import { BsCameraVideoFill } from 'react-icons/bs';
import { SITE_URL } from '../../../utils/constants';

const override = {
    marginTop: '20px'
  };



function Index() {
    // const [meetingCode, setMeetingCode] = useState(''); 
    const [error, setError] = useState<any>(null);
    const [meetings, setMeetings] = useState([]);
    const [loading, setLoading] = useState(false);

    const { t, i18n } = useTranslation();

    const {activeAcademyYear, setActiveAcademyYear} = useContext<any>(AcademicYearContext);

    const handleJoinMeeting = (meetingCode: any) => {
        setError(null);

        let data = {
            meeting_code: meetingCode
        }

        if(meetingCode.length < 8 || meetingCode.length > 8) {
            setError('Enter a valid meeting code');
            return;
        }

        joinSession(data).then((res: any) => {
            if(res.ok) {
                // REDIRECT TO JOIN MEETING
                // https://237-virtual-academy.vercel.app/
                console.log('GOOD TO JOIN')
                window.open(`${SITE_URL}/live-session/${meetingCode}`, '_blank');

            }else {
                setError(res.data.message)
            }
        }).catch(err => {
            console.log('ERROR: ', err);
        })
        console.log(meetingCode);
    }

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
        studentsGetAllSessions().then((res: any) => {
            if(res.ok) {
                console.log('SESSIONS: ', res)
                setMeetings(res.data.data);
            }else {
                // SET ERROR
                console.log(res.data.message);
            }
        }).catch((err: any) => {
            console.log('ERROR GETTING SESSIONS');
            toast.error("Error", {
                pauseOnHover: false,
                closeOnClick: true,
            })
        })
    }

    useEffect(() => {
        handleFetchAllSessions();
    }, [])

    return (
        <StudentLayout title="Join Live Session" pageTitle="Live">
      <div className="section">
            <div className="parent-con">
            <div className="data-table">
                                <div className="top">
                                    <div className="span">
                                        <h1>{t('create_live.data_table.heading')}</h1>
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
                                          {meetings.map((data: any, index: any) => <tr key={index}>
                                                <td className="flex-center">{index + 1}</td>
                                                <td className="flex-start">
                                                    <p>{data?.meeting_code}</p>
                                                </td>
                                       
                                
                                                <td className="flex-start">{data?.classroom_id?.name}</td>

                                  
                                                <td className="flex-start">{data?.status}</td>
                                                
                                                <td className="flex-start">
                                                    <p>{moment(new Date(data?.createdAt)).format('MMMM d, YYYY')}</p>
                                                </td>

                                                <td className="flex-center">
                                                    <div className="action">
                                                       {data?.status == 'Active' && <Tippy content="Join Meeting"  animation="fade">
                                                            <a onClick={() => handleJoinMeeting(data?.meeting_code)} className="see"><BsCameraVideoFill size={16} /></a>
                                                        </Tippy>}
                                                    </div>
                                                </td>
                                            </tr> )}
                                        </tbody>
                                    </table>
                                </div>

                            </div>
                        
                {/* <div className="session-form student-session-form">
                    <h1 className="live-form-title student-live-title">ENTER MEETING ID</h1>
                    <br />
                    {error && <ErrorMessage error={error} visible={true} />}
                    <div className="input-with-icon-form-group live-form-input">
                        <i className="text-primary student-live-title"><GoDeviceCameraVideo size={20}/> </i>
                        <input value={meetingCode} onChange={(e: any) => setMeetingCode(e.target.value)} type='text' placeholder="Enter meeting id" />
                    </div>
                    <Button text="Join Meeting" onClicked={() => handleJoinMeeting()}/>
                </div> */}
            </div>
        </div>

       
        </StudentLayout>
    );
}

export default Index;
import React, { useState, useEffect, useContext }  from 'react';
import './school-results.css';

import StudentLayout from '../../../components/StudentLayout/StudentLayout';

import { IoMdCloudDownload } from 'react-icons/io';
import { AiFillEye } from 'react-icons/ai';

import { toast } from 'react-toastify';

import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';

import { deletePassExamContent } from '../../../services/passExams';
import { getStudentSolutions, getStudentsClasses, getAcceptedClasses, getStudentTimetables, getStudentAnnouncements } from '../../../services/student';

import BeatLoader from "react-spinners/BeatLoader";

import moment from 'moment';
import { getTotalAssessments } from '../../../services/assessment';
import { VideoPlayerModal } from '../../../components';
import { convertDate } from '../../../utils/date';
import AcademicYearContext from '../../../contexts/AcademicYearContext';
import { getStudentResults } from '../../../services/results';

const rows: any = [
    {
        label: '#',
        name: 'num'
    },
    {
        label: 'Result Type',
        name: 'name'
    },
    {
        label: 'Average',
        name: 'name'
    },
    {
        label: 'Total Average',
        name: 'name'
    },
    {
        label: 'Remark',
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
    const {activeAcademyYear, setActiveAcademyYear} = useContext<any>(AcademicYearContext);


    const [announcements, setAnnouncements] = useState([]);
    const [loading, setLoading] = useState(false);


    const handleGetAnnouncement = ()  => {
        setLoading(true);

        setAnnouncements([]);

        getStudentResults().then((res: any) => {
            if(res.ok) {
                // console.log('RESULTS:', res)
                setAnnouncements(res.data.data);
            }
            setLoading(false);
        }).catch(err => {
            setLoading(false);
            console.log('error: ', err);
        })
    }


    useEffect(() => {
        handleGetAnnouncement();
    },[activeAcademyYear]);

    return (
        <StudentLayout title="Result Slips" pageTitle="Results">
      <div className="section">
            <div className="parent-con">
                <div className="data-table">
                    <div className="top">
                        <div className="span">

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
                                {announcements?.map((data: any, index: any) => <tr>
                                    <td className="flex-center">{index + 1}</td>
                                    <td className="flex-start">
                                        <p>{data?.result_type?.name}</p>
                                    </td>
                                    <td>
                                        <p>{data?.average}</p>
                                    </td>
                                    <td>
                                        <p>{data?.total_average}</p>
                                    </td>
                                    <td>
                                        <p>{data?.remark}</p>
                                    </td>
                                    {/* <td className="flex-start">{data?.active_to}</td> */}
                                
                                    <td className="flex-start">
                                        <p>{convertDate(data?.createdAt)}</p>
                                    </td>
                                     
            
                                    <td className="flex-center">
                                        <div className="action">
                                        <Tippy  content="Download Result Slip"  animation="fade">
                                        <a target="_blank" href={data?.result_file} onClick={() => {
                                               
                                            }} className="see"> 
                                            <IoMdCloudDownload onClick={() => null} size={14}/>
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

       
        </StudentLayout>
    );
}

export default Index;
import React, { useState, useEffect, useContext }  from 'react';
import './time-table.css';

import StudentLayout from '../../../components/StudentLayout/StudentLayout';

import { UploadTimeTableModal  } from '../../../components';


import { IoMdCloudDownload } from 'react-icons/io';
import { AiFillEye } from 'react-icons/ai';

import { toast } from 'react-toastify';

import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';

import BeatLoader from "react-spinners/BeatLoader";

import { convertDate } from '../../../utils/date';
import SchoolLayout from '../../../components/SchoolLayout/SchoolLayout';
import { schoolGetAllTimetables } from '../../../services/school';
import AcademicYearContext from '../../../contexts/AcademicYearContext';

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
        label: 'Specialities',
        name: 'name'
    },
    {
        label: 'Active From',
        name: 'name'
    },
    {
        label: 'Active To',
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
    const [deleteModal, setShowDeleteModal] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const [timetables, setTimetables] = useState([]);
    const {activeAcademyYear, setActiveAcademyYear} = useContext<any>(AcademicYearContext);
    const [showVideoModal, setShowVideoModal] = useState(false);

    const [loading, setLoading] = useState(false);

    const toggleAddModal = () => {
        setShoowAddModal(!showAddModal);
    }

    const handleGetTimetables = ()  => {
        setTimetables([]);
        setLoading(true);
        schoolGetAllTimetables().then((res: any) => {
            if(res.ok) {
                console.log('timetables: ', res.data)
                setTimetables(res.data.data);
            }
            console.log(res)
            setLoading(false)
        }).catch(err => {
            console.log('error: ', err);
            setLoading(false);
        })
    }




    const handleContentAdded = ()  => {
        handleGetTimetables();
        toggleAddModal();
    }




    useEffect(() => {
        console.log('USER EFFECT RAN')
        handleGetTimetables();
    },[activeAcademyYear]);

    return (
        <SchoolLayout title="Time Table" pageTitle="Time Table">
      <div className="section">
            <div className="parent-con">
                <div className="data-table">
                    <div className="top">
                        <div className="span">
                            <select name="" id="" onChange={(e: any) => null} className="select-field school-student-select">
                                <option value="all">Filter by Speciality</option>
                                 <option value=''>Testing</option>
                            </select>
                        </div>
                
                        <button onClick={toggleAddModal} className="btn btn-primary btn-add school-button"> Upload Time Table <i className="fas fa-plus"></i></button>
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
                                {timetables?.map((data: any, index: any) => <tr>
                                    <td className="flex-center">{index + 1}</td>
                                    <td className="flex-start">
                                        <p>{data?.name}</p>
                                    </td>
                                    <td className="flex-start specialities-table-data">
                                        <p>{data?.specialities?.map((sp: any) => `${sp.name}, `)}</p>
                                    </td>
                                    <td className="flex-start">
                                        <p>{data?.active_from}</p>
                                    </td>

                                    <td className="flex-start">
                                        <p>{data?.active_to}</p>
                                    </td>


                                    <td className="flex-start">
                                        <p>{convertDate(data?.createdAt)}</p>
                                    </td>

                                    
                                    <td className="flex-center">
                                        <div className="action">
                                        <Tippy content="Download Timetable File"  animation="fade">
                                            <a target="_blank" href={data?.file_url} download className="see"><IoMdCloudDownload onClick={() => null} size={14}/></a>
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

        {showAddModal &&  <UploadTimeTableModal onContentAdded={handleContentAdded} onClose={toggleAddModal} />}
        </SchoolLayout>
    );
}

export default Index;
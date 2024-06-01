import React, { useState, useEffect, useContext }  from 'react';
import './coursecontent.css';

import StudentLayout from '../../../components/StudentLayout/StudentLayout';

import { AssessmentModal, EditCourseContentModal, DeleteModal, PassExammodal, VideoPlayerModal, PreviewPdfModal  } from '../../../components';
import UploadFollowupSolutionModal from '../../../components/students/UploadFollowupSolutionModal/UploadFollowupSolutionModal';
import { AiFillEye } from 'react-icons/ai';
import {  BsPencilSquare } from 'react-icons/bs';
import { IoMdCloudDownload } from 'react-icons/io';

import { toast } from 'react-toastify';

import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';

import { getClasses, deleteClass } from '../../../services/classroom';
import { getPassExamContents, deletePassExamContent } from '../../../services/passExams';
import { getCourseContent, getAcceptedClasses } from '../../../services/student';

import BeatLoader from "react-spinners/BeatLoader";
import { convertDate } from '../../../utils/date';

import moment from 'moment';
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
        label: 'Pdf Content',
        name: 'name'
    },
    {
        label: 'Video Content',
        name: 'name'
    },
    {
        label: 'Follow-up File',
        name: 'name'
    },
    {
        label: 'Follow-up Solution',
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
    // NEW
    const [selectedClass, setSelectedClass] = useState("all");

    // END
    const {activeAcademyYear, setActiveAcademyYear} = useContext<any>(AcademicYearContext);
    const [ showAddModal, setShoowAddModal ] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false); 
    const [deleteModal, setShowDeleteModal] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const [contents, setContents] = useState([]);

    const [editData, setEditData] = useState(null);

    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(false);

    const [showVideoModal, setShowVideoModal] = useState(false);
    const [videoUrl, setVideoUrl] = useState('');


    const toggleVideoModal = () => {
        setShowVideoModal(!showVideoModal);
    }

    const handleSetVideoUrl = (url: any) =>  {
        setVideoUrl(url);
        toggleVideoModal();
    }  
    
    const toggleAddModal = () => {
        setShoowAddModal(!showAddModal);
    }

    const toggleEditModal = () => {
        setShowEditModal(!showEditModal);
    }

    const toggleDeleteModal = () => {
        setShowDeleteModal(!deleteModal);
    }

    const handleGetValidClasses = ()  => {
        setContents([]);
        setClasses([]);
        setSelectedClass('all');

        getAcceptedClasses().then((res: any) => {
            console.log('RES ACCEPTED: ', res);

            if(res.ok) {
                setClasses(res.data.data);
            }
        }).catch(err => {
            console.log('error: ', err);
        })
    }

    const handleDeleteCourseExamContent = () => {
        console.log('DELETE COURSE CONTENT');
        console.log(deleteId)
        deletePassExamContent(deleteId).then((res: any) => {
            if(res.ok) {
                toggleDeleteModal();
                handleGetValidClasses();
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

    const handleContentAdded = ()  => {
        handleGetContent(selectedClass);
        toggleAddModal();
    }


    const handleGetContent = (classId: any) => {
        setLoading(true);
        if(classId == 'all') {
            // Don't make request
            setLoading(false);
            setContents([]);
            return;
        }

        getCourseContent(classId).then((res: any) => {
            console.log("COURSE CONTENT: ",res);
            setLoading(false);
            setContents(res.data.data);
        }).catch((err: any) => {
            console.log('Error: ', err);
            setLoading(false);
        })
    }

    useEffect(() => {
        console.log('USER EFFECT RAN')
        handleGetValidClasses();
    },[activeAcademyYear]);

    return (
        <StudentLayout title="Course Content" pageTitle="Course Content">
      <div className="section">
            <div className="parent-con">
                <div className="data-table">
                    <div className="top">
                        <div className="span">
                            <select value={selectedClass} onChange={(e) => {
                                setSelectedClass(e.target.value);
                                handleGetContent(e.target.value);
                            }} className="select-field" id="student-select-new">
                                <option value="all">Select Classroom</option>
                                {classes.map((classData: any, index: any) => <option key={index} value={classData?._id}>{classData?.name}</option>)}
                            </select>
                        </div>
                        {/* <form className="search">
                            <input type="search" name="" id="" placeholder="Find ..." />
                            <button type="submit"><i className="fa fa-search" aria-hidden="true"></i></button>
                        </form> */}
                        {/* <button onClick={toggleAddModal} className="btn btn-primary btn-add"> Upload Solution <i className="fas fa-plus"></i></button> */}
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
                                {contents?.map((data: any, index: any) => <tr>
                                    <td className="flex-center">{index + 1}</td>
                                    <td className="flex-start">
                                        <p>{data.title}</p>
                                    </td>
                            
                                    <td className="flex-start">{data?.pdf_file_url ? <a href={data?.pdf_file_url} target="_blank" download>Pdf Content</a> : "None"}</td>
                                    <td className="flex-start">{data?.video_url ? <a href={data?.video_url} target="_blank" download>Video Content</a> : "None"}</td>
                                    <td className="flex-start">{data?.followup_file_url ? <a href={data?.followup_file_url} target="_blank" download>Foolow-up File</a> : "None"}</td>
                                    <td className="flex-start">{data?.followup_solution_url ? <a href={data?.followup_solution_url} target="_blank" download>Solution File</a> : "Not yet available"}</td>                           
                                    <td className="flex-start">
                                        <p>{convertDate(data?.createdAt)}</p>
                                    </td>
                                    <td className="flex-center">
                                        <div className="action">
                                          {data?.video_url.length > 2 &&  <Tippy content="View Video Content"  animation="fade">
                                            <a onClick={() => handleSetVideoUrl(data?.video_url)} className="see"><AiFillEye onClick={() => null} size={14}/></a>
                                            </Tippy>}
                                        {
                                            data?.pdf_file_url.length > 2 && <Tippy content="Pdf Content"  animation="fade">
                                            <a href={data?.pdf_file_url}  download target="_blank" className="see"><IoMdCloudDownload onClick={() => null} size={14}/></a>
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

       
        {showAddModal &&  <UploadFollowupSolutionModal onContentAdded={handleContentAdded} onClose={toggleAddModal} />}
        {showEditModal &&  <EditCourseContentModal data={editData} onContentAdded={handleContentAdded} onClose={toggleEditModal} />}
        {deleteModal && <DeleteModal onAccept={handleDeleteCourseExamContent} onCancel={toggleDeleteModal} />}
        {showVideoModal && <VideoPlayerModal video={videoUrl} onClose={toggleVideoModal}/>}
        </StudentLayout>
    );
}

export default Index;
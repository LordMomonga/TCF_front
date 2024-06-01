import React, { useState, useEffect, useContext }  from 'react';
import './assessment.css';

import Layout from '../../../components/Layout/Layout';

import { AssessmentModal, EditCourseContentModal, DeleteModal, VideoPlayerModal, UpdateAssessmentmodal  } from '../../../components';
import { IoMdCloudDownload } from 'react-icons/io';
import { AiFillEye } from 'react-icons/ai';

import {  BsPencilSquare } from 'react-icons/bs';

import { toast } from 'react-toastify';

import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';

import { getClasses } from '../../../services/classroom';
import { getPassExamContents, deletePassExamContent } from '../../../services/passExams';
import { deleteAssessment, getAssessments } from '../../../services/assessment';

import BeatLoader from "react-spinners/BeatLoader";

import moment from 'moment';
import {useTranslation} from "react-i18next";
import { convertDate } from '../../../utils/date';
import AcademicYearContext from '../../../contexts/AcademicYearContext';



const override = {
    marginTop: '20px'
  };



function Index() {
    const [ showAddModal, setShoowAddModal ] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false); 
    const [showVideoModal, setShowVideoModal] = useState(false);
    const [deleteModal, setShowDeleteModal] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const [contents, setContents] = useState([]);
    const [filteredData, setFilteredData] = useState([]); 
    const [selectedFilter, setSelectedFilter] = useState('all');


    const [videoUrl, setVideoUrl] = useState('');

    const [editData, setEditData] = useState(null);

    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(false);

    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [selectedAssessment, setSelectedAssessment] = useState(null);
    const {activeAcademyYear, setActiveAcademyYear} = useContext<any>(AcademicYearContext);

    const { t, i18n } = useTranslation();
  

    const rows: any = [
        {
            label: '#',
            name: 'num'
        },
        {
            label: (`${t('assessment.data_table.title')}`),
            name: 'name'
        },
        {
            label: (`${t('assessment.data_table.question_file')}`),
            name: 'name'
        },
        {
            label: (`${t('assessment.data_table.answer_pdf')}`),
            name: 'name'
        },
        {
            label: (`${t('assessment.data_table.publish_date')}`),
            name: 'name'
        },
        {
            label: (`${t('assessment.data_table.created_date')}`),
            name: 'name'
        },
        {
            label: 'Action',
            name: 'action'
        }
    ]

    const toggleAddModal = () => {
        setShoowAddModal(!showAddModal);
    }

    const toggleUpdateModal = () => {
        setShowUpdateModal(!showUpdateModal);
    }

    const toggleEditModal = () => {
        setShowEditModal(!showEditModal);
    }

    const toggleVideoModal = () => {
        setShowVideoModal(!showVideoModal);
    }

    const handleSetVideoUrl = (url: any) =>  {
        setVideoUrl(url);
        toggleVideoModal();
    }   

    const toggleDeleteModal = () => {
        setShowDeleteModal(!deleteModal);
    }

    const handleGetClasses = ()  => {

        getClasses().then((res: any) => {
            if(res.ok) {
                setClasses(res.data.data);
            }
        }).catch(err => {
            console.log('error: ', err);
        })
    }

    const handleDeleteAssessment = () => {
        console.log('DELETE ASSESSMENT SOLUTION');
        console.log(deleteId)
        deleteAssessment(deleteId).then((res: any) => {
            if(res.ok) {
                toggleDeleteModal();
                handleGetClasses();
                handleGetAssessments();
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
        handleGetAssessments();
        toggleAddModal();
    }

    const handleContentUpdated = () => {
        handleGetAssessments();
        toggleUpdateModal();
    }

    const handleSetSelectedData = (data: any) => {
        // alert('Hello')
        setSelectedAssessment(data);
        toggleUpdateModal();
    }


    const handleGetAssessments = () => {
        setLoading(true);
        getAssessments().then((res: any) => {
            console.log("ASSESSMENT CONTENT:  ",res);
            setLoading(false);
            setContents(res.data.data.reverse());
            setFilteredData(res.data.data.reverse());
        }).catch((err: any) => {
            console.log('Error: ', err);
            setLoading(false);
        })
    }

    const handleFilterSelected = (val: any) => {
        setSelectedFilter(val);
        let dataToFilter = contents;

        if(val == 'all') {
            setFilteredData(contents);
        }else {
            setFilteredData(contents);
           let updatedData =  dataToFilter.filter((data: any) => data.class_room_id == val);
           setFilteredData(updatedData);
        }
    }

    useEffect(() => {
        console.log('USER EFFECT RAN')
        handleGetAssessments();
        handleGetClasses();
    },[activeAcademyYear]);

    return (
        <Layout title={t('assessment.data_table.layout_title')}>
      <div className="section">
            <div className="parent-con">
                <div className="data-table">
                    <div className="top">
                        <div className="span">
                            <select name="" onChange={(e: any) => handleFilterSelected(e.target.value)} value={selectedFilter} className="select-field">
                                <option value="all">All</option>
                                {classes.map((classData: any, index: any) => <option key={index} value={classData._id}>{classData.name}</option>)}
                            </select>
                        </div>
                        {/* <form className="search">
                            <input type="search" name="" id="" placeholder="Find ..." />
                            <button type="submit"><i className="fa fa-search" aria-hidden="true"></i></button>
                        </form> */}
                        <button onClick={toggleAddModal} className="btn btn-primary btn-add">{t('assessment.data_table.modal_btn')}<i className="fas fa-plus"></i></button>
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
                                {filteredData?.map((data: any, index: any) => <tr>
                                    <td className="flex-center">{index + 1}</td>
                                    <td className="flex-start">
                                        <p>{data.title}</p>
                                    </td>
                            
                    
                                    <td className="flex-start"><a href={data?.assessment_file} target="_blank" download>Assessment File</a></td>
                                    
                                   <td className="flex-start">{data.answers_file.length > 2 ? <a>Available</a> : "Not Available"}</td>
                                  
                                   
                                    <td className="flex-start">{data?.publish_date}</td>
                                    
                                    <td className="flex-start">
                                        <p>{convertDate(data?.createdAt)}</p>
                                    </td>

                                    <td className="flex-center">
                                        <div className="action">
                                           {data?.answers_file_type == 'video' && <Tippy content="View Video Solution"  animation="fade">
                                            <a onClick={() => {
                                                handleSetVideoUrl(data.answers_file)
                                            }} className="see"><AiFillEye onClick={() => null} size={14}/></a>
                                            </Tippy>}
                                          {data?.answers_file_type == 'others' &&  <Tippy content="Download Answer File"  animation="fade">
                                            <a href={data?.answers_file} download target="_blank" onClick={() => {
                                            //    handleSetVideoUrl(data.answers_file)
                                            }} className="see"><IoMdCloudDownload onClick={() => null} size={14}/></a>
                                            </Tippy>}

                                               
                                            <Tippy content="Enter Solution File"  animation="fade">
                                                <a className="see"><BsPencilSquare onClick={() => handleSetSelectedData(data)} size={16}/></a>
                                            </Tippy>

                                            <Tippy content="Delete Assessment"  animation="fade">
                                                <a onClick={() => {
                                                    setDeleteId(data?._id);
                                                    toggleDeleteModal();
                                                }} className="delete"><i className="fa fa-trash" aria-hidden="true"></i></a>
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

        {showAddModal &&  <AssessmentModal onContentAdded={handleContentAdded} onClose={toggleAddModal} />}
        {showUpdateModal &&  <UpdateAssessmentmodal onContentUpdated={handleContentUpdated} assessmentVals={selectedAssessment} onClose={toggleUpdateModal} />}
        {showEditModal &&  <EditCourseContentModal data={editData} onContentAdded={handleContentAdded} onClose={toggleEditModal} />}
        {deleteModal && <DeleteModal onAccept={handleDeleteAssessment} onCancel={toggleDeleteModal} />}
        {showVideoModal && <VideoPlayerModal video={videoUrl} onClose={toggleVideoModal}/>}

        </Layout>
    );
}

export default Index;
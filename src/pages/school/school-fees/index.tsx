import React, { useState, useEffect, useContext }  from 'react';
import './school-fees.css';

import StudentLayout from '../../../components/StudentLayout/StudentLayout';

import {  BsPencilSquare } from 'react-icons/bs';

import { IoMdCloudDownload } from 'react-icons/io';
import { AiFillEye } from 'react-icons/ai';

import { toast } from 'react-toastify';

import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';

import { deletePassExamContent } from '../../../services/passExams';
import { getStudentSolutions, getStudentsClasses } from '../../../services/student';

import BeatLoader from "react-spinners/BeatLoader";

import moment from 'moment';
import { DeleteModal, VideoPlayerModal } from '../../../components';
import { convertDate } from '../../../utils/date';
import SchoolLayout from '../../../components/SchoolLayout/SchoolLayout';
import CreateBankInfoModal from '../../../components/school/CreateBankInfoModal/CreateBankInfoModal';
import { schoolDeleteBankInfo, schoolGetBankInfos } from '../../../services/bankInfo';
import { FaTrash } from 'react-icons/fa';
import AcademicYearContext from '../../../contexts/AcademicYearContext';
import { schoolDeleteDeadline } from '../../../services/instalments';

const rows: any = [
    {
        label: '#',
        name: 'num'
    },
    {
        label: 'Bank Name',
        name: 'name'
    },
    {
        label: 'Account Number',
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
    const [showEditModal, setShowEditModal] = useState(false); 
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const [bankInfos, setBankInfos] = useState([]);
    const [showVideoModal, setShowVideoModal] = useState(false);
    const {activeAcademyYear, setActiveAcademyYear} = useContext<any>(AcademicYearContext);

    const [editData, setEditData] = useState(null);

    const [videoUrl, setVideoUrl] = useState('');

    const [loading, setLoading] = useState(false);

    const toggleAddModal = () => {
        setShoowAddModal(!showAddModal);
    }

    const handleDeleteBankinfo = () => {
        // HANDLE DELETING
        schoolDeleteBankInfo(deleteId).then((res: any) => {
            if(res.ok) {
                toast.success(res.data.message, {
                    pauseOnHover: false,
                    closeOnClick: true,
                })
                handleGetbankinfos();
            }

            toggleDeleteModal();
        }).catch((error: any)=> {
            toggleDeleteModal();
            toast.error("ERROR", {
                pauseOnHover: false,
                closeOnClick: true,
            })
        })
    }

    const toggleDeleteModal = () =>  {
        setShowDeleteModal(!showDeleteModal);
    }  

    const handleContentAdded = ()  => {
        toggleAddModal();
        handleGetbankinfos();
    }




    const handleGetbankinfos = () => {
        setBankInfos([]);
        setLoading(true);
        schoolGetBankInfos().then((res: any) => {
            console.log("STUDENT bankInfos RES: ",res);
            setLoading(false);
            setBankInfos(res.data.data);
        }).catch((err: any) => {
            console.log('Error: ', err);
            setLoading(false);
        })
    }


    useEffect(() => {
        console.log('USER EFFECT RAN')
        handleGetbankinfos();
    },[]);

    return (
        <SchoolLayout title="School Fees" pageTitle="Fees">
      <div className="section">
            <div className="parent-con">
                <div className="data-table">
                    <div className="top">
                        <div className="span">
                       
                        </div>
                
                        <button onClick={toggleAddModal} className="btn btn-primary btn-add school-button"> Add Bank Info <i className="fas fa-plus"></i></button>
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
                                {bankInfos?.map((data: any, index: any) => <tr>
                                    <td className="flex-center">{index + 1}</td>
                                    <td className="flex-start">
                                        <p>{data?.name}</p>
                                    </td>
                                    <td className="flex-start">
                                      {data?.account_number}
                                    </td>
                      
                                    <td className="flex-start">
                                        <p>{convertDate(data?.createdAt)}</p>
                                    </td>

                                    <td className="flex-center">
                                        <div className="action">
                                            <Tippy content="Edit Account"  animation="fade">
                                            <a onClick={() => {
                                                // handleSetVideoUrl(data.answers_file)
                                            }} className="see"><BsPencilSquare onClick={() => null} size={14}/></a>
                                            </Tippy>
                                            <Tippy content="Delete Info"  animation="fade">
                                            <a onClick={() => {
                                                setDeleteId(data?._id);
                                                toggleDeleteModal();
                                            }} className="delete"><FaTrash onClick={() => null} size={14}/></a>
                                            </Tippy>
                                        </div>
                                    </td>
                                    {/* <td className="flex-center">
                                        <div className="action">
                                       {data?.answers_file.length > 2 && <>{data?.answers_file_type == 'video' && <Tippy content="View Video Solution"  animation="fade">
                                            <a onClick={() => {
                                                handleSetVideoUrl(data.answers_file)
                                            }} className="see"><AiFillEye onClick={() => null} size={14}/></a>
                                            </Tippy>}
                                          {data?.answers_file_type == 'others' &&  <Tippy content="Download Solution File"  animation="fade">
                                            <a target="_blank" download href={data.answers_file} className="see"><IoMdCloudDownload onClick={() => null} size={14}/></a>
                                            </Tippy>}</>}
                                            {data?.assessment_file?.length > 2 &&  <Tippy content="Download Assessment File"  animation="fade">
                                            <a href={data?.assessment_file} target="_blank" download className="see orange"><IoMdCloudDownload onClick={() => null} size={14}/></a>
                                            </Tippy>}
                                        </div>
                                    </td> */}
                                </tr> )}
                            </tbody>
                        </table>
                    </div>

                </div>
            </div>
        </div>

        {showAddModal &&  <CreateBankInfoModal onContentAdded={handleContentAdded} onClose={toggleAddModal} />}
        {showDeleteModal && <DeleteModal onAccept={handleDeleteBankinfo} onCancel={toggleDeleteModal} />}
        </SchoolLayout>
    );
}

export default Index;
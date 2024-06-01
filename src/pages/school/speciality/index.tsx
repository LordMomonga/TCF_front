import React, { useState, useEffect } from 'react';
import './speciality.css';

import Layout from '../../../components/Layout/Layout';
import StudentLayout from '../../../components/StudentLayout/StudentLayout';
import { AddClassModal, CreateSpecialityModal, DeleteModal } from '../../../components';
import JoinClassModal from '../../../components/students/JoinClassModal/JoinClassModal';

import { AiOutlineCopy } from 'react-icons/ai';

import { toast } from 'react-toastify';

import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';

import { getStudentsClasses, joinClass } from '../../../services/student';

import BeatLoader from "react-spinners/BeatLoader";
import {convertDate} from '../../../utils/date';

import moment from 'moment';
import SchoolLayout from '../../../components/SchoolLayout/SchoolLayout';
import { deleteShoolSpeciality, getSchoolSpecialitis } from '../../../services/specialities';

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
        label: 'code Spécialité',
        name: 'name'
    },
    {
        label: 'Fees',
        name: 'name'
    },
    {
        label: 'Total utilisateurs',
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
    const [ showCreateModal, setShowCreateModal ] = useState(false);

    const [specialities, setSpecialities] = useState([]);
    const [loading, setLoading] = useState(false);
    const [deleteModal, setShowDeleteModal] = useState(false);
    const [deleteId, setDeleteId] = useState(null);

    const toggleAddModal = () => {
        setShowCreateModal(!showCreateModal);
    }

    const toggleDeleteModal = () => {
        setShowDeleteModal(!deleteModal);
    }


    const handleGetSpecialities = ()  => {
        setLoading(true);

        getSchoolSpecialitis().then((res: any) => {
            console.log('RESPONSE GET: ', res);
            if(res.ok) {
                setSpecialities(res.data.data);
            }
            setLoading(false);
        }).catch(err => {
            console.log('error: ', err);
            setLoading(false);
        })
    }

    const handleDeleteSpeciality = () => {
        console.log('DELETE SPECIALITY');
        console.log(deleteId)
        deleteShoolSpeciality(deleteId).then((res: any) => {
            if(res.ok) {
                toggleDeleteModal();
                toast.success(res.data.message, {
                    pauseOnHover: false,
                    closeOnClick: true,
                })
                getSchoolSpecialitis();
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

 

    const handleSpecialityAdded = ()  => {
        handleGetSpecialities();
        toggleAddModal();
    }

    useEffect(() => {
        handleGetSpecialities();
    },[]);

    return (
        <SchoolLayout title="School Specialities" pageTitle="Specialities">
              <div className="section">
                        <div className="parent-con">
                            <div className="data-table">
                                <div className="top">
                                    <div className="span">
                                        <h1>You have : {specialities.length} Spécialité</h1>
                                    </div>
                                    {/* <form className="search">
                                        <input type="search" name="" id="" placeholder="Find ..." />
                                        <button type="submit"><i className="fa fa-search" aria-hidden="true"></i></button>
                                    </form> */}
                                    <button onClick={toggleAddModal} className="btn btn-primary btn-add school-button">Add Speciality  <i className="fas fa-plus"></i></button>
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
                                          {specialities.map((data: any, index: any) => <tr key={index}>
                                                <td className="flex-center">{index + 1}</td>

                                                <td className="flex-start">
                                                    <p>{data?.name}</p>
                                                </td>

                                                <td className="flex-start">
                                                    <p>{data?.code}</p>
                                                </td>
                                       
                                
                                                <td className="flex-start">{data?.fees} CFA</td>
                                                
                                                <td className="flex-start">{data?.students?.length}</td>

                                                <td className="flex-start">
                                                    <p>{convertDate(data?.createdAt)}</p>
                                                </td>
                                                <td className="flex-center">
                                        <div className="action">
                                            {/* <Tippy content="Copy Speciality Code"  animation="fade">
                                                        <a className="see"><AiOutlineCopy onClick={() => {
                                                            navigator.clipboard.writeText(`${data.code}`);
                                                            
                                                            toast.success("Copied To Clipboard", {
                                                                pauseOnHover: false,
                                                                closeOnClick: true,
                                                            })
                                                        }} size={14}/></a>
                                                        </Tippy> */}
                                                <Tippy content="Delete Speciality"  animation="fade">
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

                    {showCreateModal &&  <CreateSpecialityModal onSpecialityAdded={handleSpecialityAdded} onClose={toggleAddModal} />}
                    {deleteModal && <DeleteModal onAccept={handleDeleteSpeciality} color={'#605E5A'} title="Are you sure you want to delete speciality" onCancel={toggleDeleteModal} />}
        </SchoolLayout>
    );
}

export default Index;
import React, { useState, useEffect, useContext } from 'react';
import './classrooms.css';

import Layout from '../../../components/Layout/Layout';
import './classrooms.css';
import { AddClassModal, DeleteModal } from '../../../components';

import { AiOutlineCopy } from 'react-icons/ai';

import { toast } from 'react-toastify';

import { useTranslation } from 'react-i18next';


import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';

import { getClasses, deleteClass, getTeachersPendingClassRequest } from '../../../services/classroom';
import BeatLoader from "react-spinners/BeatLoader";

import moment from 'moment';
import { convertDate } from '../../../utils/date';
import AcademicYearContext from '../../../contexts/AcademicYearContext';


const override = {
    marginTop: '20px'
  };


function Index() {
    const [ showAddModal, setShoowAddModal ] = useState(false);
    const [deleteModal, setShowDeleteModal] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const {activeAcademyYear, setActiveAcademyYear} = useContext<any>(AcademicYearContext);

    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(false);

    const { t, i18n } = useTranslation();

    const rows: any = [
        {
            label: '#',
            name: 'num'
        },
        {
            label: (`${t('classroom.data_table.class_name')}`),
            name: 'name'
        },
        {
            label: `Speciality\'s`,
            name: 'name'
        },
        {
            label: `School`,
            name: 'name'
        },
        {
            label: `Status`,
            name: 'name'
        },

        {
            label: 'Applied Date',
            name: 'action'
        }
    ]


    const toggleAddModal = () => {
        setShoowAddModal(!showAddModal);
    }

    const toggleDeleteModal = () => {
        setShowDeleteModal(!deleteModal);
    }

    const handleGetClasses = ()  => {
        setLoading(true);

        getTeachersPendingClassRequest().then((res: any) => {
            console.log('RESPONSE GET: ', res);
            if(res.ok) {
                setClasses(res.data.data.reverse());
            }
            setLoading(false);
        }).catch(err => {
            console.log('error: ', err);
            setLoading(false);
        })
    }

    const handleDeleteClass = () => {
        console.log('DELETE CLASS');
        console.log(deleteId)
        deleteClass(deleteId).then((res: any) => {
            if(res.ok) {
                toggleDeleteModal();
                handleGetClasses();
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

    const handleClassAdded = ()  => {
        handleGetClasses();
        toggleAddModal();
    }

    useEffect(() => {
        handleGetClasses();
    },[]);

    return (
        <Layout title={t('classroom.data_table.layout_title')}>
              <div className="section">
                        <div className="parent-con">
                            <div className="data-table">
                                <div className="top">
                                    <div className="span">
                                        <h1>Classes </h1>
                                    </div>
                                    {/* <form className="search">
                                        <input type="search" name="" id="" placeholder="Find ..." />
                                        <button type="submit"><i className="fa fa-search" aria-hidden="true"></i></button>
                                    </form> */}
                                    <button onClick={toggleAddModal} className="btn btn-primary btn-add">{t('classroom.data_table.button')} <i className="fas fa-plus"></i></button>
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
                                          {classes.map((data: any, index: any) => <tr>
                                                <td className="flex-center">{index + 1}</td>
                                                <td className="flex-start">
                                                    <p>{data.name}</p>
                                                </td>
                                       
                        

                                               {data.specialities.length > 0 && <td className="flex-start">{data.specialities.map((sp:any ) => `${sp.name}, ` )}</td>}
                                               {data.specialities.length <= 0 && <td className="flex-start">Private</td>}

                                               <td className="flex-start">{data?.school_id?.username ? data?.school_id?.username : "Private"}</td>
                                               
                                                <td className="flex-start">{data?.status ? data?.status : "Private"}</td>

                                                
                                                <td className="flex-start">
                                                    <p>{convertDate(data.createdAt)}</p>
                                                </td>

                                                <td className="flex-center">
                                                    <div className="action">
                                                        {/* <Tippy content="Copy Class Url"  animation="fade">
                                                        <a className="see"><AiOutlineCopy onClick={() => {
                                                            navigator.clipboard.writeText(`${data._id}`);
                                                            
                                                            toast.success("Copied To Clipboard", {
                                                                pauseOnHover: false,
                                                                closeOnClick: true,
                                                            })
                                                        }} size={14}/></a>
                                                        </Tippy>
                                                        <Tippy content="Delete Class"  animation="fade">
                                                            <a onClick={() => {
                                                                setDeleteId(data._id);
                                                                toggleDeleteModal();
                                                            }} className="delete"><i className="fa fa-trash" aria-hidden="true"></i></a>
                                                        </Tippy> */}
                                                    </div>
                                                </td>
                                            </tr> )}
                                        </tbody>
                                    </table>
                                </div>


                            </div>
                        
                        </div>
                    </div>

                    {showAddModal &&  <AddClassModal onClassAdded={handleClassAdded} onClose={toggleAddModal} />}
                    {deleteModal && <DeleteModal onAccept={handleDeleteClass} onCancel={toggleDeleteModal} />}
        </Layout>
    );
}

export default Index;
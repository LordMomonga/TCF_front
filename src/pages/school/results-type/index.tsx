import React, { useState, useEffect, useContext }  from 'react';
import './result-type.css';


import { toast } from 'react-toastify';

import { AiOutlineCheckSquare } from 'react-icons/ai';
import { MdOutlineCancelPresentation } from 'react-icons/md';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';

import { DeleteModal } from '../../../components';

import { schoolAcceptStudent, schoolGetStudents, schoolRejectStudent, schoolSuspendStudent } from '../../../services/student';

import BeatLoader from "react-spinners/BeatLoader";


import { convertDate } from '../../../utils/date';
import SchoolLayout from '../../../components/SchoolLayout/SchoolLayout';
import AcademicYearContext from '../../../contexts/AcademicYearContext';
import { getSchoolSpecialitis } from '../../../services/specialities';
import CreateResultType from '../../../components/school/CreateResultsType/CreateResultsType';
import { FaTrash } from 'react-icons/fa';
import { schoolDeleteResultsTypes, schoolGetResultsTypes } from '../../../services/school';

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
        label: 'Date Created',
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
    const [ showDeleteTypeModal, setShowDeleteTypeModal ] = useState(false);


    const [selectedId, setSelectedId] = useState<any>(null);

    // NEW
    let [showCreateResultTypeModal, setShowCreateResultTypeModal] = useState(false);
    let [resultsTypes, setResultTypes] = useState([]);

    const [loading, setLoading] = useState(false);


    const toggleShowDeleteTypeModal = () => {
        setShowDeleteTypeModal(!showDeleteTypeModal);
    }


    const handleDeleteResultType = () => {
        schoolDeleteResultsTypes(selectedId).then((res: any) => {
            if(res.ok) {
                toggleShowDeleteTypeModal();
                handleGetResultTypes();
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

    const toggleShowCreateResultTypeModal = () => {
        setShowCreateResultTypeModal(!showCreateResultTypeModal);
    }




    const handleGetResultTypes = ()  => {

        setLoading(true);

        schoolGetResultsTypes().then((res: any) => {
            if(res.ok) {
                console.log('DATA: ', res.data.data);
                setLoading(false);
                setResultTypes(res.data.data);
            }
        }).catch(err => {
            setLoading(false);
            console.log('error: ', err);
        })
    }

    const handleContentAdded = () => {
        handleGetResultTypes();
        toggleShowCreateResultTypeModal();
    }

 


    useEffect(() => {
        console.log('USER EFFECT RAN')
        handleGetResultTypes();
    },[]);

    return (
        <SchoolLayout title="Result Types" pageTitle="Result Types">
      <div className="section">
            <div className="parent-con">
                <div className="data-table">
                    <div className="top">
                        <div className="span">
                            {/* <select name="" id="" onChange={(e: any) => null} className="select-field school-student-select">
                                <option value="all">Fillter Status</option>
                                <option value='active'>Active</option>
                                <option value='pending'>Pending</option>
                                <option value='suspended'>Suspended</option>
                            </select>
                            <select name="" id="" onChange={(e: any) => null} className="select-field school-student-select">
                                <option value="all">Fillter By Speciality</option>
                               {schoolSpecialities?.map((sp: any) => <option value={sp._id}>{sp?.name}</option>)}
                            </select> */}
                        </div>
                
                        <button onClick={toggleShowCreateResultTypeModal} className="btn btn-primary btn-add school-button"> New Type <i className="fas fa-plus"></i></button>
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
                                {resultsTypes?.map((data: any, index: any) => <tr>
                                    <td className="flex-center">{index + 1}</td>
                                    <td className="flex-start">
                                        <p>{data?.name}</p>
                                    </td>
                                
                                    <td className="flex-start">
                                        <p>{convertDate(data?.createdAt)}</p>
                                    </td>


                                    <td className="flex-center">
                                        <div className="action">
                                        
        
                                      <Tippy content="Delete"  animation="fade">
                                            <a onClick={() => {
                                                    setSelectedId(data?._id);
                                                    toggleShowDeleteTypeModal();
                                            }} className="delete"><FaTrash /></a>
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

         {showCreateResultTypeModal &&  <CreateResultType onContentAdded={handleContentAdded} onClose={toggleShowCreateResultTypeModal} />}
           
        {showDeleteTypeModal && <DeleteModal color={'#605E5A'} title="Are you sure you  want to delete result type ?" onAccept={handleDeleteResultType} onCancel={toggleShowDeleteTypeModal} />}

        </SchoolLayout>
    );
}

export default Index;
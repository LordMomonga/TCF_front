import React, { useState, useEffect, useContext }  from 'react';
import './student-results.css';


import { toast } from 'react-toastify';

import { AiOutlineCheckSquare } from 'react-icons/ai';
import { ImFolderUpload } from 'react-icons/im';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';

import { DeleteModal, UploadResultsModal } from '../../../components';

import { schoolAcceptStudent, schoolGetStudents, schoolRejectStudent, schoolSuspendStudent } from '../../../services/student';

import BeatLoader from "react-spinners/BeatLoader";


import { getTotalAssessments } from '../../../services/assessment';
import { convertDate } from '../../../utils/date';
import SchoolLayout from '../../../components/SchoolLayout/SchoolLayout';
import AcademicYearContext from '../../../contexts/AcademicYearContext';
import { getSchoolSpecialitis } from '../../../services/specialities';
import CreateResultType from '../../../components/school/CreateResultsType/CreateResultsType';

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
        label: 'Speciality',
        name: 'name'
    },
    {
        label: 'Email',
        name: 'name'
    },
    {
        label: 'Fees Paid',
        name: 'name'
    },
    {
        label: 'Total Fees',
        name: 'name'
    },
    {
        label: 'Status',
        name: 'name'
    },
    {
        label: 'Applied Date',
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
    const [schoolStudents, setSchoolStudents] = useState([]);
    const [ showUploadResultsModal, setShowUploadResultsModal ] = useState(false);
    const [ showRejectModal, setShowRejectModal ] = useState(false);
    const [ showSuspendedModal, setShowSuspendedModal ] = useState(false);
    const {activeAcademyYear, setActiveAcademyYear} = useContext<any>(AcademicYearContext);
    const [schoolSpecialities, setSchoolSpecialites] = useState([]);
    const [filteredData, setFilteredData] = useState<any>([]);

    const [selectedId, setSelectedId] = useState<any>(null);

    const [loading, setLoading] = useState(false);

    const handleGetStudents = ()  => {
        setSchoolStudents([]);
        setFilteredData([]);
        
        setLoading(true)
        schoolGetStudents().then((res: any) => {
            if(res.ok) {
                console.log('DATA: ', res.data.data);
                setSchoolStudents(res.data.data);
                setFilteredData(res.data.data)
            }
            setLoading(false)
        }).catch(err => {
            setLoading(false)
            console.log('error: ', err);
        })
    }

    const handleSelectedSpeciality = (id: any) => {
        let filtered: any = [];

        if(id == 'all') {
            setFilteredData(schoolStudents);
            return;
        } 

        schoolStudents.forEach((stud: any) => {
            if(stud.speciality_id._id == id) {
                filtered.push(stud);
            }
        })

        setFilteredData(filtered);
    }



    const toggleShowUploadResultsModal = () => {
        setShowUploadResultsModal(!showUploadResultsModal);
    }


    const handleGetSpecialities = ()  => {

        getSchoolSpecialitis().then((res: any) => {
            console.log('RESPONSE GET: ', res);
            if(res.ok) {
                setSchoolSpecialites(res.data.data);
            }
        }).catch(err => {
            console.log('error: ', err);
        })
    }


    const handleContentAdded = () => {
        console.log('RESULT SUBMITED')
        toggleShowUploadResultsModal();
    }

    useEffect(() => {
        console.log('USER EFFECT RAN')
        handleGetStudents();
        handleGetSpecialities();
    },[activeAcademyYear]);

    return (
        <SchoolLayout title="Student Results" pageTitle="Results">
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
                            </select> */}
                            <select name="" id="" onChange={(e: any) => handleSelectedSpeciality(e.target.value)} className="select-field school-student-select">
                                <option value="all">Fillter By Speciality</option>
                               {schoolSpecialities?.map((sp: any) => <option value={sp._id}>{sp?.name}</option>)}
                            </select>
                        </div>
                
                        {/* <button onClick={toggleAddModal} className="btn btn-primary btn-add student-button"> Upload Solution <i className="fas fa-plus"></i></button> */}
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
                                        <p>{data?.student_id?.username}</p>
                                    </td>
                                    <td className="flex-start">
                                      {data?.speciality_id?.name}
                                    </td>
                                    <td className="flex-start">
                                      {data?.student_id?.email}
                                    </td>

                                    <td className="flex-start">
                                      {data?.fees_paid}
                                    </td>

                                    <td className="flex-start">
                                      {data?.total_fees}
                                    </td>

                                    <td className="flex-start">
                                      {data?.status ? data?.status : 'Pending'}
                                    </td>

                                    <td className="flex-start">
                                        <p>{convertDate(data?.createdAt)}</p>
                                    </td>

                                    

                                    <td className="flex-center">
                                        <div className="action">
                                        
                                        <Tippy content="Upload Students Result"  animation="fade">
                                                    <a className="see" onClick={() => {
                                                        setSelectedId(data?.student_id?._id);
                                                        toggleShowUploadResultsModal();
                                                    }}><ImFolderUpload size={14}/></a>
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

         {showUploadResultsModal &&  <UploadResultsModal studentId={selectedId} onContentAdded={handleContentAdded} onClose={toggleShowUploadResultsModal} />}
        </SchoolLayout>
    );
}

export default Index;

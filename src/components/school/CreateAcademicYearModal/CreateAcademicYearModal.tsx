import React, { useState, useEffect } from 'react';
import './CreateAcademicYearModal.css';
import * as Yup from 'yup';
import Form from '../../form/components/Form/Form';
import FormField from '../../form/components/FormField/FormField';
import Button from '../../form/components/Button/Button';
import ErrorMessage from '../../form/components/ErrorMessage/ErrorMessage';
import { ImCancelCircle } from 'react-icons/im';
import { FaCloudUploadAlt, FaTrashAlt } from  'react-icons/fa';
import { useRef } from 'react';
import { toast } from 'react-toastify';
import BeatLoader from "react-spinners/BeatLoader";
import ProgressBar from '../../Progress/Progress';
import { MdTipsAndUpdates } from  'react-icons/md';

import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

import { firebaseApp } from '../../../utils/firebaseConfig';

import { getSchoolSpecialitis } from '../../../services/specialities';
import { schoolCreateAcademicYear, schoolCreateTimetable } from '../../../services/school';

const initialValues= {
    title: '',
    start: '',
    end: ''
}

const override = {
    marginTop: '10px'
  };



function UploadTimeTableModal({ onClose, onContentAdded } : any) {
    const [error, setError] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    const validationSchema = Yup.object().shape({
        title: Yup.string().required('Academic year title required'),
        start: Yup.string().required('Start  date is required'),
        end: Yup.string().required('End date is required')
    })


    const handleSubmitAcademicYear = (values: any) => {

        setError(null);

        var today:any = new Date();
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        var yyyy = today.getFullYear();

        today = yyyy + '-' + mm + '-' + dd;


        if(values.start < today) {
            setError('Academic start date needs to be between today and future dates')
            return;
        }

        if(values.end < today) {
            setError('Academic end date needs to be between today and future dates')
            return;
        }

        if(values.end <= values.start) {
            setError('Academic end date needs to be greater than start date')
            return;
        }

        let data = {
            ...values,
            status: 'ongoing'
        }

            // console.log("FINAL CONTENT: ",data)
            setLoading(true);
            schoolCreateAcademicYear(data).then((res: any) => {
                if(res.ok) {
                    toast.success(res.data.message, {
                        pauseOnHover: false,
                        closeOnClick: true,
                    })
                    setLoading(false);
                    onContentAdded();
                }else {
                    console.log(res)
                    setLoading(false);
                    setError(res.data.message);
                    toast.error(res.data.message, {
                        pauseOnHover: false,
                        closeOnClick: true,
                    })
                }
            }).catch((err: any) => {   
                setLoading(false);
                console.log('ERROR SUBMITING: ', err);
                toast.error("ERROR", {
                    pauseOnHover: false,
                    closeOnClick: true,
                })
            })
    }

    
    return (
        <div>
            <div  className='modal-container teacher-modal-academic-year'>
                <div className='modal-head'>
                    <p className="modal-title">Create A New Academic Year</p>
                    <ImCancelCircle style={{cursor: 'pointer'}} onClick={onClose} size={22} color="#fff"/>
                </div>
                <div className='modal-content'>
                <div style={{textAlign: 'center', marginBottom: '10px'}}>
                <BeatLoader
                    color="#623d91" 
                    loading={loading}
                    cssOverride={override}
                />
                </div>
                <form action="" className="auth-form">

                {error && <ErrorMessage error={error} visible={true} />}
                <Form 
                    initialValues={initialValues}
                    onSubmit={handleSubmitAcademicYear}
                    validationSchema={validationSchema}
                >
    
                        <p className="label-text">Title </p>
                        <FormField  name="title" type="general" placeholder="Academic year title "/>


                        <div className="timetable-dates">
                            <div className="from">
                                <label>Start</label>
                                <FormField  name="start" type="date" placeholder=""/>
                            </div>
                            <div className="to">
                                <label>End</label>
                                <FormField  name="end" type="date" placeholder=""/>
                            </div>
                        </div>
 
                  
               
                    {!loading &&  <Button isOutLined={true} isFullWidth={false} title="CREATE ACADEMIC YEAR"/>}

                        </Form>
                </form>
                </div>
            </div>
            <div className="modal-shadow" onClick={onClose}>
               
            </div>
        </div>
    );
}

export default UploadTimeTableModal;

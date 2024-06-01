import React, { useState, useEffect } from 'react';
import './ReportModal.css';
import * as Yup from 'yup';
import Form from '../../form/components/Form/Form';
import FormField from '../../form/components/FormField/FormField';
import Button from '../../form/components/Button/Button';
import ErrorMessage from '../../form/components/ErrorMessage/ErrorMessage';
import { ImCancelCircle } from 'react-icons/im';
import BeatLoader from "react-spinners/BeatLoader";

import { toast } from 'react-toastify';

import { createReport, joinClass, joinSchool } from '../../../services/student';

const initialValues= {
    subject: '',
}

const override = {
    marginTop: '20px'
  };



function ReportModal({ onClose, onReportSubmitted } : any) {
    const [error, setError] = useState(null);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    
    const validationSchema = Yup.object().shape({
        subject: Yup.string().required('Subject required'),
    })


    const handleSubmitReport = (values: any) => {
        console.log('DETAILS: ', values);
        let data = {    
            ...values,
            message: message
        }   

        setLoading(true);
        createReport(data).then((res: any) => {
            if(res.ok) {
                toast.success(res.data.message, {
                    pauseOnHover: false,
                    closeOnClick: true,
                })
                setLoading(false);
                onReportSubmitted();
            }else {
                console.log(res)
                setError(res.data.message)
                setLoading(false);
                toast.error(res.data.message, {
                    pauseOnHover: false,
                    closeOnClick: true,
                })
            }
        }).catch(err => {   
            console.log('ERROR CREATING: ', err);
            toast.error("ERROR", {
                pauseOnHover: false,
                closeOnClick: true,
            })
        })

    }


    
    return (
        <div>
            <div  className='add-modal-container join-modal'>
                <div className='modal-head'>
                    <p className="modal-title">Report A Problem</p>
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
                    onSubmit={handleSubmitReport}
                    validationSchema={validationSchema}
                >

                        <FormField  name="subject" type="general" placeholder="Subject"/>

                        <p className="label-text">Message: </p>
                        <textarea rows={8} onChange={(e: any) => setMessage(e.target.value)} value={message} className="textarea"></textarea>
                        <br />
                        <br />
                    

                      {!loading && <Button isOutLined={true} isFullWidth={false} title="REPORT"/>}
                        </Form>
                </form>
                </div>
            </div>
            <div className="modal-shadow" onClick={onClose}>
           
            </div>
        </div>
    );
}

export default ReportModal;
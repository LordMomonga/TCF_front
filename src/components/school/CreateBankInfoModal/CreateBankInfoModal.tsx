import React, { useState, useEffect } from 'react';
import './CreateBankInfoModal.css';
import * as Yup from 'yup';
import Form from '../../form/components/Form/Form';
import FormField from '../../form/components/FormField/FormField';
import Button from '../../form/components/Button/Button';
import ErrorMessage from '../../form/components/ErrorMessage/ErrorMessage';
import { ImCancelCircle } from 'react-icons/im';
import BeatLoader from "react-spinners/BeatLoader";

import { toast } from 'react-toastify';

import { createSpeciality } from '../../../services/specialities';
import { schoolCreateBankInfo } from '../../../services/bankInfo';

const initialValues= {
    name: '',
    account_number: ''
}

const override = {
    marginTop: '10px'
  };

function CreateBankInfoModal({ onClose, onContentAdded } : any) {
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    
    const validationSchema = Yup.object().shape({
        name: Yup.string().required('Bank name is required'),
        account_number: Yup.string().required('Bank account number is required'),
    })

    const handleCreateBankInfo = (values: any) => {
        console.log('SPECIALITY VALS: ', values);
        let data = {    
            name: values.name,
            account_number: values.account_number
        }   

        setLoading(true);
        schoolCreateBankInfo(data).then((res: any) => {
            if(res.ok) {
                toast.success(res.data.message, {
                    pauseOnHover: false,
                    closeOnClick: true,
                })
                setLoading(false);
                onContentAdded();
            }else {
                console.log(res)
                toast.error(res.data.message, {
                    pauseOnHover: false,
                    closeOnClick: true,
                })
                setLoading(false);
            }
        }).catch(err => {   
            console.log('ERROR CREATING: ', err);
            setLoading(false);
            toast.error("ERROR", {
                pauseOnHover: false,
                closeOnClick: true,
            })
        })

    }
    
    return (
        <div>
            <div  className='add-modal-container create-speciality-modal'>
                <div className='modal-head'>
                    <p className="modal-title">Add Bank Information</p>
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
                    onSubmit={handleCreateBankInfo}
                    validationSchema={validationSchema}
                >

                        <FormField  name="name" type="general" placeholder="Bank Name"/>
                        
                        <FormField  name="account_number" type="general" placeholder="Account Number"/>

                      {!loading && <Button isOutLined={true} isFullWidth={false} title="CREATE"/>}
                        </Form>
                </form>
                </div>
            </div>
            <div className="modal-shadow" onClick={onClose}>
           
            </div>
        </div>
    );
}

export default CreateBankInfoModal;
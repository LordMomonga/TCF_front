import React, { useState, useEffect } from 'react';
import './CreateFeesDeadlineModal.css';
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
import { schoolCreateDeadline } from '../../../services/instalments';

const initialValues= {
    title: '',
    date: '',
    amount_percent: null
}

const override = {
    marginTop: '10px'
  };



function CreateFeesDeadlineModal({ onClose, onContentAdded } : any) {
    const [error, setError] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    const validationSchema = Yup.object().shape({
        title: Yup.string().required('Instalment title required').label('Title'),
        date: Yup.string().required('You need to select instalment date').label('Date'),
        amount_percent: Yup.number().required('Amount in percent').label('Amount')
    })

    const handleCreateBankInfo = (values: any) => {
        console.log('SPECIALITY VALS: ', values);
        let data = {    
            title: values.title,
            date: values.date,
            amount_percent: +values.amount_percent
        }   

        var today: any = new Date();
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        var yyyy = today.getFullYear();

        today = yyyy + '-' + mm + '-' + dd;

        // if(data.date < today) {
        //     setError('Date can not be in the past');
        //     return;
        // }

        if(data.amount_percent > 100) {
            setError('Amount can not be above 100%');
            return;
        }


        setLoading(true);
        schoolCreateDeadline(data).then((res: any) => {
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
                toast.error(res.data.message, {
                    pauseOnHover: false,
                    closeOnClick: true,
                })
            }
        }).catch(err => {   
            setLoading(false);
            console.log('ERROR CREATING: ', err);
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
                    <p className="modal-title">New Deadline Date</p>
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

                        <FormField  name="title" type="general" placeholder="Installment Title"/>

                        <label>Deadline Date</label>
                        <FormField  name="date" type="date" placeholder=""/>
                       
                        <label>% Of fees to have been paid</label>
                        <FormField  name="amount_percent" type="number" placeholder="Enter amount in %"/>
                       
                      {!loading && <Button isOutLined={true} isFullWidth={false} title="CREATE DEADLINE"/>}
                        </Form>
                </form>
                </div>
            </div>
            <div className="modal-shadow" onClick={onClose}>
           
            </div>
        </div>
    );
}

export default CreateFeesDeadlineModal;
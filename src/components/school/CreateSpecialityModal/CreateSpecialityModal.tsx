import React, { useState, useEffect } from 'react';
import './CreateSpecialityModal.css';
import * as Yup from 'yup';
import Form from '../../form/components/Form/Form';
import FormField from '../../form/components/FormField/FormField';
import Button from '../../form/components/Button/Button';
import ErrorMessage from '../../form/components/ErrorMessage/ErrorMessage';
import { ImCancelCircle } from 'react-icons/im';
import BeatLoader from "react-spinners/BeatLoader";

import { toast } from 'react-toastify';

import { joinClass } from '../../../services/student';
import { createSpeciality } from '../../../services/specialities';

const initialValues= {
    name: '',
    fees: '',
    descriptions:''
}

const override = {
    marginTop: '10px'
  };

function CreateSpecialityModal({ onClose, onSpecialityAdded } : any) {
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const validationSchema = Yup.object().shape({
        name: Yup.string().required('Class Id is required'),
        fees: Yup.string().required('Speciality Fees is required'),
        descriptions: Yup.string(),

    })


    const handleCreateSpeciality = (values: any) => {
        // console.log('SPECIALITY VALS: ', values);
        let data = {    
            name: values.name,
            fees: values.fees,
            descriptions: values.description
        }   

        setLoading(true);
        createSpeciality(data).then((res: any) => {
            if(res.ok) {
                toast.success(res.data.message, {
                    pauseOnHover: false,
                    closeOnClick: true,
                })
                setLoading(false);
                onSpecialityAdded();
            }else {
                console.log(res)
                setLoading(false);
                setError(res.data.message);
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
                    <p className="modal-title">Create Speciality</p>
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
                    onSubmit={handleCreateSpeciality}
                    validationSchema={validationSchema}
                >

                        <FormField  name="name" type="general" placeholder=" Nom de spécialité"/>
                        
                        <FormField  name="fees" type="number" placeholder="Somme de Specialité"/>
                        <FormField  name="descriptions" type="general" placeholder=" detaille de spécialité"/>

                     {!loading &&  <Button isOutLined={true} isFullWidth={false} title="CREATE"/>}
                        </Form>
                </form>
                </div>
            </div>
            <div className="modal-shadow" onClick={onClose}>
           
            </div>
        </div>
    );
}

export default CreateSpecialityModal;
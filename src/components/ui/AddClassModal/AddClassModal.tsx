import React, { useState, useEffect } from 'react';
import './AddClassModal.css';
import * as Yup from 'yup';
import Form from '../../form/components/Form/Form';
import FormField from '../../form/components/FormField/FormField';
import Button from '../../form/components/Button/Button';
import ErrorMessage from '../../form/components/ErrorMessage/ErrorMessage';
import { ImCancelCircle } from 'react-icons/im';
import BeatLoader from "react-spinners/BeatLoader";

import { toast } from 'react-toastify';

import { createClass, getClasses, deleteClass } from '../../../services/classroom';

const initialValues= {
    name: '',
    school_code: '',
    specialities: ''
}

const override = {
    marginTop: '10px'
  };



function AddClassModal({ onClose, onClassAdded } : any) {
    const [error, setError] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    const validationSchema = Yup.object().shape({
        name: Yup.string().required('Class Name is required'),
        school_code: Yup.string(),
        specialities: Yup.string(),
    })

    const handleAddClass = (values: any) => {
        // console.log('CLASS NAME: ', values);
        if(values.school_code.length > 2 && values.specialities.length < 2) {
            setError("If you entered school code you need to specify speciality code too");
            return;
        }

        let data = {
            ...values,
            specialities: values.specialities.split(',')
        }
        setLoading(true);
        createClass(data).then((res: any) => {
            if(res.ok) {
                toast.success(res.data.message, {
                    pauseOnHover: false,
                    closeOnClick: true,
                })
                setLoading(false);
                onClassAdded();
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
            <div  className='add-modal-container adding-modal add-class-modal'>
                <div className='modal-head'>
                    <p className="modal-title">Add New Classroom</p>
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
                    onSubmit={handleAddClass}
                    validationSchema={validationSchema}
                >

                    <FormField  name="name" type="general" placeholder="Classroom Name"/>
                    <label>Enter School Code(Optional)</label>
                    <br />
                    <FormField  name="school_code" type="general" placeholder="School Code"/>
                    <label>Enter Speciality Code(Optional)</label>
                    <br />
                    <FormField  name="specialities" type="general" placeholder="Speciality Code"/>
                  {!loading &&  <Button isOutLined={true} isFullWidth={false} title="CREATE CLASSROOM"/>}
                    </Form>
                </form>
                </div>
            </div>
            <div className="modal-shadow" onClick={onClose}>
           
            </div>
        </div>
    );
}

export default AddClassModal;
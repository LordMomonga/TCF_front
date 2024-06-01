import React, { useState, useEffect } from 'react';
import './CreateSessionModal.css';
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

// import { submitAssignmentSolution } from '../../../services/student';
import { getClasses } from '../../../services/classroom';
import { createSession } from '../../../services/liveSession';

const initialValues= {
}



const override = {
    marginTop: '20px'
  };


function CreateSessionModal({ onClose, onSessionCreated } : any) {
    const [classes, setClasses] = useState([]);
    const [error, setError] = useState<any>(null);
    const [selectedClassroom, setSelectedClassroom] = useState<any>('all');
    const [loading, setLoading] = useState(false);

    const validationSchema = Yup.object().shape({
      
    })



    const handleGetClasses = ()  => {

        getClasses().then((res: any) => {
            // console.log('RESPONSE GET: ', res);
            if(res.ok) {
                setClasses(res.data.data);
            }
        }).catch(err => {
            console.log('error: ', err);
        })
    }



    const handleCreateSession = (values: any) => {
            setError(null);

            let data = {
                classroom_id: selectedClassroom,
                status: "Active",
                participants: []
            }

            if(data.classroom_id == null || data.classroom_id == 'all') {
                setError('You have to select a clasroom for for live session');
                return;
            }  

            // console.log('DATA: ', data);

            // CREATE LIVE SESSION
            setLoading(true);
            createSession(data).then((res: any) => {
                if(res.ok) {
                    toast.success(res.data.message, {
                        pauseOnHover: false,
                        closeOnClick: true,
                    })
                    setLoading(false);
                    onSessionCreated();
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
                console.log('ERROR CREATING SESSION: ', err);
                setLoading(false);
                toast.error("ERROR", {
                    pauseOnHover: false,
                    closeOnClick: true,
                })
            })
    }



    useEffect(() => {
        handleGetClasses();
    },[])

    
    return (
        <div>
            <div  className='modal-container'>
                <div className='modal-head'>
                    <p className="modal-title">CREATE A LIVE CLASS SESSION</p>
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
                    onSubmit={handleCreateSession}
                    validationSchema={validationSchema}
                >
                           <p className="label-text">Select Classroom: </p>
                        <select onChange={(e: any) => setSelectedClassroom(e.target.value) } className="select-field-modal">
                            <option value="all">All</option>
                            {classes.map((classData: any, key: any) => <option key={key} value={classData?._id}>{classData?.name}</option>)}
                        </select>

                     {!loading &&  <Button isOutLined={true} isFullWidth={false} title="CREATE SESSION"/>}

                        </Form>
                </form>
                </div>
            </div>
            <div className="modal-shadow" onClick={onClose}>
               
            </div>
        </div>
    );
}

export default CreateSessionModal;

import React, { useState, useEffect } from 'react';
import './FollowUpScoreModal.css';
import * as Yup from 'yup';
import Form from '../../form/components/Form/Form';
import FormField from '../../form/components/FormField/FormField';
import Button from '../../form/components/Button/Button';
import ErrorMessage from '../../form/components/ErrorMessage/ErrorMessage';
import { ImCancelCircle } from 'react-icons/im';
import { FaCloudUploadAlt, FaTrashAlt } from  'react-icons/fa';
import { useRef } from 'react';
import { toast } from 'react-toastify';
import { firebaseApp } from '../../../utils/firebaseConfig';
import {submitFollowupSolution } from '../../../services/student';
import { getStorage, ref, uploadBytesResumable, getDownloadURL, deleteObject} from 'firebase/storage';
import ProgressBar from '../../Progress/Progress';
import { BeatLoader } from 'react-spinners';

import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import { submitStudentFollowUpScore } from '../../../services/courseContent';



const override = {
    marginTop: '20px'
  };



function FollowUpScoreModal({ onClose, solutinId, followVals, onContentAdded } : any) {
    const [remark, setRemark] = useState('');

    const [error, setError] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    const storage = getStorage(firebaseApp);
    
    const [initialValues, setInitialValues]= useState({
        score: null,
        total_score: null
    });
    

    // FOLLOWBACK SCORE
    const solutionFileRef: any = useRef(null);

    const [markedScriptPdfUrl, setMarkedScriptPdfUrl] = useState('');
    const [markedScriptPdfProgress,  setSolutionPdfProgress] = useState(0);
    const [isUploadingMarkedScriptPdf, setIsUploadingMarkedScriptPdf] = useState(false);


    const validationSchema = Yup.object().shape({
        score: Yup.number().required('Enter Student Score').label('Score'),
        total_score: Yup.number().required('Enter Total Score').label('Total Score'),
    }); 

    const handleSubmitFollowUpScore = (values: any) => {
        console.log('ANSERS')
            setError(null);

            let data = {
                ...values,
                remark: remark,
                marked_script_file: markedScriptPdfUrl
            }

            if(data.score  > data.total_score) {
                setError('Student score can not be greater than  total score');
                return;
            }

            if(data.total_score == 0) {
                setError('Total score can not be 0');
                return;
            }

            console.log("VALUES: ", data);

            // return;
         
            // call submiting solution endpoint
            setLoading(false);
            submitStudentFollowUpScore(data, solutinId).then((res: any) => {
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

    const uploadAnswerPdf = (e: any) => {
        setIsUploadingMarkedScriptPdf(true);
      const pdfFile: any = e.target.files[0];
      const storageRef = ref(storage, `pdf-content/${Date.now()}-${pdfFile.name}`);
      const uploadTask = uploadBytesResumable(storageRef, pdfFile);

      console.log(e.target.files[0]);   
  
    uploadTask.on('state_changed', (snapshot: any)=>{
        const uploadProgress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

        setSolutionPdfProgress(+uploadProgress);

    }, (error: any) => {
        console.log(error);
    },()=> {
         getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setMarkedScriptPdfUrl(downloadURL);
            console.log('PDF  URL: ', downloadURL);
            setIsUploadingMarkedScriptPdf(false);
        });
    })
    }

    useEffect(() => {
        console.log('VALUES: ', followVals)

        if(followVals) {
            setRemark(followVals?.remark);
            setInitialValues({
                score: followVals.score,
                total_score: followVals.total_score
            })

            if(followVals.marked_script_file) {
                setMarkedScriptPdfUrl(followVals.marked_script_file)
            }
        }
        
    }, [])
    
    return (
        <div>
            <div  className='modal-container'>
                <div className='modal-head'>
                    <p className="modal-title">Student Followup Score</p>
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
                    onSubmit={handleSubmitFollowUpScore}
                    validationSchema={validationSchema}
                >
                        {/* <p>{solutinId}</p> */}
                        <div className='upload-content-container'>

                         <div className="form-field-upload content-upload-left">
                            <p className="label-text">Student Score: </p>
                            <FormField  name="score" type="number" placeholder="Student Score"/>
                        </div>
                        
                        <div className="form-field-upload content-upload-right">
                            <p className="label-text">Total Score: </p>
                            <FormField  name="total_score" type="number" placeholder="Total Score"/>
                        </div>
                        


                        </div>


                        <div className='upload-content-container'>

                          {markedScriptPdfUrl.length < 2 &&  <div className="form-field-upload content-upload-right">
                            <p className="label-text">Upload Solution Pdf: </p>
                            <div className="file-drop-upload" onClick={() => solutionFileRef.current.click()}>
                            {!isUploadingMarkedScriptPdf && <FaCloudUploadAlt size={35} color="#FFA500" />}
                                <input ref={solutionFileRef} onChange={uploadAnswerPdf} type="file" style={{width: '100%', height: '100%', display: 'none'}} accept="application/pdf,application/vnd.ms-excel"/>
                                {isUploadingMarkedScriptPdf &&  <div style={{width: '80%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
                              <BeatLoader
                                    color="#623d91" 
                                    loading={isUploadingMarkedScriptPdf}
                                    cssOverride={override}
                                />
                                <p style={{fontSize: '14px'}}>Uploading File</p>
                            
                                    <ProgressBar bgcolor={'#6a1b9a'} completed={markedScriptPdfProgress}/>
                                
                              </div>}
                        
                            </div>
                        </div>}

                        {markedScriptPdfUrl.length > 2 &&
                            <div className="form-field-upload">
                            <p className="label-text" style={{textAlign: 'center'}}>Done</p>
                            </div>
                            }
                        </div>

                        <p className="label-text">Remark (optional) : </p>
                        <textarea rows={8} onChange={(e: any) => setRemark(e.target.value)} value={remark} className="textarea"></textarea>
                        <br />
                        <br />
                        <Button isOutLined={true} isFullWidth={false} title="SUBMIT SCORE"/>

                        </Form>
                </form>
                </div>
            </div>
            <div className="modal-shadow" onClick={onClose}>
               
            </div>
        </div>
    );
}

export default FollowUpScoreModal;

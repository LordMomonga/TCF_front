import React, { useState, useEffect } from 'react';
import './UploadResultsModal.css';
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
import { submitAssessmentScore } from '../../../services/assessment';
import { schoolGetResultsTypes } from '../../../services/school';
import { createStudentResults } from '../../../services/results';


const override = {
    marginTop: '20px'
  };



function AssessmentScoreModal({ onClose, studentId, onContentAdded } : any) {
    const [remark, setRemark] = useState('');
    const [resultTypes, setResultTypes] = useState([]);
    const [selectedResultsType, setSelectedResultsType] = useState('none');
    const [loading, setLoading] = useState(false);


    const [error, setError] = useState<any>(null);

    const storage = getStorage(firebaseApp);

    const [initialValues, setInitialValues]= useState({
        average: null,
        total_average: null
    });
    

    // FOLLOWBACK SCORE
    const resultsFileRef: any = useRef(null);

    const [resultsPdfUrl, setResultsPdfUrl] = useState('');
    const [resultsPdfProgress,  setResultsPdfProgress] = useState(0);
    const [isUploadingResultsPdf, setIsUploadingResultsPdf] = useState(false);


    const validationSchema = Yup.object().shape({
        average: Yup.number().required('Enter Student Average').label('Average'),
        total_average: Yup.number().required('Enter Total Score').label('Total Average'),
    }); 

    const handleSubmitStudentResults = (values: any) => {
        // console.log('ANSERS')
            setError(null);
            let data = {
                ...values,
                remark: remark,
                result_file: resultsPdfUrl,
                result_type: selectedResultsType
            }

            if(+data.average  > +data.total_average) {
                setError('Student average can not be greater than  total average');
                return;
            }

            if(data.total_average == 0) {
                setError('Total average can not be 0');
                return;
            }

            if(selectedResultsType == 'none') {
                setError('You must selecte a result type');
                return;
            }

            if(resultsPdfUrl.length < 2) {
                setError('You must upload a pdf copy of result ');
                return;
            }

            data.average = +data.average;
            data.total_average = +data.total_average;

            // console.log("VALUES: ", data);


            // call submiting solution endpoint
            setLoading(true);
            createStudentResults(studentId, data).then((res: any) => {
                if(res.ok) {
                    toast.success(res.data.message, {
                        pauseOnHover: false,
                        closeOnClick: true,
                    })
                    setLoading(false);
                    onContentAdded();
                }else {
                    console.log(res)
                    setError(res.data.message);
                    setLoading(false);
                    toast.error(res.data.message, {
                        pauseOnHover: false,
                        closeOnClick: true,
                    })
                }
            }).catch((err: any) => {   
                console.log('ERROR SUBMITING: ', err);
                setLoading(false);
                toast.error("ERROR", {
                    pauseOnHover: false,
                    closeOnClick: true,
                })
            })
    } 


    const uploadAnswerPdf = (e: any) => {
        setIsUploadingResultsPdf(true);
      const pdfFile: any = e.target.files[0];
      const storageRef = ref(storage, `pdf-content/${Date.now()}-${pdfFile.name}`);
      const uploadTask = uploadBytesResumable(storageRef, pdfFile);

      console.log(e.target.files[0]);   
  
    uploadTask.on('state_changed', (snapshot: any)=>{
        const uploadProgress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

        setResultsPdfProgress(+uploadProgress);

    }, (error: any) => {
        console.log(error);
    },()=> {
         getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setResultsPdfUrl(downloadURL);
            console.log('PDF  URL: ', downloadURL);
            setIsUploadingResultsPdf(false);
        });
    })
    }

    const handleGetResultTypes = () => {

        schoolGetResultsTypes().then((res: any) => {
            if(res.ok) {
                console.log('DATA: ', res.data.data);
                setResultTypes(res.data.data);
            }
        }).catch(err => {
            console.log('error: ', err);
        })
    }


    useEffect(() => {
        // setResultTypes()
        handleGetResultTypes()
    }, []);
    
    return (
        <div>
            <div  className='modal-container create-speciality-modal'>
                <div className='modal-head'>
                    <p className="modal-title">Upload Student Results</p>
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
                    onSubmit={handleSubmitStudentResults}
                    validationSchema={validationSchema}
                >
                        {/* <p>{solutinId}</p> */}
                        <div className='upload-content-container'>

                         <div className="form-field-upload content-upload-left">
                            <p className="label-text">Student Average: </p>
                            <FormField  name="average" type="number" placeholder="Student Average"/>
                        </div>
                        
                        <div className="form-field-upload content-upload-right">
                            <p className="label-text">Total Average: </p>
                            <FormField  name="total_average" type="number" placeholder="Total Average"/>
                        </div>
                        


                        </div>


                        <p className="label-text">Result Type: </p>
                        <select value={selectedResultsType} onChange={(e: any) => setSelectedResultsType(e.target.value)} className="select-field-modal">
                            <option value="none">Select Result Type</option>
                            {resultTypes.map((data: any, key: any) => <option key={key} value={data._id}>{data?.name}</option>)}
                        </select>


                        <div className='upload-content-container'>

                          {resultsPdfUrl.length < 2 &&  <div className="form-field-upload content-upload-right">
                            <p className="label-text">Upload Result Pdf: </p>
                            <div className="file-drop-upload" onClick={() => resultsFileRef.current.click()}>
                            {!isUploadingResultsPdf && <FaCloudUploadAlt size={35} color="#FFA500" />}
                                <input ref={resultsFileRef} onChange={uploadAnswerPdf} type="file" style={{width: '100%', height: '100%', display: 'none'}} accept="application/pdf,application/vnd.ms-excel"/>
                                {isUploadingResultsPdf &&  <div style={{width: '80%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
                              <BeatLoader
                                    color="#623d91" 
                                    loading={isUploadingResultsPdf}
                                    cssOverride={override}
                                />
                                <p style={{fontSize: '14px'}}>Uploading File</p>
                            
                                    <ProgressBar bgcolor={'#6a1b9a'} completed={resultsPdfProgress}/>
                                
                              </div>}
                        
                            </div>
                        </div>}

                        {resultsPdfUrl.length > 2 &&
                            <div className="form-field-upload">
                            <p className="label-text" style={{textAlign: 'center'}}>Done</p>
                            </div>
                            }
                        </div>

                        <p className="label-text">Remark (optional) : </p>
                        <textarea rows={8} onChange={(e: any) => setRemark(e.target.value)} value={remark} className="textarea"></textarea>
                        <br />
                        <br />
                    {!loading &&  <Button isOutLined={true} isFullWidth={false} title="SUBMIT RESULT"/>}

                        </Form>
                </form>
                </div>
            </div>
            <div className="modal-shadow" onClick={onClose}>
               
            </div>
        </div>
    );
}

export default AssessmentScoreModal;

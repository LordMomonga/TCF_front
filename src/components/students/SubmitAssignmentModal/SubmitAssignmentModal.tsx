import React, { useState, useEffect } from 'react';
import './SubmitAssignmentModal.css';
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


import { getStorage, ref, uploadBytesResumable, getDownloadURL, deleteObject} from 'firebase/storage';

import { firebaseApp } from '../../../utils/firebaseConfig';

import { createCourseContent } from '../../../services/courseContent';

import { getClasses, deleteClass } from '../../../services/classroom';
import { addPassExamContent } from '../../../services/passExams';
import { getStudentsClasses, getCourseContent, getAcceptedClasses } from '../../../services/student';

import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import { studentGetAssessments, submitAssessmentSolution } from '../../../services/assessment';
import { studentGetAssignments, submitAssignmentSolution } from '../../../services/assignment';

const initialValues= {
    comment: '',
}

const override = {
    marginTop: '20px'
  };



function SubmitAssignmentModal({ onClose, onContentAdded } : any) {
    const [classes, setClasses] = useState([]);
    const [assignments, setAssignments] = useState([]);
    const [error, setError] = useState<any>(null);
    const [selectedClassroom, setSelectedClassroom] = useState<any>('all');
    const [selectedAssignment, setSelectedAssignment] = useState<any>('all');
    const [loading, setLoading] = useState(false);

    // ASSIGNMENT SOLUTION
    const [solutionPdfUrl, setSolutionPdfUrl] = useState('');
    const [solutionPdfProgress,  setSolutionPdfProgress] = useState(0);
    const [isUploadingSolutionPdf, setIsUploadingSolutionPdf] = useState(false);

    // END OF ASSIGNEMTN
    const storage = getStorage(firebaseApp);
    

    // good
    const solutionFileRef: any = useRef(null);

    const validationSchema = Yup.object().shape({
        comment: Yup.string(),
    })

    const handleGetClasses = ()  => {

        getAcceptedClasses().then((res: any) => {
            console.log('RESPONSE GET: ', res);
            if(res.ok) {
                setClasses(res.data.data);
            }
        }).catch(err => {
            console.log('error: ', err);
        })
    }


    const uploadAnswerPdf = (e: any) => {
        setIsUploadingSolutionPdf(true);
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
            setSolutionPdfUrl(downloadURL);
            console.log('PDF  URL: ', downloadURL);
            setIsUploadingSolutionPdf(false);
        });
    })
  }

    const handleGetAssignments = (classId: any)  => {

        studentGetAssignments(classId).then((res: any) => {
            console.log('CONTENT RES', res);
            if(res.ok) {
                setAssignments(res.data.data)
            }
        }).catch(err => {
            console.log('Error Getting Course Contents')
        })
    }

    const handleSetSelectedClass = (classId: any) => {
        console.log('class id: ', classId)
        setSelectedClassroom(classId);
        if(classId == 'all') {
            setSelectedAssignment('all');
            setAssignments([]);
            return;
        }

        handleGetAssignments(classId);
    }

    const handleSubmitSolution = (values: any) => {
     
            let data = {
                ...values,
                classroom_id: selectedClassroom,
                assignment_id: selectedAssignment,
                document_url: solutionPdfUrl,
            }

            // console.log('DATA: ', data);
            
            // return;
            
            if(data.classroom_id == null || data.classroom_id == 'all') {
                setError('You have to select a clasroom for for Solution');
                return;
            }

            if(data.assignment_id == null || data.assignment_id == 'all') {
                setError('You have to select a specific Assignment for Solution');
                return;
            }else {
                console.log('#### CHECK FAILED')
            }
    
            if(solutionPdfUrl.length < 2) {
                setError('Select Solution File');
                return;
            }   

            // console.log("FINAL CONTENT: ",data)

            // call submiting solution endpoint
            
            setLoading(true);
            submitAssignmentSolution(data).then((res: any) => {
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



    useEffect(() => {
        handleGetClasses();
    },[])

    
    return (
        <div>
            <div  className='modal-container student-modal-assignment'>
                <div className='modal-head'>
                    <p className="modal-title">Upload Assignment Solution</p>
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
                    onSubmit={handleSubmitSolution}
                    validationSchema={validationSchema}
                >
    
                        <p className="label-text">Comment (optional): </p>
                        <FormField  name="comment" type="text" placeholder="Any comment ? (optional)"/>


                        <p className="label-text">Select Classroom: </p>
                        <select value={selectedClassroom} onChange={(e: any) => handleSetSelectedClass(e.target.value)} className="select-field-modal">
                            <option value="all">Select Class</option>
                            {classes.map((classData: any, key: any) => <option key={key} value={classData._id}>{classData?.name}</option>)}
                        </select>


                        <p className="label-text">Select Assignment: </p>
                        <select onChange={(e: any) => setSelectedAssignment(e.target.value) } value={selectedAssignment} className="select-field-modal">
                            <option value="all">Select</option>
                            {assignments.map((contentData: any, key: any) => <option key={key} value={contentData?._id}>{contentData?.title}</option>)}
                        </select>


 
                        <div className='upload-content-container'>

                          {solutionPdfUrl.length < 2 &&  <div className="form-field-upload content-upload-right">
                            <p className="label-text">Upload Solution Pdf: </p>
                            <div className="file-drop-upload" onClick={() => solutionFileRef.current.click()}>
                            {!isUploadingSolutionPdf && <FaCloudUploadAlt size={35} color="#FFA500" />}
                                <input ref={solutionFileRef} onChange={uploadAnswerPdf} type="file" style={{width: '100%', height: '100%', display: 'none'}} accept="application/pdf,application/vnd.ms-excel"/>
                                {isUploadingSolutionPdf &&  <div style={{width: '80%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
                              <BeatLoader
                                    color="#623d91" 
                                    loading={isUploadingSolutionPdf}
                                    cssOverride={override}
                                />
                                <p style={{fontSize: '14px'}}>Uploading Content</p>
                            
                                    <ProgressBar bgcolor={'#6a1b9a'} completed={solutionPdfProgress}/>
                                
                              </div>}
                        
                            </div>
                        </div>}

                        {solutionPdfUrl.length > 2 &&
                            <div className="form-field-upload content-upload-right">
                            <p className="label-text" style={{textAlign: 'center'}}>Done</p>
                            </div>
                            }
                        </div>
               
                      {!loading && <Button isOutLined={true} isFullWidth={false} title="SUBMIT SOLUTION"/>}

                        </Form>
                </form>
                </div>
            </div>
            <div className="modal-shadow" onClick={onClose}>
               
            </div>
        </div>
    );
}

export default SubmitAssignmentModal;

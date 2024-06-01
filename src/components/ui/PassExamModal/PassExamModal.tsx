import React, { useState, useEffect } from 'react';
import './PassExamModal.css';
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

import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';

const initialValues= {
    title: '',
    publish_date: ''
}

const override = {
    marginTop: '20px'
  };



function PassExamModal({ onClose, onContentAdded } : any) {
    const [classes, setClasses] = useState([]);
    const [error, setError] = useState<any>(null);
    const [selectedClassroom, setSelectedClassroom] = useState(null);
    const [loading, setLoading] = useState(false);
    // Exam Content

    const [questionPdfUrl, setQuestionPdfUrl] = useState('');
    const [pdfProgress, setPdfProgress] = useState<any>(0);
    const [isUploadingQestionPdf, setIsUploadingQuestionPdf] = useState(false);


    // ASSIGNMENT
    const [isUploadingAnswerVideo,  setIsUploadingAnswerVideo] = useState(false);
    const [answerVideoProgress, setAnswerVideoProgress] = useState(0);
    const [answerVideoUrl, setAnswerVideoUrl] = useState('');

    const [answerPdfUrl, setAnswerPdfUrl] = useState('');
    const [answerPdfProgress,  setAnswerPdfProgress] = useState(0);
    const [isUploadingAnswerPdf, setIsUploadingAnswerPdf] = useState(false);

    const [showAnswerVideoPreview, setShowAnswerVideoPreview] = useState(false);

    // END OF ASSIGNEMTN
    const storage = getStorage(firebaseApp);
    

    // good
    const questionPdfFileRef: any = useRef(null);

    const assignPdfFileRef: any = useRef(null);
    const assignVideoFileRef: any = useRef(null);

    const validationSchema = Yup.object().shape({
        title: Yup.string().required('Exam title is required'),
        publish_date: Yup.string().required('Please enter date to publish content'),
    })

    const handleGetClasses = ()  => {

        getClasses().then((res: any) => {
            console.log('RESPONSE GET: ', res);
            if(res.ok) {
                setClasses(res.data.data);
            }
        }).catch(err => {
            console.log('error: ', err);
        })
    }



      const handleQuestionPdfFileSelect = () => {
        questionPdfFileRef.current.click();
      };

      const uploadQuestionPdf = (e: any) => {
        setIsUploadingQuestionPdf(true);
        const pdfFile: any = e.target.files[0];
        const storageRef = ref(storage, `pdf-content/${Date.now()}-${pdfFile.name}`);
        const uploadTask = uploadBytesResumable(storageRef, pdfFile);

        console.log(e.target.files[0]);   
    
      uploadTask.on('state_changed', (snapshot: any)=>{
          const uploadProgress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

          setPdfProgress(+uploadProgress);

      }, (error: any) => {
          console.log(error);
      },()=> {
           getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                setQuestionPdfUrl(downloadURL);
              console.log('URL', questionPdfUrl);
              console.log('PDF  URL: ', downloadURL);
              setIsUploadingQuestionPdf(false);
          });
      })
    }

    const deleteVideo = () =>  {
        const deleteRef = ref(storage, answerVideoUrl);
        deleteObject(deleteRef).then((res: any) => {
            console.log('RES DELETED', res);
        }).catch((err: any) => {
            console.log('ERROR DELETING');
        })
    }

    const uploadAnswerVideo = (e: any) => {
        setIsUploadingAnswerVideo(true);
        const videoFile: any = e.target.files[0];
        const storageRef = ref(storage, `videos/${Date.now()}-${videoFile.name}`);
        const uploadTask = uploadBytesResumable(storageRef, videoFile);

        console.log(e.target.files[0]);   
    
      uploadTask.on('state_changed', (snapshot: any)=>{
          const uploadProgress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

          setAnswerVideoProgress(+uploadProgress);

      }, (error: any) => {
          console.log(error);
      },()=> {
           getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              setAnswerVideoUrl(downloadURL);
              console.log('URL', answerVideoUrl);
              console.log('VIDEO  URL: ', downloadURL);
              setShowAnswerVideoPreview(true);
              setIsUploadingAnswerVideo(false);
          });
      })
    }

    const uploadAnswerPdf = (e: any) => {
        setIsUploadingAnswerPdf(true);
      const pdfFile: any = e.target.files[0];
      const storageRef = ref(storage, `pdf-content/${Date.now()}-${pdfFile.name}`);
      const uploadTask = uploadBytesResumable(storageRef, pdfFile);

      console.log(e.target.files[0]);   
  
    uploadTask.on('state_changed', (snapshot: any)=>{
        const uploadProgress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

        setAnswerPdfProgress(+uploadProgress);

    }, (error: any) => {
        console.log(error);
    },()=> {
         getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setAnswerPdfUrl(downloadURL);
            console.log('URL', questionPdfUrl);
            console.log('PDF  URL: ', downloadURL);
            setIsUploadingAnswerPdf(false);
        });
    })
  }

    const handleAddCoursePassExamContent = (values: any) => {
        setError(null);

        let data = {
            ...values,
            class_room_id: selectedClassroom,
            questions_file: questionPdfUrl,
            answers_file: answerPdfUrl,
            video_solution_url: answerVideoUrl
        }

        console.log('CONTENT', data);

        if(questionPdfUrl.length < 2) {
            setError('Select a Questions File');
            return;
        }

        if(answerVideoUrl.length < 2 && answerPdfUrl.length < 2) {
            setError('Selecte Video Solutions Or Pdf Solutions');
            return;
        }

        if(data.class_room_id == null || data.class_room_id == 'all') {
            setError('You have to select a clasroom for content');
            return;
        }

        console.log('ALL DATA: ', data);
        // return;
        setLoading(true);
        addPassExamContent(data).then((res: any) => {
            if(res.ok) {
                toast.success(res.data.message, {
                    pauseOnHover: false,
                    closeOnClick: true,
                })
                setLoading(false);
                onContentAdded();
            }else {
                // console.log(res)
                setLoading(false);
                toast.error(res.data.message, {
                    pauseOnHover: false,
                    closeOnClick: true,
                })
            }
        }).catch((err: any) => {   
            console.log('ERROR CREATING: ', err);
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
            <div  className='modal-container add-pass-exam-modal'>
                <div className='modal-head'>
                    <p className="modal-title">Add New Exam Content</p>
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
                    onSubmit={handleAddCoursePassExamContent}
                    validationSchema={validationSchema}
                >
                        <p className="label-text">Title: </p>
                        <FormField  name="title" type="general" placeholder="Exam Title"/>
                        
                        <p className="label-text">Publish Date: </p>
                        <FormField  name="publish_date" type="date" placeholder="Published Date"/>


                        <p className="label-text">Select Classroom: </p>
                        <select onChange={(e: any) => setSelectedClassroom(e.target.value) } className="select-field-modal">
                            <option value="all">All</option>
                            {classes.map((classData: any, key: any) => <option key={key} value={classData._id}>{classData.name}</option>)}
                        </select>

                        <div className='upload-content-container'>
                            

                      {questionPdfUrl.length < 2 &&  <div className="form-field-upload content-upload-right">
                            <p className="label-text">Upload Assesssment Pdf Content: </p>
                            <div className="file-drop-upload" onClick={handleQuestionPdfFileSelect}>
                            {!isUploadingQestionPdf && <FaCloudUploadAlt size={35} color="#FFA500" />}
                                <input ref={questionPdfFileRef} onChange={uploadQuestionPdf} type="file" style={{width: '100%', height: '100%', display: 'none'}} accept="application/pdf,application/vnd.ms-excel"/>
                                {isUploadingQestionPdf &&  <div style={{width: '80%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
                              <BeatLoader
                                    color="#623d91" 
                                    loading={isUploadingQestionPdf}
                                    cssOverride={override}
                                />
                                <p style={{fontSize: '14px'}}>Uploading Content</p>
                            
                                    <ProgressBar bgcolor={'#6a1b9a'} completed={pdfProgress}/>
                                
                              </div>}
                            </div>
                        </div>}

                        {questionPdfUrl.length > 2 &&
                            <div className="form-field-upload content-upload-right">
                            <p className="label-text" style={{textAlign: 'center'}}>Done</p>
                            </div>
                        }
                        </div>
               
                        
                        <div className='upload-content-container'>
                            <div className="content-upload-left">
                            {!showAnswerVideoPreview && <div className="form-field-upload">
                                    <p className="label-text">Upload Assessment Video Answer: </p>
                                    <div className="file-drop-upload" onClick={() => assignVideoFileRef.current.click()}>
                                    {!isUploadingAnswerVideo && <FaCloudUploadAlt size={35} color="#FFA500" />}
                                    {isUploadingAnswerVideo &&  <div style={{width: '80%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
                                    <BeatLoader
                                            color="#623d91" 
                                            loading={isUploadingAnswerVideo}
                                            cssOverride={override}
                                        />
                                        <p style={{fontSize: '14px'}}>Uploading Video</p>
                                    
                                            <ProgressBar bgcolor={'#6a1b9a'} completed={answerVideoProgress}/>
                                        
                                    </div>}
                                    {!isUploadingAnswerVideo && <input ref={assignVideoFileRef} onChange={uploadAnswerVideo} type="file" style={{width: '100%', height: '100%', display: 'none'}} accept="video/mp4,video/x-m4v,video/*"/>}
                                    </div>
                                
                                </div>}
                                {showAnswerVideoPreview && <div className="video-container">
                                    <div className="delete-icon-video">
                                         <FaTrashAlt color='red' />
                                    </div>
                                    <video controls width="100%" height={'100%'} src={answerVideoUrl}></video>
                                </div>}
                            </div>

                          {answerPdfUrl.length < 2 &&  <div className="form-field-upload content-upload-right">
                            <p className="label-text">Upload Assessment Pdf Answer: </p>
                            <div className="file-drop-upload" onClick={() => assignPdfFileRef.current.click()}>
                            {!isUploadingAnswerPdf && <FaCloudUploadAlt size={35} color="#FFA500" />}
                                <input ref={assignPdfFileRef} onChange={uploadAnswerPdf} type="file" style={{width: '100%', height: '100%', display: 'none'}} accept="application/pdf,application/vnd.ms-excel"/>
                                {isUploadingAnswerPdf &&  <div style={{width: '80%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
                              <BeatLoader
                                    color="#623d91" 
                                    loading={isUploadingAnswerPdf}
                                    cssOverride={override}
                                />
                                <p style={{fontSize: '14px'}}>Uploading Content</p>
                            
                                    <ProgressBar bgcolor={'#6a1b9a'} completed={answerPdfProgress}/>
                                
                              </div>}
                        
                            </div>
                        </div>}

                        {answerPdfUrl.length > 2 &&
                            <div className="form-field-upload content-upload-right">
                            <p className="label-text" style={{textAlign: 'center'}}>Done</p>
                            </div>
                            }
                        </div>
               

           
                      

                     {!loading &&  <Button isOutLined={true} isFullWidth={false} title="CREATE CONTENT"/>}

                        </Form>
                </form>
                </div>
            </div>
            <div className="modal-shadow" onClick={onClose}>
               
            </div>
        </div>
    );
}

export default PassExamModal;

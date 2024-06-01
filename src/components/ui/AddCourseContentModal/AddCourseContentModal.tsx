import React, { useState, useEffect } from 'react';
import './AddCourseContentModal.css';
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

import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';

const initialValues= {
    title: '',
    publish_date: '',
    publish_solution_date: ''
}

const override = {
    marginTop: '20px'
  };



function AddCourseContentModal({ onClose, onContentAdded } : any) {
    const [classes, setClasses] = useState([]);
    const [error, setError] = useState<any>(null);
    const [selectedClassroom, setSelectedClassroom] = useState(null);
    const [loading, setLoading] = useState(false);


    // Course Content
    const [isUploadingVideo, setIsUploadingVideo] = useState(false);
    const [videoProgress, setVideoProgress] = useState<any>(0);
    const [videoUrl, setVideoUrl] = useState('');

    const [pdfUrl, setPdfUrl] = useState('');
    const [pdfProgress, setPdfProgress] = useState<any>(0);
    const [isUploadingPdf, setIsUploadingPdf] = useState(false);

    const [showPreview, setShowPreview] = useState(false);
    // End Content

    // ASSIGNMENT
    const [isUploadingAssignmentSolutionFile,  setIsUploadingAssignmentSolutionFile] = useState(false);
    const [followupSolutionProgress, setFollowupSolutionProgress] = useState(0);
    const [followUpSolutionUrl, setFollowupSolutionUrl] = useState('');

    const [followupPdfUrl, setFollowupPdfUrl] = useState('');
    const [followupPdfProgress,  setFollowupPdfProgress] = useState(0);
    const [isUploadingFollowupPdf, setIsUploadingFollowupPdf] = useState(false);

    const [showAssignmentSolutionPreview, setShowAssignmentSolutionPreview] = useState(false);

    // END OF ASSIGNEMTN
    const storage = getStorage(firebaseApp);
    

    const videoFiileRef: any = useRef(null) 
    const pdfFileRef: any = useRef(null);
    const followupPdfFileRef: any = useRef(null);
    const followupSolutionFileRef: any = useRef(null);

    const validationSchema = Yup.object().shape({
        title: Yup.string().required('Class Name is required'),
        publish_date: Yup.string().required('Select date to publish content'),
        publish_solution_date: Yup.string(),
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

    const handleSelectVideo = () => {
        videoFiileRef.current.click();
      };

      const handlePdfFileSelect = () => {
        pdfFileRef.current.click();
      };

      const uploadVideo = (e: any) => {
          setIsUploadingVideo(true);
          const videoFile: any = e.target.files[0];
          const storageRef = ref(storage, `videos/${Date.now()}-${videoFile.name}`);
          const uploadTask = uploadBytesResumable(storageRef, videoFile);

          console.log(e.target.files[0]);   
      
        uploadTask.on('state_changed', (snapshot: any)=>{
            const uploadProgress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

            setVideoProgress(+uploadProgress);

        }, (error: any) => {
            console.log(error);
        },()=> {
             getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                setVideoUrl(downloadURL);
                console.log('URL', videoUrl);
                console.log('VIDEO  URL: ', downloadURL);
                setShowPreview(true);
                setIsUploadingVideo(false);
            });
        })
      }

      const uploadPdf = (e: any) => {
        setIsUploadingPdf(true);
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
              setPdfUrl(downloadURL);
              console.log('URL', pdfUrl);
              console.log('PDF  URL: ', downloadURL);
              setIsUploadingPdf(false);
          });
      })
    }

    const deleteVideo = () =>  {
        const deleteRef = ref(storage, videoUrl);
        deleteObject(deleteRef).then((res: any) => {
            console.log('RES DELETED', res);
        }).catch((err: any) => {
            console.log('ERROR DELETING');
        })
    }

    const uploadAssignmentSolution = (e: any) => {
        setIsUploadingAssignmentSolutionFile(true);
        const videoFile: any = e.target.files[0];
        const storageRef = ref(storage, `videos/${Date.now()}-${videoFile.name}`);
        const uploadTask = uploadBytesResumable(storageRef, videoFile);

        // console.log(e.target.files[0]);   
    
      uploadTask.on('state_changed', (snapshot: any)=>{
          const uploadProgress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

          setFollowupSolutionProgress(+uploadProgress);

      }, (error: any) => {
          console.log(error);
      },()=> {
           getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              setFollowupSolutionUrl(downloadURL);
              console.log('URL', videoUrl);
              console.log('VIDEO  URL: ', downloadURL);
              setShowAssignmentSolutionPreview(true);
              setIsUploadingAssignmentSolutionFile(false);
          });
      })
    }

    const uploadAssignmentPdf = (e: any) => {
        setIsUploadingFollowupPdf(true);
      const pdfFile: any = e.target.files[0];
      const storageRef = ref(storage, `pdf-content/${Date.now()}-${pdfFile.name}`);
      const uploadTask = uploadBytesResumable(storageRef, pdfFile);

    //   console.log(e.target.files[0]);   
  
    uploadTask.on('state_changed', (snapshot: any)=>{
        const uploadProgress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

        setFollowupPdfProgress(+uploadProgress);

    }, (error: any) => {
        console.log(error);
    },()=> {
         getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setFollowupPdfUrl(downloadURL);
            console.log('URL', pdfUrl);
            console.log('PDF  URL: ', downloadURL);
            setIsUploadingFollowupPdf(false);
        });
    })
  }

    const handleAddCourseContent = (values: any) => {
        setError(null);

        let data = {
            ...values,
            classroom_id: selectedClassroom,
            video_url: videoUrl,
            pdf_file_url: pdfUrl,
            followup_file_url: followupPdfUrl,
            followup_solution_url: followUpSolutionUrl,
        }

        // console.log('CONTENT', data);
       
        if(data.video_url.length < 2 && data.pdf_file_url.length < 2) {
            setError('Selecte Video Content Or Pdf Content');
            return;
        }

        if(data.classroom_id == null) {
            setError('You have to select a clasroom for content');
            return;
        }

        if(data.classroom_id == 'all') {
            setError('You have to select a clasroom for content');
            return;
        }

        if(data.followup_solution_url.length > 2) {
            if(data.publish_solution_date.length < 2) {
                setError('You have to select a date to publish solution');
                return;
            }
        }

        setLoading(true)

        createCourseContent(data).then((res: any) => {
            if(res.ok) {
                toast.success(res.data.message, {
                    pauseOnHover: false,
                    closeOnClick: true,
                })
                setLoading(false)
                onContentAdded();
            }else {
                // console.log(res)
                setLoading(false)
                setError(res.data.message);
                toast.error(res.data.message, {
                    pauseOnHover: false,
                    closeOnClick: true,
                })
            }
        }).catch(err => {   
            console.log('ERROR CREATING: ', err);
            setLoading(false)
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
                    <p className="modal-title">Add New Course Content</p>
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
                    onSubmit={handleAddCourseContent}
                    validationSchema={validationSchema}
                >
                        <p className="label-text">Title: </p>
                        <FormField  name="title" type="general" placeholder="Content Title"/>
                        
                        {/* <p className="label-text">Description (optional): </p>
                        <FormField  name="description" type="general" placeholder="Short Description"/>

                        <p className="label-text">Expectation (optional): </p>
                        <FormField  name="expectation" type="general" placeholder="Expectation"/> */}

                        <p className="label-text">Publish Date: </p>
                        <FormField  name="publish_date" type="date" placeholder="Published Date"/>

                        <p className="label-text">Select Classroom: </p>
                        <select onChange={(e: any) => setSelectedClassroom(e.target.value) } className="select-field-modal">
                            <option value="all">All</option>
                            {classes.map((classData: any, key: any) => <option key={key} value={classData._id}>{classData.name}</option>)}
                        </select>

                        <div className='upload-content-container'>
                            <div className="content-upload-left">
                            {!showPreview && <div className="form-field-upload">
                                    <p className="label-text">Upload Video Content: </p>
                                    <div className="file-drop-upload" onClick={handleSelectVideo}>
                                    {!isUploadingVideo && <FaCloudUploadAlt size={35} color="#FFA500" />}
                                    {isUploadingVideo &&  <div style={{width: '80%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
                                    <BeatLoader
                                            color="#623d91" 
                                            loading={isUploadingVideo}
                                            cssOverride={override}
                                        />
                                        <p style={{fontSize: '14px'}}>Uploading Video</p>
                                    
                                            <ProgressBar bgcolor={'#6a1b9a'} completed={videoProgress}/>
                                        
                                    </div>}
                                    {!isUploadingVideo && <input ref={videoFiileRef} onChange={uploadVideo} type="file" style={{width: '100%', height: '100%', display: 'none'}} accept="video/mp4,video/x-m4v,video/*"/>}
                                    </div>
                                
                                </div>}
                                {showPreview && <div className="video-container">
                                    <Tippy content="Delete Video"  animation="fade">
                                    <div className="delete-icon-video">
                                        <FaTrashAlt color='red' />
                                    </div>
                                    </Tippy>
                                    <video controls  width="100%" height={'100%'} src={videoUrl}></video>
                                </div>}
                            </div>

                      {pdfUrl.length < 2 &&  <div className="form-field-upload content-upload-right">
                            <p className="label-text">Upload Pdf Content: </p>
                            <div className="file-drop-upload" onClick={handlePdfFileSelect}>
                            {!isUploadingPdf && <FaCloudUploadAlt size={35} color="#FFA500" />}
                                <input ref={pdfFileRef} onChange={uploadPdf} type="file" style={{width: '100%', height: '100%', display: 'none'}} accept="application/pdf,application/vnd.ms-excel"/>
                                {isUploadingPdf &&  <div style={{width: '80%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
                              <BeatLoader
                                    color="#623d91" 
                                    loading={isUploadingPdf}
                                    cssOverride={override}
                                />
                                <p style={{fontSize: '14px'}}>Uploading Content</p>
                            
                                    <ProgressBar bgcolor={'#6a1b9a'} completed={pdfProgress}/>
                                
                              </div>}
                            </div>
                        </div>}

                        {pdfUrl.length > 2 &&
                            <div className="form-field-upload content-upload-right">
                            <p className="label-text" style={{textAlign: 'center'}}>Done</p>
                            </div>
                        }
                        </div>
                        
                  
                        
                        <div className='upload-content-container'>
                        {followupPdfUrl.length < 2 &&  <div className="form-field-upload content-upload-left ">
                            <p className="label-text">Upload Follow-up Pdf Content: </p>
                            <div className="file-drop-upload" onClick={() => followupPdfFileRef.current.click()}>
                            {!isUploadingFollowupPdf && <FaCloudUploadAlt size={35} color="#FFA500" />}
                                <input ref={followupPdfFileRef} onChange={uploadAssignmentPdf} type="file" style={{width: '100%', height: '100%', display: 'none'}} accept="application/pdf,application/vnd.ms-excel"/>
                                {isUploadingFollowupPdf &&  <div style={{width: '80%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
                              <BeatLoader
                                    color="#623d91" 
                                    loading={isUploadingFollowupPdf}
                                    cssOverride={override}
                                />
                                <p style={{fontSize: '14px'}}>Uploading Content</p>
                            
                                    <ProgressBar bgcolor={'#6a1b9a'} completed={followupPdfProgress}/>
                                
                              </div>}
                        
                            </div>
                        </div>}
                        {followupPdfUrl.length > 2 &&
                            <div className="form-field-upload content-upload-right">
                            <p className="label-text" style={{textAlign: 'center'}}>Done</p>
                            </div>
                            }


                            <div className="content-upload-right">
                            {followUpSolutionUrl.length < 2 && <div className="form-field-upload">
                                    <p className="label-text">Upload Follow-up Solution Content: </p>
                                    <div className="file-drop-upload" onClick={() => followupSolutionFileRef.current.click()}>
                                    {!isUploadingAssignmentSolutionFile && <FaCloudUploadAlt size={35} color="#FFA500" />}
                                    {isUploadingAssignmentSolutionFile &&  <div style={{width: '80%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
                                    <BeatLoader
                                            color="#623d91" 
                                            loading={isUploadingAssignmentSolutionFile}
                                            cssOverride={override}
                                        />
                                        <p style={{fontSize: '14px'}}>Uploading Solution</p>
                                    
                                            <ProgressBar bgcolor={'#6a1b9a'} completed={followupSolutionProgress}/>
                                        
                                    </div>}
                                    {!isUploadingAssignmentSolutionFile && <input ref={followupSolutionFileRef} onChange={uploadAssignmentSolution} type="file" style={{width: '100%', height: '100%', display: 'none'}} accept="application/pdf,application/vnd.ms-excel,video/mp4,video/x-m4v,video/*"/>}
                                    </div>
                                
                                </div>}
                                {followUpSolutionUrl.length > 2 &&
                                    <div className="form-field-upload content-upload-right">
                                    <p className="label-text" style={{textAlign: 'center'}}>Done</p>
                                    </div>
                                }
                            </div>

                         
                        </div>
               

                        <p className="label-text">Follow-up  Solution Pulish Date: </p>
                        <FormField  name="publish_solution_date" type="date" placeholder="Followup Solution Pulish Date"/>

                      

                     {!loading &&   <Button isOutLined={true} isFullWidth={false} title="CREATE CONTENT"/>}

                        </Form>
                </form>
                </div>
            </div>
            <div className="modal-shadow" onClick={onClose}>
               
            </div>
        </div>
    );
}

export default AddCourseContentModal;
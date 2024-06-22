import React, { useState, useEffect } from 'react';
import './UploadAssessmentSolutionModal.css';
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
import { studentGetAssessments, submitAssessmentSolution, createElement } from '../../../services/assessment';
import { Divider } from '@chakra-ui/react';

const initialValues= {
    question: '',
    solution1:'',
    solution2:'',
    solution3:"",
    solution4:'',
}

const override = {
    marginTop: '20px'
  };
  


function UploadAssessmentSolutionModal({ onClose, onContentAdded } : any) {
    const [classes, setClasses] = useState([]);
    const [assessments, setAssessments] = useState([]);
    const [question, setQuestion] = useState('');
    const [resp, setResp] = useState('');
    const [level, setLevel] = useState("");
    const [items, setItems] = useState([]);
    const [error, setError] = useState<any>(null);
    const [selectedClassroom, setSelectedClassroom] = useState<any>('all');
    const [selectedAssessment, setSelectedAssessment] = useState<any>('all');
    const [loading, setLoading] = useState(false);
    const [image, setImage] = useState<File | null>(null);
    const [imageUrl, setImageUrl] = useState<string>('');
    // ASSIGNMENT SOLUTION
    const [assessmentVideoUrl, setAssessmentVideoUrl] = useState('');
    const [audioUrl, setAudioUrl] = useState('')
    const [solutionPdfUrl, setSolutionPdfUrl] = useState('');
    const [solutionPdfProgress,  setSolutionPdfProgress] = useState(0);
    const [audioProgress, setAudioProgress] = useState(0)
    const [  isUploadingSolutionPdf, setIsUploadingSolutionPdf] = useState(false);
    const [  isUploadingAudio, setIsUploadingAudio] = useState(false);

    const [selectTestType, setSelectTestType] = useState("")
    const [selectLevel, setSelectLevel] = useState("")
    const [showOrale,setShowOrale] =useState(false)
    const [showEcrite,setShowEcrite] =useState(false)
 
    // END OF ASSIGNEMTN
    const storage = getStorage(firebaseApp);
    

    // good
    const solutionFileRef: any = useRef(null);
    const solutionAudioRef: any = useRef(null);
    const validationSchema = Yup.object().shape({
        question: Yup.string(),
        solution1: Yup.string(),
        solution2: Yup.string(),
        solution3: Yup.string(),
        solution4: Yup.string(),
    });

        const handleUploadAudio = (e:any) => {
            setIsUploadingAudio(true);
            const audioFile: any = e.target.files[0];
             const storageRef = ref(storage, `audio-content/${Date.now()}-${audioFile.name}`);
            const uploadTask = uploadBytesResumable(storageRef, audioFile);

            uploadTask.on('state_changed', 
                (snapshot:any) =>{
                    const uploadProgress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    setAudioProgress(+uploadProgress)            
                }, (error: any) => {
                    console.log(error);
                },()=>{
                     getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    setAudioUrl(downloadURL);
                   console.log('audio  URL: ', downloadURL);
                   setIsUploadingAudio(false);
               });
                }
                
            )

        }

      const handleUpload = (e:any) => {

        setIsUploadingSolutionPdf(true);
        const imagefile: any = e.target.files[0];

        const storageRef = ref(storage, `image-content/${Date.now()}-${imagefile.name}`);
        const uploadTask = uploadBytesResumable(storageRef, imagefile);
        console.log(uploadTask)
        console.log(e.target.files[0]);   
        uploadTask.on('state_changed',
            (snapshot: any) =>{
                const uploadProgress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setSolutionPdfProgress(+uploadProgress);

            }, (error: any) => {
                console.log(error);
            },()=> {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    setImageUrl(downloadURL);
                   console.log('image  URL: ', downloadURL, imageUrl);
                   setIsUploadingSolutionPdf(false);
               });
           }
        )

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
  const handleGetTestType = () => {

  }

    const handleGetAssessments = (classId: any)  => {

        studentGetAssessments(classId).then((res: any) => {
            console.log('CONTENT RES', res);
            if(res.ok) {
                setAssessments(res.data.data)
            }
        }).catch(err => {
            console.log('Error Getting Course Contents')
        })
    }

    const handleSetSelectedClass = (classId: any) => {
        console.log('class id: ', classId)
        setSelectedClassroom(classId);
        if(classId == 'all') {
            setSelectedAssessment('all');
            setAssessments([]);
            return;
        }

        handleGetAssessments(classId);
    }

    const handleSubmitSolution = (values: any) => {
     
            let data = {
                ...values,
                level: selectLevel,
                response: resp,
                typeElement: selectTestType,
                imageUrl: imageUrl,
                audioUrl: audioUrl
                
            }

            // console.log('DATA: ', data);
            
            // return;
            
            if(data.level == null || data.level == 'all') {
                setError('vous devez selectionner un niveau pour cet element');
                return;
            }

            if(data.typeElement == null || data.typeElement == 'all') {
                setError('vous devez selectionner le type de cet element');
                return;
            }else {
                console.log('#### CHECK FAILED')
            }
    
            if(imageUrl.length < 2) {
                setError('Select Solution File');
                return;
            }   

            // console.log("FINAL CONTENT: ",data)

            // call submiting solution endpoint
            setLoading(true);
            createElement(data).then((res: any) => {
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
                console.log('ERROR SUBMITING: ', err);
                setLoading(false);
                toast.error("ERROR", {
                    pauseOnHover: false,
                    closeOnClick: true,
                })
            })
    }



    useEffect(() => {
    },[])

    
    return (
        <div>
            <div  className='modal-container student-modal-assignment'>
                <div className='modal-head'>
                    <p className="modal-title">Upload Assessment Solution</p>
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
                        <p className="label-text">Type de test: </p>
                        <select onChange={(e: any) => setSelectTestType(e.target.value) } value = {selectTestType} className="select-field-modal">
                            <option value="all">Select</option>
                            <option value="comprehension orale">COMPREHENSION ORALE</option>
                            <option value="comprehension ecrite">COMPREHENSION ECRITE</option>
                         </select>
                        <p className="label-text">Questions (Obligatoire): </p>
                        <FormField  name="question" type="text" placeholder=" question ? (obligatoire)"/>


                        <p className="label-text">Entrer les questions: </p>
                        <div className="flex gap-5 justify-between">
                        <FormField  name="solution1" type="text" placeholder="question 1) ? "/>
                        <FormField  name="solution2" type="text" placeholder="solution 2)? "/>
             </div>
                        <div className="flex gap-5 justiy7">
                        <FormField  name="solution3" type="text" placeholder="solution 3) ? "/>
                        <FormField  name="solution4" type="text" placeholder="solution 4) ? "/>

                        </div>
                           

                        <div className="flex gap-5 justify-between">

                        <p className="label-text">Select Assessment: </p>
                        <select onChange={(e: any) => setSelectLevel(e.target.value) } value={selectLevel} className="select-field-modal">
                            <option value="all">Select</option>
                            <option value="C1">C1</option>
                            <option value="C2">C2</option>
                            <option value="B1">B1</option>
                            <option value="B2">B2</option>
                            <option value="A1">B1</option>
                            <option value="A2">B2</option>


                        </select>
                        <p className="label-text">Entrer la solution Réel: </p>
            <select onChange={(e: any) => setResp(e.target.value) } value={resp} className="select-field-modal">
                            <option value="all">Select</option>
                            <option value="1">solution 1</option>
                            <option value="2">solution 2</option>
                            <option value="3">solution 3</option>
                            <option value="4">solution 4</option>



                        </select>
                           
                        </div>
                       
 {selectTestType == "comprehension ecrite" &&  <div className='upload-content-container'>
    {imageUrl.length < 2 &&  <div className="form-field-upload content-upload-right">
   
   <p className="label-text">Uploader l'élement image : </p>
   <div className="file-drop-upload" onClick={() => solutionFileRef.current.click()}>
   {!isUploadingSolutionPdf && <FaCloudUploadAlt size={35} color="#FFA500" />}
       <input ref={solutionFileRef} onChange={handleUpload} type="file" style={{width: '100%', height: '100%', display: 'none'}} accept="application/pdf,application/vnd.ms-excel, image/*"/>
       {isUploadingSolutionPdf &&  <div style={{width: '80%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
     <BeatLoader
           color="#623d91" 
           loading={isUploadingSolutionPdf}
           cssOverride={override}
       />
       <p style={{fontSize: '14px'}} >Uploading Content</p>
   
           <ProgressBar bgcolor={'#6a1b9a'} completed={solutionPdfProgress}/>
       
     </div>}
 
   </div>
 </div>}
 {imageUrl.length > 2 &&
  <div className="form-field-upload content-upload-right">
  <p className="label-text" style={{textAlign: 'center'}}>Done</p>
  </div>
  }
 
    </div>}

{selectTestType == "comprehension orale" &&  <div className='upload-content-container'>
    {audioUrl.length < 2 && <div className="form-field-upload content-upload-right">
        <p className='label'>Uploader l'élement audio: </p>
     <div className='file-drop-upload' onClick={()=> solutionAudioRef.current.click()} >
        {!isUploadingAudio && <FaCloudUploadAlt size={35} color="#FFA500" />}
        <input ref={solutionAudioRef} accept="audio/*" onChange={handleUploadAudio} type="file" style={{width: '100%', height: '100%', display: 'none'}}  />
        {isUploadingAudio && <div style={{width: '80%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
          <BeatLoader
          color="#623d91" 
          loading={isUploadingAudio}
          cssOverride={override}
      />
      <p style={{fontSize: '14px'}}  > Uploading Audio </p>

      <ProgressBar bgcolor={'#6a1b9a'} completed={audioProgress}/>

          </div>}
     </div>
        </div>}
        {audioUrl.length > 2 &&
  <div className="form-field-upload content-upload-right">
  <p className="label-text" style={{textAlign: 'center'}}>Done</p>
  </div> }
    
{imageUrl.length < 2 &&  <div className="form-field-upload content-upload-right">
   
  <p className="label-text">Uploader l'élement image : </p>
  <div className="file-drop-upload" onClick={() => solutionFileRef.current.click()}>
  {!isUploadingSolutionPdf && <FaCloudUploadAlt size={35} color="#FFA500" />}
      <input ref={solutionFileRef} onChange={handleUpload} type="file" style={{width: '100%', height: '100%', display: 'none'}} accept="application/pdf,application/vnd.ms-excel, image/*"/>
      {isUploadingSolutionPdf &&  <div style={{width: '80%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
    <BeatLoader
          color="#623d91" 
          loading={isUploadingSolutionPdf}
          cssOverride={override}
      />
      <p style={{fontSize: '14px'}} >Uploading Content</p>
  
          <ProgressBar bgcolor={'#6a1b9a'} completed={solutionPdfProgress}/>
      
    </div>}

  </div>
</div>}

{imageUrl.length > 2 &&
  <div className="form-field-upload content-upload-right">
  <p className="label-text" style={{textAlign: 'center'}}>Done</p>
  </div>
  }
</div>
}
                       
                     {!loading &&  <Button isOutLined={true} isFullWidth={false} title="SUBMIT SOLUTION"/>}

                        </Form>
                </form>
                </div>
            </div>
            <div className="modal-shadow" onClick={onClose}>
               
            </div>
        </div>
    );
}

export default UploadAssessmentSolutionModal;

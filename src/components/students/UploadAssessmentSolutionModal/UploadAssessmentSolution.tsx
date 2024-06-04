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

const initialValues= {
    question: '',
    sol1:'',
    sol2:'',
    sol3:"",
    sol4:'',
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

    // ASSIGNMENT SOLUTION
    const [assessmentVideoUrl, setAssessmentVideoUrl] = useState('');

    const [solutionPdfUrl, setSolutionPdfUrl] = useState('');
    const [solutionPdfProgress,  setSolutionPdfProgress] = useState(0);
    const [  isUploadingSolutionPdf, setIsUploadingSolutionPdf] = useState(false);
    const [selectTestType, setSelectTestType] = useState("")
    const [selectLevel, setSelectLevel] = useState("")
    const [showOrale,setShowOrale] =useState(false)
    const [showEcrite,setShowEcrite] =useState(false)
 
    // END OF ASSIGNEMTN
    const storage = getStorage(firebaseApp);
    

    // good
    const solutionFileRef: any = useRef(null);

    const validationSchema = Yup.object().shape({
        question: Yup.string().required('obligatoire'),
        sol1: Yup.string().required(' obligatoire'),
        sol2: Yup.string().required(' obligatoire'),
        sol3: Yup.string().required('obligatoire'),
        sol4: Yup.string().required(' obligatoire'),
        response: Yup.string().required(' obligatoire'),
    });

   


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
                level: selectLevel,
                question: values.question,
                solutions: [values.sol1, values.sol2, values.sol3, values.sol4],
                response: resp,
                type: selectTestType,
            }

            // console.log('DATA: ', data);
            
            // return;
            
            if(data.level == null || data.level == 'all') {
                setError('vous devez selectionner un niveau pour cet element');
                return;
            }

            if(data.type == null || data.type == 'all') {
                setError('vous devez selectionner le type de cet element');
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
                            <option value="CO">COMPREHENSION ORALE</option>
                            <option value="CE">COMPREHENSION ECRITE</option>
                         </select>
                        <p className="label-text">Questions (Obligatoire): </p>
                        <FormField  name="question" type="text" placeholder=" question ? (obligatoire)"/>


                        <p className="label-text">Entrer les questions: </p>
                        <div className="flex gap-5 justify-between">
                        <FormField  name="sol1" type="text" placeholder="question 1) ? "/>
                        <FormField  name="sol2" type="text" placeholder="solution 2)? "/>
             </div>
                        <div className="flex gap-5 justiy7">
                        <FormField  name="sol3" type="text" placeholder="solution 3) ? "/>
                        <FormField  name="sol4" type="text" placeholder="solution 4) ? "/>

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
                       
 

{selectTestType == "CO" &&  <div className='upload-content-container'>

{solutionPdfUrl.length < 2 &&  <div className="form-field-upload content-upload-right">
  <p className="label-text">Upload image element content: </p>
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

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
import { getPublicSpecialities } from '../../../services/public';


import { getStorage, ref, uploadBytesResumable, getDownloadURL, deleteObject} from 'firebase/storage';

import { firebaseApp } from '../../../utils/firebaseConfig';

import { createCourseContent } from '../../../services/courseContent';

import { getClasses, deleteClass } from '../../../services/classroom';
import { addPassExamContent } from '../../../services/passExams';
import { getStudentsClasses, getCourseContent, getAcceptedClasses } from '../../../services/student';

import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import { studentGetAssessments, CreateTestELement } from '../../../services/assessment';
import { RxValue } from 'react-icons/rx';

const initialValues= {
    title: '',
    contenu:''
   
}

const override = {
    marginTop: '20px'
  };



function AddExpressionOrale({ onClose, onContentAdded } : any) {
    const [classes, setClasses] = useState([]);
    const [assessments, setAssessments] = useState([]);
    const [question, setQuestion] = useState('');
    const [resp, setResp] = useState('');
    const [level, setLevel] = useState("");
    const [items, setItems] = useState([]);
    const [error, setError] = useState<any>(null);
    const [contenu, setContenu] = useState('')
    const [selectedClassroom, setSelectedClassroom] = useState<any>('all');
    const [selectedAssessment, setSelectedAssessment] = useState<any>('all');
    const [loading, setLoading] = useState(false);

    // ASSIGNMENT SOLUTION
    const [assessmentVideoUrl, setAssessmentVideoUrl] = useState('');

    const [solutionPdfUrl, setSolutionPdfUrl] = useState('');
    const [solutionPdfProgress,  setSolutionPdfProgress] = useState(0);
    const [  isUploadingSolutionPdf, setIsUploadingSolutionPdf] = useState(false);
    const [selectTestType, setSelectTestType] = useState("")
    const [selectTest, setSelectTest] = useState("")

    const [selectLevel, setSelectLevel] = useState("")
    const [showOrale,setShowOrale] =useState(false)
    const [showEcrite,setShowEcrite] =useState(false)

    
    const [specialities, setSpecialities] = useState([]);
    const [selectedCode, setSelectedCode] = useState('none');
 
    // END OF ASSIGNEMTN
    const storage = getStorage(firebaseApp);
    

    // good
    const solutionFileRef: any = useRef(null);

    const validationSchema = Yup.object().shape({
        title: Yup.string(),
      
        contenu: Yup.string(),
        document1: Yup.string(),
        document2: Yup.string()
        
    });

    const handleGetSpecialities = () => {
        getPublicSpecialities().then((res: any) => {
          setSpecialities(res.data.data);
        }).catch((error: any) => {
          console.log('ERROR');
        })
      }

   


   
    

    const handleSubmitSolution = (values: any) => {
     
            let data = {
                ...values,
                TypeElement: selectTest,
                NumeroSujet: selectTestType,
                specialitie: selectedCode

               
            }

            // console.log('DATA: ', data);
            
            // return;
            
            if(data.TypeElement == null || data.TypeElement == 'all') {
                setError(' selectionnez le type de test que vous passez');
                return;
            }

            if(data.NumeroSujet == null || data.NumeroSujet == 'all') {
                setError('Selectionnez le type de sujet');
                return;
            }else {
                console.log('#### CHECK FAILED')
            }
            console.log(data)
             

            setLoading(true);
            CreateTestELement(data).then((res: any) => {
                if(res.ok) {
                    toast.success(res.data.message, {
                        pauseOnHover: false,
                        closeOnClick: true,
                    })
                    setSelectTest('')
                    setSelectTestType('')
                    setLevel('');
                    setContenu('');
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
                    setSelectTest('')
                    setSelectTestType('')
                    setLevel('');
                    setContenu('');
                }
            }).catch((err: any) => {   
                console.log('ERROR Adding: ', err);
                setLoading(false);
                toast.error("ERROR", {
                    pauseOnHover: false,
                    closeOnClick: true,
                })
            })
    }


    useEffect(() => {
        handleGetSpecialities();
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
                    <p className='label-text'>Entrer le type de sujet</p>
                    <select className="select-field-modal" onChange={(e: any) =>setSelectTest(e.target.value)}  value={selectTest} >
                        <option value="all"></option>
                        <option value="expression ecrite">Expression ecrite</option>
                        <option value="expression orale">Expression Orale</option>
                    </select>

                    <p className="label-text">Test d'évaluation: </p>
                         <select name="" id=""  className="select-field px-3 mb-2" onChange={(e: any) => setSelectedCode(e.target.value) } value={selectedCode} >
                                <option value="all"  className='text-white'>Select évaluation</option>
                               {specialities?.map((sp: any) => <option className='text-white' value={sp._id}>{sp?.name} </option>)
                               
                               }
                            </select>

                     <p className="label-text">Entrer le niveau  du sujet: </p>
                        <select onChange={(e: any) => setSelectTestType(e.target.value) } value = {selectTestType} className="select-field-modal">
                            <option value="all">Select</option>
                            <option value="sujet1">Sujet 1</option>
                            <option value="sujet2">Sujet 2</option>
                            <option value="sujet3">Sujet 3</option>

                         </select>
                      
                        <p className="label-text">Entrer le titre du sujet  </p>
                        <FormField  name="titre"   type="text" placeholder="entrer le titre du sujet"/>

                    
                        <p className="label-text">Entrer le contenu du sujet  </p>
                        <FormField  name="contenu"  type="text" placeholder="entrer le contenu du sujet ? "/>
              
                        {(selectTestType === "sujet3" && selectTest === "expression ecrite" ) && (
                            <>
                                <p className="label-text">Entrer le document 1</p>
                                <FormField name="document1" type="text" placeholder="entrer le document 1" />

                                <p className="label-text">Entrer le document 2</p>
                                <FormField name="document2" type="text" placeholder="entrer le document 2" />
                            </>
)}  

                        
 


                       
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

export default AddExpressionOrale;

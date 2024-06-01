import React, { useState, useEffect } from 'react';
import './UploadTimeTableModal.css';
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


import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

import { firebaseApp } from '../../../utils/firebaseConfig';

import { getSchoolSpecialitis } from '../../../services/specialities';
import { schoolCreateTimetable } from '../../../services/school';

const initialValues= {
    name: '',
    active_from: '',
    active_to: ''
}

const override = {
    marginTop: '20px'
  };



function UploadTimeTableModal({ onClose, onContentAdded } : any) {
    const [specialities, setSpecialities] = useState([]);
    const [error, setError] = useState<any>(null);
    const [selectedSpecialities, setSelectedSpecialities] = useState<any>([]);
    const [loading, setLoading] = useState(false);

    // TIMETABLE
    const [timetablePdfUrl, setTimetablePdfUrl] = useState('');
    const [timetablePdfProgress,  setTimetablePdfProgress] = useState(0);
    const [isUploadingTimetablePdf, setIsUploadingTimetablePdf] = useState(false);

    // END OF ASSIGNEMTN
    const storage = getStorage(firebaseApp);
    

    // good
    const timetableFileRef: any = useRef(null);

    const validationSchema = Yup.object().shape({
        name: Yup.string().required('Timetable title required'),
        active_from: Yup.string(),
        active_to: Yup.string()
    })

    const handleGetSpecialities = ()  => {

        getSchoolSpecialitis().then((res: any) => {
            console.log('RESPONSE GET: ', res);
            if(res.ok) {
                setSpecialities(res.data.data);
            }
        }).catch(err => {
            console.log('error: ', err);
        })
    }


    const uploadTimetablePdf = (e: any) => {
        setIsUploadingTimetablePdf(true);
      const pdfFile: any = e.target.files[0];
      const storageRef = ref(storage, `pdf-content/${Date.now()}-${pdfFile.name}`);
      const uploadTask = uploadBytesResumable(storageRef, pdfFile);

      console.log(e.target.files[0]);   
  
    uploadTask.on('state_changed', (snapshot: any)=>{
        const uploadProgress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

        setTimetablePdfProgress(+uploadProgress);

    }, (error: any) => {
        console.log(error);
    },()=> {
         getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setTimetablePdfUrl(downloadURL);
            console.log('PDF  URL: ', downloadURL);
            setIsUploadingTimetablePdf(false);
        });
    })
  }

    const handleAddSpeciality = (specialityId: any) => {
        // alert(`speciality: ${specialityId}`);
        let selected: any = [...selectedSpecialities];

        if(selected.indexOf(specialityId) >= 0) {
            let index = selected.indexOf(specialityId);
            selected.splice(index,1);
        
        }else {
            selected.push(specialityId);
       
        }
        setSelectedSpecialities(selected);
    }

    const handleSubmitTimetable = (values: any) => {
        // console.log(values);
        // console.log('SELECTED SPECIALITIES: ', selectedSpecialities);
        setError(null);

        if(selectedSpecialities.length < 1) {
            setError('You must select atleast one speciality')
            return;
        }

        if(timetablePdfUrl.length < 2) {
            setError('You must select a timetable file')
            return;
        }

        if(values.name.length < 2) {
            setError('You must enter a title for timetable')
            return;
        }

        if(values.active_from.length < 2) {
            setError('Select the active from date')
            return;
        }

        if(values.active_to.length < 2) {
            setError('Select the active to date')
            return;
        }

        let data = {
            ...values,
            file_url: timetablePdfUrl,
            specialities: selectedSpecialities
        }

            // console.log("FINAL CONTENT: ",data)
            setLoading(true);
            schoolCreateTimetable(data).then((res: any) => {
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
        handleGetSpecialities();
    },[])

    
    return (
        <div>
            <div  className='modal-container teacher-modal-timetable'>
                <div className='modal-head'>
                    <p className="modal-title">Upload Time Table</p>
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
                    onSubmit={handleSubmitTimetable}
                    validationSchema={validationSchema}
                >
    
                        <p className="label-text">Title </p>
                        <FormField  name="name" type="text" placeholder="Timetable title "/>


                        <p className="label-text">Select Specialities: </p>
                        <div className="specialities-container">
                           {specialities.map((sp: any) => <div className="check-container">
                                <p className="speciality-title">{sp?.name}</p>
                                <input type="checkbox" onChange={(e: any) => handleAddSpeciality(e.target.value)} value={sp?._id} name="" id="" />
                            </div>)}
           
                        </div>
                        {/* <br /> */}

                        <div className="timetable-dates">
                            <div className="from">
                                <label>Active From</label>
                                <FormField  name="active_from" type="date" placeholder=""/>
                            </div>
                            <div className="to">
                                <label>Active To</label>
                                <FormField  name="active_to" type="date" placeholder=""/>
                            </div>
                        </div>
 
                        <div className='upload-content-container'>

                          {timetablePdfUrl.length < 2 &&  <div className="form-field-upload content-upload-right">
                            <p className="label-text">Upload Timetable Pdf: </p>
                            <div className="file-drop-upload" onClick={() => timetableFileRef.current.click()}>
                            {!isUploadingTimetablePdf && <FaCloudUploadAlt size={35} color="#FFA500" />}
                                <input ref={timetableFileRef} onChange={uploadTimetablePdf} type="file" style={{width: '100%', height: '100%', display: 'none'}} accept="application/pdf,application/vnd.ms-excel"/>
                                {isUploadingTimetablePdf &&  <div style={{width: '80%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
                              <BeatLoader
                                    color="#623d91" 
                                    loading={isUploadingTimetablePdf}
                                    cssOverride={override}
                                />
                                <p style={{fontSize: '14px'}}>Uploading Timetable</p>
                            
                                    <ProgressBar bgcolor={'#6a1b9a'} completed={timetablePdfProgress}/>
                                
                              </div>}
                        
                            </div>
                        </div>}

                        {timetablePdfUrl.length > 2 &&
                            <div className="form-field-upload content-upload-right">
                            <p className="label-text" style={{textAlign: 'center'}}>Done</p>
                            </div>
                            }
                        </div>
               
                   {!loading && <Button isOutLined={true} isFullWidth={false} title="SUBMIT TIMETABLE"/>}

                        </Form>
                </form>
                </div>
            </div>
            <div className="modal-shadow" onClick={onClose}>
               
            </div>
        </div>
    );
}

export default UploadTimeTableModal;

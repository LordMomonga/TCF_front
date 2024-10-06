import React, { useState, useEffect } from 'react';
import './JoinClassModal.css';
import * as Yup from 'yup';
import Form from '../../form/components/Form/Form';
import FormField from '../../form/components/FormField/FormField';
import Button from '../../form/components/Button/Button';
import ErrorMessage from '../../form/components/ErrorMessage/ErrorMessage';
import { ImCancelCircle } from 'react-icons/im';
import BeatLoader from "react-spinners/BeatLoader";
import { getPublicSpecialities } from '../../../services/public';
import { toast } from 'react-toastify';
import Tippy from '@tippyjs/react';
import { joinClass, joinSchool } from '../../../services/student';
import { MdContentCopy } from 'react-icons/md';
import { BiInfoCircle } from 'react-icons/bi';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
const initialValues= {
    speciality_code: ''
}

const override = {
    marginTop: '20px'
  };



function JoinClassModal({ onClose, onClassAdded } : any) {
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [specialities, setSpecialities] = useState([]);
    const [selectedSchool, setSelectedSchooll] = useState('all');
    const [selectedSchoolCode, setSchoolSelectedCode] = useState('none');
    const [selectedSpecialities, setSelectedSpecialities] = useState('')
    const [selectedinformation, setSelectedinformation] = useState("")
    const [open, setOpen] = useState(false);
    const validationSchema = Yup.object().shape({
        speciality_code: Yup.string().required('Speciality code is required'),
    })
        const handleOpen = () => {
        setOpen(!open)
        }

    const handleSelectedSchool = (_id: any) => {
     
        let foundMatch = false;
  
        specialities.map((data: any) => {
          console.log(data);
          if(data._id == _id) {
            setSchoolSelectedCode(data.code);
            setSelectedinformation(data.info)
            foundMatch = true;
          }
        })
  
  
        if(!foundMatch) {
          setSchoolSelectedCode('none');
        }
  
        setSelectedSchooll(_id);
  
      }

      const copyToClipBoard = (data: any) => {
        navigator.clipboard.writeText(`${data}`);
                                                            
        toast.success("Copied To Clipboard", {
            pauseOnHover: false,
            closeOnClick: true,
        })
    }
  
      const handleGetSpecialities = () => {
        getPublicSpecialities().then((res: any) => {
          setSpecialities(res.data.data);
        }).catch((error: any) => {
          console.log('ERROR');
        })
      }

    const handleJoinSchool = (values: any) => {
        console.log('DETAILS: ', values);
        let data = {    
            ...values,
            status: "pending"
        }   
        setLoading(true);
        joinSchool(data).then((res: any) => {
            if(res.ok) {
                toast.success(res.data.message, {
                    pauseOnHover: false,
                    closeOnClick: true,
                })
                setLoading(false);
                onClassAdded();
            }else {
                console.log(res)
                setLoading(false);
                setError(res.data.message)
                toast.error(res.data.message, {
                    pauseOnHover: false,
                    closeOnClick: true,
                })
            }
        }).catch(err => {   
            console.log('ERROR CREATING: ', err);
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
            <div  className='add-modal-container join-modal'>
                <div className='modal-head'>
                    <p className="modal-title">Apply For a subscription </p>
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
                <div className='mb-5 flex justify-between items-center'>
                        <select name="" id="" onChange={(e: any) => handleSelectedSchool(e.target.value)} value={selectedSchool} className="select-field px-3 ">
                                <option value="all" className='text-white'>Select Abonnement</option>
                               {specialities?.map((sp: any) => <option value={sp._id}>{sp?.name} </option>)
                               
                               }
                            </select>
                            {selectedSchoolCode != "none" && (
                                 <motion.span 
                                 onClick={handleOpen}
                                 whileHover={{ scale: 1.1 }}  // Animation au survol (zoom léger)
                                 transition={{ type: 'spring', stiffness: 300 }}  // Type d'animation
                                 className='flex gap-2 items-center bg-blue-500 py-2 text-white px-5 border-2 border-gray-500 rounded-md cursor-pointer ' ><BiInfoCircle/> info </motion.span>
                            )}  

                             {open && (
                               <div className='absolute top-0 bg-white '>
                            okokok
                             </div>
                                 )}
                            <div className='text-blue-500 font-semibold flex gap-3 items-center'><span className='text-gray-500 font-none'>code :  </span>{selectedSchoolCode}
                            <Tippy content="Copy Code"  animation="fade"> 
                             <a  className='hover:pl-3 cursor-pointer hover:text-blue-500 ' onClick={() => copyToClipBoard(selectedSchoolCode)}><MdContentCopy size={16}/></a>
                            </Tippy>
                            </div>
                        </div>
                {error && <ErrorMessage error={error} visible={true} />}
                <Form 
                    initialValues={initialValues}
                    onSubmit={handleJoinSchool}
                    validationSchema={validationSchema}
                >


                        <FormField 
                        name="speciality_code" type="general" placeholder="Speciality Code"/>

                      {!loading &&  <Button isOutLined={true} isFullWidth={false} title="APPLY"/>}
                        </Form>
                       
                       
                </form>
                
                </div>
            </div>
            <div className="modal-shadow" onClick={onClose}>
           
            </div>
        </div>
       
    );
}

export default JoinClassModal;
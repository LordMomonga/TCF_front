import React, { useState, useEffect } from 'react';
import './UploadPaymentReceipt.css';
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

import { studentGetBankInfos } from '../../../services/bankInfo';
import { submitStudentReceipt } from '../../../services/student';

const initialValues= {
    amount: null
}

const override = {
    marginTop: '20px'
  };



function UploadPaymentReceipt({ onClose, contentAdded } : any) {
    const [error, setError] = useState<any>(null);
    const [bankInfos, setBankInfos] = useState([]);
    const [selectedBankInfo, setSelectedBankInfo] = useState('all');
    const [loading, setLoading] = useState(false);

    // TIMETABLE
    const [receiptPdfUrl, setReceiptPdfUrl] = useState('');
    const [receiptPdfProgress,  setReceiptPdfProgress] = useState(0);
    const [isUploadingReceiptPdf, setIsUploadingReceiptPdf] = useState(false);

    // END OF ASSIGNEMTN
    const storage = getStorage(firebaseApp);
    
    // good
    const announcementFileRef: any = useRef(null);

    const validationSchema = Yup.object().shape({
        amount: Yup.number().required('Amount is required'),
    })


    const uploadReceiptPdf = (e: any) => {
        setIsUploadingReceiptPdf(true);
      const pdfFile: any = e.target.files[0];
      const storageRef = ref(storage, `pdf-content/${Date.now()}-${pdfFile.name}`);
      const uploadTask = uploadBytesResumable(storageRef, pdfFile);
  
    uploadTask.on('state_changed', (snapshot: any)=>{
        const uploadProgress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

        setReceiptPdfProgress(+uploadProgress);

    }, (error: any) => {
        console.log(error);
    },()=> {
         getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setReceiptPdfUrl(downloadURL);
            console.log('PDF  URL: ', downloadURL);
            setIsUploadingReceiptPdf(false);
        });
    })
  }



    const handleSubmitReceipt = (values: any) => {
        // console.log(values);
        // console.log('SELECTED SPECIALITIES: ', selectedSpecialities);
        setError(null);

        if(receiptPdfUrl.length < 2) {
            setError('You must select a receipt payment verification file')
            return;
        }

        if(selectedBankInfo == 'all') {
            setError('You must select the bank at which you made payment')
            return;
        }


        let data = {
            ...values,
            file_url: receiptPdfUrl,
            account: selectedBankInfo
        }

        // console.log("RECEIPT INFO: ",data);
        // return;

        // console.log("FINAL CONTENT: ",data)
        setLoading(true);
        submitStudentReceipt(data).then((res: any) => {
            if(res.ok) {
                toast.success(res.data.message, {
                    pauseOnHover: false,
                    closeOnClick: true,
                })
                setLoading(false);
                contentAdded();
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
            toast.error("ERROR INS SUBMITING", {
                pauseOnHover: false,
                closeOnClick: true,
            })
        })
    }

    const handleGetbankinfos = () => {
        studentGetBankInfos().then((res: any) => {
            console.log("STUDENT bankInfos RES: ",res);
            setBankInfos(res.data.data);
        }).catch((err: any) => {
            console.log('Error: ', err);
        })
    }

    useEffect(() => {
        handleGetbankinfos();
    },[])

    
    return (
        <div>
            <div  className='modal-container student-modal-assignment payment-recipt-modal'>
                <div className='modal-head'>
                    <p className="modal-title">Payment Receipts</p>
                    <ImCancelCircle style={{cursor: 'pointer'}} onClick={onClose} size={22} color="#fff"/>
                </div>
                <div className='modal-content'>
                <form action="" className="auth-form">

                {error && <ErrorMessage error={error} visible={true} />}
                <Form 
                    initialValues={initialValues}
                    onSubmit={handleSubmitReceipt}
                    validationSchema={validationSchema}
                >

                        <p className="label-text">Amount Paid </p>
                        <FormField  name="amount" type="number" placeholder="Enter Amount "/>


                        <p className="label-text">Select Bank: </p>
                        <select onChange={(e: any) => setSelectedBankInfo(e.target.value) } value={selectedBankInfo} className="select-field-modal">
                            <option value="all">All</option>
                            {bankInfos.map((data: any, key: any) => <option key={key} value={data?._id}>{data?.name}</option>)}
                        </select>

                        <div className='upload-content-container'>

                          {receiptPdfUrl.length < 2 &&  <div className="form-field-upload content-upload-right">
                            <p className="label-text">Upload Bank Receipt Pdf: </p>
                            <div className="file-drop-upload" onClick={() => announcementFileRef.current.click()}>
                            {!isUploadingReceiptPdf && <FaCloudUploadAlt size={35} color="#FFA500" />}
                                <input ref={announcementFileRef} onChange={uploadReceiptPdf} type="file" style={{width: '100%', height: '100%', display: 'none'}} accept="application/pdf,application/vnd.ms-excel"/>
                                {isUploadingReceiptPdf &&  <div style={{width: '80%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
                              <BeatLoader
                                    color="#623d91" 
                                    loading={isUploadingReceiptPdf}
                                    cssOverride={override}
                                />
                                <p style={{fontSize: '14px'}}>Uploading Receipt</p>
                            
                                    <ProgressBar bgcolor={'#6a1b9a'} completed={receiptPdfProgress}/>
                                
                              </div>}
                        
                            </div>
                        </div>}

                        {receiptPdfUrl.length > 2 &&
                            <div className="form-field-upload content-upload-right">
                            <p className="label-text" style={{textAlign: 'center'}}>Done</p>
                            </div>
                            }
                        </div>
               
                     {!loading &&  <Button isOutLined={true} isFullWidth={false} title="SUBMIT RECEIPT"/>}

                        </Form>
                </form>
                </div>
            </div>
            <div className="modal-shadow" onClick={onClose}>
               
            </div>
        </div>
    );
}

export default UploadPaymentReceipt;

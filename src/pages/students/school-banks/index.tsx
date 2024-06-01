import React, { useState, useEffect, useContext }  from 'react';
import './school-banks.css';

import StudentLayout from '../../../components/StudentLayout/StudentLayout';

import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';

import { toast } from 'react-toastify';

import BeatLoader from "react-spinners/BeatLoader";

import { convertDate } from '../../../utils/date';
import { studentGetBankInfos } from '../../../services/bankInfo';
import { FaCopy } from 'react-icons/fa';
import AcademicYearContext from '../../../contexts/AcademicYearContext';

const rows: any = [
    {
        label: '#',
        name: 'num'
    },
    {
        label: 'Bank Name',
        name: 'name'
    },
    {
        label: 'Account Number',
        name: 'name'
    },
    {
        label: 'Action',
        name: 'name'
    },
]


const override = {
    marginTop: '20px'
  };



function Index() {
    const [ showAddModal, setShoowAddModal ] = useState(false);
    const [bankInfos, setBankInfos] = useState([]);
    const {activeAcademyYear, setActiveAcademyYear} = useContext<any>(AcademicYearContext);

    const [loading, setLoading] = useState(false);


    const handleGetbankinfos = () => {
        setLoading(true);
        studentGetBankInfos().then((res: any) => {
            console.log("STUDENT bankInfos RES: ",res);
            setLoading(false);
            setBankInfos(res.data.data);
        }).catch((err: any) => {
            console.log('Error: ', err);
            setLoading(false);
        })
    }

    const copyToClipBoard = (data: any) => {
        navigator.clipboard.writeText(`${data}`);
                                                            
        toast.success("Copied To Clipboard", {
            pauseOnHover: false,
            closeOnClick: true,
        })
    }


    useEffect(() => {
        console.log('USER EFFECT RAN')
        handleGetbankinfos();
    },[activeAcademyYear]);

    return (
        <StudentLayout title=" Tolkin Bank Accounts" pageTitle="School Banks">
      <div className="section">
            <div className="parent-con">
                <div className="data-table">
                    <div className="top">
                        <div className="span">
                       
                        </div>
                
                    </div>
                    <div className="table-con">
                    <div style={{textAlign: 'center',}}>
                        <BeatLoader
                                color="#623d91" 
                                loading={loading}
                                cssOverride={override}
                        />
                    </div>
                        <table>
                            <thead>
                                <tr>
                                    {rows.map((row: any, index: any) => <th key={index} className={row.name}>{row.label}</th>)}
                                    
                                </tr>
                            </thead>
                        
                            <tbody>
                                {bankInfos?.map((data: any, index: any) => <tr>
                                    <td className="flex-center">{index + 1}</td>
                                    <td className="flex-start">
                                        <p>{data?.name}</p>
                                    </td>
                                    <td className="flex-start">
                                      {data?.account_number}
                                    </td>
                      

                                    <td className="flex-center">
                                        <div className="action">
                                        <Tippy  content="Copy Account Number"  animation="fade">
                                        <a onClick={() => {
                                               
                                            }} className="see"> 
                                            <FaCopy onClick={() => copyToClipBoard(data?.account_number)} size={14}/>
                                            </a>
                                        </Tippy>
                                    </div>
                                    </td>
                               
                                </tr> )}
                            </tbody>
                        </table>
                    </div>

                </div>
            </div>
        </div>

        </StudentLayout>
    );
}

export default Index;
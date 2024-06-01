import React, { useState, useEffect, useContext }  from 'react';
import './fees-deadlines.css';

import StudentLayout from '../../../components/StudentLayout/StudentLayout';

import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';

import BeatLoader from "react-spinners/BeatLoader";

import { convertDate } from '../../../utils/date';
import { studentGetBankInfos } from '../../../services/bankInfo';
import { FaCopy } from 'react-icons/fa';
import AcademicYearContext from '../../../contexts/AcademicYearContext';
import { studentGetDeadlines } from '../../../services/instalments';

const rows: any = [
    {
        label: '#',
        name: 'num'
    },
    {
        label: 'Deadline Title',
        name: 'name'
    },
    {
        label: 'Should Have Paid',
        name: 'name'
    },
    {
        label: 'Date',
        name: 'name'
    },
]


const override = {
    marginTop: '20px'
  };



function Index() {
    const [ showAddModal, setShoowAddModal ] = useState(false);
    const [deadlines, setDeadlines] = useState([]);
    const {activeAcademyYear, setActiveAcademyYear} = useContext<any>(AcademicYearContext);

    const [loading, setLoading] = useState(false);


    const handleGetbankinfos = () => {
        setLoading(true);
        studentGetDeadlines().then((res: any) => {
            console.log("STUDENT deadlines RES: ",res);
            setLoading(false);
            setDeadlines(res.data.data);
        }).catch((err: any) => {
            console.log('Error: ', err);
            setLoading(false);
        })
    }


    useEffect(() => {
        console.log('USER EFFECT RAN')
        handleGetbankinfos();
    },[activeAcademyYear]);

    return (
        <StudentLayout title="School Fees Deadlines" pageTitle="School Banks">
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
                                {deadlines?.map((data: any, index: any) => <tr>
                                    <td className="flex-center">{index + 1}</td>

                                    <td className="flex-start">
                                        <p>{data?.title}</p>
                                    </td>

                                    <td className="flex-start">
                                        <p>{data?.amount_percent}%</p>
                                    </td>
                                    <td className="flex-start">
                                      {data?.date}
                                    </td>
                      

                                    <td className="flex-center">
                                        <div className="action">
                                      
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
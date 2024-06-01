import React, { useState, useEffect } from 'react';
import './info.css';

import { MdContentCopy } from 'react-icons/md';

import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';

import { BsInfoCircle } from 'react-icons/bs';
import { toast } from 'react-toastify';

import BeatLoader from "react-spinners/BeatLoader";

import moment from 'moment';
import SchoolLayout from '../../../components/SchoolLayout/SchoolLayout';
import { getUser } from '../../../utils/storage';
import { convertDate } from '../../../utils/date';


const override = {
    marginTop: '20px'
  };


function Index() {
    const [loading, setLoading] = useState(false);
    const [schoolInfo, setSchoolInfo] = useState<any>(null)
    
    const copyToClipBoard = (data: any) => {
        navigator.clipboard.writeText(`${data}`);
                                                            
        toast.success("Copied To Clipboard", {
            pauseOnHover: false,
            closeOnClick: true,
        })
    }
    useEffect(() => {
        let data = getUser();
        setSchoolInfo(data);
    }, []);

    return (
        <SchoolLayout title="" pageTitle="Info">
              <div className="section">
                        <div className="parent-con">
                            <div className="data-table">
                                <div className="top">
                                    <div className="span">
                                        <h1>Admin Information <Tippy content="School Personal Info" animation="fade"><a><BsInfoCircle /></a></Tippy></h1>
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
                                
                                <div className="info-items-container">
                                    <div className="info-item">
                                        <p className="item-key">Admin Name: </p>
                                        <p className="item-text">{schoolInfo?.username}</p>
                                    </div>

                                    <div className="info-item">
                                        <p className="item-key">Registration Date: </p>
                                        <p className="item-text">{convertDate(schoolInfo?.createdAt)}</p>
                                    </div>

                                </div>
                                </div>

                            </div>
                        
                        </div>
                    </div>
        </SchoolLayout>
    );
}

export default Index;
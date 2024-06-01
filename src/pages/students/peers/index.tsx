import React, { useState, useEffect, useContext }  from 'react';
import './peers.css';

import StudentLayout from '../../../components/StudentLayout/StudentLayout';


import { toast } from 'react-toastify';

import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';

import { PeersCard } from '../../../components';

import AcademicYearContext from '../../../contexts/AcademicYearContext';
import { getStudentResults } from '../../../services/results';



const override = {
    marginTop: '20px'
  };



function Index() {
    const {activeAcademyYear, setActiveAcademyYear} = useContext<any>(AcademicYearContext);


    const [announcements, setAnnouncements] = useState([]);
    const [loading, setLoading] = useState(false);


    const handleGetAnnouncement = ()  => {
        setLoading(true);

        setAnnouncements([]);

        getStudentResults().then((res: any) => {
            if(res.ok) {
                // console.log('RESULTS:', res)
                setAnnouncements(res.data.data);
            }
            setLoading(false);
        }).catch(err => {
            setLoading(false);
            console.log('error: ', err);
        })
    }


    useEffect(() => {
        handleGetAnnouncement();
    },[activeAcademyYear]);

    return (
        <StudentLayout title="Your Peers" pageTitle="Peers">
      <div className="section">
            <div className="peers-container">
                <PeersCard />
                <PeersCard />
                <PeersCard />
                <PeersCard />
                <PeersCard />
                <PeersCard />
                <PeersCard />
                <PeersCard />
           
            </div>
        </div>

       
        </StudentLayout>
    );
}

export default Index;
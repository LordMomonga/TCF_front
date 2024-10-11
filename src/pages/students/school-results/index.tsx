import React, { useState, useEffect, useContext }  from 'react';
import './school-results.css';

import StudentLayout from '../../../components/StudentLayout/StudentLayout';

import { IoMdCloudDownload } from 'react-icons/io';
import { AiFillEye } from 'react-icons/ai';

import { toast } from 'react-toastify';

import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';

import { deletePassExamContent } from '../../../services/passExams';
import { getStudentSolutions, getStudentsClasses, getAcceptedClasses, getStudentTimetables, getStudentAnnouncements } from '../../../services/student';

import BeatLoader from "react-spinners/BeatLoader";

import moment from 'moment';
import { getTotalAssessments } from '../../../services/assessment';
import { VideoPlayerModal } from '../../../components';
import { convertDate } from '../../../utils/date';
import AcademicYearContext from '../../../contexts/AcademicYearContext';
import { getStudentResults } from '../../../services/results';
import { getMyResults } from '../../../services/assessment';
import { getMyResultsEcrit } from '../../../services/assessment';
import { HandPlatter } from 'lucide-react';
const rows: any = [
    {
        label: '#',
        name: 'num'
    },
    {
        label: 'Niveau',
        name: 'name'
    },
    {
        label: 'Average',
        name: 'name'
    },
    
    {
        label: 'Remark',
        name: 'name'
    },
    {
        label: 'etat',
        name: 'name'
    },
    {
        label: 'created Date',
        name: 'name'
    },
]


const override = {
    marginTop: '20px'
  };


const showModal1 = ( data : any) => {


     return(
        <div>
                {data}
        </div>
     )

}
function Index() {
    const {activeAcademyYear, setActiveAcademyYear} = useContext<any>(AcademicYearContext);


    const [announcements, setAnnouncements] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showmodal, setShowModal] = useState(false)
    const [loading1, setLoading1] = useState(false);
    const [userSolution, SetUserSolution] = useState<any>();
    const [user, SetUser] = useState<any>();


    
    const handleShowResults = () =>{
        setLoading(true)
        console.log("telechargement en cours");
        
        getMyResults().then((res:any) => {
            if(res.ok){
                SetUserSolution(res.data.data)
            }
            console.log(userSolution);
            
            setLoading(false);
        }).catch(err => {
            setLoading(false);
            console.log('error: ', err);
        })
    }

const handleToggle = () =>{
    setShowModal(!showmodal)
}

    const handleShowResults2 = () =>{
        setLoading1(true)
        console.log("telechargement en cours");
        
        getMyResultsEcrit().then((res:any) => {
            if(res.ok){
                SetUser(res.data.data)
            }
            console.log(user);
            
            setLoading1(false);
        }).catch(err => {
            setLoading(false);
            console.log('error: ', err);
        })
    }




    useEffect(() => {
        handleShowResults()
        handleShowResults2()
    
    },[activeAcademyYear]);

    return (
        <StudentLayout title="My Results " pageTitle="Results test">
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
                                {userSolution?.map((data: any, index: any) => <tr>
                                    <td className="flex-center">{index + 1}</td>
                                    <td className="flex-start font-bold text-black text-2xl">
                                        <p>{data?.note}</p>
                                    </td>
                                    <td>
                                        <p>{data?.contenu1_id?.TypeElement}</p>
                                    </td>
                                    <td onClick={handleToggle} className='text-blue-500 hover:underline cursor-pointer'>
                                        <p>{data?.commentaire}</p>
                                    </td>
                                    <td>
                                        <p>{data?.note ? "corrected" : "pending"}</p>
                                    </td>
                                    {/* <td className="flex-start">{data?.active_to}</td> */}
                                
                                    <td className="flex-start">
                                        <p>{convertDate(data?.createdAt)}</p>
                                    </td>
                                     
            
                                    <td className="flex-center">
                                        <div className="action">
                                        <Tippy  content="Download Result Slip"  animation="fade">
                                        <a target="_blank" href={data?.result_file} onClick={() => {
                                               
                                            }} className="see"> 
                                            <IoMdCloudDownload onClick={() => null} size={14}/>
                                            </a>
                                        </Tippy>
                                    </div>
                                    </td>

                                </tr> )}

                                {user?.map((data: any, index: any) => <tr>
                                    <td className="flex-center">{index + 1}</td>
                                    <td className="flex-start font-bold text-black text-2xl">
                                        <p>{data?.note}</p>
                                    </td>
                                    <td>
                                        <p>{data?.contenu1_id?.TypeElement}</p>
                                    </td>
                                    <td className='text-blue-500 hover:underline cursor-pointer'>
                                        <p>{data?.commentaire}</p>
                                    </td>
                                    <td>
                                        <p>{data?.note ? "corrected" : "pending"}</p>
                                    </td>
                                    {/* <td className="flex-start">{data?.active_to}</td> */}
                                
                                    <td className="flex-start">
                                        <p>{convertDate(data?.createdAt)}</p>
                                    </td>
                                     
            
                                    <td className="flex-center">
                                        <div className="action">
                                        <Tippy  content="Download Result Slip"  animation="fade">
                                        <a target="_blank" href={data?.result_file} onClick={() => {
                                               
                                            }} className="see"> 
                                            <IoMdCloudDownload onClick={() => null} size={14}/>
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
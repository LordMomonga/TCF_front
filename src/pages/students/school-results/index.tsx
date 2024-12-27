import { FaHandPointer } from "react-icons/fa"; 
import React, { useState, useEffect, useContext }  from 'react';
import './school-results.css';
import { BiTrash } from 'react-icons/bi';
import StudentLayout from '../../../components/StudentLayout/StudentLayout';

import { IoMdCloudDownload } from 'react-icons/io';
import { AiFillEye } from 'react-icons/ai';

import { toast } from 'react-toastify';

import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';

import { deletePassExamContent } from '../../../services/passExams';
import { getStudentSolutions, getStudentsClasses, getAcceptedClasses, getStudentTimetables, getStudentAnnouncements } from '../../../services/student';

import BeatLoader from "react-spinners/BeatLoader";
import { FaTimesCircle } from 'react-icons/fa';
import moment from 'moment';
import { changeMyEcritVue, getTotalAssessments } from '../../../services/assessment';
import { VideoPlayerModal } from '../../../components';
import { convertDate } from '../../../utils/date';
import AcademicYearContext from '../../../contexts/AcademicYearContext';
import { getStudentResults } from '../../../services/results';
import { getMyResults } from '../../../services/assessment';
import { getMyResultsEcrit } from '../../../services/assessment';
import { HandPlatter } from 'lucide-react';
import { BiTime } from 'react-icons/bi';
import { changeMyAudioVue } from '../../../services/assessment';
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
        label: 'Type Test',
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
    {
        label: ' Action',
        name: 'name'
    }
]


const override = {
    marginTop: '20px'
  };


function showModal1( {data , onClose} : any) {


     return(
        
        <div className='py-5 bg-primary text-white absolute top-0 px-5 py-2'>
        <span className='top-2 absolute right-2 text-2xl' onClick={onClose}><FaTimesCircle/></span>
        <h1 className='font-bold text-gray-200 mx-5 my-2 underline'>Appreciation</h1>
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
    const [modalData, setModalData] = useState<string | null>(null);
    const [note, setNote] = useState<string | null>(null);
    const [decision, setDecision] = useState<string | null>(null);
    let changeValue = 0

    
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

    const handleChangeEcrit = (id:any) => {

        changeMyEcritVue(id).then((res:any)=> {
           if(res.ok){
              setLoading(true)
              handleShowResults()
              handleShowResults2()
               console.log( 'la valeur a bien été changé');
               
           } else {
               console.log('erreur pour la notiffication ')
           }
          
       })
       changeValue ++

     
   }

   const handleChangeAudio = (id:any) => {

    changeMyAudioVue(id).then((res:any)=> {
       if(res.ok){
        
        console.log( 'la valeur a bien été changé');

       } else {
           console.log('erreur pour la notiffication ')
       }

   })
   changeValue ++

}

    const handleToggle = (commentaire: string, note: string) => {
        setModalData(commentaire); // Passe le commentaire dans le modal
        setShowModal(!showmodal); // Affiche ou cache le modal
        setNote(note)

    };
    const handleAudio = (commentaire: string, note: string, id:any) => {
        handleToggle(commentaire, note)
        handleChangeAudio(id) 
       
    };
    const handleEcrit = (commentaire: string, note: string, id:any) => {
        handleToggle(commentaire, note)
        handleChangeEcrit(id)
    };

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
    
    },[changeValue]);

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
                                {userSolution?.map((data: any, index: any) => <tr className={`cursor-pointer ${data?.vue === false ? 'font-bold text-black shadow-md shadow-gray-200' :  'text-gray-200'} `} >
                                    <td className={`${data?.vue === false ? 'font-bold text-black' :  'text-gray-200'} flex-center`}>{index + 1}</td>
                                    <td className="flex-start font-bold text-black text-2xl">
                                        <p className={`${data?.vue === false ? 'font-bold text-black' :  'text-gray-200'} flex-start`}>{data?.note}</p>
                                    </td>
                                    <td>
                                        <p className={`${data?.vue === false ? 'font-bold text-black' :  'text-gray-200'} flex-start`}>{data?.contenu1_id?.TypeElement}</p>
                                    </td>
                                    <td onClick={() =>{ handleAudio(data?.commentaire, data?.note, data?._id)}} className='text-blue-500 hover:underline cursor-pointer'>
                                        <p className={`${data?.vue === false ? 'font-bold text-black' :  'text-gray-200'} flex-start`}>{typeof data?.commentaire === 'string' && data.commentaire.trim().length > 0
    ? data.commentaire.split(' ').slice(0, 2).join(' ') + '...'
    : "non commentaire"}</p>
                                    </td>
                                    <td>
                                        <p>{data?.note ? "corrected" : "pending"}</p>
                                    </td>
                                    {/* <td className="flex-start">{data?.active_to}</td> */}
                                
                                    <td className="flex-start">
                                        <p>{convertDate(data?.createdAt)}</p>
                                    </td>
                                     
            
                                    <td className="flex-center flex ">
                                        <div className="action ">
                                        <Tippy  content="Download Result Slip "  animation="fade">
                                        <a target="_blank" href={data?.result_file} onClick={() => {
                                               
                                            }} className="see"> 
                                            <IoMdCloudDownload onClick={() => null} size={14}/>
                                            </a>
                                        </Tippy>
                                    </div>
                                    <div className="action bg-red-500 px-2 rounded-md">
                                         <BiTrash onClick={() => null} size={14}/>
                                    </div>
                                    </td>

                                </tr> )}
                                
                                </tbody>
                                </table>
                              
                              <div className='font-semibold text-blue-500  w-full text-center my-5 py-5 flex justify-center'>
                                Expression ECRITE 
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


                           
                                {user?.map((data: any, index: any) => <tr  className={`cursor-pointer ${data?.vue === false ? 'font-bold text-black shadow-md shadow-gray-200' :  'text-gray-200'} `}>
                                    <td className={`${data?.vue === false ? 'font-bold text-black' :  'text-gray-200'} flex-center`}>{index + 1}</td>
                                    <td className={`${data?.vue === false ? 'font-bold text-black' :  'text-gray-200'} flex-start`}>
                                        <p className={`${data?.vue === false ? 'font-bold text-black' :  'text-gray-200'} flex-start`}>{data?.note ? "aucune note": `${data?.note}`}</p>
                                    </td>
                                    <td>
                                        <p className={`${data?.vue === false ? 'font-bold text-black' :  'text-gray-200'} flex-start`}>{data?.contenu1_id?.TypeElement}</p>
                                    </td>
                                    <td onClick={() =>  handleEcrit(data?.commentaire, data?.note, data?._id)} className='text-blue-500 hover:underline cursor-pointer'>
                                        <p className={`${data?.vue === false ? 'font-bold text-black' :  'text-gray-200'} flex-start flex items-center gap-2 hover:text-xl`}><FaHandPointer className=" transform rotate-90 text-blue-200 " />{typeof data?.commentaire === 'string' && data.commentaire.trim().length > 0
    ? data.commentaire.split(' ').slice(0, 2).join(' ') + '...'
    : "non commentaire"}</p>
                                    </td>
                                    <td>
                                        <p className={`${data?.vue === false ? 'font-bold text-black' :  'text-gray-200'} flex-start`}>{data?.note ? "corrected" : "pending"}</p>
                                    </td>
                                    {/* <td className="flex-start">{data?.active_to}</td> */}
                                
                                    <td className="flex-start">
                                        <p className={`${data?.vue === false ? 'font-bold text-black' :  'text-gray-200'} flex-start`}>{convertDate(data?.createdAt)}</p>
                                    </td>
                                     
            
                                    <td className="flex-center flex ">
                                        <div className="action ">
                                        <Tippy  content="Download Result Slip "  animation="fade">
                                        <a target="_blank" href={data?.result_file} onClick={() => {
                                               
                                            }} className="see"> 
                                            <IoMdCloudDownload onClick={() => null} size={14}/>
                                            </a>
                                        </Tippy>
                                    </div>
                                    <div className="action bg-red-500 px-2 rounded-md cursor-pointer">
                                         <BiTrash onClick={() => null} size={14} color='#ffffff'/>
                                    </div>
                                    </td>

                                </tr> )}
                                </tbody>
                                </table>

                             </div>
                             {showmodal && (
                                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                                    <div className="py-5 bg-primary text-white relative px-5 py-2 rounded">
                                        <span className="absolute top-2 right-2 text-2xl cursor-pointer" onClick={() => setShowModal(false)}>
                                            <FaTimesCircle />
                                        </span>
                                        <h1 className="font-bold text-white mx-5 my-2 underline text-3xl uppercase text-center">Appreciation</h1>
                                        <p className='text-white'>vous avez un niveau <span className='text-2xl my-2 text-green-500 font-semibold '>{note}</span></p>
                                        <p className='bg-white text-gray-500 px-3 py-5 rounded-sm'>correcteur : {modalData}</p>
                                        <p className='bg-white py-5 px-3'><span className=' mr-2 bg-white font-semibold my-2 '>Conclusion:</span>
                                        {(() => {
    switch(note) {
        case 'A1':
            return 'Peut comprendre et utiliser des expressions familières  et quotidiennes ainsi que des énoncés très simples.';
          case 'A2':
            return 'Peut communiquer dans des tâches simples et routinières. Peut décrire son environnement et exprimer ses besoins.';
          case 'B1':
            return 'Peut produire un discours simple et cohérent et raconter des événements sur des sujets familiers.';
          case 'B2':
            return 'Peut s\'exprimer de manière claire et détaillée, avec une certaine aisance.';
          case 'C1':
            return 'Peut s\'exprimer de façon fluide et spontanée, avec aisance dans des contextes sociaux ou professionnels.';
          case 'C2':
            return 'Peut comprendre et résumer pratiquement tout, et s\'exprimer avec précision et aisance.';
          default:
            return 'Note non disponible';
    }
  })()}
                                         </p>
                                    </div>
                                </div>
                            )}
                    </div>

                </div>
            </div>
            
        </div>

        </StudentLayout>
    );
}

export default Index;
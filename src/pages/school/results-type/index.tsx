import { MdOutlineUpdate } from "react-icons/md"; 
import { AiFillSave } from "react-icons/ai"; 
import React, { useState, useEffect, useContext }  from 'react';
import './result-type.css';
import { BsFillEyeFill } from 'react-icons/bs';
import { getCorrectionStudentOneEcrit } from '../../../services/assessment';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { AiOutlineCheckSquare } from 'react-icons/ai';
import { MdOutlineCancelPresentation } from 'react-icons/md';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import { DeleteModal } from '../../../components';
import { getCorrectionStudentOne } from '../../../services/assessment';
import { getCorrectionStudentEcrit } from '../../../services/assessment';
import { schoolAcceptStudent, schoolGetStudents, schoolRejectStudent, schoolSuspendStudent } from '../../../services/student';
import { getEcritAndUpdate, getAudioAndUpdate} from '../../../services/assessment';
import BeatLoader from "react-spinners/BeatLoader";
import { BiSpeaker } from 'react-icons/bi';

import { convertDate } from '../../../utils/date';
import SchoolLayout from '../../../components/SchoolLayout/SchoolLayout';
import AcademicYearContext from '../../../contexts/AcademicYearContext';
import { getSchoolSpecialitis } from '../../../services/specialities';
import CreateResultType from '../../../components/school/CreateResultsType/CreateResultsType';
import { getCorrectionStudent } from '../../../services/assessment';
import { FaTrash } from 'react-icons/fa';
import { schoolDeleteResultsTypes, schoolGetResultsTypes } from '../../../services/school';

const rows: any = [
    {
        label: '#',
        name: 'num'
    },
    {
        label: 'Name',
        name: 'name'
    },

    {
        label: 'Test Type',
        name: 'name'
    },
  
    {
        label: 'Action',
        name: 'name'
    },
    {
        label: 'correct',
        name: 'name'
    },
    {
        label: 'Created At',
        name: 'name'
    },
]


const override = {
    marginTop: '20px'
  };

const SolutionModal = ({message1, solution, data,  onClose}: any) => {
  console.log("ca charge ou ps");
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState<any>()
  const [comment, setComment] = useState<any>();
    const [level, setLevel] = useState<any>();
    const [AudioId, setAudioId] = useState<any>();
    const status = "accepted"
const handleAudio = () =>  {


}

// Fonction pour gérer les changements du textarea
const handleCommentChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setComment(event.target.value);
};

// Fonction pour gérer les changements du select
const handleLevelChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setLevel(event.target.value);
};

const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault(); // Empêche le rechargement de la page
    console.log('Commentaire:', comment);
    console.log('Niveau:', level);
    console.log('id:', data);
    setAudioId(data)
   
    try {
        const data2 = {
            _idAudio: data,
            commentaire: comment,
            note:level
        }

        getAudioAndUpdate(data2).then((res: any) => {
            console.log(res);
            if(res.ok){
                toast.success("Submit with succes", {
                    pauseOnHover: false,
                    closeOnClick: true,
                }) 
                onClose()
            }else{
                console.log(res);
                
                toast.error("Error while correcting the Test", {
                    pauseOnHover: false,
                    closeOnClick: true,
                })
            }
        })
        
    } catch (error) {

        toast.error("ERROR", {
            pauseOnHover: false,
            closeOnClick: true,
        })
        
    }
};


  const handleSolutionStudentOne = () => {
  
    getCorrectionStudentOne(data).then((res:any)=> {
       

        setUser(res.data.data)
        console.log("data pour un user", res, data);
        
    }).catch((error: any) => {
        setLoading(false)
        console.log('ERROR');
      })
}

useEffect(() => {
    handleSolutionStudentOne()

   
},[]);
  
    return(
    <div className=' fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50  '>
        <motion.div initial={{ x: '-100vw', opacity: 0 }} // Position de départ (hors écran à gauche)
           animate={{ x: 0, opacity: 1 }} // Position finale (à l'endroit normal)
           transition={{
             type: 'spring', // Utilise un effet de ressort pour l'animation
             stiffness: 60, // Ajuste la vitesse du ressort
             damping: 10, // Contrôle l'effet de rebond
             duration: 0.8 // Durée de l'animation 
             }}
          className="bg-white rounded-lg w-11/12 md:w-2/3 p-4 max-h-screen overflow-y-auto relative">
        
        <div className="flex justify-between items-center border-b pb-2">
              <h2 className="text-lg font-semibold text-center uppercase "><span className='text-green-500'>Correction Complet : </span>Comprehension Orale </h2>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700"
              >
                &#x2715;
              </button>
            </div>
            <div className=' absolute right-5 bg-gray-500 text-white  px-2 py-4 rounded-md '>
                <h1 className='text-white font-bold text-2xl text-center uppercase'>
                    candidat 
                </h1>
                <span className='text-white'>
                    Name:  {user?.utilisateur_id?.username}
                </span>
                
                    <span className='block text-white'>
                    Email:  {user?.utilisateur_id?.email}
                </span>
               
            </div>
            <div className='text-center mt-5 bg-gray-200 mb-5 py-5 '>
                Sujet 1: {user?.contenu1_id?.titre}
                <div>
                    {user?.contenu1_id?.contenu}
                </div>
                <div className='mt-3 w-[3/4] flex justify-center '>
                 <a href={user?.audioUrl1} target="_blank"> <button  className='text-white flex mb-3 gap-2 items-center bg-primary  py-1 px-2 rounded-md w-[3/4]'><BiSpeaker /> lire laudio</button> </a>
               
        <audio controls>
          <source src={user?.audioUrl1} type="audio/webm" />
          Your browser does not support the audio element.
        </audio>
      
   
                </div>
                           </div>

            <div className='text-center mt-5 bg-gray-100 py-5 '>
                Sujet 2: {user?.contenu2_id?.titre}
                <div>
                    {user?.contenu2_id?.contenu}
                </div>
                <div className='w-[3/4] flex mt-3 justify-center'>
                 <a href={user?.audioUrl2} target="_blank">  <button  className='text-white flex gap-2 mb-3 items-center bg-primary  py-1 px-2 rounded-md w-[3/4] '><BiSpeaker /> lire laudio</button> </a>
        <audio controls>
          <source src={user?.audioUrl2} type="audio/webm" />
          Your browser does not support the audio element.
        </audio>
     
   
                </div>
                
            </div>



            <div className='text-center mt-5 bg-gray-300 py-5  mb-5'>
                Sujet 3: {user?.contenu3_id?.titre}
                <div>
                    {user?.contenu3_id?.contenu}
                </div>
                <div className='mt-3 flex justify-center'>
                   <a href={user?.audioUrl3} target="_blank">  <button  className='text-white flex gap-2 items-center bg-primary  py-1 px-2 rounded-md w-[3/4]'><BiSpeaker /> lire laudio</button> </a>
              
        <audio controls>
          <source src={user?.audioUrl3} type="audio/webm" />
          Your browser does not support the audio element.
        </audio>
      
   
                </div>

              
            </div>
            <form action="" onSubmit={handleSubmit} >
            <div className='mt-2 mb-3 flex justify-center'>
                  <textarea  name="comment"  className='mt-2 px-3 py-2'  value={comment} onChange={handleCommentChange} id=""></textarea>
                  </div>
            <div className='flex justify-center items-center gap-2'>
                note <select name="level" id="level" value={level}  onChange={handleLevelChange} className=' text-white bg-primary py-2 px-5'>
                    <option value="" className='px-2 text-white'>niveau</option>
                    <option value="A1" className='px-2 text-white'>A1</option>
                    <option value="A2" className='px-2 text-white'>A2</option>
                    <option value="B1" className='px-2 text-white'>B1</option>
                    <option value="B2" className='px-2 text-white'>B2</option>
                    <option value="C1" className='px-2 text-white'>C1</option>
                    <option value="C2" className='px-2 text-white'>C2</option>
                </select>
            </div>
            <div className='flex justify-between mt-5'>
            <button  type="submit" className='bg-green-500 text-white px-2 rounded-md hover:bg-green-400 '>
            Enregistrer
           </button>
           <button className='bg-gray-500 text-white px-2 rounded-md hover:bg-gray-400 '>
            Modifier
           </button>

            </div>
          
          
            </form>
           
        </motion.div>
            
        </div>
    )
} 

const SolutionModal2 = ({message1, solution, data,  onClose}: any) => {
    console.log("ca charge ou ps");
    const [loading, setLoading] = useState(false)
    const [user, setUser] = useState<any>()
    const [comment, setComment] = useState<any>();
    const [level, setLevel] = useState<any>();
    const [status, setStatus] = useState("accepted");
const handleAudio = () =>  {


}

// Fonction pour gérer les changements du textarea
const handleCommentChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setComment(event.target.value);
};

// Fonction pour gérer les changements du select
const handleLevelChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setLevel(event.target.value);
};

const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault(); // Empêche le rechargement de la page
    console.log('Commentaire:', comment);
    console.log('Niveau:', level);
    console.log('statsus:', status);
    console.log('id:', data);
   
    try {
        const data2 = {
            _id: data,
            commentaire: comment,
            note:level,
            
            status: status
        }

        getEcritAndUpdate(data2).then((res: any) => {
            console.log(data2);
            if(res.ok){
                toast.success("Submit with succes", {
                    pauseOnHover: false,
                    closeOnClick: true,
                }) 
                console.log(res, "still jogging");
                
                onClose()
            }else{
                toast.error("Error while correcting the Test", {
                    pauseOnHover: false,
                    closeOnClick: true,
                })
            }
        })
        
    } catch (error) {

        toast.error("ERROR", {
            pauseOnHover: false,
            closeOnClick: true,
        })
        
    }
};
    const handleSolutionStudentOne = () => {
    
        getCorrectionStudentOneEcrit(data).then((res:any)=> {
         
  
          setUser(res.data.data)
          console.log("data pour un user ECRIT", res, data);
          
      }).catch((error: any) => {
          setLoading(false)
          console.log('ERROR');
        })
  }
  
  useEffect(() => {
      handleSolutionStudentOne()
  
     
  },[]);
    
      return(
      <div className=' fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50  '>
          <motion.div initial={{ x: '-100vw', opacity: 0 }} // Position de départ (hors écran à gauche)
             animate={{ x: 0, opacity: 1 }} // Position finale (à l'endroit normal)
             transition={{
               type: 'spring', // Utilise un effet de ressort pour l'animation
               stiffness: 60, // Ajuste la vitesse du ressort
               damping: 10, // Contrôle l'effet de rebond
               duration: 0.8 // Durée de l'animation 
               }}
            className="bg-white rounded-lg w-11/12 md:w-2/3 p-4 max-h-screen overflow-y-auto relative">
          
          <div className="flex justify-between items-center border-b pb-2">
                <h2 className="text-lg font-semibold text-center uppercase "><span className='text-green-500'>Correction Complet : </span>Comprehension Orale </h2>
                <button
                  onClick={onClose}
                  className="text-gray-500 hover:text-gray-700"
                >
                  &#x2715;
                </button>
              </div>
              <div className=' absolute right-5 bg-gray-500 text-white  px-2 py-4 rounded-md '>
                  <h1 className='text-white font-bold text-2xl text-center uppercase'>
                      candidat 
                  </h1>
                  <span className='text-white'>
                      Name:  {user?.utilisateur_id?.username}
                  </span>
                  
                      <span className='block text-white'>
                      Email:  {user?.utilisateur_id?.email}
                  </span>
                 
              </div>
              <div className='text-center mt-5 bg-gray-200 mb-5 py-5 '>
                  Sujet 1: {user?.contenu1_id?.titre}
                  <div>
                      {user?.contenu1_id?.contenu}
                  </div>
                  
                  <div className='mt-5 '>
                    <span className='font-semibold block mb-2'>Reponses:</span>
                  {user?.contenu1}
                  </div>
                             </div>
  
              <div className='text-center mt-5 bg-gray-100 py-5 '>
                  Sujet 2: {user?.contenu2_id?.titre}
                  <div>
                      {user?.contenu2_id?.contenu}
                  </div>
                  <div className='mt-5 '>
                    <span className='font-semibold block mb-2'>Reponses:</span>
                  {user?.contenu2}
                  </div>
                 
              </div>
  
  
  
              <div className='text-center mt-5 bg-gray-300 py-5  mb-5'>
                  Sujet 3: {user?.contenu3_id?.titre}
                  <div>
                      {user?.contenu3_id?.contenu}
                  </div>
                  <div className='mt-5 '>
                    <span className='font-semibold block mb-2'>Reponses:</span>
                  {user?.contenu3 }
                  </div>
  
                
              </div>
              <form action="" onSubmit={handleSubmit} >
            <div className='mt-2 mb-3 flex justify-center'>
                  <textarea  name="comment"  className='mt-2 px-3 py-2 border-2 border-solid border-gray-500 '  value={comment} onChange={handleCommentChange} id=""></textarea>
                  </div>
            <div className='flex justify-center items-center gap-2'>
                note <select name="level" id="level" value={level}  onChange={handleLevelChange} className=' text-white bg-primary py-2 px-5'>
                    <option value="" className='px-2 text-white'>niveau</option>
                    <option value="A1" className='px-2 text-white'>A1</option>
                    <option value="A2" className='px-2 text-white'>A2</option>
                    <option value="B1" className='px-2 text-white'>B1</option>
                    <option value="B2" className='px-2 text-white'>B2</option>
                    <option value="C1" className='px-2 text-white'>C1</option>
                    <option value="C2" className='px-2 text-white'>C2</option>
                </select>
            </div>
            <div className='flex justify-between mt-5'>
            <button  type="submit" className='flex items-center gap-2 bg-green-500 text-white px-2 py-2  rounded-md hover:bg-green-400 '>
            <AiFillSave />Enregistrer
           </button>
           <button className='bg-gray-500 text-white flex items-center gap-2 py-2  px-2 rounded-md hover:bg-gray-400 '>
            <MdOutlineUpdate />Modifier
           </button>

            </div>
          
          
            </form>
           
          </motion.div>
              
          </div>
      )
  } 
  


function Index() {
    const [ showDeleteTypeModal, setShowDeleteTypeModal ] = useState(false);
    const [userSolution, setUserSolution] = useState<any>()
    const [userSolution1, setUserSolution1] = useState<any>()

    const [isSolutionModal, setIsSolutionModal] = useState(false)
    const [isSolutionModal1, setIsSolutionModal2] = useState(false)

    const [selectedId, setSelectedId] = useState<any>(null);
    const [content1, setContent1] = useState<any>()
    const [data1, setData1] = useState<any>()
    const [data2, setData2] = useState<any>()

    const [content3, setContent3] = useState<any>()
    const [question, setQuestion] = useState<any>()
    const [solution, setSolution] = useState<any>()
    // NEW
    let [showCreateResultTypeModal, setShowCreateResultTypeModal] = useState(false);
    let [resultsTypes, setResultTypes] = useState<any>();

    const [loading, setLoading] = useState(false);
    const [loading1, setLoading1] = useState(false);

    const handleTakeValue = (data:any)  => {
        setData1(data)
    }

    const handleTakeValue2 = (data:any)  => {
        setData2(data)
    }
    const toggleShowDeleteTypeModal = () => {
        setShowDeleteTypeModal(!showDeleteTypeModal);
    }
    const handleToggle = ()  => {
        setIsSolutionModal(!isSolutionModal)
        

    }
    const handleToggle1 = ()  => {
        setIsSolutionModal2(!isSolutionModal1)
        

    }


const handleSolutionStudent = () => {
    setLoading(true)
    getCorrectionStudent().then((res:any)=> {
        setLoading(false)

        setUserSolution(res.data.data)
        console.log("data offf", res);
        
    }).catch((error: any) => {
        setLoading(false)
        console.log('ERROR');
      })
}
const handleSolutionStudent2 = () => {
    setLoading1(true)
    getCorrectionStudentEcrit().then((res:any)=> {
        setLoading1(false)

        setUserSolution1(res.data.data)
        console.log("data offf", res);
        
    }).catch((error: any) => {
        setLoading1(false)
        console.log('ERROR');
      })
}

    

    




    useEffect(() => {
        handleSolutionStudent()
        handleSolutionStudent2()


       
    },[]);

    return (
        <SchoolLayout title="Result Types" pageTitle="Result users">
      <div className="section">
            <div className="parent-con">
                <div className="data-table">
                    <div className="top">
                        <button>filtrer</button>
                        <div className="span">
                            {/*  */}
                        </div>
                          <h1 className='text-center uppercase text-2xl '>COMPREHENSION ORALE </h1>
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
                                    <td className="flex-start">
                                        <p>{data?.utilisateur_id?.username}</p>
                                    </td>
                                
                                    <td className="flex-start">
                                        <p>{data?.contenu1_id?.TypeElement}</p>
                                    </td>


                                    <td className="flex-center">
                                        <div className="action">
                                        
        
                                      <Tippy content="open"  animation="fade">
                                            <span onClick={() => {
                                                    setSelectedId(data?._id);
                                                     handleToggle()
                                                     handleTakeValue(data?._id)
                                            }} className="p-2 rounded-md cursor-pointer hover:bg-green-400 bg-green-500"><BsFillEyeFill className="text-white" style={{ color: "white" }}/></span>
                                        </Tippy>
                                        </div>
                                    </td>
                                    <td className="flex-start">
                                        <p>{data?.commentaire ? "corrected": "pending"}</p>
                                    </td>
                                    <td className="flex-start">
                                        <p>{convertDate(data?.createdAt)}</p>
                                    </td>
                                </tr> )}
                            </tbody>
                        </table>
                    </div>

                </div>

                
            </div>

            
            <div className="parent-con mt-5">
                <div className="data-table">
                    <div className="top">
                        <button>filtrer</button>
                        <div className="span">
                            {/*  */}
                        </div>
                          <h1 className='text-center uppercase text-2xl '>EXPRESSION ECRITE </h1>
                    </div>
                    <div className="table-con">
                    <div style={{textAlign: 'center',}}>
                        <BeatLoader
                                color="#623d91" 
                                loading={loading1}
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
                                {userSolution1?.map((data: any, index: any) => <tr>
                                    <td className="flex-center">{index + 1}</td>
                                    <td className="flex-start">
                                        <p>{data?.utilisateur_id?.username}</p>
                                    </td>
                                
                                    <td className="flex-start">
                                        <p>{data?.contenu1_id?.TypeElement}</p>
                                    </td>


                                    <td className="flex-center">
                                        <div className="action">
                                        
        
                                      <Tippy content="open"  animation="fade">
                                            <span onClick={() => {
                                                    setSelectedId(data?._id);
                                                    handleToggle1()
                                                     handleTakeValue2(data?._id)
                                            }} className="p-2 rounded-md cursor-pointer hover:bg-green-400 bg-green-500"><BsFillEyeFill className="text-white" style={{ color: "white" }}/></span>
                                        </Tippy>
                                        </div>
                                    </td>
                                    <td className="flex-start">
                                        <p>{data?.commentaire ? "corrected": "pending"}</p>
                                    </td>
                                    <td className="flex-start">
                                        <p>{convertDate(data?.createdAt)}</p>
                                    </td>
                                </tr> )}
                            </tbody>
                        </table>
                    </div>

                </div>

                
            </div>
            {isSolutionModal && <SolutionModal message1 = "je valide" data={data1} onClose={handleToggle} />}
            {isSolutionModal1 && <SolutionModal2 message1 = "je valide" data={data2} onClose={handleToggle1} />}

        </div>

        </SchoolLayout>
    );
}

export default Index;
import { SiBaremetrics } from "react-icons/si"; 
import { GrDocumentPerformance } from "react-icons/gr"; 
import { AiTwotoneFilter } from "react-icons/ai"; 
import { AiTwotonePieChart } from "react-icons/ai"; 
import { BiPlusMedical } from "react-icons/bi"; 
import React, { useState, useEffect, useContext } from 'react';
import './landing.css';

import Layout from '../../../components/Layout/Layout';
import StudentLayout from '../../../components/StudentLayout/StudentLayout';
import { AddClassModal, DeleteModal } from '../../../components';
import JoinClassModal from '../../../components/students/JoinClassModal/JoinClassModal';
import AcademicYearContext from '../../../contexts/AcademicYearContext';
import { motion } from 'framer-motion';
import { AiOutlineCopy } from 'react-icons/ai';
import { BiMoney } from 'react-icons/bi';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import { useTranslation } from 'react-i18next';
import { selectResultat } from '../../../services/assessment';

import { getStudentApplications, getStudentsClasses, joinClass } from '../../../services/student';
import { Bar } from "react-chartjs-2";
import { Pie } from "react-chartjs-2";
import BeatLoader from "react-spinners/BeatLoader";
import {convertDate} from '../../../utils/date';
import {
    Chart as ChartJS,
    BarElement,
    CategoryScale,
    LinearScale,
    Tooltip,
    Legend,
    ArcElement
    
} from 'chart.js';
import moment from 'moment';
import { log } from "console";


ChartJS.register(
    BarElement,
    CategoryScale,
    LinearScale,
    Tooltip,
    Legend,
    ArcElement
);

const rows: any = [
    {
        label: '#',
        name: 'num'
    },
    {
        label: ' Name',
        name: 'name'
    },
    {
        label: 'Speciality',
        name: 'name'
    },
    {
        label: 'Academic Year',
        name: 'name'
    },
    {
        label: 'Fees Paid',
        name: 'name'
    },
    {
        label: 'Total Fees',
        name: 'name'
    },
    {
        label: 'Status',
        name: 'name'
    },
    {
        label: 'Submited Date',
        name: 'name'
    },
]


const override = {
    marginTop: '20px'
  };


function Index() {
    const { t, i18n } = useTranslation();
    let [lang, setLang] = useState<any>(null);
    const [barData, setBarData] = useState<any>({});
    const [pieData, setPieData] = useState<any>({});
    const [ showJoinModal, setShowJoinModal ] = useState(false);
    const {activeAcademyYear, setActiveAcademyYear} = useContext<any>(AcademicYearContext);
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingElement , setLoadingElement] = useState(false);
    const [allElement, setAllElement] = useState<any>([])
    const [selectionTest, setSelectionTest] = useState<any>()


    const toggleAddModal = () => {
        setShowJoinModal(!showJoinModal);
    }

//phase de tesy
const exampleBarData = {
    labels: ['none(A1)', ' none(A2)','none(B1)'],
    datasets: [
        {
            label: 'Scores',
            data: [10, 20, 30],
            backgroundColor: 'rgba(75, 192, 192, 0.6)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
        },
    ],
};


 const handleTrans = () => {
        i18n.changeLanguage(lang);
      };
  
      const handleLangInit = () => {
        let lng = localStorage.getItem('locale');
       
        if(lng == null) {
          localStorage.setItem('locale', 'fr')
          setLang('fr');
        }else {
          setLang(lng);
        }
      }
  
      const changeLang = () => {
        if(lang != null) {
          localStorage.setItem('locale', lang)
          handleTrans();
        }
      }

     const handleGetElements = (test:any) => { 
        const fate = test
        const testType = test
        
        setLoadingElement(true);
        setAllElement([])

        selectResultat(fate).then((res: any) => {
            
            if(res.ok) {
                

            console.log('ca passe', fate);
            
            setAllElement(res?.data?.data); 

            handleEffect(res?.data?.data);
            }
           
            console.log("je ne vois element nul part", allElement);
            setLoadingElement(false);
        }).catch(err => {
            setLoadingElement(false);
        })
     

        }

        const handleSelectedTest = ((element:any) =>{

        })

 // Préparer les données pour les graphiques lorsque allElement change
 const handleEffect = ((allElement:any) => {
   
    const labels = allElement.map(
        (item: any) => `${item.typeTest} (${item.niveau})`
    );
    const avgScores = allElement.map((item: any) => item.avgScore);
    const counts = allElement.map((item: any) => item.count);
        console.log('le nombre de tableau present',avgScores);
        console.log('le nombre de fois que sa apparait',counts)
        
    // Données pour l'histogramme
    setBarData({
        labels:labels,
        datasets: [
            {
                label: 'Score Moyen',
                data: avgScores ,
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 2,
            },
        ],
    });

    // Données pour le diagramme circulaire
   setPieData({
         labels:labels,
        datasets: [
            {
                label: 'Proportion des Tests',
                data: counts ,
                backgroundColor: [
                    '#FF6384',
                    '#36A2EB',
                    '#FFCE56',
                    '#4BC0C0',
                    '#9966FF',
                    '#FF9F40',
                ],
            },
        ],
    });
});





    const handleGetApplications = ()  => {
        setLoading(true);
        setApplications([]);
        getStudentApplications().then((res: any) => {

            if(res.ok) {
                setApplications(res.data.data);
            }
            setLoading(false);
        }).catch(err => {
            setLoading(false);
        })
    }

    useEffect(() => {
        
        
        
    },[]);
 

    const handleClassAdded = ()  => {
        handleGetApplications();
        toggleAddModal();
    }

    useEffect(() => {
        handleGetApplications();
    },[activeAcademyYear]);

    
    useEffect(() => {
        changeLang()
      }, [lang]);

    return (
        <StudentLayout title={t('layout.title')} pageTitle={t('layout.home')}>
             <div>
             <Link to="/students/school-banks"> 
              <motion.button 
               
               
                 animate={{
                    x: [0, -10, 10, -10, 5, 0], // Déplace de gauche à droite pour l'effet de vibration
                  }}
                  transition={{
                    repeat: Infinity, // Répète l'animation à l'infini
                    repeatType: "loop", // Boucle l'animation
                    duration: 0.7, // Durée de chaque cycle de vibration
                  }}
               className='mb-2  select-field px-2  flex text-white items-center gap-2'> <BiMoney className='text-white text-2xl'/>{t('layout.gererPay')}</motion.button></Link>
            </div>
              <div className="section">
                        <div className="parent-con">
                            <div className="data-table">
                                <div className="top">
                                    <div className="span">
                                        <h1>Valide Years</h1>
                                    </div>
                                    {/* <form className="search">
                                        <input type="search" name="" id="" placeholder="Find ..." />
                                        <button type="submit"><i className="fa fa-search" aria-hidden="true"></i></button>
                                    </form> */}
                                    <button onClick={toggleAddModal} className="btn btn-primary btn-add student-button">{t('layout.abonnement')}  <i className="fas fa-plus"><BiPlusMedical /></i></button>
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
                                          {applications.map((data: any, index: any) => <tr key={index}>
                                                <td className="flex-center">{index + 1}</td>

                                                <td className="flex-start">
                                                    <p>{data?.school_id?.username}</p>
                                                </td>

                                                <td className="flex-start">
                                                    <p>{data?.speciality_id?.name}</p>
                                                </td>
                                    
                                                <td className="flex-start">{data?.academic_year?.title}</td>
                                                
                                                <td className="flex-start">{data?.fees_paid}</td>

                                                <td className="flex-start">{data?.total_fees}</td>
                                                
                                                <td className="flex-start">{data?.status}</td>

                                                <td className="flex-start">
                                                    <p>{convertDate(data?.createdAt)}</p>
                                                </td>

                                    
                                            </tr> )}
                                        </tbody>
                                    </table>
                                    <div>

            
            
             <div className="mt-20">
            <h2 className="text-center text-2xl text-blue-500 uppercase flex items-center gap-2 justify-center font-bold">Mes Performances<SiBaremetrics /></h2>
            
            {loadingElement ? (
                  <BeatLoader
                  color="#623d91" 
                  loading={loadingElement}
                  cssOverride={override}
          />
            ) : (
                <>
                  <div className="mt-10 mb-2">
                        <div className="flex items-center gap-2 ">
                        <span className="flex items-center transform  translate-x-7"><AiTwotoneFilter /></span>
                           <select name="" id="" onChange={(e: any) => handleGetElements(e.target.value)} value={selectionTest}  className="py-1 border-2 border-solid rounded-sm border-black px-5 select-field text-white"> 
                           <option value="" className="text-white" >selectionnez un test</option>
                           <option value="comprehension orale" className="text-white">Comprehension Orale</option>
                           <option value="comprehension ecrite" className="text-white">Comprehension Ecrite</option>
                           <option value="expression orale" className="text-white">Expression Orale</option>
                           <option value="expression ecrite" className="text-white">Expression Ecrite </option>
                           </select>
                        </div>

                    </div>
                    {barData?.labels && (<div>
                        <h3>
                            niveau Obtenu en {selectionTest} :</h3>
                        <Bar data={barData} />
                    </div>)}  

                  
                    {pieData?.labels && (<div className="mt-5 w-[100%] flex justify-center">
                        
                        <h3 className="text-blue-500 flex items-center gap-2"><AiTwotonePieChart />Diagramme Circulaire :</h3>
                        <div className="w-[50%] mt-10 ">
                        <Pie data={pieData?.labels ? pieData : exampleBarData}  className=""/>

                        </div>
                    </div>)} 

                </>
            )}
        </div>
                                    </div>
                                </div>


                            </div>
                        </div>
                    </div>

                    {showJoinModal &&  <JoinClassModal onClassAdded={handleClassAdded} onClose={toggleAddModal} />}
        </StudentLayout>
    );
}

export default Index;
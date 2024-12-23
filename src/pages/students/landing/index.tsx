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
} from 'chart.js';
import moment from 'moment';


ChartJS.register(
    BarElement,
    CategoryScale,
    LinearScale,
    Tooltip,
    Legend
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
    const toggleAddModal = () => {
        setShowJoinModal(!showJoinModal);
    }

//phase de tesy
const exampleBarData = {
    labels: ['Label 1', 'Label 2'],
    datasets: [
        {
            label: 'Scores',
            data: [10, 20],
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
        console.log("locale", lng);
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

     const handleGetElements =() => { 
        setLoadingElement(true);
        setAllElement([]);

        selectResultat().then((res: any) => {
            console.log('RESPONSE GET: ', res);
            if(res.ok) {
                setAllElement(res.data.data);
            }
            setLoadingElement(false);
        }).catch(err => {
            console.log('error: ', err);
            setLoadingElement(false);
        })

        }

 // Préparer les données pour les graphiques lorsque allElement change
 useEffect(() => {
    if (allElement.length === 0) return;

    const labels = allElement.map(
        (item: any) => `${item.typeTest} (${item.niveau})`
    );
    const avgScores = allElement.map((item: any) => item.avgScore);
    const counts = allElement.map((item: any) => item.count);

    // Données pour l'histogramme
    setBarData({
        labels,
        datasets: [
            {
                label: 'Score Moyen',
                data: [0,2],
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 2,
            },
        ],
    });

    // Données pour le diagramme circulaire
    setPieData({
        labels,
        datasets: [
            {
                label: 'Proportion des Tests',
                data: counts,
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
}, [allElement]);





    const handleGetApplications = ()  => {
        setLoading(true);
        setApplications([]);
        getStudentApplications().then((res: any) => {
            console.log('RESPONSE GET: ', res);
            if(res.ok) {
                setApplications(res.data.data);
            }
            setLoading(false);
        }).catch(err => {
            console.log('error: ', err);
            setLoading(false);
        })
    }

 

    const handleClassAdded = ()  => {
        handleGetApplications();
        toggleAddModal();
    }

    useEffect(() => {
        handleGetApplications();
    },[activeAcademyYear]);

        useEffect(() => {
            console.log('Bar Data:', barData);
            handleGetElements();
        },[]);
    
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

                                         <div className="mt-10">
            <h2 className="text-center">Analyse Statistique</h2>
            {loadingElement ? (
                  <BeatLoader
                  color="#623d91" 
                  loading={loadingElement}
                  cssOverride={override}
          />
            ) : (
                <>
                     <div>
                        <h3>Histogramme :</h3>
                        <Bar data={exampleBarData} />
                    </div>
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
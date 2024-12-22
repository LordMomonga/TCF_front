import React, { useState, useEffect, useContext }  from 'react';
import './coursecontent.css';
import { AiOutlinePaperClip } from 'react-icons/ai';
import StudentLayout from '../../../components/StudentLayout/StudentLayout';

import { AssessmentModal, EditCourseContentModal, DeleteModal, PassExammodal, VideoPlayerModal, PreviewPdfModal  } from '../../../components';
import UploadFollowupSolutionModal from '../../../components/students/UploadFollowupSolutionModal/UploadFollowupSolutionModal';
import { AiFillEye } from 'react-icons/ai';
import {  BsPencilSquare } from 'react-icons/bs';
import { IoMdCloudDownload } from 'react-icons/io';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { BiChevronDown } from 'react-icons/bi'
import { FaLightbulb, FaBrain, FaCheckCircle } from 'react-icons/fa'
import { FaExclamationTriangle, FaInfoCircle,  } from 'react-icons/fa'
import { FaHeadphones, FaQuestionCircle, FaListUl } from 'react-icons/fa'
import { useTranslation } from 'react-i18next';

import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';

import { getClasses, deleteClass } from '../../../services/classroom';
import { getPassExamContents, deletePassExamContent } from '../../../services/passExams';
import { getCourseContent, getAcceptedClasses } from '../../../services/student';
import { FaClock, FaFileAlt, FaBook, FaNewspaper } from 'react-icons/fa'

import BeatLoader from "react-spinners/BeatLoader";
import { convertDate } from '../../../utils/date';

import moment from 'moment';
import AcademicYearContext from '../../../contexts/AcademicYearContext';

const rows: any = [
    {
        label: '#',
        name: 'num'
    },
    {
        label: 'Title',
        name: 'name'
    },
    {
        label: 'Pdf Content',
        name: 'name'
    },
    {
        label: 'Video Content',
        name: 'name'
    },
    {
        label: 'Follow-up File',
        name: 'name'
    },
    {
        label: 'Follow-up Solution',
        name: 'name'
    },
    {
        label: 'Created Date',
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

  const { t, i18n } = useTranslation();
    let [lang, setLang] = useState<any>(null);

    // NEW
    const [selectedClass, setSelectedClass] = useState("all");

    // END
    const {activeAcademyYear, setActiveAcademyYear} = useContext<any>(AcademicYearContext);
    const [ showAddModal, setShoowAddModal ] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false); 
    const [deleteModal, setShowDeleteModal] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const [contents, setContents] = useState([]);
    const [isCo, setisCo] = useState(false);
    const [isEo, setisEo] = useState(false);
    const [isEE, setisEE] = useState(false);
    const [activeTab, setActiveTab] = useState('synthese')

    const [editData, setEditData] = useState(null);

    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(false);

    const [showVideoModal, setShowVideoModal] = useState(false);
    const [videoUrl, setVideoUrl] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [isAstuce, setisAstuce] = useState(false);
    const [isAlert, setisAlert] = useState(false);
    const [isAstuceCO, setisAstuceCO] = useState(false);
    const [isAlertECO, setisAlertCO] = useState(false);
    const [isAstuceEO, setisAstuceEO] = useState(false);
    const [isAlertEO, setisAlertEO] = useState(false);
    const [isAstuceEE, setisAstuceEE] = useState(false);
    const [isAlertEE, setisAlertEE] = useState(false);

    const [openSection, setOpenSection] = useState<number | null>(null)

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

  const sections = [
    {
      title: `${t('secret.section.title1')}`,
      content: [
        `${t('secret.section.content1.first1')}`,
        `${t('secret.section.content1.first2')}`,
        `${t('secret.section.content1.first3')}`,
        `${t('secret.section.content1.first4')}`,
        `${t('secret.section.content1.first5')}`,
        `${t('secret.section.content1.first6')}`,
        `${t('secret.section.content1.first7')}`,
        `${t('secret.section.content1.first8')}`,
        `${t('secret.section.content1.first9')}`,
        `${t('secret.section.content1.first10')}`,
        `${t('secret.section.content1.first11')}`
      ]
    },
    {
      title: `${t('secret.section.title2')}`,
      content: [
        `${t('secret.section.content2.first1')}`,
        `${t('secret.section.content2.first2')}`,
        `${t('secret.section.content2.first3')}`,
        `${t('secret.section.content2.first4')}`,
        `${t('secret.section.content2.first5')}`,
        `${t('secret.section.content2.first6')}`
      ]
    },
    {
      title: `${t('secret.section.title3')}`,
      content: [
        `${t('secret.section.content3.first1')}`,
        `${t('secret.section.content3.first2')}`,
        `${t('secret.section.content3.first3')}`,
        `${t('secret.section.content3.first4')}`,
        `${t('secret.section.content3.first5')}`,
        `${t('secret.section.content3.first6')}`
      ]
    }
  ]
  const [expandedSection, setExpandedSection] = useState<number | null>(null)
  const [expandedSection1, setExpandedSection1] = useState<number | null>(null)

  const examInfo = [
    { icon: FaClock, title: `${t('secret.time')}`, content: "1 heure" },
    { icon: FaFileAlt, title: "Questions", content: "39 questions" },
    { icon: FaBook, title: "Gestion du temps", content: "Libre (possibilité de revenir sur les questions)" },
  ]
  const tips = [
    {
      title: `${t('secret.conseil')}`,
      icon: FaLightbulb,
      content: [
        "Apprenez à lire très rapidement un texte en essayant de le comprendre le plus rapidement possible.",
        "Ne passez plus sur les longs textes, même sur les réseaux sociaux et partout d'ailleurs, lisez-les !",
        "Ça travaille votre capacité à intégrer rapidement et ça exerce votre cerveau.",
        "Prenez au sérieux ceci car si votre cerveau est bien exercé vous aurez votre C2 soit 602 points et plus."
      ]
    },
    {
      title: "Astuces en Compréhension Écrite",
      icon: FaBrain,
      content: [
        "Commencez par les dernières questions. Votre mémoire est encore fraîche juste après la compréhension orale.",
        "Lisez la question posée avant le texte en lui-même.",
        "En lisant le texte, essayez de répondre à la question posée.",
        "Annulez les deux questions qui n'ont rien à voir avec la question posée.",
        "Des deux restantes, éliminez le distracteur qui se rapproche très souvent de la réponse vraie.",
        "Gardez la réponse juste qui renvoie à la question posée."
      ]
    }
  ]

  const tips1 = [
    {
      title: "ATTENTION : Ne pas confondre vitesse et précipitation",
      icon: FaExclamationTriangle,
      content: [
        "Lisez d'abord la question et les 04 propositions de réponses avant d'aller lire le texte.",
        "Il y a beaucoup d'infos inutiles et de pièges dans le texte pour vous perdre.",
        "En lisant d'abord les questions et les propositions de réponses, vous aurez un aperçu de ce qui est demandé et cela réduit le champ d'investigation."
      ]
    },
    {
      title: "Stratégies de lecture",
      icon: FaInfoCircle,
      content: [
        "Si le texte contient un titre, commencez par le comprendre car il contient généralement l'idée générale.",
        "Pour les textes avec des paragraphes, recherchez l'idée de chaque paragraphe en faisant attention aux connecteurs logiques.",
        "Certains paragraphes peuvent ne pas suivre la logique générale du texte.",
        "Faites toujours attention aux temps des verbes.",
        "Si vous ne comprenez pas bien une question malgré plusieurs lectures, passez à la suivante et revenez-y plus tard.",
        "Si une question est centrée sur le lieu, abordez le texte sous cet angle spécifique."
      ]
    }
  ]

  const documentTypes = [
    "Messages courts et simples",
    "Lettres amicales, professionnelles ou administratives",
    "Documents portant sur des horaires, menus et annonces",
    "Articles de presse",
    "Comptes rendus",
    "Extraits d'œuvres littéraires",
    "Ouvrages spécialisés",
  ]

  const skills = [
    "Identifier les informations générales et détaillées dans les documents de la vie quotidienne ou professionnelle",
    "Comprendre des informations précises sur des personnes, des faits ou des évènements",
    "Comprendre des textes portant sur des thèmes concrets ou abstraits",
  ]

  const [expandedSection2, setExpandedSection2] = useState<number | null>(null)

  const sections1 = [
    {
      title: "Aperçu de l'épreuve",
      icon: FaHeadphones,
      content: [
        "Première épreuve de l'examen du TCF",
        "Durée : 35 minutes",
        "39 questions",
        "Teste la capacité à comprendre le français parlé dans des situations quotidiennes ou professionnelles",
        "L'écoute se fait en une seule fois"
      ]
    },
    {
      title: "Structure de l'épreuve",
      icon: FaListUl,
      content: [
        "La bande audio se divise en 4 parties :",
        "L'extrait audio sur la situation",
        "L'énoncé de la question",
        "Les propositions de réponses dans certains cas",
        "Les consignes de l'examen, les images de la situation décrite, les propositions de réponses, les questions"
      ]
    },
    {
      title: "Compétences évaluées",
      icon: FaCheckCircle,
      content: [
        "Comprendre des mots familiers et des expressions courantes",
        "Repérer l'essentiel des informations dans des messages ou annonces courtes",
        "Identifier le sujet d'une conversation, suivre des exposés",
        "Comprendre les informations présentées de manière complexe",
        "Comprendre un discours prononcé à un débit rapide"
      ]
    }
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  }


    const fadeIn = {
      hidden: { opacity: 0 },
      visible: { opacity: 1 }
    }
  
    const slideIn = {
      hidden: { x: -50, opacity: 0 },
      visible: { x: 0, opacity: 1 }
    }

    const toggleModal = () => {
        setIsOpen(!isOpen);
      };
      const toggleco = () => {
        setisCo(!isCo);
      };
      const toggleEo = () => {
        setisEo(!isEo);
      };
      const toggleEE = () => {
        setisEE(!isEE);
      };

      const toggleAstuce = () => {
        setisAstuce(!isAstuce);
        setIsOpen(!isOpen);
      };
      const toggleAlerte = () => {
        setisAlert(!isAlert);
        setIsOpen(!isOpen);
      };
      const toggleAstuceco = () => {
        setisAstuceCO(!isAstuceCO);
        setisCo(!isCo);
      };
      const toggleAlerteco = () => {
        setisAlertCO(!isAlertECO);
        setisCo (!isCo);
      };
      const toggleAstuceEE = () => {
        setisAstuceCO(!isAstuceCO);
        setisCo(!isCo);
      };
      const toggleAlerteEE = () => {
        setisAlertCO(!isAlertECO);
        setisCo (!isCo);
      };
      const toggleAstuceEo = () => {
        setisAstuceCO(!isAstuceCO);
        setisCo(!isCo);
      };
      const toggleAlerteEo = () => {
        setisAlertCO(!isAlertECO);
        setisCo (!isCo);
      };
    

    const toggleVideoModal = () => {
        setShowVideoModal(!showVideoModal);
    }

    const handleSetVideoUrl = (url: any) =>  {
        setVideoUrl(url);
        toggleVideoModal();
    }  
    
    const toggleAddModal = () => {
        setShoowAddModal(!showAddModal);
    }

    const toggleEditModal = () => {
        setShowEditModal(!showEditModal);
    }

    const toggleDeleteModal = () => {
        setShowDeleteModal(!deleteModal);
    }

    const handleGetValidClasses = ()  => {
        setContents([]);
        setClasses([]);
        setSelectedClass('all');

        getAcceptedClasses().then((res: any) => {
            console.log('RES ACCEPTED: ', res);

            if(res.ok) {
                setClasses(res.data.data);
            }
        }).catch(err => {
            console.log('error: ', err);
        })
    }

   

    const handleDeleteCourseExamContent = () => {
        console.log('DELETE COURSE CONTENT');
        console.log(deleteId)
        deletePassExamContent(deleteId).then((res: any) => {
            if(res.ok) {
                toggleDeleteModal();
                handleGetValidClasses();
                toast.success(res.data.message, {
                    pauseOnHover: false,
                    closeOnClick: true,
                })
          
            }else {
                toast.error(res.data.message, {
                    pauseOnHover: false,
                    closeOnClick: true,
                })
            }
        }).catch(err => {
            toast.error("ERROR", {
                pauseOnHover: false,
                closeOnClick: true,
            })
        })
    }

    const handleContentAdded = ()  => {
        handleGetContent(selectedClass);
        toggleAddModal();
    }


    const handleGetContent = (classId: any) => {
        setLoading(true);
        if(classId == 'all') {
            // Don't make request
            setLoading(false);
            setContents([]);
            return;
        }

        getCourseContent(classId).then((res: any) => {
            console.log("COURSE CONTENT: ",res);
            setLoading(false);
            setContents(res.data.data);
        }).catch((err: any) => {
            console.log('Error: ', err);
            setLoading(false);
        })
    }

    useEffect(() => {
        console.log('USER EFFECT RAN')
        handleGetValidClasses();
    },[activeAcademyYear]);

    useEffect(() => {
      changeLang()
    }, [lang]);

    return (
        <StudentLayout title={t('layout.title_course')} pageTitle={t('layout.title_course')}>
      <div className="section">
            <div className="parent-con">
                <div className="data-table">
                    <div className="top">
                        <div className="span">
                            <select value={selectedClass} onChange={(e) => {
                                setSelectedClass(e.target.value);
                                handleGetContent(e.target.value);
                            }} className="select-field" id="student-select-new">
                                <option value="all">{t('layout.button_cours')}</option>
                                {classes.map((classData: any, index: any) => <option key={index} value={classData?._id}>{classData?.name}</option>)}
                            </select>
                        </div>
                        {/* <form className="search">
                            <input type="search" name="" id="" placeholder="Find ..." />
                            <button type="submit"><i className="fa fa-search" aria-hidden="true"></i></button>
                        </form> */}
                        {/* <button onClick={toggleAddModal} className="btn btn-primary btn-add"> Upload Solution <i className="fas fa-plus"></i></button> */}
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
                                {contents?.map((data: any, index: any) => <tr>
                                    <td className="flex-center">{index + 1}</td>
                                    <td className="flex-start">
                                        <p>{data.title}</p>
                                    </td>
                            
                                    <td className="flex-start">{data?.pdf_file_url ? <a href={data?.pdf_file_url} target="_blank" download>Pdf Content g</a> : "None"}</td>
                                    <td className="flex-start">{data?.video_url ? <a href={data?.video_url} target="_blank" download>Video Content</a> : "None"}</td>
                                    <td className="flex-start">{data?.followup_file_url ? <a href={data?.followup_file_url} target="_blank" download>Foolow-up File</a> : "None"}</td>
                                    <td className="flex-start">{data?.followup_solution_url ? <a href={data?.followup_solution_url} target="_blank" download>Solution File</a> : "Not yet available"}</td>                           
                                    <td className="flex-start">
                                        <p>{convertDate(data?.createdAt)}</p>
                                    </td>
                                    <td className="flex-center">
                                        <div className="action">
                                          {data?.video_url.length > 2 &&  <Tippy content="View Video Content"  animation="fade">
                                            <a onClick={() => handleSetVideoUrl(data?.video_url)} className="see"><AiFillEye onClick={() => null} size={14}/></a>
                                            </Tippy>}
                                        {
                                            data?.pdf_file_url.length > 2 && <Tippy content="Pdf Content"  animation="fade">
                                            <a href={data?.pdf_file_url}  download target="_blank" className="see"><IoMdCloudDownload onClick={() => null} size={14}/></a>
                                            </Tippy>}
                                        </div>
                                    </td>

                                 
                                </tr> )}
                            </tbody>
                        </table>
                    </div>

                </div>
            </div>
        </div>
        <div className='text-center  bg-white py-4  '>
           <h1 className='font-bold text-4xl underline underline-offset-2 mb-5  '>
           {t('layout.secret')}            </h1> 
            <span className='flex flex-col items-stretch space-y-3 p-4'>
      <button
        onClick={toggleModal}
        className="select-field flex items-center gap-2  uppercase text-white px-3  hover:px-10  rounded hover:bg-blue-700 text-start hover:mb-5 "
      >
    ­  
    <span className="w-7 h-7 bg-white flex justify-center items-center rounded-full p-1">
    <FaBrain></FaBrain>
      </span>  comprehension Ecrite
      </button>
      <button
        onClick={toggleco}
        className=" select-field flex items-center gap-2  uppercase text-white px-5  hover:px-10  rounded hover:bg-blue-700 text-start hover:mb-5"
      >
        <span className="w-7 h-7 bg-white flex justify-center items-center rounded-full p-1"><FaHeadphones></FaHeadphones></span>
        comprehension orale
      </button>
      <button
        onClick={toggleEE}
        className="flex items-center gap-2   uppercase text-white rounded px-5 select-field hover:px-10 text-start hover:mb-5 "
      >
                <span className="w-7 h-7 bg-white flex justify-center items-center rounded-full p-1"> <FaListUl></FaListUl></span>

        Expression Ecrite
      </button>
      <button
        onClick={toggleEo}
        className="flex items-center gap-2 uppercase  select-field text-white px-5 hover:px-10 rounded text-start hover:mb-5"
      >
                <span className="w-7 h-7 bg-white flex justify-center items-center rounded-full p-1">  <FaNewspaper></FaNewspaper></span>

        Expression Orale
      </button>
            </span>
        </div>

       
        {showAddModal &&  <UploadFollowupSolutionModal onContentAdded={handleContentAdded} onClose={toggleAddModal} />}
        {showEditModal &&  <EditCourseContentModal data={editData} onContentAdded={handleContentAdded} onClose={toggleEditModal} />}
        {deleteModal && <DeleteModal onAccept={handleDeleteCourseExamContent} onCancel={toggleDeleteModal} />}
        {showVideoModal && <VideoPlayerModal video={videoUrl} onClose={toggleVideoModal}/>}
        
        {isAstuce &&(
            <div className='fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 '>
             <motion.div 
                  initial={{ x: '-100vw', opacity: 0 }} // Position de départ (hors écran à gauche)
                  animate={{ x: 0, opacity: 1 }} // Position finale (à l'endroit normal)
                  transition={{
                    type: 'spring', // Utilise un effet de ressort pour l'animation
                    stiffness: 60, // Ajuste la vitesse du ressort
                    damping: 10, // Contrôle l'effet de rebond
                    duration: 0.8 // Durée de l'animation 
                    }}
             
             className=" bg-white rounded-lg w-11/12 md:w-2/3 p-4 max-h-screen overflow-y-auto">
             <div className="flex justify-between items-center border-b pb-2">
              <h2 className="text-lg font-semibold text-center uppercase "><span className='text-green-500'>SECRET : </span>ASTUCES</h2>
              <button
                onClick={toggleAstuce}
                className="text-gray-500 hover:text-gray-700"
              >
                &#x2715;
              </button>
            </div>
            <div>
            <div className="min-h-screen bg-gray-50 text-gray-800 p-8">
      <motion.div
        className="max-w-4xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h1 
          className="text-4xl font-bold mb-8 text-center text-blue-600"
          variants={itemVariants}
        >
          Conseils et Astuces pour le TCF Canada
        </motion.h1>

        {tips.map((section, index) => (
          <motion.div
            key={index}
            className="mb-8 bg-white rounded-lg shadow-md overflow-hidden"
            variants={itemVariants}
          >
            <button
              className="w-full text-left p-6 flex items-center justify-between focus:outline-none"
              onClick={() => setExpandedSection1(expandedSection1 === index ? null : index)}
            >
              <div className="flex items-center">
                <section.icon className="w-8 h-8 text-blue-500 mr-4" />
                <h2 className="text-2xl font-semibold">{section.title}</h2>
              </div>
              <FaCheckCircle 
                className={`w-6 h-6 transition-transform duration-300 ${expandedSection1 === index ? 'text-green-500 transform rotate-180' : 'text-gray-400'}`}
              />
            </button>
            <motion.div
              initial={false}
              animate={{ height: expandedSection1 === index ? 'auto' : 0, opacity: expandedSection1 === index ? 1 : 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <ul className="p-6 space-y-4 bg-blue-50">
                {section.content.map((tip, tipIndex) => (
                  <motion.li 
                    key={tipIndex}
                    className="flex items-start"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: tipIndex * 0.05 }}
                  >
                    <FaCheckCircle className="w-5 h-5 text-green-500 mr-2 mt-1 flex-shrink-0" />
                    <span>{tip}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </motion.div>
        ))}

        <motion.p 
          className="mt-8 text-center text-lg font-semibold text-blue-600"
          variants={itemVariants}
        >
          Suivez ces conseils pour maximiser vos chances de réussite au TCF Canada !
        </motion.p>
      </motion.div>
    </div>
            </div>
            </motion.div>
            </div>
        )}
        {isAlert &&(
            <div className='fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 '>
             <motion.div
                  initial={{ x: '-100vw', opacity: 0 }} // Position de départ (hors écran à gauche)
                  animate={{ x: 0, opacity: 1 }} // Position finale (à l'endroit normal)
                  transition={{
                    type: 'spring', // Utilise un effet de ressort pour l'animation
                    stiffness: 60, // Ajuste la vitesse du ressort
                    damping: 10, // Contrôle l'effet de rebond
                    duration: 0.8 // Durée de l'animation 
                    }}
             
             className=" bg-white rounded-lg w-11/12 md:w-2/3 p-4 max-h-screen overflow-y-auto">
             <div className="flex justify-between items-center border-b pb-2">
              <h2 className="text-lg font-semibold text-center uppercase text-red-500 "><span className=''>SECRET : </span>ATTENTION</h2>
              <button
                onClick={toggleAlerte}
                className="text-gray-500 hover:text-gray-700"
              >
                &#x2715;
              </button>
            </div>
            <div>
            <div className="min-h-screen bg-gray-50 text-gray-800 p-8">
      <motion.div
        className="max-w-4xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h1 
          className="text-4xl font-bold mb-8 text-center text-red-600"
          variants={itemVariants}
        >
          Conseils Supplémentaires pour le TCF Canada
        </motion.h1>

        {tips1.map((section, index) => (
          <motion.div
            key={index}
            className="mb-8 bg-white rounded-lg shadow-md overflow-hidden"
            variants={itemVariants}
          >
            <button
              className="w-full text-left p-6 flex items-center justify-between focus:outline-none"
              onClick={() => setExpandedSection2(expandedSection2 === index ? null : index)}
            >
              <div className="flex items-center">
                <section.icon className={`w-8 h-8 mr-4 ${index === 0 ? 'text-red-500' : 'text-blue-500'}`} />
                <h2 className="text-2xl font-semibold">{section.title}</h2>
              </div>
              <FaCheckCircle 
                className={`w-6 h-6 transition-transform duration-300 ${expandedSection2 === index ? 'text-green-500 transform rotate-180' : 'text-gray-400'}`}
              />
            </button>
            <motion.div
              initial={false}
              animate={{ height: expandedSection2 === index ? 'auto' : 0, opacity: expandedSection2 === index ? 1 : 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <ul className={`p-6 space-y-4 ${index === 0 ? 'bg-red-50' : 'bg-blue-50'}`}>
                {section.content.map((tip, tipIndex) => (
                  <motion.li 
                    key={tipIndex}
                    className="flex items-start"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: tipIndex * 0.05 }}
                  >
                    <FaCheckCircle className={`w-5 h-5 mr-2 mt-1 flex-shrink-0 ${index === 0 ? 'text-red-500' : 'text-blue-500'}`} />
                    <span>{tip}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </motion.div>
        ))}

        <motion.p 
          className="mt-8 text-center text-lg font-semibold text-red-600"
          variants={itemVariants}
        >
          Appliquez ces conseils pour optimiser votre performance au TCF Canada !
        </motion.p>
      </motion.div>
    </div>
            </div>
            </motion.div>
            </div>
        )}
        {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className=' py-5 absolute right-0 text-gray-500  top-0 md:w-1/6 px-3'>
            <motion.button
            onClick={toggleAlerte}
      className="bg-red-500 text-white rounded-md py-2 px-4"
      // Animation pour faire vibrer le bouton
      animate={{
        x: [0, -10, 10, -10, 5, 0], // Déplace de gauche à droite pour l'effet de vibration
      }}
      transition={{
        repeat: Infinity, // Répète l'animation à l'infini
        repeatType: "loop", // Boucle l'animation
        duration: 0.7, // Durée de chaque cycle de vibration
      }}
    >
      ATTENTION NE PAS CONFONDRE VITESSE ET PRECIPITATION
    </motion.button >
          </div>
          <div className=' py-5 absolute left-0 text-gray-500  top-0 md:w-1/6 px-3'>
     <motion.button
     onClick={toggleAstuce}
      className="bg-green-500 text-white rounded-md py-2 px-4"
      // Animation pour faire vibrer le bouton
      animate={{
        x: [0, -10, 10, -10, 5, 0], // Déplace de gauche à droite pour l'effet de vibration
      }}
      transition={{
        repeat: Infinity, // Répète l'animation à l'infini
        repeatType: "loop", // Boucle l'animation
        duration: 0.7, // Durée de chaque cycle de vibration
      }}
    >
      ASTUCES
    </motion.button >
          </div>
        
          <motion.div 
           initial={{ x: '-100vw', opacity: 0 }} // Position de départ (hors écran à gauche)
           animate={{ x: 0, opacity: 1 }} // Position finale (à l'endroit normal)
           transition={{
             type: 'spring', // Utilise un effet de ressort pour l'animation
             stiffness: 60, // Ajuste la vitesse du ressort
             damping: 10, // Contrôle l'effet de rebond
             duration: 0.8 // Durée de l'animation 
             }}
          className="bg-white rounded-lg w-11/12 md:w-2/3 p-4 max-h-screen overflow-y-auto">
            <div className="flex justify-between items-center border-b pb-2">
              <h2 className="text-lg font-semibold text-center uppercase "><span className='text-green-500'>SECRET : </span>Compréhension Écrite</h2>
              <button
                onClick={toggleModal}
                className="text-gray-500 hover:text-gray-700"
              >
                &#x2715;
              </button>
            </div>
            <div className="mt-4">
             
             
            <div className="min-h-screen bg-white text-gray-800 p-8">
      <motion.div
        className="max-w-4xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h1 
          className="text-4xl font-bold mb-8 text-center text-blue-600"
          variants={itemVariants}
        >
          Épreuve de Compréhension Écrite - TCF Canada
        </motion.h1>

        <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8" variants={containerVariants}>
          {examInfo.map((info, index) => (
            <motion.div 
              key={index}
              className="bg-blue-50 p-6 rounded-lg shadow-md flex flex-col items-center"
              variants={itemVariants}
            >
              <info.icon className="w-12 h-12 text-blue-500 mb-4" />
              <h2 className="text-xl font-semibold mb-2">{info.title}</h2>
              <p className="text-center">{info.content}</p>
            </motion.div>
          ))}
        </motion.div>

        <motion.div className="mb-8" variants={containerVariants}>
          <motion.h2 className="text-2xl font-semibold mb-4" variants={itemVariants}>
            Compétences Évaluées
          </motion.h2>
          <motion.ul className="list-disc pl-6 space-y-2" variants={containerVariants}>
            {skills.map((skill, index) => (
              <motion.li key={index} variants={itemVariants}>{skill}</motion.li>
            ))}
          </motion.ul>
        </motion.div>

        <motion.div variants={containerVariants}>
          <motion.h2 className="text-2xl font-semibold mb-4" variants={itemVariants}>
            Types de Documents
          </motion.h2>
          <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-4" variants={containerVariants}>
            {documentTypes.map((type, index) => (
              <motion.div 
                key={index}
                className="bg-gray-50 p-4 rounded-lg shadow flex items-center space-x-3"
                variants={itemVariants}
              >
                <FaNewspaper className="w-6 h-6 text-blue-500 flex-shrink-0" />
                <span>{type}</span>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        <motion.p 
          className="mt-8 text-center text-lg font-semibold text-blue-600"
          variants={itemVariants}
        >
          Cette épreuve suit directement l'épreuve de Compréhension Orale. 
          Gérez votre temps efficacement et bonne chance !
        </motion.p>
      </motion.div>
    </div>
             
             
              </div>
          </motion.div>
        </div>

       
      )}
        {isAstuceCO &&(
            <div className='fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 '>
             <div className=" bg-white rounded-lg w-11/12 md:w-2/3 p-4 max-h-screen overflow-y-auto">
             <div className="flex justify-between items-center border-b pb-2">
              <h2 className="text-lg font-semibold text-center uppercase "><span className='text-green-500'>SECRET : </span>ASTUCES</h2>
              <button
                onClick={toggleAstuceco}
                className="text-gray-500 hover:text-gray-700"
              >
                &#x2715;
              </button>
            </div>
            <div>
            <div className="mt-2">
            En fait il faut écouter l'audio et lire les choix de réponses simultanément. Ce test requiert beaucoup de
             concentration de la part du candidat.
             Vous devez vous relâcher et faire le vide dans votre tête en restant très,très,hyper concentré (e). 
             <strong>Votre score en dépendra</strong>
            <h3 className="font-semibold text-center mt-2 mb-3">A. Quelques Conseils et astuces</h3>
                <ul className="list-disc list-inside">
                  <li className='list-disc ml-10'>
                    <strong> Il y'a un temps d'arrêt avant le début de l'audio ,</strong>
                    profitez-en pour lire les propositions de réponses ci possible,

                  </li>
                  <li className='list-disc ml-10'>
                  sinon, En écoutant l'audio rechercher le lien avec la réponse la plus juste,
                  </li>
                  <li className='list-disc ml-10'>
                  Lorsqu'un audio a déjà été vu et écoute durant les cours , cocher la 
                  réponse rapidement et commencer la lecture des propositions de réponses 
                  de la question suivante en attendant l'audio afin de confirmer sa réponse,
                  </li>
                  <li className='list-disc ml-10'>
                  Il y'a deux réponses qui n'ont rien à voir avec le sujet et la question posée les éliminer. 
                  </li>
                  <li className='list-disc ml-10'>
                  Des deux autres restantes il y'a le distracteur il faut le répérer et l'annuler 
                  après avoir écouter la question posée à la fin
                  </li>
                  <li className='list-disc ml-10'>
                  Choisir la bonne réponse
                  </li>
                  
                </ul>
              
            
               
              </div>
            </div>
            </div>
            </div>
        )}
        {isAlertECO &&(
            <div className='fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 '>
             <div className=" bg-white rounded-lg w-11/12 md:w-2/3 p-4 max-h-screen overflow-y-auto">
             <div className="flex justify-between items-center border-b pb-2">
              <h2 className="text-lg font-semibold text-center uppercase text-red-500 "><span className=''>SECRET : </span>ATTENTION</h2>
              <button
                onClick={toggleAlerteco}
                className="text-gray-500 hover:text-gray-700"
              >
                &#x2715;
              </button>
            </div>
            <div>
            <div className="mt-2">
              <h3 className="font-semibold text-center mt-2 text-4xl text-red-500 mb-5 ">ATTENTION </h3>
               <p className='list-disc  mt-5' style={{ textIndent: '2rem' }}>
               NE PAS CONFONDRE VITESSE ET PRECIPITATION
              Lire d'abord la question et les 04 propositions de réponses avant d'aller lire le texte simplement parce qu’il y'a beaucoup d'infos inutiles placées dans le texte et de pièges pour vous perdre. 
               Des phrases qui n'ont rien à voir avec l'idée générale du texte juste pour brouiller des pistes.
               <strong>En lisant d'abord les questions et les propositions de réponses 
               ça donne déjà un aperçu de ce qui nous ait demandé et ça réduit le champ d'investigation.
               </strong>
               </p>
               <p className='list-disc ' style={{ textIndent: '2rem' }}>
                <strong>  Si le texte contient un titre,</strong>
                commencez par comprendre le titre car il s'y trouve généralement l'idée générale et il
                 donne des précisions sur ce qu'on recherche.
               </p>
               <p className='list-disc ' style={{ textIndent: '2rem' }}>
                <strong>Si le texte contient des paragraphes</strong>rechercher l'idée de chaque paragraphe
                 en faisant attention aux connecteurs logiques. Parfois vous verrez que certains paragraphes 
                 avec leurs idées ne suivent pas la logique générale du test.

                
               </p>
               <p> <strong> Toujours faire attention aux temps des verbes</strong></p>
            
                <ul className="list-disc pl-5 mt-2 space-y-2">
                    <li className='list-disc '>
                    Si vous ne comprenez pas bien une question malgré l'instance dans la lecture,
                     passez à la suivante et revenez quand vous aurez terminé. 
                    </li>
                    <li className='list-disc '>
                    Si une question est centrée sur le lieu, on le sait par les propositions de réponse
                     et la question on saura sous quel angle aborder le texte et le lire.
                    </li>
                </ul>
              </div>
            </div>
            </div>
            </div>
        )}
        {isCo && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className=' py-5 absolute right-0 text-gray-500  top-0 md:w-1/6 px-3'>
            <motion.button
            onClick={toggleAlerteco}
      className="bg-red-500 text-white rounded-md py-2 px-4"
      // Animation pour faire vibrer le bouton
      animate={{
        x: [0, -10, 10, -10, 5, 0], // Déplace de gauche à droite pour l'effet de vibration
      }}
      transition={{
        repeat: Infinity, // Répète l'animation à l'infini
        repeatType: "loop", // Boucle l'animation
        duration: 0.7, // Durée de chaque cycle de vibration
      }}
    >
      ATTENTION 
    </motion.button >
          </div>
        
          <motion.div 
           initial={{ x: '-100vw', opacity: 0 }} // Position de départ (hors écran à gauche)
           animate={{ x: 0, opacity: 1 }} // Position finale (à l'endroit normal)
           transition={{
             type: 'spring', // Utilise un effet de ressort pour l'animation
             stiffness: 60, // Ajuste la vitesse du ressort
             damping: 10, // Contrôle l'effet de rebond
             duration: 0.8 // Durée de l'animation 
             }}
          className="bg-white rounded-lg w-11/12 md:w-2/3 p-4 max-h-screen overflow-y-auto">
            <div className="flex justify-between items-center border-b pb-2">
              <h2 className="text-lg font-semibold text-center uppercase "><span className='text-green-500'>SECRET : </span>Compréhension Orale</h2>
              <button
                onClick={toggleco}
                className="text-gray-500 hover:text-gray-700"
              >
                &#x2715;
              </button>
            </div>
            <div className="min-h-screen bg-white text-white p-8">
      <motion.div
        className="max-w-4xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h1 
          className="text-5xl font-bold mb-12 text-center"
          variants={itemVariants}
        >
          Compréhension Orale - TCF
        </motion.h1>

        {sections1.map((section, index) => (
          <motion.div
            key={index}
            className="mb-8 bg-white bg-opacity-10 rounded-lg shadow-lg overflow-hidden"
            variants={itemVariants}
          >
            <button
              className="w-full text-left p-6 flex items-center justify-between focus:outline-none"
              onClick={() => setExpandedSection2(expandedSection2 === index ? null : index)}
            >
              <div className="flex items-center">
                <section.icon className="w-8 h-8 mr-4" />
                <h2 className="text-2xl font-semibold">{section.title}</h2>
              </div>
              <FaQuestionCircle 
                className={`w-6 h-6 transition-transform duration-300 ${expandedSection2 === index ? 'transform rotate-180' : ''}`}
              />
            </button>
            <motion.div
              initial={false}
              animate={{ height: expandedSection2 === index ? 'auto' : 0, opacity: expandedSection2 === index ? 1 : 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <ul className="p-6 space-y-2">
                {section.content.map((item, itemIndex) => (
                  <motion.li 
                    key={itemIndex}
                    className="flex items-start"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: itemIndex * 0.05 }}
                  >
                    <FaCheckCircle className="w-5 h-5 mr-2 mt-1 flex-shrink-0 text-green-400" />
                    <span>{item}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </motion.div>
        ))}

        <motion.div 
          className="mt-12 p-6 bg-white bg-opacity-10 rounded-lg shadow-lg"
          variants={itemVariants}
        >
          <h2 className="text-2xl font-semibold mb-4 flex items-center">
            <FaClock className="w-6 h-6 mr-2" />
            Conseils pour l'épreuve
          </h2>
          <p className="text-lg">
            Restez concentré pendant toute la durée de l'écoute. La bande audio ne sera diffusée qu'une seule fois. 
            Soyez attentif aux mots-clés et aux expressions courantes. N'oubliez pas que vous serez évalué sur votre 
            capacité à comprendre le français parlé dans diverses situations, du quotidien au professionnel.
          </p>
        </motion.div>
      </motion.div>
    </div>
          </motion.div>
        </div>

       
      )}
       {isAstuceEE &&(
            <div className='fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 '>
             <div className=" bg-white rounded-lg w-11/12 md:w-2/3 p-4 max-h-screen overflow-y-auto">
             <div className="flex justify-between items-center border-b pb-2">
              <h2 className="text-lg font-semibold text-center uppercase "><span className='text-green-500'>SECRET : </span>ASTUCES</h2>
              <button
                onClick={toggleAstuceEE}
                className="text-gray-500 hover:text-gray-700"
              >
                &#x2715;
              </button>
            </div>
            <div>
            <div className="mt-2">
            En fait il faut écouter l'audio et lire les choix de réponses simultanément. Ce test requiert beaucoup de
             concentration de la part du candidat.
             Vous devez vous relâcher et faire le vide dans votre tête en restant très,très,hyper concentré (e). 
             <strong>Votre score en dépendra</strong>
            <h3 className="font-semibold text-center mt-2 mb-3">A. Quelques Conseils et astuces</h3>
                <ul className="list-disc list-inside">
                  <li className='list-disc ml-10'>
                    <strong> Il y'a un temps d'arrêt avant le début de l'audio ,</strong>
                    profitez-en pour lire les propositions de réponses ci possible,

                  </li>
                  <li className='list-disc ml-10'>
                  sinon, En écoutant l'audio rechercher le lien avec la réponse la plus juste,
                  </li>
                  <li className='list-disc ml-10'>
                  Lorsqu'un audio a déjà été vu et écoute durant les cours , cocher la 
                  réponse rapidement et commencer la lecture des propositions de réponses 
                  de la question suivante en attendant l'audio afin de confirmer sa réponse,
                  </li>
                  <li className='list-disc ml-10'>
                  Il y'a deux réponses qui n'ont rien à voir avec le sujet et la question posée les éliminer. 
                  </li>
                  <li className='list-disc ml-10'>
                  Des deux autres restantes il y'a le distracteur il faut le répérer et l'annuler 
                  après avoir écouter la question posée à la fin
                  </li>
                  <li className='list-disc ml-10'>
                  Choisir la bonne réponse
                  </li>
                  
                </ul>
              
            
               
              </div>
            </div>
            </div>
            </div>
        )}
        {isAlertEE &&(
            <div className='fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 '>
             <div className=" bg-white rounded-lg w-11/12 md:w-2/3 p-4 max-h-screen overflow-y-auto">
             <div className="flex justify-between items-center border-b pb-2">
              <h2 className="text-lg font-semibold text-center uppercase text-red-500 "><span className=''>SECRET : </span>ATTENTION</h2>
              <button
                onClick={toggleAlerte}
                className="text-gray-500 hover:text-gray-700"
              >
                &#x2715;
              </button>
            </div>
            <div>
            <div className="mt-2">
              <h3 className="font-semibold text-center mt-2 text-4xl text-red-500 mb-5 ">ATTENTION </h3>
               <p className='list-disc  mt-5' style={{ textIndent: '2rem' }}>
               NE PAS CONFONDRE VITESSE ET PRECIPITATION
              Lire d'abord la question et les 04 propositions de réponses avant d'aller lire le texte simplement parce qu’il y'a beaucoup d'infos inutiles placées dans le texte et de pièges pour vous perdre. 
               Des phrases qui n'ont rien à voir avec l'idée générale du texte juste pour brouiller des pistes.
               <strong>En lisant d'abord les questions et les propositions de réponses 
               ça donne déjà un aperçu de ce qui nous ait demandé et ça réduit le champ d'investigation.
               </strong>
               </p>
               <p className='list-disc ' style={{ textIndent: '2rem' }}>
                <strong>  Si le texte contient un titre,</strong>
                commencez par comprendre le titre car il s'y trouve généralement l'idée générale et il
                 donne des précisions sur ce qu'on recherche.
               </p>
               <p className='list-disc ' style={{ textIndent: '2rem' }}>
                <strong>Si le texte contient des paragraphes</strong>rechercher l'idée de chaque paragraphe
                 en faisant attention aux connecteurs logiques. Parfois vous verrez que certains paragraphes 
                 avec leurs idées ne suivent pas la logique générale du test.

                
               </p>
               <p> <strong> Toujours faire attention aux temps des verbes</strong></p>
            
                <ul className="list-disc pl-5 mt-2 space-y-2">
                    <li className='list-disc '>
                    Si vous ne comprenez pas bien une question malgré l'instance dans la lecture,
                     passez à la suivante et revenez quand vous aurez terminé. 
                    </li>
                    <li className='list-disc '>
                    Si une question est centrée sur le lieu, on le sait par les propositions de réponse
                     et la question on saura sous quel angle aborder le texte et le lire.
                    </li>
                </ul>
              </div>
            </div>
            </div>
            </div>
        )}
        {isEE && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className=' py-5 absolute right-0 text-gray-500  top-0 md:w-1/6 px-3'>
            <motion.button
            onClick={toggleAlerteco}
      className="bg-red-500 text-white rounded-md py-2 px-4"
      // Animation pour faire vibrer le bouton
      animate={{
        x: [0, -10, 10, -10, 5, 0], // Déplace de gauche à droite pour l'effet de vibration
      }}
      transition={{
        repeat: Infinity, // Répète l'animation à l'infini
        repeatType: "loop", // Boucle l'animation
        duration: 0.7, // Durée de chaque cycle de vibration
      }}
    >
      ATTENTION
    </motion.button >
          </div>
          <div className=' py-5 absolute left-0 text-gray-500  top-0 md:w-1/6 px-3'>
     <motion.button
     onClick={toggleAstuceco}
      className="bg-green-500 text-white rounded-md py-2 px-4"
      // Animation pour faire vibrer le bouton
      animate={{
        x: [0, -10, 10, -10, 5, 0], // Déplace de gauche à droite pour l'effet de vibration
      }}
      transition={{
        repeat: Infinity, // Répète l'animation à l'infini
        repeatType: "loop", // Boucle l'animation
        duration: 0.7, // Durée de chaque cycle de vibration
      }}
    >
      ASTUCES
    </motion.button >
          </div>
        
          <motion.div 
           initial={{ x: '-100vw', opacity: 0 }} // Position de départ (hors écran à gauche)
           animate={{ x: 0, opacity: 1 }} // Position finale (à l'endroit normal)
           transition={{
             type: 'spring', // Utilise un effet de ressort pour l'animation
             stiffness: 60, // Ajuste la vitesse du ressort
             damping: 10, // Contrôle l'effet de rebond
             duration: 0.8 // Durée de l'animation 
             }}
          className="bg-white rounded-lg w-11/12 md:w-2/3 p-4 max-h-screen overflow-y-auto">
            <div className="flex justify-between items-center border-b pb-2">
              <h2 className="text-lg font-semibold text-center uppercase "><span className='text-green-500'>SECRET : </span>EXPRESSION ECRITE</h2>
              <button
                onClick={toggleEE}
                className="text-gray-500 hover:text-gray-700"
              >
                &#x2715;
              </button>
            </div>
            <div className="mt-4">
              <p className="text-sm">
              C'est la 3e épreuve de l'examen et la dernière du 1er bloc CE-CO-EE. 
              . Elle dure <strong>01 heure</strong> et comporte{' '}
                <strong>03 tâcheS</strong>de difficultés croissantes
                <ul className="list-disc pl-5 mt-2 space-y-2">
                <div className="max-w-3xl mx-auto p-6 bg-gray-100 rounded-lg shadow-lg">
      <motion.h1 
        className="text-3xl font-bold mb-4 text-center text-blue-600"
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        transition={{ duration: 0.5 }}
      >
        EXPRESSION ECRITE
      </motion.h1>

      <motion.p 
        className="mb-4 text-gray-700"
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        C'est la 3e épreuve de l'examen et la dernière du 1er bloc CE-CO-EE. Elle dure 01 heure et comporte 03 tâches de difficultés croissantes.
      </motion.p>

      <motion.h2 
        className="text-2xl font-semibold mb-3 text-blue-500"
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        TÂCHE 1:
      </motion.h2>

      <motion.p 
        className="mb-4 text-gray-700"
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        transition={{ delay: 0.6, duration: 0.5 }}
      >
        Ici le candidat est évalué sur sa capacité à:
      </motion.p>

      <ul className="list-none space-y-2 mb-4">
        {[
          "Décrire un lieu ou une situation",
          "Répondre à une invitation",
          "Raconter un évènement✍🏾"
        ].map((item, index) => (
          <motion.li 
            key={index}
            className="flex items-center text-gray-600"
            initial="hidden"
            animate="visible"
            variants={slideIn}
            transition={{ delay: 0.8 + index * 0.1, duration: 0.5 }}
          >
            <span className="text-blue-500 mr-2">〰️</span>
            {item}
          </motion.li>
        ))}
      </ul>

      <motion.h3 
        className="text-xl font-semibold mb-3 text-blue-500"
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        transition={{ delay: 1.1, duration: 0.5 }}
      >
        Quelques conseils
      </motion.h3>

      <ul className="list-none space-y-2 mb-4">
        {[
          "Temps de la rédaction conseillés : Présent de l'indicatif, futur, passé composé",
          "Utiliser une Variété d'Adjectifs qualificatifs et certains Adverbes",
          "Rédiger des Phrases simples et courtes",
          "Utiliser un vocabulaire en relation avec le thématique proposé",
          "Consacrer au plus 12min à cette tâche. C'est la plus facile et celle qui doit vous prendre le moins de temps. Mais ça ne veut pas dire ne pas s'appliquer car c'est par elle que l'examinateur prend connaissance de votre plume.",
          "Ne pas rédiger au brouillon vous pouvez par contre mettre les idées essentielles pour avoir une ossature à suivre. Mais en réalité vu que cette tâche revient sous la même forme à force de la faire pendant la préparation, ça devient évident de ne plus passer au brouillon."
        ].map((tip, index) => (
          <motion.li 
            key={index}
            className="flex items-start text-gray-600"
            initial="hidden"
            animate="visible"
            variants={slideIn}
            transition={{ delay: 1.3 + index * 0.1, duration: 0.5 }}
          >
            <span className="text-red-500 mr-2 mt-1">⭕️</span>
            <span>{tip}</span>
          </motion.li>
        ))}
      </ul>

      <motion.p 
        className="mb-4 text-gray-700"
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        transition={{ delay: 2.1, duration: 0.5 }}
      >
        Il faut donc être méthodique, discipliné et très organisé. Elle est connue comme l'épreuve dont le temps ne suffit pas. Il faut être rapide et méthodique pour produire les 03 tâches en 1h.
      </motion.p>

      <motion.p 
        className="text-lg font-semibold text-blue-600"
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        transition={{ delay: 2.3, duration: 0.5 }}
      >
        Tâche 1: Nombre de mots 60 minimum - 120 maximum. Un essai est sérieux quand il atteint au moins le cap des 100 mots. Ça voudrait dire que c'est le nombre de mots qui limite votre expression et non que vous vous battez à faire le minimum.
      </motion.p>
    </div>
    
     <div className="max-w-3xl mx-auto p-6 bg-gray-100 rounded-lg shadow-lg">
      <motion.h1 
        className="text-3xl font-bold mb-4 text-center text-blue-600"
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        transition={{ duration: 0.5 }}
      >
        TÂCHE 2: Expérience d'un vécu personnel
      </motion.h1>

      <motion.p 
        className="mb-4 text-gray-700"
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        Dans cette partie de l'épreuve, il s'agit de faire une redaction d'un article, d'un courrier, d'une note en s'appuyant sur un document ou non adressé à l'intention d'un ou plusieurs destinataires pour faire le Compte rendu d'une expérience, ceci incluant l'expression d'une opinion qui est la vôtre tout en tenant compte d'un Objectif. Cet objectif peut être de renseigner, d'informer ou de revendiquer.
      </motion.p>

      <motion.h2 
        className="text-2xl font-semibold mb-3 text-blue-500"
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        Critères d'évaluation:
      </motion.h2>

      <ul className="list-none space-y-2 mb-4">
        {[
          "Donner un axe ou une opinion en illustrant par des exemples",
          "Trouver des des exemples",
          "Argumenter et justifier",
          "Clarifier et nuancer des propos",
          "Structurer votre discours en organisant vos idées et en utilisant des connecteurs logiques",
          "Faire à la fois des phrases simples et complexes",
          "Conjuguer correctement tous les verbes utilisés dans son devoir"
        ].map((criterion, index) => (
          <motion.li 
            key={index}
            className="flex items-center text-gray-600"
            initial="hidden"
            animate="visible"
            variants={slideIn}
            transition={{ delay: 0.6 + index * 0.1, duration: 0.5 }}
          >
            <span className="text-blue-500 mr-2">〰️</span>
            {criterion}
          </motion.li>
        ))}
      </ul>

      <motion.p 
        className="text-lg font-semibold text-blue-600"
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        transition={{ delay: 1.4, duration: 0.5 }}
      >
        Nombre de mots exigés : 120 minimum-150 maximum
      </motion.p>
    </div>

    <div className="max-w-4xl mx-auto p-6 bg-gray-100 rounded-lg shadow-lg">
      <motion.h1 
        className="text-3xl font-bold mb-4 text-center text-blue-600"
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        transition={{ duration: 0.5 }}
      >
        TÂCHE 3: Synthèse de Documents + Expression d'un point de vue
      </motion.h1>

      <motion.p 
        className="mb-4 text-gray-700"
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        Le candidat aura 02 Documents qui lui seront remis. Dans cette partie de l'épreuve, le candidat doit rédiger un texte qui reprend les idées émises dans les 02 documents. Ces derniers comparent 02 points de vue portant sur un fait de société. Dans une autre partie le candidat doit rédiger un Texte argumentatif avec une prise de position sur le thème traité dans les 02 documents.
      </motion.p>

      <div className="mb-4">
        <motion.button
          className={`px-4 py-2 mr-2 rounded ${activeTab === 'synthese' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
          onClick={() => setActiveTab('synthese')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          1ère Partie: Synthèse
        </motion.button>
        <motion.button
          className={`px-4 py-2 rounded ${activeTab === 'argumentation' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
          onClick={() => setActiveTab('argumentation')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          2ème Partie: Argumentation
        </motion.button>
      </div>

      {activeTab === 'synthese' && (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl font-semibold mb-3 text-blue-500">1ère Partie: Synthèse avec ses propres mots</h2>
          <p className="mb-4 text-gray-700">
            Il ne s'agit pas d'un résumé ou d'un compte Rendu. Le candidat doit reprendre les idées émises dans le doc avec ses propres mots. Ça permet de juger son niveau de compréhension.
          </p>
          <p className="font-semibold text-blue-600">Nombre de mots exigés: 40-60 mots</p>
        </motion.div>
      )}

      {activeTab === 'argumentation' && (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl font-semibold mb-3 text-blue-500">2ème Partie: Argumentation</h2>
          <p className="mb-4 text-gray-700">
            Rédiger une argumentation en s'appuyant sur le thème général tiré des 02 documents proposés.
          </p>
          <h3 className="text-xl font-semibold mb-2 text-blue-400">Structure de l'argumentation:</h3>
          <ul className="list-disc pl-5 mb-4 text-gray-700">
            <motion.li variants={slideIn} transition={{ delay: 0.2 }}>Idée + Développement de l'idée + Illustration</motion.li>
            <motion.li variants={slideIn} transition={{ delay: 0.3 }}>Repartir ses idées en arguments (Un argument = Une idée)</motion.li>
            <motion.li variants={slideIn} transition={{ delay: 0.4 }}>Utiliser les Connecteurs logiques (De plus, Cependant, toutefois, Néanmoins...Etc.)</motion.li>
            <motion.li variants={slideIn} transition={{ delay: 0.5 }}>Apporter une nuance à son idée</motion.li>
          </ul>
        </motion.div>
      )}

      <motion.h3 
        className="text-2xl font-semibold mt-6 mb-3 text-blue-500"
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        transition={{ delay: 0.6, duration: 0.5 }}
      >
        Méthode de travail pour Résumer📜👨🏽‍🏫
      </motion.h3>

      <ol className="list-decimal pl-5 space-y-2 mb-4 text-gray-700">
        {[
          "1ere lecture des documents permet de se faire une idée de ce dont parlent les textes. Au bout de la lecture Trouver le thème général et le noter au brouillon",
          "2e Lecture des documents et trouver les Idées principales de chaque document les noter au brouillon",
          "Faire une synthèse en ses propres mots maintenant qu'on a compris, qu'on connait le thème et les idées défendues dans chaque document.",
          "La prise de position par rapport au thème et aux idées émises",
          "L'argumentation: j'ai donné ma position je la justifie.",
          "La nuance ➕ Ouverture du débat"
        ].map((step, index) => (
          <motion.li 
            key={index}
            initial="hidden"
            animate="visible"
            variants={slideIn}
            transition={{ delay: 0.7 + index * 0.1, duration: 0.5 }}
          >
            {step}
          </motion.li>
        ))}
      </ol>

      <motion.p 
        className="mt-4 text-gray-700 italic"
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        transition={{ delay: 1.4, duration: 0.5 }}
      >
        Soyez vigilent! La plupart du temps les documents défendent des points de vue divergents mais il arrive que les idées du 2e document suivent le sens de celles du 1er.
      </motion.p>
    </div>
       
      </ul>
                {/* Continue to add your full content here */}
              </p>
             
              </div>
          </motion.div>
        </div>

       
      )}
       {isEo && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className=' py-5 absolute right-0 text-white top-0 md:w-1/6 px-3'>
            <motion.button
            onClick={toggleAlerteco}
      className="bg-red-500 text-white rounded-md py-2 px-4"
      // Animation pour faire vibrer le bouton
      animate={{
        x: [0, -10, 10, -10, 5, 0], // Déplace de gauche à droite pour l'effet de vibration
      }}
      transition={{
        repeat: Infinity, // Répète l'animation à l'infini
        repeatType: "loop", // Boucle l'animation
        duration: 0.7, // Durée de chaque cycle de vibration
      }}
    >
      ATTENTION 
    </motion.button >
          </div>
          <div className=' py-5 absolute left-0 text-white  top-0 md:w-1/6 px-3'>
     <motion.button
     onClick={toggleAstuceco}
      className="bg-green-500 text-white rounded-md py-2 px-4"
      // Animation pour faire vibrer le bouton
      animate={{
        x: [0, -10, 10, -10, 5, 0], // Déplace de gauche à droite pour l'effet de vibration
      }}
      transition={{
        repeat: Infinity, // Répète l'animation à l'infini
        repeatType: "loop", // Boucle l'animation
        duration: 0.7, // Durée de chaque cycle de vibration
      }}
    >
      ASTUCES
    </motion.button >
          </div>
        
          <motion.div 
           initial={{ x: '-100vw', opacity: 0 }} // Position de départ (hors écran à gauche)
           animate={{ x: 0, opacity: 1 }} // Position finale (à l'endroit normal)
           transition={{
             type: 'spring', // Utilise un effet de ressort pour l'animation
             stiffness: 60, // Ajuste la vitesse du ressort
             damping: 10, // Contrôle l'effet de rebond
             duration: 0.8 // Durée de l'animation 
             }}
          className="bg-white rounded-lg w-11/12 md:w-2/3 p-4 max-h-screen overflow-y-auto">
            <div className="flex justify-between items-center border-b pb-2">
              <h2 className="text-lg font-semibold text-center uppercase "><span className='text-green-500'>SECRET : </span>Expression Orale</h2>
              <button
                onClick={toggleEo}
                className="text-gray-500 hover:text-gray-700"
              >
                &#x2715;
              </button>
            </div>
            <div className="min-h-screen  rounded-md text-white bg-gray-200 text-white p-8">
      <motion.h1 
        className="text-4xl font-bold mb-8 text-center text-gray-500"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        L'expression orale au TCF Canada
      </motion.h1>
      <motion.div 
        className="max-w-3xl mx-auto space-y-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {sections.map((section, index) => (
          <motion.div 
            key={index}
            className="bg-gray-800 rounded-lg overflow-hidden shadow-lg text-white"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 + 0.3 }}
          >
            <button
              className="w-full text-left p-4 flex justify-between items-center focus:outline-none"
              onClick={() => setOpenSection(openSection === index ? null : index)}
            >
              <h2 className="text-xl font-semibold text-white ">{section.title}</h2>
              <BiChevronDown 
                className={`w-6 h-6 transition-transform duration-300 text-white ${openSection === index ? 'transform rotate-180' : ''}`}
              />
            </button>
            <motion.div
              initial={false}
              animate={{ height: openSection === index ? 'auto' : 0, opacity: openSection === index ? 1 : 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <ul className="p-4 space-y-2 text-white">
                {section.content.map((item, itemIndex) => (
                  <motion.li 
                    key={itemIndex}
                    className="flex items-start text-white"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: itemIndex * 0.05 }}
                  >
                    <span className="text-blue-400 mr-2">•</span>
                    {item}
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </motion.div>
        ))}
      </motion.div>
      <motion.p 
        className="text-center mt-8 text-lg font-semibold text-blue-300"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 1 }}
      >
        Soyez serein et sûr de vous. L'assurance du départ est la clé. Évitez les "beurkkk" !
      </motion.p>
    </div>
          </motion.div>
        </div>

       
      )}

        </StudentLayout>
    );
}

export default Index;
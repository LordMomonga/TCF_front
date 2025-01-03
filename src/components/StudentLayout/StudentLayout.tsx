import { AiTwotoneBell } from "react-icons/ai"; 
import { AiOutlineLogout } from "react-icons/ai"; 
import { AiOutlineMail } from "react-icons/ai"; 
import { FcSettings } from "react-icons/fc"; 
import React, { useState, useEffect, useContext } from 'react';
import './StudentLayout.css';
import { getAcademicYear, removeAcademicYear, removeToken, storeAcademicYear } from '../../utils/storage';
import { useNavigate, NavLink } from "react-router-dom";
import {GiTimeBomb} from 'react-icons/gi';
import { MdContentPaste, MdAssignmentTurnedIn,MdReportProblem, MdAssignmentLate, MdAssessment, MdDashboard } from 'react-icons/md';
import { SlCalender } from 'react-icons/sl';
import { BsFillCalendar2CheckFill } from 'react-icons/bs';
import { FaPeopleArrows,FaSchool } from 'react-icons/fa';
import { GiMoneyStack } from 'react-icons/gi';
import { TfiAnnouncement } from 'react-icons/tfi';
import { useTranslation } from 'react-i18next';
import { GoDeviceCameraVideo } from 'react-icons/go';
import AcademicYearContext from '../../contexts/AcademicYearContext';
import { BsBank2 } from 'react-icons/bs';
import { getNotification } from "../../services/assessment";

import { getUser } from '../../utils/storage';
import { studentGetAcademicYears } from '../../services/student';

function StudentLayout({ title, children, pageTitle } : any) {
    const { t, i18n } = useTranslation();
    let [lang, setLang] = useState<any>(null);

    const [academicYears, setAcademicYears] = useState([]);
    const {activeAcademyYear, setActiveAcademyYear} = useContext<any>(AcademicYearContext);
    const [notification, setNotification] = useState<any>([])

    const navigate = useNavigate();
    const [user, setUser] = useState<any>(null);

    const [showStudNav,setShowStudNav] = useState(true);
    const [showUserMenu, setShowUserMenu] = useState(false);


    const handleGetAcademicYears = () => {
        studentGetAcademicYears().then((res: any) => {
            if(res.ok) {
                if(!getAcademicYear()) {
                    setActiveAcademyYear(res?.data?.data[0]._id);
                    storeAcademicYear(res?.data?.data[0]._id);
                }else {
                    setActiveAcademyYear(getAcademicYear())
                }
                setAcademicYears(res?.data?.data);
            }
        })
    }
    const handleNotification = () => {
        getNotification().then((res:any)=> {
            if(res.ok){
                setNotification(res?.data)
                console.log(res?.data, 'la notification a biue');
                
            } else {
                console.log('erreur pour la notiffication ')
            }

        })
    }

    const goToNotification = () => {
        navigate('/students/notification')
    }
    const handleAccademicYearChange = (e: any) => {
        setActiveAcademyYear(e.target.value);
        storeAcademicYear(e.target.value);

    }


    const handleLogout = () => {
        removeToken();
        removeAcademicYear();
        navigate('/');
    }

    const toggleNav = () => {
        console.log('toggle nav')
        setShowStudNav(!showStudNav);
    }

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
      
      useEffect(() => {
        handleLangInit();
      },[])
  
      useEffect(() => {
        changeLang()
      }, [lang]);

    useEffect(() => {
        console.log("USER", getUser());
        let usr = getUser();
        setUser(usr);
    }, [])


    useEffect(() => {
        handleGetAcademicYears();
        handleNotification();
    },[])
    useEffect(() => {
      
        handleNotification();
    },[])


    return (
        <div className="dashboard-grid">
        <div className={`sidebar-student student student-dashboard-sidebar  ${!showStudNav ? 'show' : ''}`}>
            <div className="logo" style={{cursor: 'pointer'}}>
                <a onClick={() => navigate('/students/home')}><span className='text-3xl text-white font-bold '>Tolkin</span></a>
            </div>
            <div className="menu">
                <div className="sub-menu">
                    <div className="title">MAIN NAVIGATION</div>
                    <NavLink className="link" to="/students/home">
                    <i><MdDashboard size={20}/></i>
                        <span>{t('layout.dashboard')}</span>
                    </NavLink>


                    <NavLink className="link" to="/students/course-contents">
                    <i><MdContentPaste size={20}/></i>
                        <span>{t('layout.strategie')}</span>
                    </NavLink>

                   

                    

                    <NavLink className="link" to="/students/passexams">
                    <i><MdAssessment size={20}/></i>
                        <span>{t('layout.simulation')}</span>
                    </NavLink>


                    <NavLink className="link" to="/students/results">
                    <i><FaSchool size={20}/></i>
                        <span>{t('layout.results')}</span>
                    </NavLink>
                    
                    


                    <NavLink className="link" to="/students/time-table">
                    <i><SlCalender size={20}/></i>
                        <span>{t('layout.table')}</span>
                    </NavLink>


                    <NavLink className="link" to="/students/announcements">
                    <i><TfiAnnouncement size={20}/></i>
                        <span>Anouncements</span>
                    </NavLink>
                    
                   
                    {/* <NavLink className="link" to="/students/todos">
                    <i><BsFillCalendar2CheckFill size={20}/></i>
                        <span>Personal Todos</span>
                    </NavLink> */}


                    <NavLink className="link" to="/students/report">
                    <i><MdReportProblem size={20}/></i>
                        <span>{t('layout.report')}</span>
                    </NavLink>

                    <NavLink className="link" to="/students/fees-deadlines">
                    <i><GiTimeBomb size={20}/></i>
                        <span>{t('layout.deadline')}</span>
                    </NavLink>

                    <NavLink className="link" to="/students/fees-payment">
                    <i><GiMoneyStack size={20}/></i>
                        <span>{t('layout.payement')}</span>
                    </NavLink>
                    
                    
                    <NavLink className="link" to="/students/school-banks">
                    <i><BsBank2 size={20}/></i>
                        <span> {t('layout.compte')}</span>
                    </NavLink>

                
                </div>
    
            </div>
        </div>
        <div className={`main ${!showStudNav ? 'expand' : ''}`}>
            <header className={`${!showStudNav ? 'expand' : ''}`}>
                <div className="con">
                    <div className="nav-toggler-btn" onClick={toggleNav}>
                        <i className="fa fa-bars" aria-hidden="true"></i>
                    </div>
                    
                    <span>
                    <select onChange={handleAccademicYearChange} value={activeAcademyYear} id="" className="language-dashboard ">
                           {academicYears.map((acca: any) => <option value={acca._id}>{acca?.title}</option> )}

                    </select>

                    <div className="divider "></div>
                        <select value={lang} className ='language-dashboard px-1 rounded-md md:px-3' onChange={(e: any) => setLang(e.target.value)} id="" >
                            <option value="en">🏴󠁧󠁢󠁥󠁮󠁧󠁿 EN</option>
                            <option value="fr">🇫🇷 FR</option>
                        </select>
                        <div className="divider"></div>
                        <a href="" className="pr-5 text-xl relative" onClick={() => goToNotification()}>
                        <div className="absolute  left-2 text-white  ">
                            <div className="flex w-6 h-6 transform scale-[0.5] font-bold rounded-full  bg-primary items-center justify-center text-[13px] text-white ">
                                {notification.length}
                            </div>
                            </div>    
                            <i className="" aria-hidden="true"> <AiTwotoneBell /></i>
                            
                        </a>
                        <div className="divider"></div>
                        <div className="profile-btn" onClick={() => setShowUserMenu(!showUserMenu)}>
                            <div className="name">{t('layout.user')}</div>
                            {/* <img src="./assets/images/users/user-1.png" alt=""> */}
                        </div>
                    </span>
                </div>
            </header>

            <div className={`user-menu ${showUserMenu ? 'show' : ''}`}>
                <div className="user-menu-top">
                    <i className="fa fa-times" onClick={() => setShowUserMenu(!showUserMenu)}></i>
                    <img src={require("../../assets/images/users/user.jpg")} alt="" />
                    <p>{user?.username}</p>
                    <span className='text-[10px] my-1 text-gray-600  italic  flex items-center gap-2'><AiOutlineMail />{user?.email}</span>
                    <span>{t('user')}</span>
                </div>
                <div className="user-menu-footer">
                    <a className="flex items-center gap-2 "> <FcSettings />{t('layout.setting')}</a>
                    <a onClick={handleLogout} className="logout-link flex items-center gap-2"> <AiOutlineLogout />{t('layout.logout')}</a>
                </div>
            </div>

            <div className="content">
                    <div className="con">
                        <div className="page-title">
                            <p>{title}</p>
                            <div className="crumb">
                                <NavLink to="/" className="crumb-item">{t('layout.user')}</NavLink>
                                <span>{'>'}</span>
                                <a className="crumb-item">{pageTitle}</a>
                            </div>
                        </div>

                        <div className="section">
                            { children }
                        </div>

                    </div>
                </div>

            <footer className={`${!showStudNav ? 'expand' : ''}`}>
                <div className="con">
                    <p>support us</p>
                    <p>Version 1.0</p>
                </div>
            </footer>
        </div>
    </div>
    );
}

export default StudentLayout;
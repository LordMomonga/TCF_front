import React, { useState, useEffect, useContext } from 'react';
import './Layout.css';
import { getAcademicYear, isStudent, removeAcademicYear, removeToken, storeAcademicYear } from '../../utils/storage';
import { useNavigate, NavLink } from "react-router-dom";
import {SiGoogleclassroom} from 'react-icons/si';
import { MdOutlineContentPaste, MdAssignmentTurnedIn, MdAssignmentLate, MdAssessment, MdDashboard } from 'react-icons/md';
import { GoDeviceCameraVideo } from 'react-icons/go';
import { useTranslation } from 'react-i18next';
import { Navigate } from "react-router";
import AcademicYearContext from '../../contexts/AcademicYearContext';

import { getUser, isTeacher } from '../../utils/storage';
import { teachersGetAcademicYears } from '../../services/teachers';

function Layout({ title, children, pageTitle = '' } : any) {
    const { t, i18n } = useTranslation();
    let [lang, setLang] = useState<any>(null);

    const [academicYears, setAcademicYears] = useState([]);
    const {activeAcademyYear, setActiveAcademyYear} = useContext<any>(AcademicYearContext);


    const navigate = useNavigate();
    const [user, setUser] = useState<any>(null);

    const [showNav, setShowNav] = useState(true);
    const [showUserMenu, setShowUserMenu] = useState(false);

    const handleGetAcademicYears = () => {
        teachersGetAcademicYears().then((res: any) => {
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
        setShowNav(!showNav);
    }

    const handleTrans = () => {
        i18n.changeLanguage(lang);
      };
  
      const handleLangInit = () => {
        let lng = localStorage.getItem('locale');
        // console.log("locale", lng);
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
        let usr = getUser();
        setUser(usr);
    }, [])

    useEffect(() => {
        handleGetAcademicYears();
    },[])

        
    if(isStudent()) {
        // console.log('STUDENT');
        return <Navigate to="/students/home" replace/>
    }

    if(!isTeacher()) {
        // console.log('TEACHER');
        return <Navigate to="/" replace/>
    }

    
    return (
        <div className="dashboard-grid">
        <div className={`sidebar ${!showNav ? 'show' : ''}`}>
            <div className="logo" style={{cursor: 'pointer'}}>
                <a onClick={() => navigate('/')}><img src={require('../../assets/images/logo/logo-light.png')} alt=" " /></a>
            </div>
            <div className="menu">
                <div className="sub-menu">
                    <div className="title">MAIN NAVIGATION</div>
                    <NavLink className="link" to="/dashboard">
                    <i><MdDashboard size={20}/></i>
                        <span>Dashboard</span>
                    </NavLink>

                    
            
                    <NavLink className="link" to="/class-rooms">
                    <i><SiGoogleclassroom size={20}/></i>
                        <span>Classrooms</span>
                    </NavLink>

                    <NavLink className="link" to="/course-contents">
                    <i><MdOutlineContentPaste size={20}/></i>
                        <span>Course Content</span>
                    </NavLink>


                    <NavLink className="link" to="/follow-up">
                    <i><MdAssignmentLate size={20}/></i>
                        <span>Follow-up</span>
                    </NavLink>

                    <NavLink className="link" to="/assignments">
                    <i><MdAssignmentLate size={20}/></i>
                        <span>Assignments</span>
                    </NavLink>

                    <NavLink className="link" to="/assignment-submissions">
                    <i><MdAssignmentTurnedIn size={20}/></i>
                        <span>Assignment Submissions</span>
                    </NavLink>

                    <NavLink className="link" to="/assessments">
                    <i><MdAssessment size={20}/></i>
                        <span>Assessment</span>
                    </NavLink>

                    <NavLink className="link" to="/assessment-submissions">
                    <i><MdAssessment size={20}/></i>
                        <span>Assessment Submissions</span>
                    </NavLink>

                    <NavLink className="link" to="/pass-exams">
                    <i><MdAssessment size={20}/></i>
                        <span>Pass Exams</span>
                    </NavLink>

                    <NavLink className="link" to="/live-session">
                    <i><GoDeviceCameraVideo size={20}/></i>
                        <span>Live Sessions</span>
                    </NavLink>
                    
                    
                </div>
               
            </div>
        </div>
        <div className={`main ${!showNav ? 'expand' : ''}`}>
            <header className={`${!showNav ? 'expand' : ''}`}>
                <div className="con">
                    <div className="nav-toggler-btn" onClick={toggleNav}>
                        <i className="fa fa-bars" aria-hidden="true"></i>
                    </div>
                    <span>
                    <select onChange={handleAccademicYearChange} value={activeAcademyYear} id="" className="language-dashboard">
                           {academicYears.map((acca: any) => <option value={acca._id}>{acca?.title}</option> )}
                           {/* <option value='hghhfhffgggdgd'>Test</option> */}
                    </select>
                    <div className="divider"></div>
                        <select value={lang} onChange={(e: any) => setLang(e.target.value)} id="" className="language-dashboard">
                            <option value="en">🏴󠁧󠁢󠁥󠁮󠁧󠁿 EN</option>
                            <option value="fr">🇫🇷 FR</option>
                        </select>
                        <div className="divider"></div>
                        <a href="" className="link notify">
                            <i className="fa fa-bell" aria-hidden="true"></i>
                        </a>
                        <div className="divider"></div>
                        <div className="profile-btn" onClick={() => setShowUserMenu(!showUserMenu)}>
                            <div className="name">{t('hello')} Admin</div>
                            {/* <img src="./assets/images/users/user-1.png" alt=""> */}
                        </div>
                    </span>
                </div>
            </header>
            
            <div className={`user-menu ${showUserMenu ? 'show' : ''}`}>
                <div className="user-menu-top">
                    <i className="fa fa-times" onClick={() => setShowUserMenu(!showUserMenu)}></i>
                    <img src={require("../../assets/images/users/avatar.jpg")} alt="" />
                    <p>{user?.username}</p>
                    <span>Teacher</span>
                </div>
                <div className="user-menu-footer">
                    <a><i className="fas fa-cog"></i> Settings</a>
                    <a onClick={handleLogout} className="logout-link"><i className="fas fa-door-open"></i> Logout</a>
                </div>
            </div>
            
            <div className="content">
                    <div className="con">
                        <div className="page-title">
                            <p>{title}</p>
                            <div className="crumb">
                                <NavLink to="/dashboard" className="crumb-item">{t('layout.dashboard')}</NavLink>
                                <span>{'>'}</span>
                                <a className="crumb-item">{ pageTitle }</a>
                            </div>
                        </div>

                        <div className="section">
                            { children }
                        </div>

                    </div>
                </div>

            <footer className={`${!showNav ? 'expand' : ''}`}>
                <div className="con">
                    <p>{t('copywright_text')}</p>
                    <p>Version 1.0</p>
                </div>
            </footer>
        </div>
    </div>
    );
}

export default Layout;
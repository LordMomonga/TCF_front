import { AiTwotoneFolderAdd } from "react-icons/ai"; 
import React, { useState, useEffect, useContext } from 'react';
import './SchoolLayout.css';
import { getAcademicYear, removeAcademicYear, removeToken, storeAcademicYear } from '../../utils/storage';
import { useNavigate, NavLink } from "react-router-dom";
import {SiGoogleclassroom} from 'react-icons/si';
import { MdContentPaste, MdAssignmentTurnedIn,MdReportProblem, MdAssignmentLate, MdAssessment, MdDashboard } from 'react-icons/md';
import { BsInfoCircle } from 'react-icons/bs';
import { SlCalender } from 'react-icons/sl';
import { BsFillCalendar2CheckFill } from 'react-icons/bs';
import { FaPeopleArrows } from 'react-icons/fa';
import { GiMoneyStack } from 'react-icons/gi';
import { TfiAnnouncement } from 'react-icons/tfi';
import { BsFillPersonFill } from 'react-icons/bs';
import { GoMortarBoard } from 'react-icons/go';
import { BsBank2 } from 'react-icons/bs';
import { GiTimeBomb } from 'react-icons/gi';
import { getAdminNotification } from "../../services/assessment";
import { useTranslation } from 'react-i18next';
import { getUser } from '../../utils/storage';
import { schoolGetAcademicYears } from '../../services/school';
import AcademicYearContext from '../../contexts/AcademicYearContext';
import { AiTwotoneBell } from "react-icons/ai";

function SchoolLayout({ title, children, pageTitle } : any) {
    const { t, i18n } = useTranslation();
    let [lang, setLang] = useState<any>(null);

    const navigate = useNavigate();
    const [user, setUser] = useState<any>(null);

    const [academicYears, setAcademicYears] = useState([]);
    const {activeAcademyYear, setActiveAcademyYear} = useContext<any>(AcademicYearContext);

    const [showStudNav,setShowStudNav] = useState(true);
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [notification, setNotification] = useState<any>([])

    const handleGetAcademicYears = () => {
        schoolGetAcademicYears().then((res: any) => {
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
        getAdminNotification().then((res:any)=> {
            if(res.ok){
                console.log(res?.data, 'la notification a biue');
                setNotification(res?.data?.notification2)
               
                
            } else {
                console.log('erreur pour la notiffication ')
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
       
        setShowStudNav(!showStudNav);
       
    }

    const handleTrans = () => {
        i18n.changeLanguage(lang);
      };

      const goToNotification = ()=> {
        navigate("/school/notification")
      }
  
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
      
      useEffect(() => {
        handleLangInit();
        handleNotification()
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

    return (
        <div className="dashboard-grid ">
        <div className={`sidebar-student student student-dashboard-sidebar  ${!showStudNav ? 'show' : ''}`}>
            <div className="logo" style={{cursor: 'pointer'}}>
                <a onClick={() => navigate('/school/home')}><span className='font-bold text-3xl text-white'>Tolkin</span></a>
            </div>
            <div className="menu">
                <div className="sub-menu">
                    <div className="title">MAIN NAVIGATION</div>
                    <NavLink className="link" to="/school/home">
                    <i><MdDashboard size={20}/></i>
                        <span>Dashboard</span>
                    </NavLink>

                    <NavLink className="link" to="/add">
                    <i><AiTwotoneFolderAdd size={20}/></i>
                        <span>Add new element</span>
                    </NavLink>

                    <NavLink className="link" to="/school/speciality">
                    <i><MdContentPaste size={20}/></i>
                        <span> spécialité</span>
                    </NavLink>


                    <NavLink className="link" to="/school/students">
                    <i><BsFillPersonFill size={20}/></i>
                        <span>utilisateurs</span>
                    </NavLink>
                    
                    <NavLink className="link" to="/school/result-types">
                    <i><GoMortarBoard size={20}/></i>
                        <span>Results Users</span>
                    </NavLink>

                    <NavLink className="link" to="/school/students-results">
                    <i><GoMortarBoard size={20}/></i>
                        <span>Users</span>
                    </NavLink>


                    <NavLink className="link" to="/school/anouncement">
                    <i><TfiAnnouncement size={20}/></i>
                        <span>Anouncement</span>
                    </NavLink>
    
                    <NavLink className="link" to="/school/reports">
                    <i><MdReportProblem size={20}/></i>
                        <span>Reports</span>
                    </NavLink>

                   

                    <NavLink className="link" to="/school/fees-payments">
                    <i><GiMoneyStack size={20}/></i>
                        <span>Fees Payments</span>
                    </NavLink>
                    

                    <NavLink className="link" to="/school/fees">
                    <i><BsBank2 size={20}/></i>
                        <span>Fees Accounts</span>
                    </NavLink>

                    <NavLink className="link" to="/school/fees-deadlines">
                    <i><GiTimeBomb size={20}/></i>
                        <span>Fees Deadlines</span>
                    </NavLink>
               
                    
    
                    <NavLink className="link" to="/school/info">
                    <i><BsInfoCircle size={20}/></i>
                        <span>School Info</span>
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
                    <select onChange={handleAccademicYearChange} value={activeAcademyYear} id="" className="language-dashboard ml-5 ">
                           {academicYears.map((acca: any) => <option value={acca._id} className='text-[12px] font-bold' >{acca?.title}</option> )}
                    </select>
                    <div className="divider"></div>
                        <select value={lang} onChange={(e: any) => setLang(e.target.value)} id="" className="language-dashboard md:px-2 px-1 rounded-md">
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
                            <div className="name"> Admin</div>
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
                    <span>Admin</span>
                </div>
                <div className="user-menu-footer">
                    <a onClick={() => navigate('/school/info')} className="logout-link"><i className="fas fa-cog"></i> Settings</a>
                    <a onClick={handleLogout} className="logout-link"><i className="fas fa-door-open"></i> Logout</a>
                </div>
            </div>

            <div className="content">
                    <div className="con">
                        <div className="page-title">
                            <p>{title}</p>
                            <div className="crumb">
                                <NavLink to="/" className="crumb-item">Admin</NavLink>
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
                    <p>Support us </p>
                    <p>Version 1.0</p>
                </div>
            </footer>
        </div>
    </div>
    );
}

export default SchoolLayout;
import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { AiOutlineUserAdd } from 'react-icons/ai';
import { CiFacebook } from 'react-icons/ci';
import { FaTiktok } from 'react-icons/fa';
import { FaYoutube } from 'react-icons/fa';
import { BsCheck2Circle }  from 'react-icons/bs';
import './home.css';
import { Link } from "react-router-dom";
import { MdContentCopy } from 'react-icons/md';


import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import { toast } from 'react-toastify';


import { useTranslation } from 'react-i18next';
import { getPublicSchools, getPublicSpecialities } from '../../services/public';

import { FaRegEdit } from 'react-icons/fa';

import BeatLoader from "react-spinners/BeatLoader";

const override = {
  marginTop: '20px'
};



const rows: any = [
  {
      label: '#',
      name: 'num'
  },
  {
      label: 'Speciality Name',
      name: 'name'
  },
  {
      label: 'Speciality Code',
      name: 'name'
  },
  {
      label: 'School',
      name: 'name'
  },
  {
      label: 'Fees',
      name: 'name'
  },
  {
      label: 'Action',
      name: 'name'
  },
]


function Index() {
    const { t, i18n } = useTranslation();
    
    let [lang, setLang] = useState<any>(null);

    const [schools, setSchools] = useState([]);
    const [specialities, setSpecialities] = useState([]);
    const [selectedSchool, setSelectedSchooll] = useState('all');
    const [selectedSchoolCode, setSchoolSelectedCode] = useState('none');

    const [loading, setLoading] = useState(false);

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

    const copyToClipBoard = (data: any) => {
      navigator.clipboard.writeText(`${data}`);
                                                          
      toast.success("Copied To Clipboard", {
          pauseOnHover: false,
          closeOnClick: true,
      })
  }

    const handleSelectedSchool = (_id: any) => {
     
      let foundMatch = false;

      schools.map((data: any) => {
        console.log(data);
        if(data._id == _id) {
          setSchoolSelectedCode(data.school_code);
          foundMatch = true;
        }
      })


      if(!foundMatch) {
        setSchoolSelectedCode('none');
      }

      setSelectedSchooll(_id);
      handleGetSpecialities();

    }


    const handleGetSpecialities = () => {
      getPublicSpecialities().then((res: any) => {
        setSpecialities(res.data.data);
      }).catch((error: any) => {
        console.log('ERROR');
      })
    }

    const changeLang = () => {
      if(lang != null) {
        localStorage.setItem('locale', lang)
        handleTrans();
      }
    }

    const getSchools = () => {
      getPublicSchools().then((res: any) => {
        setSchools(res.data.data);
      }).catch((err: any) => {

      })
    }
    
    useEffect(() => {
      handleLangInit();
      getSchools();
    },[])

    useEffect(() => {
      changeLang()
    }, [lang]);


    return (
        <div className="landing-page">
         
      
        <div className="page">
          <div className='nav'>
            <div>
          <h1 className='font-bold'> Tolkin</h1>
            </div>
          <div>
          <select value={lang} onChange={(e: any) => setLang(e.target.value)} id="" className="language px-2 rounded-md ">
                  <option value="en">🏴󠁧󠁢󠁥󠁮󠁧󠁿 EN</option>
                  <option value="fr">🇫🇷 FR</option>
              </select>
       

          </div>

          
          </div>
          <div className="hero">
            <div className="con">
              <div className="sec-1">
                
               
                <h1>
                    {t('home_title')}
                </h1>
                <p className="home-desc ">
                  {t('home_descriptioon')}
                </p>
                <div className="hero-btns">
                  <Link to="/register" className="btn btn-primary"
                    >{t('register_text')}</Link>
                  <Link to="/login" className="btn btn-secondary"
                    >{t('login_text')}</Link>
                
                </div>
              </div>
              
            </div>
          </div>

          <section>
            <div className="how-it-works">
              <div className="con">
                <div className="sec-1">
                  <h1>{t('how_it_works')}</h1>
                  <ul>
                    <li>
                      <AiOutlineUserAdd size={22} />
                      <div className="text">
                        <h5>{t('step_one_title')}</h5>
                        <p>{t('step_one_description')}</p>
                      </div>
                    </li>
                    <li>
                    <AiOutlineUserAdd size={22} />
                      <div className="text">
                      <h5>{t('step_two_title')}</h5>
                        <p>{t('step_two_description')}</p>
                      </div>
                    </li>
                    <li>
                    <AiOutlineUserAdd size={22} />
                      <div className="text">
                      <h5>{t('step_three_title')}</h5>
                        <p>{t('step_three_description')}</p>
                      </div>
                    </li>
                  </ul>
                </div>
                <div className="sec-2">
                  <img src={require('../../assets/images/illustrtions/landing-2.png')} alt="" />
                </div>
              </div>
            </div>
          </section>
        </div>
    
        <section className="waiting">
          <div className="con">
            <h1>{t('waiting_question')}</h1>
            <div className="btn-flex">
              <Link to="/register"  className="btn btn-white"
                >{t('register_text')}</Link>
              <Link to="/login" className="btn btn-secondary">{t('login_text')}</Link>
            </div>
            <div className="checks">
              <div className="check">
                <BsCheck2Circle size={20}/>
                <span>{t('features_one')}</span>
              </div>
              <div className="check">
                 <BsCheck2Circle size={20}/>
                <span>{t('features_two')}</span>
              </div>
              <div className="check">
                 <BsCheck2Circle size={20}/>
                <span>{t('features_three')}</span>
              </div>
            </div>
          </div>
        </section>

        <section >
        <div className="con school-info-container">
          <h1 className="home-school-sec-title">Select subscription type To Get Code </h1>
          <br />
          <div className="home-speciality-title">
              <p>Subscription Code: <span>{selectedSchoolCode} {selectedSchoolCode != 'none' && <Tippy content="Copy Code"  animation="fade">
                                            <a className="see" onClick={() => copyToClipBoard(selectedSchoolCode)}><MdContentCopy size={20}/></a>
                                            </Tippy>}</span></p>
          </div>
        <div className="data-table">
                    <div className="top">
                        <div className="span">
                        
                            <select name="" id="" onChange={(e: any) => handleSelectedSchool(e.target.value)} value={selectedSchool} className="select-field">
                                <option value="all">Select Abonnement</option>
                               {specialities?.map((sp: any) => <option value={sp._id}>{sp?.name}</option>)}
                            </select>
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
                                {specialities?.map((data: any, index: any) => <tr>
                                    <td className="flex-center">{index + 1}</td>
                                    <td className="flex-start">
                                        <p>{data?.name}</p>
                                    </td>
                                    <td className="flex-start">
                                      {data?.code}
                                    </td>
                                    <td className="flex-start">
                                      {data?.username}
                                    </td>

                                    <td className="flex-start">
                                      {data?.fees}
                                    </td>

                                    <td className="flex-center">
                                        <div className="action">

                                        <Tippy content="Copy Code"  animation="fade">
                                            <a className="see" onClick={() => copyToClipBoard(data?.code)}><MdContentCopy size={14}/></a>
                                            </Tippy>
{/*                                         
                                       {data.status != 'accepted' &&    <Tippy content="Activate"  animation="fade">
                                                    <a className="see" onClick={() => {
                                                        setSelectedId(data?._id);
                                                        toggleAcceptModal();
                                                    }}><AiOutlineCheckSquare size={14}/></a>
                                                    </Tippy>}

                                          {data.status == 'pending' &&   <Tippy content="Reject"  animation="fade">
                                            <a onClick={() => {
                                                    setSelectedId(data?._id);
                                                    toggleRejectModal();
                                            }} className="delete"><MdOutlineCancelPresentation /></a>
                                        </Tippy>}

                                       {data.status == 'accepted' &&  <Tippy content="Suspend"  animation="fade">
                                            <a onClick={() => {
                                                    setSelectedId(data?._id);
                                                    toggleSuspendModal();
                                            }} className="delete"><MdOutlineCancelPresentation /></a>
                                        </Tippy>} */}
                                        </div>
                                    </td>
                                </tr> )}
                            </tbody>
                        </table>
                    </div>

                </div>
                </div>
        </section>
    
        <section className="footer">
          <div className="con">
            <p>All Right reserve to Tolkin</p>
            <div className="social">
              <ul>
                <li>
                  <a href=""><CiFacebook size={20} className="text-white"/></a>
                </li>
                <li>
                 <a href=""><FaTiktok size={20} color="#fff"/></a>
                </li>
                <li>
                 <a href=""><FaYoutube size={20} color="#fff"/></a>
                </li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    );
}

export default Index;
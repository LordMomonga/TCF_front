import { AiFillDelete } from "react-icons/ai"; 
import { AiOutlineEye } from "react-icons/ai"; 
import { BiDotsVerticalRounded } from "react-icons/bi"; 
import React from 'react'
import StudentLayout from '../../../components/StudentLayout/StudentLayout'
import { useState } from 'react'
import { useNavigate } from 'react-router'
import { BeatLoader } from 'react-spinners'
import { getAllNotifications } from '../../../services/assessment'
import { getNotification } from "../../../services/assessment";
import { getUser } from '../../../utils/storage'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useContext } from 'react'
import { convertDate } from "../../../utils/date";
import { changeNotification } from "../../../services/assessment";

const rows: any = [
    {
        label: '#',
        name: 'num'
    },
   
    {
        label: 'motif',
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

export const Notification = () => {
    const [notification, setNotification] = useState<any>([])
    const navigate = useNavigate();
    const { t, i18n } = useTranslation();

    const handleNotifications = () => {
         getAllNotifications().then((res:any)=> {
            if(res.ok){
                setNotification(res?.data)
                console.log(res?.data[0], 'la notification a all');
                
            } else {
                console.log('erreur pour la notiffication ')
            }

        })
    }

    const handleChangeNotification = (id:any) => {

        changeNotification(id).then((res:any)=> {
           if(res.ok){
              
               console.log( 'la valeur a bien été changé');
               navigate('/students/results')
           } else {
               console.log('erreur pour la notiffication ')
           }

       })
   }

    

    const goToNotification = () => {
        navigate('/students/notification')
    }

    useEffect(() => {
        handleNotifications();
      },[])
    return (
        <StudentLayout title="Boite de Reception" pageTitle="Boite de reception">
            <div className='section'>
                <div className='parent-con'>
              <div className="data-table">
                <div className="top">
                <div className="span">
                    
                </div>  
                    <div className="table-con">
                    <table>
                        <thead>
                            <tr>
                            {rows.map((row: any, index: any) => <th key={index} className={row.name}>{row.label}</th>)}   
                            </tr>
                        </thead>
                        <tbody>
                            {notification?.map((data:any, index:any) =>
                            
                            <tr className={`cursor-pointer ${data?.vue === false ? 'font-bold text-black shadow-md shadow-gray-200' :  'text-gray-3   00'} `} onClick={() => handleChangeNotification(data?._id)}>
                               <td className={`${data?.vue === false ? 'font-bold text-black' :  'text-gray-300'} flex-center`}>{index + 1}</td> 
                               <td className={`${data?.vue === false ? 'font-bold text-black' :  'text-gray-300'} flex-start`}>
                                <p className={`${data?.vue === false ? 'font-bold text-black' :  'text-gray-300'} flex-start`}>{data?.typeNotification}</p>
                               </td>
                              
                               <td className="flex-start">
                                        <p className={`${data?.vue === false ? 'font-bold text-black' :  'text-gray-300'} flex-start`}>{convertDate(data?.createdAt)}</p>
                                    </td>
                                    <td className="flex-center">
                                        <div className="flex items-center gap-5">
                                            <AiOutlineEye className=""/>
                                            <AiFillDelete />
                                        </div>
                                    </td>
                               
                               </tr>
                            )}
                        </tbody>
                        </table> 
                    </div>
                                        
                </div>

              </div>
                </div>

            </div>


        </StudentLayout>

  )
}

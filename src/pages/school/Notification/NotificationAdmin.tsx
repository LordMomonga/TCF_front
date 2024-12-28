import React from 'react'
import { AiFillDelete } from "react-icons/ai"; 
import { AiOutlineEye } from "react-icons/ai"; 
import SchoolLayout from '../../../components/SchoolLayout/SchoolLayout';
import { useState } from 'react';
import { useNavigate } from 'react-router'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { convertDate } from "../../../utils/date";
import { changeNotification, changeNotificationAdmin } from "../../../services/assessment";
import { getAdminNotification } from '../../../services/assessment';

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

export const NotificationAdmin = () => {
 const [notification, setNotification] = useState<any>([])
    const navigate = useNavigate();
    const { t, i18n } = useTranslation();


    const handleNotifications = () => {
      getAdminNotification().then((res:any)=> {
         if(res.ok){
             setNotification(res?.data?.notification)
             console.log(res?.data[0], 'la notification a all');
             
         } else {
             console.log('erreur pour la notiffication ')
         }

     })
 }

 const handleChangeNotification = (id:any, type:any) => {
 
  changeNotificationAdmin(id).then((res:any)=> {
            if(res.ok){
               
                console.log( 'la valeur a bien été changé');
              
                switch (type) {
                  case 'Demande Abonnement':
                    navigate('/school/students')
                    break;
                
                  default:
                    navigate('/school/result-types')
                    break;
                }
                
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
    <SchoolLayout title="Boite de Reception" pageTitle="Boite de reception">
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
                    
                    <tr className={`cursor-pointer ${data?.vue === false ? 'font-bold text-black shadow-md shadow-gray-200' :  'text-gray-300'} `} onClick={() => handleChangeNotification(data?._id, data?.typeNotification)}>
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


</SchoolLayout>
  )
}

import React from 'react'
import { BiAlarmExclamation } from 'react-icons/bi'
import { BiQuestionMark } from 'react-icons/bi'
import { Question } from './constant'
import { BiError } from 'react-icons/bi'
import { BiExit } from 'react-icons/bi'
import { BiSkipNext } from 'react-icons/bi'
import { NavLink, Outlet } from 'react-router-dom';
import { getUser } from '../../utils/storage'
import { useEffect } from 'react'
import { useState } from 'react'
import { selectComprehensionOrale } from '../../services/assessment'
import './test.css'

interface Question {
  level: string;
  question: string;
  solution1: string;
  solution2: string;
  solution3: string;
  solution4: string;
  response: string;
  typeElement: string;
  imageUrl: string;
  audioUrl: string;
}

const CO = () => {
     const [remainingTime, setRemainingTime] = useState<number>(35 * 60)
    const [user, setUser] = useState<any>(null);
    const [numb, setNumb] = useState(39)
    const [loading, setLoading] = useState(false)
    const [selectListeningA1, setSelectListeningA1]= useState([])
    const [selectListeningA2, setSelectListeningA2]= useState([])
    const [selectListeningB1, setSelectListeningB1]= useState([])
    const [selectListeningB2, setSelectListeningB2]= useState([])
    const [selectListeningC1, setSelectListeningC1]= useState([])
    const [selectListeningC2, setSelectListeningC2]= useState([])
    const [allQuestion, setAllQuestion] = useState<any>([])
    const [CO, setCO] = useState<any>("still");
    const [question1, setQuestion1] = useState<any>("error network response charging");
    const [question2, setQuestion2] = useState<any>("error network response charging");

    const [question3, setQuestion3] = useState<any>("error network response charging");
    const [question4, setQuestion4] = useState<any>("error network response charging");

    const [qst, setqst] = useState("");

    const [question, setQuestion] = useState("")
    const [currentList, setCurrentList] = useState<any>([]);
    const [currentIndex, setCurrentIndex] = useState<number>(0);
    const [Index, setIndex] = useState<number>(0);
    const [data, setData] = useState<any>({});

    const handleComprehensionOrale = () => {
      setLoading(true)
      selectComprehensionOrale().then((res: any) => {
        console.log('RESPONSE GET: ', res.data);
        setData(res.data.data);
        if(res.ok) {
         
          setSelectListeningA1(res.data.data.selectListeningA1);
         
          setSelectListeningA2(res.data.data.selectListeningA2);
          setSelectListeningB1(res.data.data.selectListeningB1);
          setSelectListeningB2(res.data.data.selectListeningB2);
          setSelectListeningC1(res.data.data.selectListeningC1);
          setSelectListeningC2(res.data.data.selectListeningC2);
          
        }
        const allQuestions = [
          ...res.data.data.selectListeningA1,
          ...res.data.data.selectListeningA2,
          ...res.data.data.selectListeningB1,
          ...res.data.data.selectListeningB2
        ];
        setAllQuestion(allQuestions)
       
     
        console.log("le premier listening", selectListeningA2, allQuestions);
        setCO(allQuestions[0].question)
        setQuestion1(allQuestions[0].solution1)
        setQuestion2(allQuestions[0].solution2)
        setQuestion3(allQuestions[0].solution3)
        setQuestion4(allQuestions[0].solution4)
        setqst(allQuestions[0].imageUrl)
        console.log("ou je veux en venir",CO, question1, qst);
        
        setLoading(false);
      }).catch(err => {
        console.log('error error', err)
        setLoading(false);
      })
    }
    useEffect(() => {
      handleComprehensionOrale();
        let usr = getUser();
        setUser(usr);
    }, [])

    useEffect(() => {
        const intervalId = setInterval(() => {
          if (remainingTime > 0) {
            setRemainingTime((prevRemainingTime) => prevRemainingTime - 1);
          } else {
            clearInterval(intervalId);
          }
        }, 1000); // Update every second
    
        return () => clearInterval(intervalId); // Cleanup on unmount
      }, []);

      const formatTime = (seconds: number): string => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
    
        return `${minutes.toString().padStart(2, '0')}min ${remainingSeconds.toString().padStart(2, '0')}s`;
      };

     const nextVideo = () =>  {

     }
    
   
     useEffect(() => {
      let index = 0
      const interval = setInterval(() => {
        if(index == allQuestion.length + 1) return
        index ++
        setCO(allQuestion[index].question)
        setQuestion1(allQuestion[index].solution1)
        setQuestion2(allQuestion[index].solution2)
        setQuestion3(allQuestion[index].solution3)
        setQuestion4(allQuestion[index].solution4)
        setqst(allQuestion[index].imageUrl)
        console.log("ou si ca marche",CO, question1, qst);
        
        

      }, 10000); // 60000 ms = 1 minute
  
      return () => clearInterval(interval);
    }, []);
  
   

      useEffect(() => {
        const items = document.querySelectorAll<HTMLLIElement>('.question-item');
        let index = 0;
        const interval = setInterval(() => {
          items.forEach((item, i) => {
            if (i === index) {
              item.classList.add('border-highlight', 'bg-green-500');
                    

            } else {
              item.classList.remove('border-highlight', 'bg-green-500');
            }
          });
              setNumb(39 - index);

          index = (index + 1) % items.length;

        }, 10000); // 60000 ms = 1 minute
    
        return () => clearInterval(interval);
      }, []);
    

  return (
    <div className='w-screen relative'>
      <nav className=' px-5 py-5 flex items-center bg-prim '>
        <span className=' text-white font-bold text-3xl'>Tolkin</span>
        </nav>
        
       <div className='fixed z-10 left-0 px-2 bg-prim h-[80%]'>
           <span className='mt-8 block font-bold  text-sm uppercase text-white '>comprehension orale </span>
            <div className='mt-5 px-1 bg-white  py-2'>
              
                <ol className=''>{Object.keys(Question).map((Question)=>(
                    <li  className=" question-item py-1 text-white text-sm font-bold text-center px-5 bg-gray-500 rounded-xl mt-1 " key={Question}>{Question}</li>
                ))} </ol>
            </div>
            <div className="bg-white text-gray-500 mt-5 mb-5 rounded-md px-5 py-2">
                    <div className='text-sm font-bold flex items-center gap-3 '> <BiQuestionMark className=' text-white bg-blue-500 rounded-full font-bold  '></BiQuestionMark><span> restant: {numb} </span> </div>
                    <div className='mt-2 text-sm font-bold flex items-center gap-3 '><BiAlarmExclamation className=' text-white bg-green-500 rounded-full font-bold  '></BiAlarmExclamation><span> repondu :</span></div>
                    <div className='mt-2 text-sm font-bold flex items-center gap-3 '><BiError className=' text-white bg-red-500 rounded-full font-bold  '></BiError><span>Aucune  :</span></div>
                </div>
        </div>      
        <div className='z-10 fixed right-0 px-4 bg-prim h-[80%]'>
              <div className='bg-white px-5  text-gray-600  text-sm text-center rounded-md py-2'>
                <h1 className='font-bold underline underline-offset-4 '>Mon profil</h1>
                <div className=' py-3 text-left'>
                    <span className='font-bold'>Nom : <span className='text-prim font-bolder'>{user?.username}</span></span>
                    <span className='block mt-2 font-bold'>Adresse : <span className='text-prim font-bolder'>{user?.email}</span></span>
                    <span className='block mt-2 font-bold'>Partie : Comprehension Orale</span>
                    <span className='block mt-2 font-bold'>Durée : 35min</span>

                </div>
              </div>
              
            <div className="bg-white text-gray-500 mt-[30%] mb-5 rounded-md px-5 py-2">
                    <div className='text-[13px] font-bold flex items-center gap-3 '> <BiQuestionMark className=' text-white bg-blue-500 rounded-full font-bold  '></BiQuestionMark><span> Temps : {formatTime(remainingTime)} </span> </div>
                    <div className='mt-2 text-[13px] font-bold flex items-center gap-3 '><BiAlarmExclamation className=' text-white bg-green-500 rounded-full font-bold  '></BiAlarmExclamation><span>Temps restant :</span></div>
                </div>
        </div>      
        <div className='z-10 fixed bottom-0 bg-prim w-screen flex justify-between py-5 px-[10%] '>
           
        <div className='bg-white text-gray-600 px-5 py-2 rounded-xl font-bold flex gap-2 items-center'><NavLink to='/compecrite' className='flex items-center gap-2'><BiSkipNext className='text-md bg-green-500 text-white'></BiSkipNext>skip this test</NavLink></div>
        <div className='bg-white text-gray-600 px-5 py-2 rounded-xl font-bold flex gap-2 items-center '><NavLink to='/home'className='flex items-center gap-2'><BiExit className='text-md bg-red-500 text-white'></BiExit>quit the examination</NavLink></div></div>
       
        <div className='bg-white h-[80%] w-[68%] py-2 left-[13.5%] px-5 text-gray-700 fixed z-0'>
        <div className="text-sm font-bold text-center">
                Écoutez l'enregistrement  et  Choisissez la/les réponse/s qui correspond/ent à la question . 
            </div>
            <div className='w-full relative'>
                <div className='flex justify-center'>
                <img className=' w-[30%] ' src={qst} alt="" />
                </div>
                <div className='pl-[15%] justify-center '>

                <span className='block  mb-5 font-bold'>
                  {CO}
                 </span>
                <div className='flex gap-5 mb-2'>
                    <input type="radio" />
                    <label htmlFor="">a- {question1}</label>
                </div>
                <div className='flex gap-5 mb-2'>
                    <input type="radio" />
                    <label htmlFor="">b- {question2}</label>
                </div>
                <div className='flex gap-5 mb-2'>
                    <input type="radio" />
                    <label htmlFor="">c- {question3}</label>
                </div>
                <div className='flex gap-5 mb-2'>
                    <input type="radio" />
                    <label htmlFor="">d- {question4}</label>
                </div>
                </div>

            </div>
           
            
        </div>
    </div>
  )
}

export default CO

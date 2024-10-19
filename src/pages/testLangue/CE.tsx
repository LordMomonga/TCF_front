import React from 'react'
import { BiAlarmExclamation } from 'react-icons/bi'
import { BiQuestionMark } from 'react-icons/bi'
import { BiError } from 'react-icons/bi'
import { BiExit } from 'react-icons/bi'
import { BiSkipNext } from 'react-icons/bi'
import { NavLink, Outlet } from 'react-router-dom';
import { useEffect } from 'react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import {Question} from './constant'
import { getUser } from '../../utils/storage'
import './test.css'
import { selectComprehensionEcrite } from '../../services/assessment'
import { Console } from 'console'
const CE = () => {
    const [remainingTime, setRemainingTime] = useState<number>(60 * 60)
    const [user, setUser] = useState<any>(null);

    const [question1, setQuestion1] = useState<any>("error network response charging");
    const [question2, setQuestion2] = useState<any>("error network response charging");
    const [score, setScore] = useState(0);
    const [question3, setQuestion3] = useState<any>("error network response charging");
    const [question4, setQuestion4] = useState<any>("error network response charging");
    const [response, setResponse] = useState<any>();
    const [hasAnswered, setHasAnswered] = useState<boolean>(false);
    const [qst, setqst] = useState("");
    const [loading, setLoading] = useState(false)
    const [selectListeningA1, setSelectListeningA1]= useState<any>([])
    const [selectListeningA2, setSelectListeningA2]= useState<any>([])
    const [selectListeningB1, setSelectListeningB1]= useState<any>([])
    const [selectListeningB2, setSelectListeningB2]= useState<any>([])
    const [selectListeningC1, setSelectListeningC1]= useState<any>([])
    const [selectListeningC2, setSelectListeningC2]= useState<any>([])
    const [allQuestion, setAllQuestion] = useState<any>([])
    const [timeLeft, setTimeLeft] = useState(60); 
    const [CO, setCO] = useState<any>("still");
    const [data, setData] = useState<any>();
    const [result, setResult] = useState(0)
    const [currentIndex, setCurrentIndex] = useState<number>(0);
    const [selectedValue, setSelectedValue] = useState<any>('');
    const [selectedAnswer, setSelectedAnswer] = useState<any>(null); 
    const locate = useNavigate();
    useEffect(() => {
        let usr = getUser();
        setUser(usr);
    }, [])

    const handleComprehensionOrale = () => {
      setLoading(true)
      selectComprehensionEcrite().then((res: any) => {
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
          ...res.data.data.selectListeningB2,
          ...res.data.data.selectListeningC1,
          ...res.data.data.selectListeningC2


        ];
        
        setAllQuestion(allQuestions)
       
     
        console.log("le premier listening", allQuestions);
        setCO(allQuestions[0].question)
        setQuestion1(allQuestions[0].solution1)
        setQuestion2(allQuestions[0].solution2)
        setQuestion3(allQuestions[0].solution3)
        setQuestion4(allQuestions[0].solution4)
        setqst(allQuestions[0].imageUrl)
        setResponse(allQuestions[0].response)
        console.log("ou je veux en venir",CO, question1, qst);
        setLoading(false);
      }).catch(err => {
        console.log('error error', err)
        setLoading(false);
      })
    }

    const currentQuestion = allQuestion[currentIndex];
    const index = allQuestion.length - 1 ;
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      //  setSelectedValue(e.target.value);
        setSelectedAnswer(e.target.value);
        setHasAnswered(true);
        console.log('Selected Answer on change:', e.target.value);
        console.log(selectedAnswer);
        
      };
    

    const moveToNextQuestion = () => {
      console.log('Selected Answer:', selectedAnswer);
      console.log('Correct Solution:', currentQuestion.response);

      if ( selectedAnswer === currentQuestion.response) {
        let point = 1
       setScore(prevScore => prevScore + 1);
       }
  
      setSelectedAnswer(null); // Reset selected answer
      setTimeLeft(60); // Reset timer for the next question
      
      if (currentIndex < allQuestion.length - 1) {
        
        setCurrentIndex(currentIndex + 1);
        console.log(currentIndex, score, result);
         // Move to next question
      } else {
        console.log(score, result,"obtenu");
        locate('/stud/results', { state: { score, index } });
      }
    };
    
    useEffect(() => {
      if (timeLeft === 0) {
        moveToNextQuestion();
        return;
      }
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }, [timeLeft]);
    useEffect(() => {
      // This will run each time the score is updated
      console.log('Score updated:', score);
    }, [score]);

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


    const handleExit = () => {
      locate("/students/passexams")
    }
    useEffect(() => {
      handleComprehensionOrale();
        let usr = getUser();
        setUser(usr);
    }, [])

    const checkAnswer = () => {
      const currentQuestion = allQuestion[currentIndex];
      if (selectedValue === currentQuestion?.response) {
        let points = 1;
        if (currentIndex >= 10 && currentIndex < 15) {
          points = 3;
        } else if (currentIndex >= 15) {
          points = 5;
        }
        setScore((prevScore) => prevScore + points);
      }
    };  

    

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
    
     
    
    
    

  return (
    <div className='w-screen relative'>
      <nav className=' px-5 py-5 flex items-center bg-prim '>
        <span className=' font-bold text-3xl text-white'>Tolkin</span>
        </nav>
        
       <div className='z-10 fixed left-0 px-2 bg-prim h-[80%]'>
           <span className='mt-8 block font-bold  text-sm uppercase text-white '>comprehension Ecrite </span>
            <div className='mt-5 px-1 bg-white  py-2'>
              
                <ol className='text-white'>{Object.keys(Question).map((Question)=>(
                    <li  className="question-item py-1 text-sm text-white font-bold text-center px-5 bg-gray-500 rounded-xl mt-1 " key={Question}>{Question}</li>
                ))} </ol>
            </div>
            <div className="bg-white text-gray-500 mt-5 mb-5 rounded-md px-5 py-2">
                    <div className='text-sm font-bold flex items-center gap-3 '> <BiQuestionMark className=' text-white p-2 bg-blue-500 rounded-full font-bold  ' color={'white'}></BiQuestionMark ><span> restant:</span> </div>
                    <div className='mt-2 text-sm font-bold flex items-center gap-3 '><BiAlarmExclamation className=' text-white bg-green-500 rounded-full font-bold  p-2 '></BiAlarmExclamation><span> repondu :</span></div>
                    <div className='mt-2 text-sm font-bold flex items-center gap-3 '><BiError className=' text-white bg-red-500 rounded-full font-bold  '></BiError><span>Aucune  :</span></div>
                </div>
        </div>      
        <div className=' z-10 fixed right-0 px-4 bg-prim h-[80%]'>
              <div className='bg-white px-5  text-gray-600  text-sm text-center rounded-md py-2'>
                <h1 className='font-bold underline underline-offset-4 '>Mon profil</h1>
                <div className=' py-3 text-left'>
                    <span className='font-bold'>Nom : <span className='text-prim font-bolder'>{user?.username}</span></span>
                    <span className='block mt-2 font-bold'>Adresse : <span className='text-prim font-bolder'>{user?.email}</span></span>
                    <span className='block mt-2 font-bold'>Partie : Comprehension Ecrite</span>
                    <span className='block mt-2 font-bold'>Durée : 60min</span>

                </div>
              </div>
              
            <div className="bg-white text-gray-500 mt-[30%] mb-5 rounded-md px-5 py-2">
                    <div className='text-[13px] font-bold flex items-center gap-3 '> <BiQuestionMark className=' text-white bg-blue-500 rounded-full font-bold  '></BiQuestionMark><span> Temps : {formatTime(remainingTime)} </span> </div>
                    <div className='mt-2 text-[13px] font-bold flex items-center gap-3 '><BiAlarmExclamation className=' text-white bg-green-500 rounded-full font-bold  '></BiAlarmExclamation><span>Temps restant :</span></div>
                </div>
        </div>      
        <div className='z-10 fixed bottom-0 bg-prim w-screen flex justify-between py-5 px-[10%] '>
        <div className='bg-white text-gray-600 px-5 py-2 rounded-xl font-bold flex gap-2 items-center'><NavLink to='/Eorale' className='flex items-center gap-2'><BiSkipNext className='text-md bg-green-500 text-white'></BiSkipNext>skip this test</NavLink></div>
        <div className='bg-white text-gray-600 px-5 py-2 rounded-xl font-bold flex gap-2 items-center '><span onClick={handleExit} className='flex items-center gap-2'><BiExit className='text-md bg-red-500 text-white'></BiExit>quit the examination</span></div></div>
       
        <div className='bg-white h-[80%] w-[68%] py-2 left-[14%] px-5 text-gray-700 fixed z-0'>
        <div className="text-sm font-bold text-center">
                lisez le test et  Choisissez la bonne réponse en cochant sur la bonne reponse. 
            </div>
            <div className='w-full relative'>
                <div className='flex justify-center'>
                <img className=' w-[50%] ' src={currentQuestion?.imageUrl} alt="" />
                </div>
                <div className='pl-[15%] justify-center '>
                <span className='block  mb-5 font-bold'>
                {currentIndex + 1}- {currentQuestion?.question}
                </span>
                <form action="">
                 <div className='flex gap-5 mb-2'>
                 <input type="radio" name="question" value="1"
                  checked={selectedAnswer === "1"}
                 onChange={handleChange} id="option-a" />
                 <label htmlFor="option-a">a- {currentQuestion?.solution1}</label>
                </div>
                <div className='flex gap-5 mb-2'>
                <input type="radio" name="question" value="2" 
                 checked={selectedAnswer === "2"}
                onChange={handleChange} id="option-b" />
                <label htmlFor="option-b">b- {currentQuestion?.solution2}</label>
                </div>
                <div className='flex gap-5 mb-2'>
                <input type="radio" name="question" value="3"  
                 checked={selectedAnswer === "3"}
                onChange={handleChange} id="option-c" />
                <label htmlFor="option-c">c- {currentQuestion?.solution3}</label>
                </div>
                <div className='flex gap-5 mb-2'>
                    <input type="radio" name="question" value="4" 
                     checked={selectedAnswer === "4"}
                    onChange={handleChange}id="option-d" />
                    <label htmlFor="option-d">d- {currentQuestion?.solution4}</label>
                </div>
                 </form>
                </div>

            </div>
           
            
        </div>
    
    </div>

  )
}

export default CE

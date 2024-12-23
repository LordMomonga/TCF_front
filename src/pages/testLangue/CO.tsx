import { HiOutlineSpeakerphone } from "react-icons/hi"; 
import { FaTeamspeak } from "react-icons/fa"; 
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
import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
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
    const [remainingTime, setRemainingTime] = useState<number>(40 * 60)
    const [user, setUser] = useState<any>(null);
    const [numb, setNumb] = useState(39)
    const [loading, setLoading] = useState(false)
    const audioRef = useRef<HTMLAudioElement>(null);

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
    const [score, setScore] = useState(0);
    const [question3, setQuestion3] = useState<any>("error network response charging");
    const [question4, setQuestion4] = useState<any>("error network response charging");
    const [response, setResponse] = useState<any>();
    const [hasAnswered, setHasAnswered] = useState<boolean>(false);
    const [qst, setqst] = useState("");
    const [timeLeft, setTimeLeft] = useState(60); 
    const locate = useNavigate();
    const audio1Ref = useRef<HTMLAudioElement>(null);
    const [echou, setEchou] = useState<any[]>([]);
    const [currentIndex, setCurrentIndex] = useState<number>(0);
const [selectedValue, setSelectedValue] = useState<any>('');
const [selectedAnswer, setSelectedAnswer] = useState<any>(null); 
    const [question, setQuestion] = useState("")
    const [currentList, setCurrentList] = useState<any>([]);
    const [Index, setIndex] = useState<number>(0);
    const [data, setData] = useState<any>({});
    const [array, setArray] = useState([])
    const [result, setResult] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);

    const [responses, setResponses] = useState(Array(39).fill({answer: null, option: Array().fill(null)}));
   
    const [isOpen, setIsOpen] = useState(false);

    const handleImageToggle = () => {
        setIsOpen(!isOpen);
    };
    const handleExit = () => {
      locate("/students/passexams")
    }

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
          ...res.data.data.selectListeningB2,
          ...res.data.data.selectListeningC1,
          ...res.data.data.selectListeningC2
        ];
        setAllQuestion(allQuestions)
       
     
        console.log("le premier listening", selectListeningA2, allQuestions);
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
    const index = allQuestion.length ;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement> , optionIndex?: number) => {
      const { value } = e.target;
      
      //  setSelectedValue(e.target.value);
        setSelectedAnswer(e.target.value);
        setHasAnswered(true);
       

        setResponses((prevResponses) => {
          // Créez une copie de l'état précédent
          const updatedResponses = [...prevResponses];
      
          // Vérifiez si la mise à jour concerne une réponse principale ou une sous-option
          if (optionIndex === undefined) {
            // Met à jour la réponse principale
            updatedResponses[currentIndex] = {
              ...updatedResponses[currentIndex],
              answer: value, // Met à jour la propriété `answer`
            };
          } else {
            // Met à jour une sous-option dans `options`
            const updatedOptions = [...(updatedResponses[currentIndex]?.option || [])];
            updatedOptions[optionIndex] = value;
      
            updatedResponses[currentIndex] = {
              ...updatedResponses[currentIndex],
              option: updatedOptions, // Met à jour les sous-options
            };
          }
      
          return updatedResponses;
        });
              
      };

      const moveToNextQuestion = () => {
        console.log('Selected Answer:', selectedAnswer);
        console.log('Correct Solution:', currentQuestion.response);
  
        if ( selectedAnswer === currentQuestion.response) {
          let point = 1
         setScore(prevScore => prevScore + 1);
         } else {
          setEchou(prevEchou => [...prevEchou, {currentQuestion,
            selectedAnswer
          }]);
          console.log('Incorrect answer. Correct answer was:', currentQuestion.response);
         }
    
        setSelectedAnswer(null); // Reset selected answer
        setTimeLeft(60); // Reset timer for the next question
        
        if (currentIndex < allQuestion.length - 1) {
          
          setCurrentIndex(currentIndex + 1);
          console.log(currentIndex, score, result);
           // Move to next question
        } else {
          {
            // Vérifiez le contenu des tableaux
            let finalScore = 0;
            let choixEchec = [{}]
   
            const levelPointsMap: { [key: string]: number } = {
              A1: 3,
              A2: 9,
              B1: 15,
              B2: 21,
              C1: 26,
              C2: 33,
            };
   
            responses.forEach((response:any, index:any) => {
              
             if (index < allQuestion.length ) {
   
               let points = 0; // Points gagnés ou perdus pour cette question
   
                const question = allQuestion[index];
                const levelPoints = levelPointsMap[question.level] || 0; // Récupère les points associés au niveau, 0 par défaut.  
                const optionPenalty = levelPoints / (currentQuestion.options.length + 1); // Pénalité par option incorrecte
                
               

                
                let respAnswer = response?.answer
                
                points = levelPoints;
   
                if (respAnswer !== question.response) {
               

                 if (response.option?.length === 0) points = 0
                 else  points -= optionPenalty

                choixEchec.push( {
                 question:question,
                 selectedAnswer: respAnswer,
                 correctedAnswer:question.response,
                 index: index,
                 opt: null
               })
   
               console.log("l'echec est de taille", echou);
               
                
   
               }
               console.log('verification du point', points, index, echou)
   
      
                if (question?.option) {
   
                  question.options.forEach((option: any, optIndex: number) => {
   
                    
                    const chosenOption = response?.option[optIndex]
                     const laSol = String(option.solution)
                    if (chosenOption !== laSol ) {
                    
                     points -= optionPenalty;
                     
                    choixEchec.push( {
                     question:question,
                     selectedAnswer: chosenOption,
                     correctedAnswer:laSol,
                     index: index,
                     opt: option
                   })
                     
                   }else{
                     console.log("index en cours de changement", finalScore, String(chosenOption) !== String(option.solution));
                   }
                  
                  
   
                  });
                }
                
                
                finalScore += points
   
      
            }
            });
   
          
           
           locate('/stud/results', { state: { score: finalScore, index: allQuestion.length, echou: choixEchec, type:allQuestion[0]?.typeElement, genre: allQuestion[0]?.specialitie } });
         }
        }
        if (audioRef.current) {
          audioRef.current.play();
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
        // Play audio whenever the question changes
        if (audioRef.current) {
          audioRef.current.play();
        }
      }, [currentIndex]);
    
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

      useEffect(() => {
        if (audio1Ref.current) {
       
          audio1Ref.current.play()
          
        }
      }, []);
      const handlePlay = () => {
        if (audio1Ref.current) {
            audio1Ref.current.play().catch(error => {
            console.error("Audio playback failed:", error);
            });
            setIsPlaying(true); 
        }
    };
    
    useEffect(() => {
      if (currentIndex > 0) {
          // Vérifiez la réponse de la question précédente
          const previousQuestion = allQuestion[currentIndex - 1];
          if (responses[currentIndex - 1] === previousQuestion.response) {
              setResult(prevScore => prevScore + 1);
          } else {
            setResult(prevScore => prevScore - 1);
          }
      }
  }, [currentIndex]);

    useEffect(() => {
      console.log("Updated responses nouveau:", responses); 
    }, [responses]); 

    


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
        
        }, 60000); // 60000 ms = 1 minute
    
        return () => clearInterval(interval);
      }, []);

      const remainingQuestions = responses.filter((response) => response === null || response === undefined).length;
      const answeredQuestions = responses.filter((response) => response !== null && response !== undefined).length;
    

  return (
    <div className='w-screen relative'>
      <nav className=' px-5 py-1 md:py-2 flex items-center bg-prim '>
        <span className=' font-bold text-3xl text-white'>Tolkin</span>
        </nav>
        
        <div className='hidden md:fixed z-10 left-0 px-2 bg-prim h-[90%] md:block'>
           <span className='mt-8 block font-bold  text-sm uppercase text-white  flex items-center gap-2 '><span className="w-6 h-6 bg-white flex justify-center items-center rounded-full p-1"><FaTeamspeak className="text-xl" /></span>Comprehension Orale </span>
            <div className='mt-5 px-1 max-h-[250px] overflow-y-auto bg-white  py-2'>
              
            <ol className=''>{allQuestion?.map((item:any, index:any)=>(
                    <li  className={`question-item cursor-pointer py-1 text-white text-[10px] md:text-sm font-bold text-center px-1 md:px-3 rounded-md mt-1 
                       ${responses[index] === null ? 'bg-gray-500 border-[2px] border-yellow-500 border-solid' :  'flex items-center gap-2 bg-gray-500 border-[2px] border-black  text-gray-500 border-solid '} ${index === currentIndex ? 'bg-green-500 py-2' : 'bg-gray-500'}`} key={index}> <span className="w-6 h-6 bg-white flex justify-center items-center rounded-full p-1"><HiOutlineSpeakerphone /></span> proposition {index + 1}</li>
                ))} </ol>
            </div>
            <div className="bg-white text-gray-500 mt-5 mb-5 rounded-md px-5 py-2">
                    <div className='text-sm font-bold flex items-center gap-3 '> <BiQuestionMark className=' text-white p-2 bg-blue-500 rounded-full font-bold  ' color={'white'}></BiQuestionMark ><span> restant:{remainingQuestions} </span> </div>
                    <div className='mt-2 text-sm font-bold flex items-center gap-3 '><BiAlarmExclamation className=' text-white bg-green-500 rounded-full font-bold  p-2 '></BiAlarmExclamation><span> repondu : {answeredQuestions}</span></div>
                </div>
        </div>   

        <div className='z-10 fixed hidden md:block  right-0  px-1 md:px-4 bg-prim h-[90%]'>
              <div className='bg-white md:px-5 px-1  text-gray-600   text-[10px] md:text-sm text-center rounded-md py-2'>
                <h1 className='font-bold underline underline-offset-4 '>Mon profil</h1>
                <div className=' py-3 text-left'>
                    <span className='font-bold'>Nom : <span className='text-prim font-bolder'>{user?.username}</span></span>
                    <span className='block mt-2 font-bold'>Adresse : <span className='text-prim font-bolder'>{user?.email}</span></span>
                    <span className='block mt-2 font-bold'>Partie : Comprehension Orale</span>
                    <span className='block mt-2 font-bold'>Durée : 40min</span>

                </div>
              </div>
              <div>
              

              </div>
              
            <div className="bg-white text-gray-500 mt-[30%] mb-5 rounded-md px-1  text-[10px] md:text-sm md:px-5 py-2">
                    <div className=' text-[10px] md:text-sm font-bold flex items-center gap-3 '> <BiQuestionMark className=' text-white bg-blue-500 rounded-full font-bold  '></BiQuestionMark><span> Temps : {formatTime(remainingTime)} </span> </div>
                    <div className='mt-2  text-[10px] md:text-sm font-bold flex items-center gap-3 '><BiAlarmExclamation className=' text-white bg-green-500 rounded-full font-bold  '></BiAlarmExclamation><span>Temps restant :</span></div>
                </div>
        </div>      
        <div className='z-10 fixed bottom-0 bg-prim w-screen flex justify-between py-5 px-[10%] '>
           
        <div className='bg-white text-gray-600 px-5 py-1 rounded-sm font-bold flex gap-2 items-center '><span onClick={handleExit} className='text-[10px] md:text-sm flex items-center gap-2'><BiExit className='text-[10px] md:text-sm bg-red-500 text-white'></BiExit>quit the examination</span></div></div>
       
        <div className='bg-white h-[90%] w-[100%] md:w-[68%] py-2 left-0 md:left-[13.5%] px-5 text-gray-700 fixed z-0'>
       <div className="text-sm font-bold text-center mb-5">
                Ecoutez l'extrait sonore et  Choisissez la bonne réponse. 
            </div>
            <div className='w-full relative'>
            <div className='flex justify-center'>
            {!isPlaying && (
                <button onClick={handlePlay} className='bg-blue-500 text-sm text-white px-2 mb-2 '> commencer l'extrait</button>
            )}
                <img className=' w-[30%] '  onClick={handleImageToggle}  src={currentQuestion?.imageUrl} alt="" />
                </div>
                
                
                  <div className='pl-[15%] justify-center '>
                <span className='block  mb-3 font-bold bg-gray-300 shadow-md  pl-1 w-fit pr-10 rounded-sm py-2 text-black'>
                {currentIndex + 1}- <span className='text-black'>{currentQuestion?.question}</span>
                </span>
                <form action="" className='max-h-[50vh] overflow-y-auto  '>
                 <div className='flex gap-5 mb-1 items-center '>
                 <input type="radio" name="question" value="1"
                  checked={responses[currentIndex]?.answer === "1"}
                 onChange={handleChange} id="option-a" />
                 <label htmlFor="option-a">a- {currentQuestion?.solution1}</label>
                </div>
                <div className='flex gap-5 mb-1 items-center'>
                <input type="radio" name="question" value="2" 
                 checked={responses[currentIndex]?.answer === "2"}
                onChange={handleChange} id="option-b" />
                <label htmlFor="option-b">b- {currentQuestion?.solution2}</label>
                </div>
                <div className='flex gap-5 mb-1 items-center'>
                <input type="radio" name="question" value="3"  
                 checked={responses[currentIndex]?.answer === "3"}
                onChange={handleChange} id="option-c" />
                <label htmlFor="option-c">c- {currentQuestion?.solution3}</label>
                </div>
                <div className='flex gap-5 mb-1 items-center'>
                    <input type="radio" name="question" value="4" 
                     checked={responses[currentIndex]?.answer === "4"}
                    onChange={handleChange}id="option-d" />
                    <label htmlFor="option-d">d- {currentQuestion?.solution4}</label>
                </div>

                {currentQuestion?.options?.map((item:any, index:any)=>(
                   <div 
                  
                   className='my-2  justify-center'>
                    <span className='block  mb-3 font-bold bg-gray-300 shadow-md  pl-1 w-fit pr-10 rounded-sm py-2 text-black'> 
                    {currentIndex + 1}.{currentIndex + index + 1}- <span className='text-black first-letter:uppercase '>{item?.question}</span> 
                    </span>

                    <div className='flex gap-5 items-center'>
                 <input type="radio"  name={`option-${currentIndex}-${index}`}
                  value='1'
                 checked={responses[currentIndex]?.option[index] === "1"}
                 id={`option-a-${index}`} 
                 onChange={(e) => handleChange(e, index)}

                 />
                 <label htmlFor="option-a">a- {item?.answer1}</label>
                </div>
                <div className='flex gap-5 mb-1 items-center'>
                <input type="radio"  name={`option-${currentIndex}-${index}`} value='2'
                checked={responses[currentIndex]?.option[index] === "2"}
                id={`option-b-${index}`}
                onChange={(e) => handleChange(e, index)}

                className=''
                 
                 />
                <label htmlFor="option-b">b- {item?.answer2}</label>
                </div>
                <div className='flex gap-5 mb-1 items-center'>
                <input type="radio"  name={`option-${currentIndex}-${index}`} value='3'
                checked={responses[currentIndex]?.option[index] === "3"}
                id={`option-c-${index}`} 
                onChange={(e) => handleChange(e, index)}

                />
                <label htmlFor="option-c">c- {item?.answer3}</label>
                </div>
                <div className='flex gap-5 mb-1 items-center'>
                    <input type="radio"  name={`option-${currentIndex}-${index}`} value="4"
                    checked={responses[currentIndex]?.option[index] === "4"}
                    id={`option-d-${index}`} 
                    onChange={(e) => handleChange(e, index)}

                    />
                    <label htmlFor="option-d">d- {item?.answer4}</label>
                </div>
                   </div>
                ))}

                 </form>

               
                </div>
                <audio ref={audio1Ref} className='md:text-sm text-[10px] border-[2px]  border-gray-500' src={currentQuestion?.audioUrl} autoPlay />     


                </div>
                  
            </div>
           
            
       
        {isOpen && (
                <div 
                    className='fixed inset-0 z-10 bg-black bg-opacity-75 flex justify-center items-center' 
                    onClick={handleImageToggle}>
                    <img className='max-h-full max-w-full' src={currentQuestion?.imageUrl} alt="" />
                </div>
            )}
    </div>
  )
}

export default CO

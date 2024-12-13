import React from 'react'
import { BiAlarmExclamation } from 'react-icons/bi'
import { BiQuestionMark } from 'react-icons/bi'
import { BiError } from 'react-icons/bi'
import { BiExit } from 'react-icons/bi'
import { BiSkipNext } from 'react-icons/bi'
import { NavLink, Outlet } from 'react-router-dom';
import { useEffect } from 'react'
import { useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import {Question} from './constant'
import { getUser } from '../../utils/storage'
import './test.css'
import { selectComprehensionEcrite } from '../../services/assessment'
import { Console, log } from 'console'
const CE = () => {
    const [remainingTime, setRemainingTime] = useState<number>(60 * 60)
    const [user, setUser] = useState<any>(null);
    const audioRef = useRef<HTMLAudioElement>(null);
    const [question1, setQuestion1] = useState<any>("error network response charging");
    const [question2, setQuestion2] = useState<any>("error network response charging");
    const [score, setScore] = useState(0);
    const [question3, setQuestion3] = useState<any>("error network response charging");
    const [question4, setQuestion4] = useState<any>("error network response charging");
    const [response, setResponse] = useState<any>();
    const [option, setOption] = useState<any>();

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


    const [Fscore, setFscore] = useState<any>();
    const [timer , setTimer] = useState<any>();
    const timeRef = useRef(0); // Utilisation d'une ref pour `time`


    const [timeLeft, setTimeLeft] = useState(60); 
    const [CO, setCO] = useState<any>("still");
    const [data, setData] = useState<any>();
    const [result, setResult] = useState(0);
    const [echou, setEchou] = useState(Array().fill(null));
  
    const [Lechec, setLechec] = useState<any[]>([]);
        const [currentIndex, setCurrentIndex] = useState<number>(0);
    const [selectedValue, setSelectedValue] = useState<any>('');
    const [selectedAnswer, setSelectedAnswer] = useState<any>(null); 
    const [responses, setResponses] = useState(Array(39).fill({answer: null, option: Array().fill(null)}));

    const locate = useNavigate();

    const [isOpen, setIsOpen] = useState(false);

    const handleImageToggle = () => {
        setIsOpen(!isOpen);
    };


    useEffect(() => {
        let usr = getUser();
        setUser(usr);
    }, [])

    const handleComprehensionOrale = () => {
      setLoading(true)
      selectComprehensionEcrite().then((res: any) => {
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
       
     
        setCO(allQuestions[0].question)
        setQuestion1(allQuestions[0].solution1)
        setQuestion2(allQuestions[0].solution2)
        setQuestion3(allQuestions[0].solution3)
        setQuestion4(allQuestions[0].solution4)
        setqst(allQuestions[0].imageUrl)
        setResponse(allQuestions[0].response)
        setLoading(false);
      }).catch(err => {
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
      
        console.log("Updated responses:", responses);
        
        
        
      };
    
      const moveToPreviousQuestion = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
        }
    };



    const moveToNextQuestion = () => {

      if (!responses[currentIndex]) {
        console.error("Response for current index is undefined.");
        return; // Empêche l'exécution si la réponse est inexistante
      }
      
      let opti: { chosenIndex: any; correctIndex: any; question: any, index:any }[] =
      []; // Tableau pour stocker les erreurs
  
      setSelectedAnswer (responses[currentIndex]?.answer)

      
      
      if ( responses[currentIndex]?.answer === currentQuestion?.response) {

        if(currentQuestion){ 
        
          currentQuestion?.options.forEach((response:any, index:number) => {
            const chosenOption = String(responses[currentIndex]?.option[index]) ;
            const correctSolution = String(response.solution);

          if( chosenOption !== correctSolution ){
           
            opti.push({
              chosenIndex: chosenOption,
              correctIndex:correctSolution,
              question: currentQuestion.options,
              index:index
             
            });

            console.log("verification OK ", response.solution, responses[currentIndex]?.option[index]);
            console.log("voila les options ", opti );   
          }
           

        })

      


      }
        
      setEchou((prevEchou) => {

        const alreadyExists = prevEchou.some(
          (entry) =>
            entry.question._id === currentQuestion._id &&
            entry.correctAnswer === currentQuestion?.response 
         
        );

        console.log("ca existe", alreadyExists);
        
 
       if (!alreadyExists) {
        
        return[
        ...prevEchou,
        {
          question: currentQuestion,
          selectedAnswer: responses[currentIndex]?.answer,
          correctAnswer: currentQuestion?.response,
          option:opti,

        },
      ]}

    else
    {
      

      return prevEchou.map((entry) =>
        entry.question._id === currentQuestion._id
          ? {
              ...entry,
              option: opti,
            }
          : entry
      );

    }
    });
      console.log("la liste des echecs", echou);
      

       } else {

        if(currentQuestion){ 
        
          currentQuestion?.options.forEach((response:any, index:number) => {
            const chosenOption = String(responses[currentIndex]?.option[index]) ;
            const correctSolution = String(response.solution);

          if( chosenOption !== correctSolution ){
           
            opti.push({
              chosenIndex: chosenOption,
              correctIndex:correctSolution,
              question: response,
              index:index
             
            });

            console.log("verification OK ", response.solution, responses[currentIndex]?.option[index]);
            console.log("voila les options ", opti );   
          }
          

        })

      


      }
      setEchou((prevEchou) => {

        const alreadyExists = prevEchou.some(
          (entry) =>
            entry.question._id === currentQuestion._id &&
            entry.correctAnswer === currentQuestion?.response 
         
        );

        console.log("ca existe", alreadyExists);
        
 
       if (!alreadyExists) {
        
        return[
        ...prevEchou,
        {
          question: currentQuestion,
          selectedAnswer: responses[currentIndex]?.answer,
          correctAnswer: currentQuestion?.response,
          option:opti,

        },
      ]}

    else
    {
      

      return prevEchou.map((entry) =>
        entry.question._id === currentQuestion._id
          ? {
              ...entry,
              selectedAnswer: responses[currentIndex]?.answer,
              correctAnswer: currentQuestion?.response,
              option: opti,
            }
          : entry
      );

    }
    });
       }
  
      setSelectedAnswer(null); // Reset selected answer
      setTimeLeft(60); // Reset timer for the next question


      if (currentIndex < allQuestion.length - 1) {
        
        setCurrentIndex(currentIndex + 1);
        
         // Move to next question
      } else {
         // Vérifiez le contenu des tableaux
         let finalScore = 0;

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
             const optionPenalty = levelPoints / currentQuestion.options.length; // Pénalité par option incorrecte

             if (response?.answer === currentQuestion.response) {
              points += levelPoints; // Ajoute les points du niveau si la réponse principale est correcte
            }


             if (response?.answer === question?.response) {
             finalScore += levelPoints; // Ajoute des points pour la réponse principale

             if (question?.options && response?.option) {
               currentQuestion.options.forEach((option: any, optIndex: number) => {
                 const point = levelPoints / (optIndex + 1)
                 const chosenOption = response.option?.[optIndex]

                 if (String(chosenOption) !== String(option.solution)) {
                  points -= optionPenalty;

                }

                 console.log("index en cours de changement", points);

               });
             }
             }

   
         }
         });

       
        
        locate('/stud/results', { state: { score: finalScore, index: allQuestion.length, echou:echou } });
      }
      if (audioRef.current) {
        audioRef.current.play();
      }

    };
    
    const goToQuestion = (index: number) => {
      // Vérifie si l'index est dans les limites du tableau allQuestion
      if (index >= 0 && index < allQuestion.length) {
        setCurrentIndex(index); // Met à jour l'index actuel pour la nouvelle question
    
        console.log(`Moved to question ${index + 1}`);
      } else {
        console.log('Index hors limite');
      }
    };

    useEffect(() => {
      console.log("echou a été mis à jour :", echou);
    }, [echou]); 

  /*useEffect(() => {
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
    }, [score]);*/

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

    useEffect(() => {
      // Play audio whenever the question changes
      if (audioRef.current) {
        audioRef.current.play();
      }
    }, [currentIndex]);
  

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


        let time = 0
        
        const intervalId = setInterval(() => {

          timeRef.current++; // Incrémentation directe dans la ref
          time ++;

          if (remainingTime > 0) {
            setRemainingTime((prevRemainingTime) => prevRemainingTime - 1);
        



              if (timeRef.current === 3600){
                
                let finalScore = 0;

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

                    
                    const question = allQuestion[index];
                    const levelPoints = levelPointsMap[question.level] || 0; // Récupère les points associés au niveau, 0 par défaut.  
                   
                    if (response.answer === question.response) {
                    finalScore += levelPoints; // Ajoute des points pour la réponse principale

                    if (question.options && response.option) {
                      question.options.forEach((option: any, optIndex: number) => {
                        const point = levelPoints / (index + 1)

                        if (response.option[optIndex] !== option[optIndex].solution) {
                          finalScore -= point; // Ajoute des points pour chaque option correcte
                        }
                      });
                    }
                    }

          
                }
                });
                
                locate('/stud/results', { state: { score: finalScore, index: allQuestion.length, echou } });}

          } else {
            clearInterval(intervalId);
            
          }
          

        }, 1000); // Update every second

        return () => clearInterval(intervalId); // Nettoyage

        }, [allQuestion, echou, remainingTime, responses]);


      const formatTime = (seconds: number): string => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
    
        return `${minutes.toString().padStart(2, '0')}min ${remainingSeconds.toString().padStart(2, '0')}s`;
      };
    
      const remainingQuestions = responses.filter((response) => response === null || response === undefined).length;
      const answeredQuestions = responses.filter((response) => response !== null && response !== undefined).length;
      
    
    
    

  return (
    <div className='w-screen relative'>
      <nav className=' px-5 py-1 md:py-2 flex items-center bg-prim '>
        <span className=' font-bold text-3xl text-white'>Tolkin</span>
        </nav>
        
       <div className='hidden md:fixed z-10 left-0 px-2 bg-prim h-[80%] md:block'>
           <span className='mt-8 block font-bold  text-sm uppercase text-white '>comprehension Ecrite </span>
            <div className='mt-5 px-1 max-h-[250px] overflow-y-auto bg-white  py-2'>
              
            <ol className=''>{allQuestion?.map((item:any, index:any)=>(
                    <li onClick={() => goToQuestion(index)} className={`question-item cursor-pointer py-1 text-white text-[10px] md:text-sm font-bold text-center px-1 md:px-3 rounded-md mt-1 
                       ${responses[index] === null ? 'bg-gray-500 border-[2px] border-yellow-500 border-solid' :  'bg-gray-500 border-[2px] border-black  text-gray-500 border-solid '} ${index === currentIndex ? 'bg-green-500 py-2' : 'bg-gray-500'}`} key={index}>proposition {index + 1}</li>
                ))} </ol>
            </div>
            <div className="bg-white text-gray-500 mt-5 mb-5 rounded-md px-5 py-2">
                    <div className='text-sm font-bold flex items-center gap-3 '> <BiQuestionMark className=' text-white p-2 bg-blue-500 rounded-full font-bold  ' color={'white'}></BiQuestionMark ><span> restant:{remainingQuestions} </span> </div>
                    <div className='mt-2 text-sm font-bold flex items-center gap-3 '><BiAlarmExclamation className=' text-white bg-green-500 rounded-full font-bold  p-2 '></BiAlarmExclamation><span> repondu : {answeredQuestions}</span></div>
                </div>
        </div>      
        <div className='z-10 fixed hidden md:block  right-0  px-1 md:px-4 bg-prim h-[80%]'>
              <div className='bg-white md:px-5 px-1  text-gray-600   text-[10px] md:text-sm text-center rounded-md py-2'>
                <h1 className='font-bold underline underline-offset-4 '>Mon profil</h1>
                <div className=' py-3 text-left'>
                    <span className='font-bold'>Nom : <span className='text-prim font-bolder'>{user?.username}</span></span>
                    <span className='block mt-2 font-bold'>Adresse : <span className='text-prim font-bolder'>{user?.email}</span></span>
                    <span className='block mt-2 font-bold'>Partie : Comprehension Orale</span>
                    <span className='block mt-2 font-bold'>Durée : 1h</span>

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
        <div className='bg-white text-gray-600 px-5 py-1 rounded-sm font-bold flex gap-2 items-center '><span onClick={handleExit} className='flex items-center gap-2'><BiExit className='text-md bg-red-500 text-white'></BiExit>quit the examination</span></div>
        </div>
       
        <div className='bg-white h-[80%] w-[100%] md:w-[68%] py-2 left-0 md:left-[13.5%] overflow-y-auto px-5 text-gray-700 fixed z-0'>
        <div className="text-sm font-bold text-center mb-5">
                lisez le test et  Choisissez la bonne réponse en cochant sur la bonne reponse. 
            </div>
            <div className='w-full relative'>
                <div className='flex justify-center'>
                <img className=' w-[30%] z-0' onClick={handleImageToggle}  src={currentQuestion?.imageUrl} alt="" />
               
                </div>
                <div className='pl-[15%] justify-center '>
                <span className='block  mb-3 font-semibold'>
                {currentIndex + 1}- <span className=''>{currentQuestion?.question}</span>
                </span>
                <form action="" className=''>
                 <div className='flex gap-5 mb-1 items-center'>
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
                    <span className='block  mb-3 font-semibold'> 
                    {currentIndex + 1}.{currentIndex + index + 1}.a- <span className=''>{item?.question}</span> 
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

                 <div className='w-[90%] my-5'>
                 <div className="flex justify-between  mt-4">
                            <button className='bg-blue-500 text-white text-sm px-2 rounded-md' onClick={moveToPreviousQuestion} disabled={currentIndex === 0}>Précédent</button>
                            <button className='bg-blue-500 text-white text-sm px-2 rounded-md' onClick={moveToNextQuestion}>Suivant</button>
                        </div>
                 </div>
                
                </div>
                   {/* Audio element */}
               <audio ref={audioRef} src="/bruit.mp3" />
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

export default CE

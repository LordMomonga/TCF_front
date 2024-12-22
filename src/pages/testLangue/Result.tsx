import { GiArmorUpgrade } from "react-icons/gi"; 
import { FaSitemap } from "react-icons/fa"; 
import { BsFillFileEarmarkMinusFill } from "react-icons/bs"; 
import { FaTimes } from "react-icons/fa"; 
import { FaTimesCircle } from "react-icons/fa"; 
import { AiOutlineCheckCircle } from "react-icons/ai"; 
import { GiDeathSkull } from "react-icons/gi"; 
import React from 'react'
import { useLocation } from 'react-router-dom';
import { setResultElement } from "../../services/assessment";
import { toast } from 'react-toastify';
import { motion } from 'framer-motion'
import { useState, useEffect } from 'react';
import { FaTrophy,FaChartLine, FaCommentAlt } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'


const getTCFLevel = (score: number) => {
    switch (true) {
      case score >= 5 && score <= 330:
        return 'A1';
      case score >= 331 && score <= 368:
        return 'A2';
      case score >= 369 && score <= 457:
        return 'B1';
      case score >= 458 && score <= 522:
        return 'B2';
      case score >= 523 && score <= 548:
        return 'C1';
      case score >= 549 :
        return 'C2';
      default:
        return 'TROP FAIBLE';
    }
  };


export const Result = () => {
    const location = useLocation();
  const { score, index, echou, type, genre } = location.state || { score: 0, index: 0 , echou:[{}], type:'', genre:''}; // Default to 0 if undefined
    const [resultat, setResultat] = useState<any>()
    const locate = useNavigate();

const handleSubmit = () => {

  const data = {
    typeTest: type,
    niveau:level,
    score:score,
    genreTest:genre
  }

  console.log(data);

  setResultElement(data).then((res: any) => { 
    console.log(res)
    if(res.ok) {
      toast.success("Test Enregistré ", {
          pauseOnHover: false,
          closeOnClick: true,
      })
      
      locate('/students/passexams')
    }else {
        toast.error("Error while submitting the Test", {
            pauseOnHover: false,
            closeOnClick: true,
        })
    }
  }).catch(err => {   
    console.log('ERROR CREATING: ', err);

    toast.error("ERROR", {
        pauseOnHover: false,
        closeOnClick: true,
    })
})
}

    const handleExit = () => {
        locate("/students/passexams")
      }
   
    const afficheMessage = (level: string)=> {
        switch (level) {
            case 'A1':
              return '  Débutant. Vous pouvez comprendre des phrases très simples et de base.';
            case 'A2':
              return ' Élémentaire. Vous pouvez comprendre des expressions fréquentes en rapport avec des domaines simples.';
            case 'B1':
              return ' Intermédiaire. Vous êtes capable de comprendre des situations quotidiennes, simples et claires.';
            case 'B2':
              return ' Intermédiaire supérieur. Vous comprenez des idées principales dans des textes complexes.';
            case 'C1':
              return ' Avancé. Vous pouvez comprendre des textes longs et exigeants et exprimer des idées spontanément.';
            case 'C2':
              return ' Maîtrise. Vous comprenez presque tout sans effort et pouvez exprimer vos idées de manière fluide.';
            default:
              return 'Score inconnu. Veuillez entrer un score valide.';
          }};

          const echec = echou.length - 1  ;
  const determineLevel = (score: number) => {
    if (score >= 549) return 'C2';
    if (score >= 523) return 'C1';
    if (score >= 458) return 'B2';
    if (score >= 369) return 'B1';
    if (score >= 331) return 'A2';
    // Add more conditions here
    return 'A1';
  };

  const level = determineLevel(score);
  const message = afficheMessage(level)
  const level2 = getTCFLevel(score);
  const [animatedScore, setAnimatedScore] = useState(0)
  const [animatedEchec, setAnimatedEchec] = useState(0)

  useEffect(() => {
    const scoreTimer = setInterval(() => {
      setAnimatedScore(prev => Math.min(prev + 1, score))
    }, 50)

    const echecTimer = setInterval(() => {
      setAnimatedEchec(prev => Math.min(prev + 1, echec))
    }, 50)

    return () => {
      clearInterval(scoreTimer)
      clearInterval(echecTimer)
    }
  }, [score, echec])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.3,
      } 
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  }  

  return (
      <div className="min-h-screen  text-white">
      <nav className="px-5 py-5 flex items-center bg-blue-500 ">
        <span className="font-bold text-3xl text-white" onClick={handleExit}>Tolkin</span>
      </nav>
      <motion.div
        className="container mx-auto px-4 py-12"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h1 
          className="text-4xl md:text-4xl text-gray-400  mb-12 text-center"
          variants={itemVariants}
        >
           Résultats<GiArmorUpgrade />  <span className="uppercase text-gray-400  font-semibold ">{type}</span>
        </motion.h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <motion.div 
            className="bg-white  rounded-lg p-6 backdrop-blur-lg"
            variants={itemVariants}
          >
            <div className="flex items-center mb-4">
              <FaTrophy className="text-3xl text-yellow-400 mr-4" />
              <h2 className="text-2xl font-semibold text-green-500">Score Total</h2>
            </div>
            <p className="text-5xl font-bold text-center text-green-400">{animatedScore}</p>
          </motion.div>

          <motion.div 
            className="bg-white  rounded-lg p-6 backdrop-blur-lg"
            variants={itemVariants}
          >
            <div className="flex items-center mb-4 ">
              <FaTimesCircle className="text-3xl text-red-400 mr-4" />
              <h2 className="text-2xl font-semibold text-red-500">Questions Échouées</h2>
            </div>
            <p className="text-5xl font-bold text-center text-red-500">{animatedEchec}</p>
          </motion.div>
        </div>

        <motion.div 
          className="bg-white  rounded-lg p-6 backdrop-blur-lg mb-8"
          variants={itemVariants}
        >
          <div className="flex items-center mb-4">
            <FaChartLine className="text-3xl text-green-400 mr-4" />
            <h2 className="text-2xl font-semibold text-blue-500">Votre Niveau</h2>
          </div>
          <p className="text-4xl font-bold text-center text-blue-500">{level2}</p>
        </motion.div>

        <motion.div 
          className="bg-white rounded-lg p-6 backdrop-blur-lg"
          variants={itemVariants}
        >
          <div className="flex items-center mb-4 justify-center">
            <FaCommentAlt className="text-3xl text-blue-400 mr-4" />
            <h2 className="text-2xl font-semibold text-green-500">Conclusion</h2>
          </div>
          <p className="text-xl text-center italic">{message}</p>
        </motion.div>

        <motion.div 
          className="bg-white rounded-lg p-6 backdrop-blur-lg mt-5"
          variants={itemVariants}
        >
          <div className="flex items-center mb-5 text-center justify-center ">
            <FaTimesCircle className="text-3xl text-blue-400 mr-4" />
            <h2 className="text-2xl font-semibold text-red-500">Questions échouée</h2>
          </div>
          {echou?.map((question:any, idx:number) => (
         <li key={idx} className="bg-gray-100 p-4 mt-3 rounded-lg shadow-md">
           
          {question.question && (
          <div className='flex justify-between items-center px-10'>
         
         
         <div >
         <p className="font-medium">Question:</p>
          <p className="text-black font-semibold flex gap-2 items-center"> <BsFillFileEarmarkMinusFill /> {question.opt ? question.opt.question : question.question?.question}</p>
          <p className="font-medium mt-2">Your Answer:</p>
          <p className="text-gray-700 font-semibold text-red-500 text-2xl flex gap-2 items-center"><FaTimes /> : {question.selectedAnswer}</p>
          <p className="font-medium mt-2">Correct Answer:  </p>
          <p className="text-gray-700 text-green-500  text-2xl flex gap-2 items-center"><AiOutlineCheckCircle /> : {question.correctedAnswer}</p>
         </div>
   
     

           
            <div>
              <img src={question.question?.imageUrl} alt="" />
            </div>
            <div>
            
                <h1 className='font-bold text-blue-500 flex items-center gap-2'> <FaSitemap />Proposition </h1>
                
             <p className="text gray 500">1- {question.opt  ? question.opt.answer1 : question.question?.solution1 }  </p>
             <p className="text gray 500">2- {question.opt  ? question.opt.answer2 : question.question?.solution2 } </p>
             <p className="text gray 500">3- {question.opt  ? question.opt.answer3 : question.question?.solution3 } </p>
             <p className="text gray 500">4- {question.opt  ? question.opt.answer4 : question.question?.solution4 }</p>
            </div>
        </div>
    )}  
       </li>
        ))}
        </motion.div>


        <motion.button
          className="mt-12 px-8 py-3 bg-white text-purple-600 rounded-full font-bold text-lg mx-auto block hover:bg-opacity-90 transition-colors duration-300"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          variants={itemVariants}
          onClick={handleSubmit}
        >
          Retour à l'accueil
        </motion.button>
        
      </motion.div>
    </div>
  )
}

import React from 'react'
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion'
import { useState, useEffect } from 'react';
import { FaTrophy, FaTimesCircle, FaChartLine, FaCommentAlt } from 'react-icons/fa'

export const Result = () => {
    const location = useLocation();
  const { score, index } = location.state || { score: 0, index: 0 }; // Default to 0 if undefined
    const [resultat, setResultat] = useState<any>()


   
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

          const echec = index - score ;
  const determineLevel = (score: number) => {
    if (score >= 90) return 'C2';
    if (score >= 75) return 'C1';
    if (score >= 60) return 'B2';
    // Add more conditions here
    return 'A1';
  };

  const level = determineLevel(score);
  const message = afficheMessage(level)

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
        <span className="font-bold text-3xl text-white">Tolkin</span>
      </nav>
      <motion.div
        className="container mx-auto px-4 py-12"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h1 
          className="text-4xl md:text-5xl font-bold mb-12 text-center"
          variants={itemVariants}
        >
          Vos Résultats
        </motion.h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <motion.div 
            className="bg-white bg-opacity-10 rounded-lg p-6 backdrop-blur-lg"
            variants={itemVariants}
          >
            <div className="flex items-center mb-4">
              <FaTrophy className="text-3xl text-yellow-400 mr-4" />
              <h2 className="text-2xl font-semibold">Questions Réussies</h2>
            </div>
            <p className="text-5xl font-bold text-center">{animatedScore}</p>
          </motion.div>

          <motion.div 
            className="bg-white bg-opacity-10 rounded-lg p-6 backdrop-blur-lg"
            variants={itemVariants}
          >
            <div className="flex items-center mb-4">
              <FaTimesCircle className="text-3xl text-red-400 mr-4" />
              <h2 className="text-2xl font-semibold">Questions Échouées</h2>
            </div>
            <p className="text-5xl font-bold text-center">{animatedEchec}</p>
          </motion.div>
        </div>

        <motion.div 
          className="bg-white bg-opacity-10 rounded-lg p-6 backdrop-blur-lg mb-8"
          variants={itemVariants}
        >
          <div className="flex items-center mb-4">
            <FaChartLine className="text-3xl text-green-400 mr-4" />
            <h2 className="text-2xl font-semibold">Votre Niveau</h2>
          </div>
          <p className="text-4xl font-bold text-center">{level}</p>
        </motion.div>

        <motion.div 
          className="bg-white bg-opacity-10 rounded-lg p-6 backdrop-blur-lg"
          variants={itemVariants}
        >
          <div className="flex items-center mb-4">
            <FaCommentAlt className="text-3xl text-blue-400 mr-4" />
            <h2 className="text-2xl font-semibold">Conclusion</h2>
          </div>
          <p className="text-xl text-center italic">{message}</p>
        </motion.div>

        <motion.button
          className="mt-12 px-8 py-3 bg-white text-purple-600 rounded-full font-bold text-lg mx-auto block hover:bg-opacity-90 transition-colors duration-300"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          variants={itemVariants}
        >
          Retour à l'accueil
        </motion.button>
      </motion.div>
    </div>
  )
}

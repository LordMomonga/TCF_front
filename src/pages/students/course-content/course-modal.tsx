'use client'

import { motion } from 'framer-motion'
import { FaHeadphones, FaClock, FaQuestionCircle, FaListUl, FaCheckCircle } from 'react-icons/fa'
import { useState } from 'react'

export default function Component() {
  const [expandedSection2, setExpandedSection2] = useState<number | null>(null)

  const sections1 = [
    {
      title: "Aperçu de l'épreuve",
      icon: FaHeadphones,
      content: [
        "Première épreuve de l'examen du TCF",
        "Durée : 35 minutes",
        "39 questions",
        "Teste la capacité à comprendre le français parlé dans des situations quotidiennes ou professionnelles",
        "L'écoute se fait en une seule fois"
      ]
    },
    {
      title: "Structure de l'épreuve",
      icon: FaListUl,
      content: [
        "La bande audio se divise en 4 parties :",
        "L'extrait audio sur la situation",
        "L'énoncé de la question",
        "Les propositions de réponses dans certains cas",
        "Les consignes de l'examen, les images de la situation décrite, les propositions de réponses, les questions"
      ]
    },
    {
      title: "Compétences évaluées",
      icon: FaCheckCircle,
      content: [
        "Comprendre des mots familiers et des expressions courantes",
        "Repérer l'essentiel des informations dans des messages ou annonces courtes",
        "Identifier le sujet d'une conversation, suivre des exposés",
        "Comprendre les informations présentées de manière complexe",
        "Comprendre un discours prononcé à un débit rapide"
      ]
    }
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-700 text-white p-8">
      <motion.div
        className="max-w-4xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h1 
          className="text-5xl font-bold mb-12 text-center"
          variants={itemVariants}
        >
          Compréhension Orale - TCF
        </motion.h1>

        {sections1.map((section, index) => (
          <motion.div
            key={index}
            className="mb-8 bg-white bg-opacity-10 rounded-lg shadow-lg overflow-hidden"
            variants={itemVariants}
          >
            <button
              className="w-full text-left p-6 flex items-center justify-between focus:outline-none"
              onClick={() => setExpandedSection2(expandedSection2 === index ? null : index)}
            >
              <div className="flex items-center">
                <section.icon className="w-8 h-8 mr-4" />
                <h2 className="text-2xl font-semibold">{section.title}</h2>
              </div>
              <FaQuestionCircle 
                className={`w-6 h-6 transition-transform duration-300 ${expandedSection2 === index ? 'transform rotate-180' : ''}`}
              />
            </button>
            <motion.div
              initial={false}
              animate={{ height: expandedSection2 === index ? 'auto' : 0, opacity: expandedSection2 === index ? 1 : 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <ul className="p-6 space-y-2">
                {section.content.map((item, itemIndex) => (
                  <motion.li 
                    key={itemIndex}
                    className="flex items-start"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: itemIndex * 0.05 }}
                  >
                    <FaCheckCircle className="w-5 h-5 mr-2 mt-1 flex-shrink-0 text-green-400" />
                    <span>{item}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </motion.div>
        ))}

        <motion.div 
          className="mt-12 p-6 bg-white bg-opacity-10 rounded-lg shadow-lg"
          variants={itemVariants}
        >
          <h2 className="text-2xl font-semibold mb-4 flex items-center">
            <FaClock className="w-6 h-6 mr-2" />
            Conseils pour l'épreuve
          </h2>
          <p className="text-lg">
            Restez concentré pendant toute la durée de l'écoute. La bande audio ne sera diffusée qu'une seule fois. 
            Soyez attentif aux mots-clés et aux expressions courantes. N'oubliez pas que vous serez évalué sur votre 
            capacité à comprendre le français parlé dans diverses situations, du quotidien au professionnel.
          </p>
        </motion.div>
      </motion.div>
    </div>
  )
}
import React from 'react'
import { motion } from 'framer-motion'

const containerVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: 'easeInOut', when: "beforeChildren", staggerChildren: 0.2 } }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
}

const Contact = () => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 p-4">
      <motion.div
        className="flex flex-col items-center w-full max-w-2xl p-8 bg-white border border-gray-200 rounded-2xl shadow-lg"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h1
          className="text-3xl font-bold text-emerald-400 mb-6"
          variants={itemVariants}
        >
          Nellai Stores
        </motion.h1>

        <motion.div className="text-center text-lg text-gray-700 space-y-4" variants={itemVariants}>
          <p><span className="font-semibold">Address:</span></p>
          <p>Mulanur Rd, opposite to Sivan Temple,</p>
          <p>Vellakoil, Tamil Nadu, 638 111</p>
          <p><span className="font-semibold">Contact No:</span> +91 90250 00054</p>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default Contact

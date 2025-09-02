import React from 'react'

const Title = ({ text1, text2 }) => {
  return (
    <h2 className="section-title mb-4">
      <span className="text-gray-900">{text1} </span>
      <span className="text-accent font-arial-extrabold">{text2}</span>
    </h2>
  )
}

export default Title

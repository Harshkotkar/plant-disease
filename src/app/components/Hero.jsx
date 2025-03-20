"use client"

import React, { useState } from 'react'
import UserInput from './UserInput'
import Prediction from './Prediction'

const Hero = () => {
  const [userData, setUserData] = useState({});
  const [file, setFile] = useState(null)
  return (
    <div className="flex h-auto items-center justify-center px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-6 items-start w-full max-w-[2000px]">
        <div className="w-full lg:w-1/2">
            <UserInput setUserData={setUserData} setFile={setFile} file={file} />
        </div>
        <div className="w-full lg:w-1/2">
          <Prediction userData={userData} file={file} />
        </div>
      </div>
    </div>
  )
}

export default Hero
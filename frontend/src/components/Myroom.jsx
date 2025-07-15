import React from 'react'
import { useEffect,useState } from 'react'
import { useContext } from 'react'
import LoginContext from '../context/logincontext'
function Myroom() {
  const login_info=useContext(LoginContext)
  if (login_info.login==false){
    return(
        <div className="text-white bg-red-600 rounded-3xl">PLEASE LOGIN</div>
    )
  }
  
  return (
    <div>
      
    </div>
  )
}

export default Myroom

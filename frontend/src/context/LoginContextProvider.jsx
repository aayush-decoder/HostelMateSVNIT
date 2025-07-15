import React, { Children } from "react";
import React from "react";
import { useState } from "react";
import LoginContext from "./logincontext";
 
const LoginContextProvider=({children})=>{
    const [login,setLogin]=useState(false)
    return (
     <LoginContext.Provider value={{login, setLogin}}>
        {children}
    </LoginContext.Provider>
    )
}
export default LoginContextProvider
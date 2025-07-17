import React, { Children } from "react";
import { useState } from "react";
import LoginContext from "./logincontext";
 
const LoginContextProvider=({children})=>{
    const [login,setLogin]=useState(false)
    const [refresh,setRefresh]=useState(false)
    return (
     <LoginContext.Provider value={{login, setLogin,refresh,setRefresh}}>
        {children}
    </LoginContext.Provider>
    )
}
export default LoginContextProvider
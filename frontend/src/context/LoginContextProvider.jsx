import React from "react";
import { useState } from "react";
import LoginContext from "./logincontext";
const LoginContextProvider=({childern})=>{
    const [login,setLogin]=useState(false)
    return (
    <UserContext.Provider value={{login,setLogin}}>
        {childern}
    </UserContext.Provider>
    )
}
export default LoginContextProvider
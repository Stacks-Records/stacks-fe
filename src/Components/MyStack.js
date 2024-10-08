import {createContext, useContext, useState} from 'react'

const MyStackContext = createContext([[], () => {}])

export const useStack = () => useContext(MyStackContext) 

export const MyStackProvider = ({children}) => {
    const [myStack, setMyStack] = useState([])
    const [authCode, setAuthCode] = useState('')

    return (
        <MyStackContext.Provider value={[myStack, setMyStack,authCode,setAuthCode]}>
            {children}
        </MyStackContext.Provider>
    )
}
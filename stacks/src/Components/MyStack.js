import {createContext, useContext, useState} from 'react'

const MyStackContext = createContext()

export const useStack = () => {
    return useContext(MyStackContext) 
}

export const MyStackProvider = ({children}) => {
    const [myStack, setMyStack] = useState([])

    const addToStack = (newAlbum) => {
        setMyStack((collection)=> [...collection, newAlbum])
    }

    return (
        <MyStackContext.Provider value={{myStack, addToStack}}>
            {children}
        </MyStackContext.Provider>
    )
}
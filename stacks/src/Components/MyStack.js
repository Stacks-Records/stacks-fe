import {createContext, useContext, useState} from 'react'

const MyStack = createContext()

export const useStack = () => {
    return useContext(MyStack) 
}

export const MyStackGallery = ({children}) => {
    const [myStack, setMyStack] = useState([])

    const addToStack = (newAlbum) => {
        setMyStack((collection)=> [...collection, newAlbum])
    }

    return (
        <MyStack.Provider value={{myStack, addToStack}}>
            {children}
        </MyStack.Provider>
    )
}
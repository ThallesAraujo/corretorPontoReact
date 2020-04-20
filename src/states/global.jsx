//mais detalhes -> https://www.basefactor.com/global-state-with-react
import Ponto from '../models'
import React, { createContext, useContext, useReducer } from 'react'

const defaultGlobalState = {
    matricula: "",
    senha : "",
    pontos: [Ponto],
    showSpinner: false,
    pontosFilter: [Ponto],
    startedEdition: false
}

const globalStateContext = createContext(defaultGlobalState)
const dispatchStateContext = createContext(undefined)

export const GlobalStateProvider = ({ children }) => {
    const [state, dispatch] = useReducer(
        (state, newValue) => ({...state, ...newValue}),
        defaultGlobalState
    );
    return(
        <globalStateContext.Provider value={state}>
            <dispatchStateContext.Provider value={dispatch}>
                {children}
            </dispatchStateContext.Provider>
        </globalStateContext.Provider>
    )
}

export const useGlobal = () => [
    useContext(globalStateContext),
    useContext(dispatchStateContext)
];
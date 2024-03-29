import React from "react";


export interface IAppState {
    token: string | null;
    firstname: string;
    lastname: string;
    id: string;
    setAuthInfo: (token: string | null, firstname: string, lastname: string, id: string) => void;
}

export const initialAppState: IAppState = {
    token: null,
    firstname: '',
    lastname: '',
    id: '',


    setAuthInfo: (token: string | null, firstname: string, lastname: string, id: string): void => { }

}

export const AppContext = React.createContext<IAppState>(initialAppState);
export const AppContextProvider = AppContext.Provider;
export const AppContextConsumer = AppContext.Consumer;

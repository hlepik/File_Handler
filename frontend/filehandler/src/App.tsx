import React, {useState} from 'react';
import { Route, Routes } from "react-router-dom";
import Header from "./components/Header/Header";
import {AppContextProvider, initialAppState} from "./context/AppContext";
import LoginPage from "./containers/login/LoginPage";
import RegisterPage from "./containers/register/RegisterPage";
import MainPage from "./containers/main/MainPage";
import { StyledEngineProvider } from '@mui/material';
function App() {
  const setAuthInfo = (
      token: string | null,
      firstname: string,
      lastname: string,
      id: string
  ): void => {
    setAppState({ ...appState, token, firstname, lastname, id });
  };
  const [appState, setAppState] = useState({ ...initialAppState, setAuthInfo });
  return (
      <StyledEngineProvider>
          <AppContextProvider value={appState}>
            <Header />
            <div className="MainPage">
              <div className="PageContainer">
                <Routes>

                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />

                  <Route path="/" element={<MainPage />} />
                </Routes>
              </div>
            </div>
          </AppContextProvider>
      </StyledEngineProvider>
  );
}

export default App;

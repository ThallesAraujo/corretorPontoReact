import React from 'react';
import './styles/main.css';
import { GlobalStateProvider } from './states/global'
import Login from './pages/login'

function App() {
  return (
    <GlobalStateProvider>
      <link href="https://fonts.googleapis.com/css2?family=Quicksand&family=Open+Sans&display=swap" rel="stylesheet"></link>
      <Login></Login>
    </GlobalStateProvider>
  );
}

export default App;

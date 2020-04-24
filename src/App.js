import React from 'react';
import './styles/main.css';
import { GlobalStateProvider } from './states/global'
import Login from './pages/login/login'
import Main from './pages/main/main'
import Spinner from './components/Spinner/spinner.component';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from 'react-router-dom';

function App() {

  return (
    <GlobalStateProvider>
      <Router>
      <link href="https://fonts.googleapis.com/css2?family=Quicksand&family=Open+Sans&display=swap" rel="stylesheet"></link>
      <link href='https://css.gg/c' rel='stylesheet'></link>
      <div>
        <Spinner />
      <Switch>
          <Route path="/" exact={true} component={Login}></Route>
          <Route path="/main" component={Main}></Route>
        </Switch>
      </div>
    </Router>
    </GlobalStateProvider>
  );
}

export default App;

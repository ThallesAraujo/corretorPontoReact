import React from 'react';
import './styles/main.css';
import './styles/gg.css';
import { GlobalStateProvider } from './states/global'
import { GuardProvider, GuardedRoute } from 'react-router-guards';
import Login from './pages/login/login'
import Main from './pages/main/main'
import Spinner from './components/Spinner/spinner.component';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from 'react-router-dom';
import SessionService from './services/session.service';

function App() {

  const requireValidSession = (to, from, next) => {
    if (to.meta.auth){
      if(SessionService.isSessionValid()){
        next()
      }else{
        next.redirect("/")
      }
    }
  } 

  return (
    <GlobalStateProvider>
      <Router>
      <link href="https://fonts.googleapis.com/css2?family=Quicksand&family=Open+Sans&display=swap" rel="stylesheet"></link>
      <div>
        <Spinner />
        <div className="message" id="message"></div>
        <GuardProvider guards={[requireValidSession]}>
          <Switch>
            <GuardedRoute path="/" exact component={Login} loading={Login} error={Login}/>
            <GuardedRoute path="/main" component={Main} meta={{ auth: true }} />
          </Switch>
        </GuardProvider>
      </div>
    </Router>
    </GlobalStateProvider>
  );
}

export default App;

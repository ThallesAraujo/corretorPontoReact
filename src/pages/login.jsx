import React from 'react';
import { useGlobal } from '../states/global'
import './login.css'
// import { Container } from './styles';

const Login = () => {
  var [saveSessionData] = useGlobal()

  return (
    <div>
      <div className="wide">
        <div className="container-h">
          <div className="clock-figure"></div>
          <div className="stack">
            <div className="text-container">
              <h1 className="main-title">Bem vindo ao Corretor de Ponto!</h1>
              <p>Desenvolvido para colaboradores que utilizam o Portal Horas, do Stefanini Group</p>
              <div className="stack">
                <div className="stack" style={{width: "100%"}}>
                <input className="textfield" type="text" name="field-login" id="login" placeholder="Usuário" />
                <input className="textfield" type="password" name="field-password" id="password" placeholder="Senha" />
                <input type="button" className="button" value="Entrar" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const saveLogin = (matricula, senha) => {

  }

  const login = (user) => {

  }

}

export default Login
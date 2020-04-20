import React from 'react';
import { useGlobal } from '../../states/global'
import './login.css'
import PontoService from '../../services/ponto.service'
import { useHistory } from "react-router-dom";

const Login = () => {
  var [state, dispatch] = useGlobal()
  let history = useHistory();

  const handleChange = ({ target }) => {
    dispatch({ [target.name]: target.value })
  }

  const login = () => {

    console.log("Dados:", state.matricula, state.senha, state.saveSessionData)
    dispatch({showSpinner: true})
    PontoService.getPontos(state.matricula, state.senha, (pontos) => {
      dispatch({ pontos })
      dispatch({ pontosFilter: pontos.filter((ponto) => PontoService.isInconsistencia(ponto)) })
      dispatch({showSpinner: false})
      history.push("/main")
    })
  }


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
                <input className="textfield" type="number" name="matricula" id="login" placeholder="Usuário" onChange={ handleChange }/>
                <input className="textfield" maxLength="3" minLength="3" type="password" name="senha" id="password" placeholder="Senha" onChange={ handleChange }/>
                <input type="button" className="button" value="Entrar"  onClick={ () => login() }/>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  

}

export default Login
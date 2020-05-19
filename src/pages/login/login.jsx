import React from 'react';
import { useGlobal } from '../../states/global'
import './login.css'
import PontoService from '../../services/ponto.service'
import { useHistory } from "react-router-dom";
import moment from 'moment';

const Login = () => {
  var [state, dispatch] = useGlobal()
  let history = useHistory();

  const handleChange = ({ target }) => {
    dispatch({ [target.name]: target.value })
  }

  const exibirMensagemErro = (mensagemErro) => {
    const mensagem = document.getElementById('message');
    if (mensagem !== undefined && mensagem !== null){
      if(mensagem.classList.contains('out')){
        mensagem.classList.toggle('out');
      }
  
      if(mensagem.classList.contains('remove-pad')){
        mensagem.classList.toggle('remove-pad');
      }
  
      if(mensagem.classList.contains('in')){
        mensagem.classList.toggle('in');
      }
  
      mensagem.classList.add('message-error')
              mensagem.innerText = mensagemErro;
              mensagem.setAttribute('style', 'display: block')
              mensagem.classList.toggle('in');
              setTimeout(() =>{
                mensagem.classList.toggle('out');
                mensagem.classList.toggle('remove-pad');
        }, 5000);
    }
}


  const login = () => {
    dispatch({showSpinner: true})
    PontoService.getPontos(state.matricula, state.senha, (pontos) => {
      dispatch({ pontos })
      dispatch({showSpinner: false})
      var date = new Date()
      dispatch({mes: date.getMonth().toString(10)})
      dispatch({ano: date.getFullYear().toString(10)})
      sessionStorage.setItem("pontos", JSON.stringify(pontos))
      history.push("/main")
    }, (error) => {
      dispatch({showSpinner: false})
      exibirMensagemErro(`Houve um problema: (${error})`)
    })
  }

  


  return (
    <div className="main-container">
      <div class="message" id="message"></div>
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
                <input className="textfield" minLength="3" type="password" name="senha" id="password" placeholder="Senha" onChange={ handleChange }/>
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
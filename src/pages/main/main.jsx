import React, { useEffect } from 'react';
import { useGlobal } from '../../states/global'
import './main.css'
import Card from '../../components/Card/card.component'
import SheetViewer from '../../components/SheetViewer/SheetViewer.component'
import PontoService from '../../services/ponto.service'
import months from './utils/meses'
import moment from 'moment'
import MessageService from '../../services/messages.service';

const Main = () => {

    const [state, dispatch] = useGlobal()

    var pontos = state.pontosFilter

    const meses = months

    const handleClickTab = (event) => {

        var tabs = document.querySelectorAll('.tab')
        tabs.forEach((tab) => {
            if(tab.id === event.target.id){
                tab.classList.add('tab-active')
            }else{
                tab.classList.remove('tab-active')
            }
        })

        if (event.target.id === "inconsistencias"){
            pontos = []
            pontos = state.pontos.filter((ponto) => PontoService.isInconsistencia(ponto));
        }else{
            pontos = []
            pontos = state.pontos
        }

        dispatch({pontosFilter: []})
        dispatch({pontosFilter: pontos})
    
    }

    const unselectTabs = () => {
        var tabs = document.querySelectorAll('.tab')
        tabs.forEach((tab) => {
            if(tab.id === "inconsistencias"){
                tab.classList.add('tab-active')
            }else{
                tab.classList.remove('tab-active')
            }
        })
    }

    const handleChangeMonth = (event) => {
        handleChangePeriodo(meses.indexOf(event.target.value)+1, state.ano)
    }

    const handleChangeYear = (event) => {
        if(event.target.value.length == 4){
            handleChangePeriodo(state.mes, event.target.value)
        }
    }

    const handleChangePeriodo = (mes, ano) => {
        dispatch({showSpinner: true})
        PontoService.getPontosDaData(mes, ano, state.matricula, state.senha, 
        (pontos) => {
            dispatch({pontos})
            dispatch({pontosFilter: pontos.filter((ponto) => PontoService.isInconsistencia(ponto))})
            dispatch({mes})
            dispatch({ano})
            dispatch({showSpinner: false})
            unselectTabs()
        }, 
        (error) => {
            dispatch({showSpinner: false})
            MessageService.exibirMensagemErro(`Houve um problema: (${error})`)
        })
    }

    useEffect(()=> {
        var pontosStorage = JSON.parse(sessionStorage.getItem("pontos"))
        if((pontos[0] === undefined || pontos[0].data === undefined)&&  pontosStorage !== undefined && pontosStorage !== null){
            console.table(pontosStorage)
            pontos = []
            dispatch({pontos: pontosStorage})
            dispatch({pontosFilter: pontosStorage.filter(ponto => PontoService.isInconsistencia(ponto))})
        }
    }, [])

    const updatePonto = (antigo, novo) => {
        const indice = pontos.indexOf(antigo)
        pontos[indice] = novo
        dispatch({ pontosFilter: pontos })
    }

    const getMesAtual = () =>{
        var date = new Date()
        if (date.getDate() < 15){
            return meses[moment(date).add(1, "days").format("MM") - 1]
        }else{
            return meses[Number.parseInt(moment(date).add(1, "days").format("MM"))]
        }
    }

    const getAnoAtual = () => {
        return moment(Date()).add(1, "days").format("YYYY")
    }
    

   return(
       <div className="container">
           <div className="container-select">
              <div className="rotulo">
                 <p>Período</p>
              </div>
                <div className="content">
                <select className="select" name="select-mes" id="select-mes" defaultValue={getMesAtual()} onChange={handleChangeMonth}>
                    {meses.map(mes => {
                        return <option>{mes}</option>
                    })}
                </select>
                <input type="text" maxLength="4" onChange={handleChangeYear} name="input-ano" id="input-ano" placeholder="Ano" defaultValue={getAnoAtual()} className="textfield"/>
                </div>
           </div>
           <div className="tabs">
               <div className="tab tab-active" id="inconsistencias" onClick={handleClickTab}>
                   <p id="inconsistencias">Inconsistências</p>
               </div>
               <div className="tab" id="tds-pontos" onClick={handleClickTab}>
                   <p id="tds-pontos">Todos os Pontos</p>
               </div>
           </div>
           <div>
                {pontos.map( (ponto) => {
                    return <Card key={ponto.data} ponto={ponto} updatePonto={updatePonto}></Card>
                })}
           </div>
           <SheetViewer exibirMensagemSucesso={MessageService.exibirMensagemSucesso}></SheetViewer>
       </div>
   );

}

export default Main;

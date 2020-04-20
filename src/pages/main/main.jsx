import React, { ReactDOM, useEffect, useState, useCallback } from 'react';
import { useGlobal } from '../../states/global'
import './main.css'
import Card from '../../components/Card/card.component'
import SheetViewer from '../../components/SheetViewer/SheetViewer.component'
import PontoService from '../../services/ponto.service'



const Main = () => {

    const [state, dispatch] = useGlobal()

    var pontos = state.pontosFilter

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
            pontos = pontos.filter((ponto) => PontoService.isInconsistencia(ponto));
        }else{
            pontos = state.pontos
        }

        dispatch({ pontosFilter: pontos })
    
    }

    useEffect(()=> {}, [pontos])

    const updatePonto = (antigo, novo) => {
        const indice = pontos.indexOf(antigo)
        pontos[indice] = novo
        dispatch({ pontosFilter: pontos })
    }


    

   return(
       <div className="container">
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
                    return <Card ponto={ponto} updatePonto={updatePonto}></Card>
                })}
           </div>
           <SheetViewer></SheetViewer>
       </div>
   );

}

export default Main;

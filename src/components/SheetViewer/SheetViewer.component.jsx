import React from 'react';
import { useGlobal } from '../../states/global'
import './sheetview.css'

const SheetViewer = () => {

    const [state] = useGlobal()

    const pontosOriginais = state.pontos
    const pontosModificados = state.pontosFilter

    const isModificado = (campo, ponto) => {
        const indice = pontosModificados.indexOf(ponto)
        if(indice < 0){
            return true
        }else if(pontosOriginais[indice][campo] !== ponto[campo]){
            return true
        }else{
            return false
        }

    }

    const diasDaSemana = {
        0: "Dom",
        1: "Seg",
        2: "Ter",
        3: "Qua",
        4: "Qui",
        5: "Sex",
        6: "Sáb",
    }

    const appendZero = (num) =>{
        if (num < 10){
            return `0${num}`
        }else{
            return `${num}`
        }
    }
    
    const getFomattedDate = (dateToFormat) => {
        let date = new Date(dateToFormat)
        return `${diasDaSemana[date.getDay()]} - ${appendZero(date.getDate())}/${appendZero(date.getMonth()+1)}/${date.getFullYear()}`
    }

    const getFormattedTime = (dateToFormat) => {

        console.log("dateToFormat", dateToFormat)

        if(dateToFormat !== null && dateToFormat !== undefined && dateToFormat.length > 5){
            let date = new Date(dateToFormat)
            return `${appendZero(date.getHours())}:${appendZero(date.getMinutes())}`
        }else{
            return dateToFormat
        }
    }

    const toggleViewer = () => {
        console.log("chamou")
        const viewer = document.getElementsByClassName('planview-container')[0]
        viewer.classList.toggle('planview-hidden')    
        viewer.classList.toggle('planview-show')
    }

    return(
        <div className="planview">
            <input type="button" className="button" value="Pré-visualizar planilha" onClick={toggleViewer}/>
            <div className="planview-hidden planview-container">
                    <i class="gg-close" onClick={toggleViewer}></i>
                    {pontosOriginais.map((ponto) =>{
                        return (
                            <tr>
                                <td className={isModificado("entrada1", ponto) ? "ponto-modificado": "ponto"}>{getFormattedTime(ponto.entrada1)}</td>
                                <td className={isModificado("saida1", ponto) ? "ponto-modificado": "ponto"}>{getFormattedTime(ponto.saida1)}</td>
                                <td className={isModificado("entrada2", ponto) ? "ponto-modificado": "ponto"}>{getFormattedTime(ponto.entrada2)}</td>
                                <td className={isModificado("saida2", ponto) ? "ponto-modificado": "ponto"}>{getFormattedTime(ponto.saida2)}</td>
                                <td className={isModificado("entrada3", ponto) ? "ponto-modificado": "ponto"}>{getFormattedTime(ponto.entrada3)}</td>
                                <td className={isModificado("saida3", ponto) ? "ponto-modificado": "ponto"}>{getFormattedTime(ponto.saida3)}</td>
                                <td className={isModificado("entrada4", ponto) ? "ponto-modificado": "ponto"}>{getFormattedTime(ponto.entrada4)}</td>
                                <td className={isModificado("saida4", ponto) ? "ponto-modificado": "ponto"}>{getFormattedTime(ponto.saida4)}</td>
                            </tr>
                        )
                    })}
                
            </div>
        </div>
    )



}

export default SheetViewer;

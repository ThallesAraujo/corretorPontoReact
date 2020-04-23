import React, { useRef } from 'react';
import { useGlobal } from '../../states/global'
import './sheetview.css'
import ReactToPrint from 'react-to-print';

const SheetViewer = () => {

    const [state] = useGlobal()

    const tableRef = useRef();

    const pontosOriginais = state.pontos
    const pontosModificados = state.pontosFilter

    const isModificado = (campo, ponto) => {
       if (ponto["camposEditados"]){
           if(ponto["camposEditados"].includes(campo)){
                return true
           }else{
               return false
           }
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

        if(dateToFormat !== null && dateToFormat !== undefined && dateToFormat.length > 5){
            let date = new Date(dateToFormat)
            return `${appendZero(date.getHours())}:${appendZero(date.getMinutes())}`
        }else{
            return dateToFormat
        }
    }

    const toggleViewer = () => {
        const viewer = document.getElementsByClassName('planview-container')[0]
        viewer.classList.toggle('planview-hidden')    
        viewer.classList.toggle('planview-show')
    }


    return(
        <div className="planview">
            <input type="button" className="button" value="Pré-visualizar planilha" onClick={toggleViewer}/>
            <div className="planview-hidden planview-container">
                    <div className="planview-actionbar">
                        <i class="gg-close action-button" onClick={toggleViewer}></i>
                    </div>
                    <table className="pontos-container" ref={tableRef}>
                    <tr>
                        <th>Data</th>
                        <th>Entrada 1</th>
                        <th>Saída 1</th>
                        <th>Entrada 2</th>
                        <th>Saída 2</th>
                        <th>Entrada 3</th>
                        <th>Saída 3</th>
                        <th>Entrada 4</th>
                        <th>Saída 4</th>
                        <th>Justificativa</th>
                    </tr>
                    {pontosModificados.map((ponto) =>{
                        return (
                            <tr>
                                <td className={ponto["isEditado"] ? "ponto-modificado": "ponto"}>{getFomattedDate(ponto.data)}</td>
                                <td className={isModificado("entrada1", ponto) ? "ponto-modificado": "ponto"}>{getFormattedTime(ponto.entrada1)}</td>
                                <td className={isModificado("saida1", ponto) ? "ponto-modificado": "ponto"}>{getFormattedTime(ponto.saida1)}</td>
                                <td className={isModificado("entrada2", ponto) ? "ponto-modificado": "ponto"}>{getFormattedTime(ponto.entrada2)}</td>
                                <td className={isModificado("saida2", ponto) ? "ponto-modificado": "ponto"}>{getFormattedTime(ponto.saida2)}</td>
                                <td className={isModificado("entrada3", ponto) ? "ponto-modificado": "ponto"}>{getFormattedTime(ponto.entrada3)}</td>
                                <td className={isModificado("saida3", ponto) ? "ponto-modificado": "ponto"}>{getFormattedTime(ponto.saida3)}</td>
                                <td className={isModificado("entrada4", ponto) ? "ponto-modificado": "ponto"}>{getFormattedTime(ponto.entrada4)}</td>
                                <td className={isModificado("saida4", ponto) ? "ponto-modificado": "ponto"}>{getFormattedTime(ponto.saida4)}</td>
                                <td className={isModificado("justificativa", ponto) ? "ponto-modificado": "ponto"}>{ponto["justificativa"] !== null && ponto["justificativa"] !== undefined ? ponto["justificativa"]: ""}</td>
                            </tr>
                        )
                    })}
                    </table>
                    <ReactToPrint
                            trigger={() => <i class="gg-software-download action-button"></i>}
                            content={() => tableRef.current}
                        />
                
            </div>
        </div>
    )




}

export default SheetViewer;

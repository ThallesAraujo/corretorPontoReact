import React, { useRef } from 'react';
import { useGlobal } from '../../states/global'
import './sheetview.css'
import ReactToPrint from 'react-to-print';
import moment from 'moment'

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
        "Sun": "Dom",
        "Mon": "Seg",
        "Tue": "Ter",
        "Wed": "Qua",
        "Thu": "Qui",
        "Fri": "Sex",
        "Sat": "Sáb",
    }
    
    const getFomattedDate = (dateToFormat) => {
        let toFormat = new Date(dateToFormat)
        let date = moment(dateToFormat).add(1, "days")
        return `${diasDaSemana[date.format("ddd")]} - ${date.format("DD/MM/YYYY")}`
    }

    const getFormattedTime = (dateToFormat) => {

        if(dateToFormat !== null && dateToFormat !== undefined && dateToFormat.length > 5){
            
            return `${moment(dateToFormat).add(3,"hours").format("HH:mm")}`
        }else{
            return dateToFormat
        }
    }

    const toggleViewer = () => {
        const viewer = document.getElementsByClassName('planview-container')[0]
        viewer.classList.toggle('planview-hidden')    
        viewer.classList.toggle('planview-show')
    }

    const btnExportar = () => {
        return(
            <div className="btn-exportar-container">
                <button className="button action-button" title="Exportar para PDF">
                    <i className="gg-software-download"></i>
                </button>
            </div>
        )
    }


    return(
        <div className="planview">
            <button className="button action-button" onClick={toggleViewer} title="Pré-visualizar">
                <i className="gg-eye"></i>
            </button>
            <div className="planview-hidden planview-container">
                    <div className="planview-actionbar">
                        <i class="gg-close action-button" onClick={toggleViewer}></i>
                    </div>
                    <div className="table-container" >
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
                    {pontosOriginais.map((ponto) =>{
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
                    </div>
                    <ReactToPrint
                            trigger={btnExportar}
                            content={() => tableRef.current}
                        />
                
            </div>
        </div>
    )




}

export default SheetViewer;

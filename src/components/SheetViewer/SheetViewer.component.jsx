import React, { useRef } from 'react';
import { useGlobal } from '../../states/global'
import './sheetview.css'
import ReactToPrint from 'react-to-print';
import moment from 'moment'
import EmailService from '../../services/mail.service';
import MailStyler from '../../services/mail.styler';
import ValidationUtils from '../../utils/ValidationUtils';
import MessageService from '../../services/messages.service';

const SheetViewer = (props) => {

    const [state, dispatch] = useGlobal()

    const tableRef = useRef();

    const pontosOriginais = state.pontos
    const pontosModificados = state.pontosFilter

    const getClasse = (campo, ponto) => {
        const diaSemana = moment(ponto.data).add(1, "days").format("ddd")


        if (ponto["camposEditados"]) {
            if (ponto["camposEditados"].includes(campo)) {
                return "ponto-modificado"
            } else {
                if (diaSemana === "Sat") {
                    return "sabado"
                } else if (diaSemana === "Sun") {
                    return "domingo"
                } else {
                    return "ponto"
                }
            }
        } else {
            if (diaSemana === "Sat") {
                return "sabado"
            } else if (diaSemana === "Sun") {
                return "domingo"
            } else {
                return "ponto"
            }
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
        return `${date.format("DD/MM/YYYY")} - ${diasDaSemana[date.format("ddd")]}`
    }

    const getFormattedTime = (dateToFormat) => {

        if (dateToFormat !== null && dateToFormat !== undefined && dateToFormat.length > 5) {

            return `${moment(dateToFormat).add(3, "hours").format("HH:mm")}`
        } else {
            return dateToFormat
        }
    }

    const toggleViewer = (event) => {
        const viewer = document.getElementsByClassName('planview-container')[0]
        viewer.classList.toggle('planview-hidden')
        viewer.classList.toggle('planview-show')
        event.target.parentNode.classList.toggle('handler-closed')
        event.target.parentNode.classList.toggle('handler-open')
    }

    const toggleViewerMobile = (event) => {
        const viewer = document.getElementsByClassName('planview-container-mobile')[0]
        viewer.classList.toggle('planview-hidden')
        viewer.classList.toggle('planview-show')
        event.target.parentNode.classList.toggle('handler-closed')
        event.target.parentNode.classList.toggle('handler-open')
    }

    const btnExportar = () => {
        return (
            <div className="btn-exportar-container">
                <button className="button action-button" title="Exportar para PDF">
                    <i className="gg-software-download"></i>
                </button>
            </div>
        )
    }

    const enviarEmail = () => {
        var email = prompt("Informe seu e-mail corporativo")
        if (!ValidationUtils.isNull(email)){
            var mailContent = tableRef.current.outerHTML
            var mailBody = `${mailContent}`
            mailBody = MailStyler.styleMail(mailBody)
            dispatch({showSpinner: true})
            EmailService.sendEmail("Pontos corrigidos: Corretor de Ponto", [email], mailBody, (response) => {
                props.exibirMensagemSucesso("E-mail enviado!")
                dispatch({showSpinner: false})
            }, 
            (error) =>{
                props.exibirMensagemSucesso("E-mail enviado!")
                dispatch({showSpinner: false})
            })
        }
    }


    return (
        <div>
            <div className="planview">
            <button className="button btn-email" title="Enviar por e-mail" onClick={enviarEmail}>
                    <i className="gg-mail"></i>
            </button>
            <div className="handler handler-closed" title="Expandir ou contrair o painel de visualização">
                <i class="gg-chevron-up" onClick={toggleViewer}></i>
            </div>
        
            <div className="planview-hidden planview-container">
                <div className="table-container" >
                    <table className="pontos-container" ref={tableRef}>
                        <tr>
                            <th>Data</th>
                            <th><div>Ent 1</div></th>
                            <th><div>Sai 1</div></th>
                            <th><div>Ent 2</div></th>
                            <th><div>Sai 2</div></th>
                            <th><div>Ent 3</div></th>
                            <th><div>Sai 3</div></th>
                            <th><div>Ent 4</div></th>
                            <th><div>Sai 4</div></th>
                            <th>Justificativa</th>
                        </tr>
                        {pontosOriginais.map((ponto) => {
                            return (
                                <div className="card">
                                    <tr>
                                    <td className={ponto["isEditado"] ? "ponto-modificado" : getClasse("entrada1", ponto)}>{getFomattedDate(ponto.data)}</td>
                                    <td className={getClasse("entrada1", ponto)}>{getFormattedTime(ponto.entrada1)}</td>
                                    <td className={getClasse("saida1", ponto)}>{getFormattedTime(ponto.saida1)}</td>
                                    <td className={getClasse("entrada2", ponto)}>{getFormattedTime(ponto.entrada2)}</td>
                                    <td className={getClasse("saida2", ponto)}>{getFormattedTime(ponto.saida2)}</td>
                                    <td className={getClasse("entrada3", ponto)}>{getFormattedTime(ponto.entrada3)}</td>
                                    <td className={getClasse("saida3", ponto)}>{getFormattedTime(ponto.saida3)}</td>
                                    <td className={getClasse("entrada4", ponto)}>{getFormattedTime(ponto.entrada4)}</td>
                                    <td className={getClasse("saida4", ponto)}>{getFormattedTime(ponto.saida4)}</td>
                                    <td className={getClasse("justificativa", ponto)}>{ponto["justificativa"] !== null && ponto["justificativa"] !== undefined ? ponto["justificativa"] : ""}</td>
                                </tr>
                                </div>
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
        <div className="planview-mobile">


        <div className="planview-hidden planview-container-mobile">
                <div className="table-container" >
                    <table className="pontos-container" ref={tableRef}>
                        <tr>
                            <th>Data</th>
                            <th><div>Ent 1</div></th>
                            <th><div>Sai 1</div></th>
                            <th><div>Ent 2</div></th>
                            <th><div>Sai 2</div></th>
                            <th><div>Ent 3</div></th>
                            <th><div>Sai 3</div></th>
                            <th><div>Ent 4</div></th>
                            <th><div>Sai 4</div></th>
                            <th>Justificativa</th>
                        </tr>
                        {pontosOriginais.map((ponto) => {
                            return (
                                <tr>
                                    <td className={ponto["isEditado"] ? "ponto-modificado" : getClasse("entrada1", ponto)}>{getFomattedDate(ponto.data)}</td>
                                    <td className={getClasse("entrada1", ponto)}>{getFormattedTime(ponto.entrada1)}</td>
                                    <td className={getClasse("saida1", ponto)}>{getFormattedTime(ponto.saida1)}</td>
                                    <td className={getClasse("entrada2", ponto)}>{getFormattedTime(ponto.entrada2)}</td>
                                    <td className={getClasse("saida2", ponto)}>{getFormattedTime(ponto.saida2)}</td>
                                    <td className={getClasse("entrada3", ponto)}>{getFormattedTime(ponto.entrada3)}</td>
                                    <td className={getClasse("saida3", ponto)}>{getFormattedTime(ponto.saida3)}</td>
                                    <td className={getClasse("entrada4", ponto)}>{getFormattedTime(ponto.entrada4)}</td>
                                    <td className={getClasse("saida4", ponto)}>{getFormattedTime(ponto.saida4)}</td>
                                    <td className={getClasse("justificativa", ponto)}>{ponto["justificativa"] !== null && ponto["justificativa"] !== undefined ? ponto["justificativa"] : ""}</td>
                                </tr>
                            )
                        })}
                    </table>
                </div>
            </div>

            <div className="mobile-tabs">
            <button className="button btn-email" onClick={enviarEmail}>
                    <i className="gg-mail"></i>
            </button>
            <button className="button btn-toggle-viewer" onClick={toggleViewerMobile}>
                    <i className="gg-eye"></i>
            </button>
            <ReactToPrint
                    trigger={btnExportar}
                    content={() => tableRef.current}
                />
            </div>
        </div>
        </div>
    )




}

export default SheetViewer;

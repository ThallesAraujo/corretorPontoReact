import React, { useRef } from 'react'
import './card.css'
import { withRouter } from 'react-router-dom'
import PontoService from '../../services/ponto.service'
import { useGlobal } from '../../states/global'
import moment from 'moment'
import ValidationUtils from '../../utils/ValidationUtils'

const Card = (params) => {

    const [state, dispatch] = useGlobal()

    const form = useRef()

    const diasDaSemana = {
        "Sun": "Dom",
        "Mon": "Seg",
        "Tue": "Ter",
        "Wed": "Qua",
        "Thu": "Qui",
        "Fri": "Sex",
        "Sat": "Sáb",
    }

    const ponto = params.ponto

    const getFomattedDate = (dateToFormat) => {
        let toFormat = new Date(dateToFormat)
        let date = moment(dateToFormat).add(1, "days")
        return `${diasDaSemana[date.format("ddd")]} - ${date.format("DD/MM/YYYY")}`
    }

    const getFormattedTime = (dateToFormat) => {

        if (dateToFormat !== null && dateToFormat !== undefined && dateToFormat.length > 5) {

            return `${moment(dateToFormat).add(3, "hours").format("HH:mm")}`
        } else {
            return dateToFormat
        }
    }

    const marcarLinhaCompleta = (ponto) => {
        for (var i = 1; i < 5; i++) {
            if (ponto["camposEditados"] !== null && ponto["camposEditados"] !== undefined) {
                ponto["camposEditados"] = [...ponto["camposEditados"], `entrada${i}`, `saida${i}`]
            } else {
                ponto["camposEditados"] = [`entrada${i}`, `saida${i}`]
            }
        }
    }

    const limparEdicoes = () => {
        let old = { ...ponto }
        ponto["camposEditados"] = []
        ponto["isEditado"] = false
        ponto.isInconsistencia = true
        for (var i = 1; i < 5; i++) {
            ponto[`entrada${i}`] = ""
            ponto[`saida${i}`] = ""
            form["current"][i]["value"] = ""
        }
        ponto["justificativa"] = ""
        params.updatePonto(old, ponto)

    }

    const marcarDebito = () => {
        let old = ponto
        marcarLinhaCompleta(ponto)
        ponto["justificativa"] = "Débito Banco Horas"
        ponto["camposEditados"] = [...ponto["camposEditados"], "justificativa"]
        ponto["isEditado"] = true
        params.updatePonto(old, ponto)
    }

    const handleEdit = (event) => {
        dispatch({ startedEdition: true })

        let old = ponto
        ponto[event.target.id] = event.target.value
        ponto["isEditado"] = true
        if (ponto["camposEditados"] !== null && ponto["camposEditados"] !== undefined) {
            ponto["camposEditados"] = [...ponto["camposEditados"], event.target.id]
        } else {
            ponto["camposEditados"] = [event.target.id]
        }
        if (event.target.value.length === 5) {
            if (event.target.id === "justificativa") {
                marcarLinhaCompleta(ponto)
            }
            params.updatePonto(old, ponto)
        }
        getHorasTrabalhadas()
    }

    const getTempoFormatado = (intervalo) => {
        if (intervalo > 59) {
            var minutos = intervalo % 60
            var minutosText = `${minutos}`
            if (minutos < 9) {
                minutosText = "0" + minutos
            }
            return Math.floor(intervalo / 60) + ":" + minutosText
        } else {
            console.log("Intervalo:", intervalo)
            return "00:" + ((ValidationUtils.isNull(intervalo) || isNaN(intervalo)) ? "00" : intervalo)
        }
    }

    const getHorasTrabalhadas = () => {

        if (ValidationUtils.isNull(ponto.entrada1)) {
            var old = { ...ponto }
            ponto["horasTrabalhadas"] = "00:00"
            params.updatePonto(old, ponto)
        } else {
            var intervalo = 0
            var intervalo2 = 0
            var intervalo3 = 0
            if (!ValidationUtils.isNull(ponto.entrada2)) {
                intervalo = moment(ponto.saida1, "HH:mm").diff(moment(ponto.entrada2, "HH:mm"))
            }
            if (!ValidationUtils.isNull(ponto.entrada3)) {
                intervalo2 = moment(ponto.saida2, "HH:mm").diff(moment(ponto.entrada3, "HH:mm"))
            }
            if (!ValidationUtils.isNull(ponto.entrada4)) {
                intervalo3 = moment(ponto.saida3, "HH:mm").diff(moment(ponto.entrada4, "HH:mm"))
            }

            intervalo = intervalo + intervalo2 + intervalo3

            var ultimoPonto = undefined
            for (var i = 4; i > 0; i--) {
                if (!ValidationUtils.isNull(ponto[`saida${i}`])) {
                    ultimoPonto = ponto[`saida${i}`]
                    break
                }
            }

            var intervaloTrabalhado = moment.duration(moment(ponto.entrada1, "HH:mm").diff(moment(ultimoPonto, "HH:mm")))
            intervaloTrabalhado = intervaloTrabalhado * -1
            intervalo = intervalo * -1
            intervaloTrabalhado = intervaloTrabalhado - intervalo
            intervaloTrabalhado = (intervaloTrabalhado / 1000) / 60
            var debitoEmMinutos = (intervalo / 1000) / 60
            
            var old = { ...ponto }
            ponto["horasTrabalhadas"] = intervaloTrabalhado
            if(intervaloTrabalhado < 480){
                ponto["debitoHoras"] = (480 - intervaloTrabalhado)
            }else{
                if (debitoEmMinutos > 60) {
                    ponto["debitoHoras"] = debitoEmMinutos
                }else{
                    ponto["debitoHoras"] = ""
                }
            }
            params.updatePonto(old, ponto)
        }


    }

    return (
        <form className={PontoService.isInconsistencia(ponto) ? "card card-inconsistencia" : "card"} ref={form}>
            <div className="date-container">
                <div className="item"><i class="gg-calendar-today"></i></div>
                <div className="item"><p>{getFomattedDate(ponto.data)}</p></div>
            </div>
            <div className="horas-info">
                <p>Horas trabalhadas: {getTempoFormatado(ponto.horasTrabalhadas)}</p>
                <p>{getTempoFormatado(ponto.debitoHoras)}</p>
            </div>

            <div className="ponto-container">
                <input type="text" className="textfield" name="ponto1" id="entrada1" value={getFormattedTime(ponto.entrada1)} onChange={handleEdit} />
                <input type="text" className="textfield" name="ponto2" id="saida1" value={getFormattedTime(ponto.saida1)} onChange={handleEdit} />
                <input type="text" className="textfield" name="ponto3" id="entrada2" value={getFormattedTime(ponto.entrada2)} onChange={handleEdit} />
                <input type="text" className="textfield" name="ponto4" id="saida2" value={getFormattedTime(ponto.saida2)} onChange={handleEdit} />
                <input type="text" className="textfield" name="ponto5" id="entrada3" value={getFormattedTime(ponto.entrada3)} onChange={handleEdit} />
                <input type="text" className="textfield" name="ponto6" id="saida3" value={getFormattedTime(ponto.saida3)} onChange={handleEdit} />
                <input type="text" className="textfield" name="ponto7" id="entrada4" value={getFormattedTime(ponto.entrada4)} onChange={handleEdit} />
                <input type="text" className="textfield" name="ponto8" id="saida4" value={getFormattedTime(ponto.saida4)} onChange={handleEdit} />
            </div>
            <div>
                <p>Falta</p>
                <input type="text" className="textfield" name="justificativa" id="justificativa" maxLength="50" value={ponto["justificativa"] !== null && ponto["justificativa"] !== undefined ? ponto["justificativa"] : ""} placeholder="Digite uma justificativa de falta" onChange={handleEdit} />
                <input type="button" className="button" value="Marcar como débito no banco de horas" onClick={marcarDebito} />
                <input type="button" className="button button-danger" value="Limpar Edições" onClick={limparEdicoes} />
            </div>
        </form>
    )


}

export default withRouter(Card)
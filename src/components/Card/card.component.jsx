import React, { useRef, useEffect } from 'react'
import './card.css'
import { withRouter } from 'react-router-dom'
import PontoService from '../../services/ponto.service'
import { useGlobal } from '../../states/global'
import moment from 'moment'
import ValidationUtils from '../../utils/ValidationUtils'
import TimeUtils from '../../utils/TimeUtils'

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
        getHorasTrabalhadas(false)
        var duration = moment.duration(intervalo, "minutes")
        return moment.utc(duration.asMilliseconds()).format('HH:mm');
    }

    const getHorasTrabalhadas = (isEdicao=true) => {

        if (ValidationUtils.isNull(ponto.entrada1)) {
            var old = { ...ponto }
            ponto["horasTrabalhadas"] = "00:00"
            
        } else {
            var primeiroHorario = TimeUtils.getTimeDiff(ponto.entrada1, ponto.saida1)
            
            var segundoHorario = TimeUtils.getTimeDiff(ponto.entrada2, ponto.saida2)
            var terceiroHorario = TimeUtils.getTimeDiff(ponto.entrada3, ponto.saida4)
            var quartoHorario = TimeUtils.getTimeDiff(ponto.entrada4, ponto.saida4)
            var intervaloTrabalhado = primeiroHorario + segundoHorario + terceiroHorario + quartoHorario
            intervaloTrabalhado = (intervaloTrabalhado / 1000) / 60
            intervaloTrabalhado = Math.abs(intervaloTrabalhado)
            console.log("totalEmMinutos =", intervaloTrabalhado)
            var old = { ...ponto }
            ponto["horasTrabalhadas"] = intervaloTrabalhado
            ponto["debitoHoras"] = 0
            ponto["creditoHoras"] = 0
            if(intervaloTrabalhado < 480){
                var debitoHoras = 480 - intervaloTrabalhado
                if(ValidationUtils.isNull(ponto.entrada2)){
                    debitoHoras -= 60
                }
                ponto["debitoHoras"] = debitoHoras
            }else{
                if (intervaloTrabalhado > 480){
                    var horasExtras = intervaloTrabalhado - 480
                    if(ValidationUtils.isNull(ponto.entrada2)){
                        horasExtras -= 60
                    }

                    if (horasExtras > 45){
                        ponto["creditoHoras"] = horasExtras
                    }
                }
            }
        }
        if(isEdicao){
            params.updatePonto(old, ponto)
        }


    }

    return (
        <form className={PontoService.isInconsistencia(ponto) ? "card card-inconsistencia" : "card"} ref={form}>
            <div className="date-container">
                <div className="item"><i class="gg-calendar-today"></i></div>
                <div className="item"><p>{getFomattedDate(ponto.data)}</p></div>
                <div className="item"></div>
                <div className="item"><i className="gg-sand-clock"></i></div>
                <p className="item" title="Horas trabalhadas">{getTempoFormatado(ponto.horasTrabalhadas)}</p>
                <p className="item" title="Débito em horas" style={{display: ponto.debitoHoras > 0? "block": "none", color: "red"}}>({getTempoFormatado(ponto.debitoHoras)})</p>
                <p className="item" title="Crédito em horas" style={{display: ponto.creditoHoras > 0? "block": "none", color: "green"}}>({getTempoFormatado(ponto.creditoHoras)})</p>
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
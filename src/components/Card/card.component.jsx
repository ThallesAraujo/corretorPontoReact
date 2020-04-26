import React from 'react'
import './card.css'
import { withRouter } from 'react-router-dom'
import PontoService from '../../services/ponto.service'
import { useGlobal } from '../../states/global'
import moment from 'moment'

const Card = (params) => {

    const [state, dispatch] = useGlobal()

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

        if(dateToFormat !== null && dateToFormat !== undefined && dateToFormat.length > 5){
            
            return `${moment(dateToFormat).format("HH:mm")}`
        }else{
            return dateToFormat
        }
    }

    const marcarLinhaCompleta = (ponto) =>{
        for (var i = 1; i < 5; i++){
            if (ponto["camposEditados"] !== null && ponto["camposEditados"] !== undefined){
                ponto["camposEditados"] = [...ponto["camposEditados"],`entrada${i}`,`saida${i}`]
            }else{
                ponto["camposEditados"] = [`entrada${i}`,`saida${i}`]
            }
        }
    }

    const marcarDebito = () => {
        let old = ponto
        marcarLinhaCompleta(ponto)
        ponto["justificativa"] = "Débito Banco Horas"
        ponto["camposEditados"] =[...ponto["camposEditados"], "justificativa"]
        ponto["isEditado"] = true
        params.updatePonto(old, ponto)
    }

    const handleEdit = (event) => {
        dispatch({startedEdition: true})

        let old = ponto
        ponto[event.target.id] = event.target.value
        ponto["isEditado"] = true
        if (ponto["camposEditados"] !== null && ponto["camposEditados"] !== undefined){
            ponto["camposEditados"] = [...ponto["camposEditados"], event.target.id]
        }else{
            ponto["camposEditados"] = [event.target.id]
        }
        if(event.target.value.length === 5){
            if(event.target.id === "justificativa"){
                marcarLinhaCompleta(ponto)
            }
            params.updatePonto(old, ponto)
        }
    }


    return (
        <div className={PontoService.isInconsistencia(ponto) ? "card card-inconsistencia" : "card"}>
            <div className="date-container">
                <div className="item"><i class="gg-calendar-today"></i></div>
                <div className="item"><p>{ getFomattedDate(ponto.data) }</p></div>
            </div>
            <div className="ponto-container">
                <input type="text" className="textfield" name="ponto1" id="entrada1" value={getFormattedTime(ponto.entrada1)} onChange={handleEdit}/>
                <input type="text" className="textfield" name="ponto2" id="saida1" value ={getFormattedTime(ponto.saida1)} onChange={handleEdit}/>
                <input type="text" className="textfield" name="ponto3" id="entrada2" value ={getFormattedTime(ponto.entrada2)} onChange={handleEdit}/>
                <input type="text" className="textfield" name="ponto4" id="saida2" value ={getFormattedTime(ponto.saida2)} onChange={handleEdit}/>
                <input type="text" className="textfield" name="ponto5" id="entrada3" value ={getFormattedTime(ponto.entrada3)} onChange={handleEdit}/>
                <input type="text" className="textfield" name="ponto6" id="saida3" value ={getFormattedTime(ponto.saida3)} onChange={handleEdit}/>
                <input type="text" className="textfield" name="ponto7" id="entrada4" value ={getFormattedTime(ponto.entrada4)} onChange={handleEdit}/>
                <input type="text" className="textfield" name="ponto8" id="saida4" value ={getFormattedTime(ponto.saida4)} onChange={handleEdit}/>
            </div>
            <div>
                <p>Falta</p>
                <input type="text" className="textfield" name="justificativa" id="justificativa" value={ponto["justificativa"] !== null && ponto["justificativa"] !== undefined ? ponto["justificativa"]: ""} placeholder="Digite uma justificativa de falta" onChange={handleEdit}/>
                <input type="button" className="button" value="Marcar como débito no banco de horas" onClick={marcarDebito}/>
            </div>
        </div>
    )


}

export default withRouter(Card)
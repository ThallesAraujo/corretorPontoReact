import GERNINI_URL from "./helper"
import axios from 'axios'
import moment from 'moment'

class PontoService {

    getPontos = (matricula, senha, completion, completionError) => {
        
        var date = new Date()
        date.setMonth(date.getMonth()+1)

        if (date.getDate() > 15){
            date.setMonth(date.getMonth()+1)
        }

        axios.post(`${GERNINI_URL}pontoHora`, { 
            "matricula": matricula.toString(10),
            "cpf": senha.toString(10),
            "ano": date.getFullYear().toString(10),
            "mes": date.getMonth().toString(10)
         }, {timeout: 500000}).then(response => {
             console.table(response)
             completion(response.data)

         }).catch(error => {
            completionError(error)
         })
    }


    isInconsistencia = (ponto) => {

        let date = moment(ponto.data).add(1, "days")
        let diaHoje = moment(new Date())

        var cont = 0
        for(var i = 1; i< 5; i++){
            if (ponto[`entrada${i}`] !== null && ponto[`entrada${i}`] !== ""){
                cont = cont + 1
            }
            if (ponto[`saida${i}`] !== null && ponto[`saida${i}`] !== ""){
                cont = cont + 1
            }
        }

        var isDiaHoje = (today, data) => { 
            return today.getFullYear() === data.getFullYear() &&
                    today.getMonth() === data.getMonth() &&
                    today.getDate() === data.getDate()
        }
    

        return ((date < diaHoje && date !== diaHoje) 
                && (date.format("ddd") !== "Sat" && date.format("ddd") !== "Sun")
                && (cont % 2 > 0 || cont === 0))
    }

}

export default new PontoService()
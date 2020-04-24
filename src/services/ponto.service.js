import GERNINI_URL from "./helper"
import axios from 'axios'

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
         }).then(response => {
             console.table(response)
             completion(response.data)

         }).catch(error => {
            completionError(error)
         })
    }


    isInconsistencia = (ponto) => {

        let date = new Date(ponto.data)
        let diaHoje = new Date()

        var cont = 0
        for(var i = 1; i< 5; i++){
            if (ponto[`entrada${i}`] !== null){
                cont = cont + 1
            }
            if (ponto[`saida${i}`] !== null){
                cont = cont + 1
            }
        }

        var isDiaHoje = (today, data) => { 
            return today.getFullYear() === data.getFullYear() &&
                    today.getMonth() === data.getMonth() &&
                    today.getDate() === data.getDate()
        }

        return (ponto["is_falta"] 
                && (date < diaHoje && !isDiaHoje(diaHoje, date)) 
                && (date?.getDay() !== 0 && date?.getDay() !== 6)
                && (cont % 2 > 0 || cont === 0))
    }

}

export default new PontoService()
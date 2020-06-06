import ValidationUtils from "../utils/ValidationUtils"

class SessionService {

    isSessionValid = () =>{

       const matricula = sessionStorage.getItem('matricula')
       const senha = sessionStorage.getItem('senha')
       return !ValidationUtils.isNull(matricula) && !ValidationUtils.isNull(senha)

    }

}

export default new SessionService()
import moment from 'moment'
import ValidationUtils from './ValidationUtils'
class TimeUtils{

    getTimeString = (obj) => {
       return moment(obj, "hh:mm").format("HH:mm").toString()
    }

    getTimeDiff = (obj1, obj2) => {

        if (ValidationUtils.isNull(obj1) || ValidationUtils.isNull(obj2)){
            return 0
        }

        if (obj1 !== null && obj1.length > 5){
            obj1 = obj1.split("T")[1].split(".")[0].substring(0,5)
        }
        if (obj2 !== null && obj2.length > 5){
            obj2 = obj2.split("T")[1].split(".")[0].substring(0,5)
        }
        
        var hora1 = this.getTimeString(obj1)
        var hora2 = this.getTimeString(obj2)
        return Math.abs(moment(hora1, "HH:mm").diff(moment(hora2, "HH:mm")))
    }

}

export default new TimeUtils()
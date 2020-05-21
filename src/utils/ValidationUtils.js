class ValidationUtils{

    isNull = (obj) =>{
        return (obj === undefined || obj === null || obj === "")
    }

}

export default new ValidationUtils()
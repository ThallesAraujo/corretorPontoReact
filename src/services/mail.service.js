import axios from 'axios'

var EmailService = {
    sendEmail(subject,toList,body, completion, completionError){
        axios.post("http://mail-sender-cli.herokuapp.com/send_email", {
            "body": body,
            "destinations": toList,
            "subject": subject 
        }, {headers: {
            'content-type': 'application/json',
            'Authorization': null,
            },timeout: 500000}).then(response => {
            console.log(response)
            completion(response.data)
        }).catch(error => {
           completionError(error)
        })
    }
}
    
export default EmailService;
var MailStyler = {

    styleMail(mail){
        return mail.replace(/class="ponto-modificado"/g, `style="
            background-color: #ffa19a;
            border: 2px solid #ff6358;
            color: #cd0d00;
        "`)
        .replace(/class="ponto"/g, `style="
            border: 2px solid #dbe0e8;
            color: #5b6f8d;
        "`)
        .replace(/class="pontos-container"/g, `style="
            background-color: #f1f3f6;
            color: #5b6f8d;
        "`)
        .replace(/class="sabado"/g, `style="
            border: 2px solid #e6e6e6;
            color: #a6a6a6;
        "`)
        .replace(/class="domingo"/g, `style="
            border: 2px solid #e6e6e6;
            color: #b3b3b3;
        "`)
        
    }

}

export default MailStyler
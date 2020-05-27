var MessageService ={

    exibirMensagem(classe, textoMensagem){
        const mensagem = document.getElementById('message');
        if (mensagem !== undefined && mensagem !== null){
          if(mensagem.classList.contains('out')){
            mensagem.classList.toggle('out');
          }
      
          if(mensagem.classList.contains('remove-pad')){
            mensagem.classList.toggle('remove-pad');
          }
      
          if(mensagem.classList.contains('in')){
            mensagem.classList.toggle('in');
          }
      
          mensagem.classList.add(classe)
                  mensagem.innerText = textoMensagem;
                  mensagem.setAttribute('style', 'display: block')
                  mensagem.classList.toggle('in');
                  setTimeout(() =>{
                    mensagem.classList.toggle('out');
                    mensagem.classList.toggle('remove-pad');
            }, 5000);
        }
    },

    exibirMensagemErro(mensagem){
        MessageService.exibirMensagem('message-error', mensagem)
    },

    exibirMensagemSucesso(mensagem){
        MessageService.exibirMensagem('message-success', mensagem)
    }

}

export default MessageService
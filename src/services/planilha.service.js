import XLSX from 'xlsx-style'

var colunas = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K'];

const criarNovaPlanilha = (pontos) => {

    var wb = {
        SheetNames: ["Sheet1"],
        "!cols": [
            { wpx: 400 },
            { wpx: 50 },
            { wpx: 50 },
            { wpx: 50 },
            { wpx: 50 },
            { wpx: 50 },
            { wpx: 50 },
            { wpx: 50 },
            { wpx: 50 },
            { wpx: 50 },
            { wpx: 200 },
        ],
        "Sheets":{
            "Sheet1": {}
        },
        "cellStyles":true
    }

    var planilha = {}

    planilha["!ref"] = `A1:K${pontos.length*10}`

    for(var cont = 0; cont < pontos.length; cont++){
        for(var col = 0; col <colunas.length; col ++){
            var chaves = ["data", "entrada1", "saida1", "entrada2", "saida2", "entrada3", "saida3", "entrada4", "saida4", "justificativa"]
            console.log("chaves", chaves)
            console.table(pontos)

            if (pontos[cont]["pontosEditados"] !== undefined && pontos[cont]["pontosEditados"].includes(chaves[col])){
                var estiloCorrigido = {
                    font: { color: { rgb: 'FFB51F1F' } },
                    fill: { fgColor: { rgb: "FFFCC3B3" } }
                }
                planilha[`${colunas[col]}${cont+1}`] = {"v": pontos[cont][chaves[col]], "s": estiloCorrigido}
            }else{
                planilha[`${colunas[col]}${cont+1}`] = {"v": pontos[cont][chaves[col]], "s": "border: 1px solid red"}
            }
        }
    }

    wb.Sheets.Sheet1 = planilha

    XLSX.writeFile(wb, "./espelho_de_ponto_corrigido.xlsx")
    console.log(wb)

    //window.location = "espelho_de_ponto_corrigido.xlsx"

    document.execCommand('SaveAs','true',XLSX.writeFile(wb, "./espelho_de_ponto_corrigido.xlsx"))
}

export default criarNovaPlanilha
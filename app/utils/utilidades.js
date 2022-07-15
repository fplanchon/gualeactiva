export const fechaIso2dmy = (fecha, con_hora) => {
    console.log('fecha', fecha)
    if (!fecha) { return false; }

    let f = new Date('2022-08-10');
    console.log('f', f)
    if (fecha.length == 10) {
        f.setDate(f.getDate() + 1)
    }

    let dia = (f.getDate())
    console.log('dia', dia)

    if (dia < 10) { dia = '0' + dia; }

    let mes = (f.getMonth() + 1)
    if (mes < 10) { mes = '0' + mes }
    console.log('mes', mes)

    let nf = dia + '/' + mes + '/' + f.getFullYear()
    console.log('nf', nf)

    if (con_hora) {
        nf += ' ' + ("0" + f.getHours()).slice(-2) + ':' + ("0" + f.getMinutes()).slice(-2) + ':' + ("0" + f.getSeconds()).slice(-2)
    }

    return nf
} // function fechaIso2dmy
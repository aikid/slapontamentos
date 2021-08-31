import React from 'react';
import { TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import voucherIcon from '../../assets/img/voucher.png';
import Moment from 'moment';
import 'moment/locale/pt-br';
import { Container, Left, Bandeira, Info, Nome, Numero, Expires, Action } from './styles';

export default function Vouchers({ data, onCancel }) {
    let ativo = true;
    function getValor(){
        let valor = data.valorDoVoucher;
        let tipoDesconto = data.tipoDescontoVoucher;
        let valorTratado = '';
        
        switch(tipoDesconto){
            case 1:
                valorTratado = valor+'% de desconto';
            break;
            case 2:
                valorTratado = 'R$ '+valor;
            break;
            default:
                valorTratado = 'Valor não definido';
        }
        return valorTratado;
    }

    function formataData(data){
        let novadata = '';
        novadata = Moment(data).format('DD/M/YYYY HH:mm:ss');
        return novadata;
    }

    function getStatus(status){
        let novoStatus = '';
        switch(status){
            case 1:
                novoStatus = 'Disponivel';
                ativo = true;
            break;
            case 2:
                novoStatus = 'Utilizado';
            break;
            case 3:
                novoStatus = 'Expirado';
            break;
            default:
                novoStatus = 'ND';
        }
        return novoStatus;
    }

    // function getUso(uso){
    //     let novoUso = 'ND';
    //     if(uso){
    //         novoUso = 'Usado';
    //     }else{
    //         novoUso = 'Disponível';
    //     }
    //     return novoUso;
    // }

  return (
    <Container onStartShouldSetResponder={onCancel}>
        <Left>
            <Bandeira source={voucherIcon}></Bandeira>
            <Info>
                <Nome>Código: {data.codigo}</Nome>
                <Numero>Valor: {getValor()}</Numero>
                <Expires>Expira em: {formataData(data.dataDeValidade)} | {getStatus(data.statusVoucher)}</Expires>
            </Info>
        </Left>
    </Container>
  );
}

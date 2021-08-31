import React from 'react';
import { TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Moment from 'moment';
import 'moment/locale/pt-br';
import { Container, Left, Bandeira, Info, Nome, Numero, Valor, Status, confirmadoSet, negadoSet} from './styles';

export default function Compra({ data, onCancel }) {
    let bandeira = '';
    let auto = '';
    let status = '';
    let novadata = '';
    if(data === null || data === undefined){
        auto = '';
    }
    function getStatus(status){
        switch(status){
            case "CON":
                status = 'confirmado';
            break;
            case "NEG":
                status = 'negado';            
            break;
            default:
                status = 'indefinido'; 
        }
        return status;
    }

    function formataData(data){
        novadata = Moment(data).format('DD/M/YYYY HH:mm:ss');
        return novadata;
    }

    function trataValor(valor){
        let novoValor = 0;
        if(valor !== null && valor !== undefined){
            novoValor = valor;
        }
        return novoValor.toFixed(2);;
    }

    function getBandeira(autorizadora){
        switch(autorizadora){
            case 1:
            bandeira = require('../../assets/img/cartao-visa.png');
            break;
            case 2:
            bandeira = require('../../assets/img/cartao-mastercard.png');
            break;
            case 3:
            bandeira = require('../../assets/img/cartao-american-express.png');
            break;
            case 5:
            bandeira = require('../../assets/img/cartao-hipercard.png');
            break;
            case 6:
            bandeira = require('../../assets/img/cartao-aura.png');
            break;
            case 12:
            bandeira = require('../../assets/img/cartao-cabal.png');
            break;
            case 33:
            bandeira = require('../../assets/img/cartao-diners.png');
            break;
            case 41:
            bandeira = require('../../assets/img/cartao-elo.png');
            break;
            case 207:
            bandeira = require('../../assets/img/cartao-vr-alimentacao.png');
            break;
            case 209:
            bandeira = require('../../assets/img/cartao-alelo.png');
            break;
            case 224:
            bandeira = require('../../assets/img/cartao-alelo.png');
            break;
            case 280:
            bandeira = require('../../assets/img/cartao-sodexo-alimentacao.png');
            break;
            case 281:
            bandeira = require('../../assets/img/cartao-sodexo-refeicao.png');
            break;
            default:
            bandeira = require('../../assets/img/snack-default.png');
        }
        return bandeira;
    }
  return (
    <Container>
        <Left>
            <Bandeira source={getBandeira(auto)}></Bandeira>
            <Info>
                <Nome>Produto: {data.produtoNome}</Nome>
                <Valor>Valor pago: R${trataValor(data.valorTotal)}</Valor>
                <Numero>Data da compra: {formataData(data.dataDoPagamento)}</Numero>
                <Status>Status da Compra: {data.descricaoStatusPedido}</Status>
            </Info>
        </Left>

        {/* <TouchableOpacity onPress={onCancel}>
            <Icon name="delete" size={20} color="#f64c75"/>
        </TouchableOpacity> */}
    </Container>
  );
}
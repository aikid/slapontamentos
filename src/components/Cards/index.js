import React from 'react';
import { TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Container, Left, Bandeira, Info, Nome, Numero, Expires } from './styles';

export default function Cards({ data, onCancel, onNavigate }) {
    let bandeira = '';
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
            bandeira = require('../../assets/img/cartao-vr-refeicao.png');
            break;
            case 224:
            bandeira = require('../../assets/img/cartao-alelo.png');
            break;
            case 225:
            bandeira = require('../../assets/img/cartao-alelo.png');
            break;
            case 280:
            bandeira = require('../../assets/img/cartao-sodexo-alimentacao.png');
            break;
            case 281:
            bandeira = require('../../assets/img/cartao-sodexo-refeicao.png');
            break;
            default:
            bandeira = require('../../assets/img/cartao-default.png');
        }
        return bandeira;
    }

    function getTipo(type){
        console.log(type);
        let tipo = '';
        switch(type){
            case 1:
                tipo = 'Maquina';
            break;
            case 2:
                tipo = 'Depósito';
            break;
            case 3:
                tipo = 'Expedição';
            break;
            case 4:
                tipo = 'Recebimento';
            break;
            case 5:
                tipo = 'Outros';
            break;
        }
        return tipo;
    }
  return (
    <Container onPress={onNavigate}>
        <Left>
            <Bandeira source={getBandeira(data.autorizadora)}></Bandeira>
            <Info>
                <Nome>{getTipo(data.tipo)}</Nome>
                <Numero>Criado por: {data.login}</Numero>
                <Expires>Data do registro: {data.data}</Expires>
            </Info>
        </Left>

        {/* <TouchableOpacity onPress={onCancel}>
            <Icon name="delete" size={20} color="#f64c75"/>
        </TouchableOpacity> */}
    </Container>
  );
}

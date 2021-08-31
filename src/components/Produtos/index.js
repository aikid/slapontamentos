import React from 'react';
import { TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import prodIcon from '../../assets/img/snack-default.png';
import { Container, Left, Bandeira, Info, Nome, Numero, Expires, Action } from './styles';

export default function Produtos({ data, onCancel }) {

  return (
    <Container onStartShouldSetResponder={onCancel}>
        <Left>
            <Bandeira source={prodIcon}></Bandeira>
            <Info>
                <Nome>Nome: {data.nome}</Nome>
                <Numero>Preço: R${data.preco}</Numero>
                <Expires>Código: {data.codigo}</Expires>
            </Info>
        </Left>
    </Container>
  );
}

import React, { useState } from 'react';
import { Image,ScrollView,Picker,Text } from 'react-native';
import Background from '../../../components/Background';
import logo from '../../../assets/img/logo-sl-cafes.png';
import { Container, Form, SubmitButton,Intro } from './styles';

export default function Apontamento({ navigation }) {
  const apontamentoData = navigation.getParam('apontamento');

  return (
    <Background>
      <Container>
        <Image source={logo}/>
        <Form>
          <ScrollView>
            <Text>Tipo: {apontamentoData.tipo}</Text>
            <Text>Data do Inventário: {apontamentoData.data}</Text>
            <Text>Matrícula: {apontamentoData.id}</Text>
            <Intro>Itens do Apontamento</Intro>
            
            <SubmitButton onPress={()=>navigation.navigate("ApontamentoItem")}>
              Adicionar Itens
            </SubmitButton>
            <SubmitButton onPress={()=>navigation.navigate("Apontamentos")}>
              Voltar
            </SubmitButton>
          </ScrollView>
        </Form>
      </Container>
    </Background>
  );
}

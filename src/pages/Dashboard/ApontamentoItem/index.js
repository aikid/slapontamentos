import React, { useState } from 'react';
import { Image,ScrollView,Alert } from 'react-native';
import Background from '../../../components/Background';
import logo from '../../../assets/img/logo-sl-cafes.png';
import { Container, Form, FormInput, SubmitButton,Intro } from './styles';

export default function Apontamento({ navigation }) {
   const [codigoProduto,setCodigoProduto] = useState('');
   const [produto,setProduto] = useState('');
   const [quantidade,setQuantidade] = useState('');
  
  

  function handleSubmit(){
    Alert.alert('Sucesso!','Produto adicionado com sucesso!');
  }
  
  return (
    <Background>
      <Container>
        <Image source={logo}/>
        <Form>
          <ScrollView>
          <Intro>Adicionar Item</Intro>
            <FormInput 
              icon={'dialpad'}
              keyboardCorrect={false}
              autoCapitalize="none"
              placeholder="Código Produto"
              value={codigoProduto}
              onChangeText={setCodigoProduto}
            />

            <FormInput 
              icon={'archive'}
              keyboardCorrect={false}
              autoCapitalize="none"
              placeholder="Produto"
              value={produto}
              onChangeText={setProduto}
            />

            <FormInput 
              icon={'filter-1'}
              keyboardCorrect={false}
              autoCapitalize="none"
              placeholder="Quantidade"
              value={quantidade}
              onChangeText={setQuantidade}
            />
            
            
            <SubmitButton onPress={handleSubmit}>
              Adicionar
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

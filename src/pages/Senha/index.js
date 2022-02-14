import React, { useState } from 'react';
import { Alert,Image,Keyboard,ScrollView } from 'react-native';
import Background from '../../components/Background';
import logo from '../../assets/img/logo-2btech.png';
import { Container, Form, FormInput, SubmitButton,SignLink,SignLinkText } from './styles';
import api from '../../services/api';

export default function Senha({ navigation }) {
  
  const [email,setEmail] = useState('');
  let loading = false;
  async function handleSubmit(){
    loading = true;
    console.log(loading)
    try {
      const response = await api.post('/Auth/esqueci-senha',{
        email
      });

      console.log(response.data);
      Alert.alert('Sucesso!', response.data.data);
      loading = false;
      navigation.navigate('SignIn');
    } catch (error) {
      console.log(error.response);
      Alert.alert('Falha ao recuperar a senha', error.response.data.errors[0]);
      loading = false;
    }
  }
  
  return (
    <Background>
      <Container>
        <Image source={logo}/>
        <Form>
          <ScrollView>
            <FormInput 
              icon="mail-outline"
              keyboardType="email-address"
              keyboardCorrect={false}
              autoCapitalize="none"
              autoCompleteType="email"
              textContentType="emailAddress"
              placeholder="Digite seu e-mail"
              returnKeyType="next"
              onSubmitEditing={()=> passwordRef.current.focus()}
              value={email}
              onChangeText={setEmail}
            />

            <SubmitButton loading={loading} onPress={handleSubmit}>
              Recuperar Senha
            </SubmitButton>
            <SignLink onPress={()=> navigation.navigate('SignIn')}>
              <SignLinkText>Entrar com a conta</SignLinkText>
            </SignLink>
          </ScrollView>
        </Form>
      </Container>
    </Background>
  );
}

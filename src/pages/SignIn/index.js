import React, { useEffect,useState } from 'react';
import { Image,Keyboard,ScrollView,Linking } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import Background from '../../components/Background';
import { signInRequest,signInRefresh } from '../../store/modules/auth/actions';
import logo from '../../assets/img/logo-2btech.png';
import { Container, Form, FormInput, SubmitButton,SignLink,SignLinkText } from './styles';

export default function SignIn({ navigation }) {
  const dispatch = useDispatch();
  const [filial,setFilial] = useState('');
  const [email,setEmail] = useState('');
  const [password,setPassword] = useState('');
  const user = useSelector(state => state.user.profile);
  const loading = useSelector(state => state.auth.loading);

  useEffect(()=>{
    if(user !== null && user !== undefined){
      const hora = new Date(user.datelog);
      const horagora = new Date();
      if(horagora.getTime() - hora.getTime() > 3600000){
        if(user.password !== null && user.password !== undefined){
          dispatch(signInRefresh(user.name,user.password,user.filial));
        }
      }
    }

  },[]);

  function handleSubmit(){
    dispatch(signInRequest(email,password,filial));
  }
  
  return (
    <Background>
      <Container>
        <Image source={logo}/>
        <Form>
          <ScrollView>
            <FormInput 
              icon="business"
              keyboardType="numeric"
              keyboardCorrect={false}
              autoCapitalize="none"
              placeholder="Digite sua filial"
              value={filial}
              onChangeText={setFilial}
            />
            <FormInput 
              icon="perm-identity"
              keyboardType="email-address"
              keyboardCorrect={false}
              autoCapitalize="none"
              autoCompleteType="email"
              textContentType="emailAddress"
              placeholder="Digite seu usuario"
              value={email}
              onChangeText={setEmail}
            />

            <FormInput 
              icon="lock-outline"
              secureTextEntry
              placeholder="Digite sua Senha"
              returnKeyType="send"
              onSubmitEditing={handleSubmit}
              value={password}
              onChangeText={setPassword}
            />

            <SubmitButton loading={loading} onPress={handleSubmit}>
              Acessar
            </SubmitButton>
            {/* <SignLink onPress={()=> navigation.navigate('Senha')}>
              <SignLinkText>Esqueci Minha Senha</SignLinkText>
            </SignLink> */}
          </ScrollView>
        </Form>
      </Container>
    </Background>
  );
}

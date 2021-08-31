import React, { useEffect,useRef,useState } from 'react';
import { Image,Keyboard,ScrollView,Linking } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import Background from '../../components/Background';
import { signInRequest,signInRefresh } from '../../store/modules/auth/actions';
import logo from '../../assets/img/logo-pilao.png';
import { Container, Form, FormInput, SubmitButton,SignLink,SignLinkText } from './styles';

export default function SignIn({ navigation }) {
  const dispatch = useDispatch();
  const passwordRef = useRef();

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
          dispatch(signInRefresh(user.email,user.password));
        }
      }
    }

  },[]);

  function handleSubmit(){
    dispatch(signInRequest(email,password));
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

            <FormInput 
              icon="lock-outline"
              secureTextEntry
              placeholder="Sua Senha"
              ref={passwordRef}
              returnKeyType="send"
              onSubmitEditing={handleSubmit}
              value={password}
              onChangeText={setPassword}
            />

            <SubmitButton loading={loading} onPress={handleSubmit}>
              Acessar
            </SubmitButton>
            <SignLink onPress={()=> navigation.navigate('SignUp')}>
              <SignLinkText>Criar uma conta</SignLinkText>
            </SignLink>
            <SignLink onPress={()=> navigation.navigate('Senha')}>
              <SignLinkText>Esqueci Minha Senha</SignLinkText>
            </SignLink>
            <SignLink onPress={()=> Linking.openURL('https://slpay.slcafes.com.br:8098/politica/')}>
              <SignLinkText>Politica de Privacidade</SignLinkText>
            </SignLink>
          </ScrollView>
        </Form>
      </Container>
    </Background>
  );
}

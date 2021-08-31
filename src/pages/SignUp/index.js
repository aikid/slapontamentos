import React, { useRef,useState } from 'react';
import { Image,ScrollView } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import Background from '../../components/Background';
import { signUpRequest } from '../../store/modules/auth/actions';
import logo from '../../assets/img/logo-pilao.png';
import { Container, Form, FormInput, SubmitButton,SignLink,SignLinkText,MaskInput } from './styles';

export default function SignUp({ navigation }) {
  const dispatch = useDispatch();
  const emailRef = useRef();
  const telefoneRef = useRef();
  const passwordRef = useRef();
  const confirmRef = useRef();

  const [nomeCompleto,setnomeCompleto] = useState('');
  const [email,setEmail] = useState('');
  const [telefone,setTelefone] = useState('');
  const [password,setPassword] = useState('');
  const [confirmPassword,setconfirmPassword] = useState('');

  const loading = useSelector(state => state.auth.loading);

  function handleSubmit(){
    dispatch(signUpRequest(nomeCompleto, email, telefone.replace(/[^0-9]+/g,''), password, confirmPassword));
  }

  return (
    <Background>
      <Container>
        <Image source={logo} />
        <Form>
          <ScrollView>
            <FormInput 
              icon="person-outline"
              keyboardCorrect={false}
              autoCapitalize="none"
              placeholder="Nome Completo"
              returnKeyType="next"
              value={nomeCompleto}
              onChangeText={setnomeCompleto}
            />

            <FormInput 
              icon="mail-outline"
              keyboardType="email-address"
              keyboardCorrect={false}
              autoCapitalize="none"
              autoCompleteType="email"
              textContentType="emailAddress"
              placeholder="Digite seu e-mail"
              returnKeyType="next"
              value={email}
              onChangeText={setEmail}
            />

            <MaskInput
              icon="phone"
              placeholder="Telefone"
              type={'cel-phone'}
              options={{
                maskType: 'BRL',
                withDDD: true,
                dddMask: '(99) '
              }}
              value={telefone}
              onChangeText={setTelefone}
            />

            <FormInput 
              icon="lock-outline"
              secureTextEntry
              placeholder="Sua Senha"
              returnKeyType="next"
              value={password}
              onChangeText={setPassword}
            />

            <FormInput 
              icon="lock-outline"
              secureTextEntry
              placeholder="Confirme sua Senha"
              returnKeyType="send"
              onSubmitEditing={handleSubmit}
              value={confirmPassword}
              onChangeText={setconfirmPassword}
            />

            <SubmitButton loading={loading} onPress={handleSubmit}>
              Cadastrar
            </SubmitButton>
            <SignLink onPress={()=> navigation.navigate('SignIn')}>
              <SignLinkText>Já tenho uma conta</SignLinkText>
            </SignLink>
          </ScrollView>
        </Form>
      </Container>
    </Background>
  );
}

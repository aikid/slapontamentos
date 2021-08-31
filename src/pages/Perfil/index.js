import React, { useEffect,useRef,useState } from 'react';
import { useDispatch,useSelector } from 'react-redux';
import Background from '../../components/Background';
import { signOut } from '../../store/modules/auth/actions';
import { TextInputMask } from 'react-native-masked-text'
import { updateProfileRequest } from '../../store/modules/user/actions';
import { Container, Title, Form, FormInput, SubmitButton,SignLink,SignLinkText,MaskInput } from './styles';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default function Perfil({ navigation }) {
  const profile = useSelector(state=> state.user.profile);
  const dispatch = useDispatch();
  const emailRef = useRef();
  const telefoneRef = useRef();

  const [nomeCompleto,setnomeCompleto] = useState(profile.nomeCompleto);
  const [email,setEmail] = useState(profile.email);
  const [telefone,setTelefone] = useState(profile.telefone);
  const user = useSelector(state => state.user.profile);
  const loading = useSelector(state => state.auth.loading);
  const token = useSelector(state=> state.auth.token);

  useEffect(()=>{
    //console.log(user);
    if(user !== null && user !== undefined){
      const hora = new Date(user.datelog);
      const horagora = new Date();
      console.log(horagora.getTime() - hora.getTime());
      if(horagora.getTime() - hora.getTime() > 3600000){
        if(user.password !== null && user.password !== undefined){
          navigation.navigate('SignIn');
        }
      }
    }

  },[]);

  function handleSubmit(){
    dispatch(updateProfileRequest({nomeCompleto, email, telefone, token}));
  }

  function handleLogout(){
    dispatch(signOut());
  }

  return (
    <Background>
      <Container>
          <Title>Dados do Perfil</Title>
        <Form>
          <FormInput 
            icon="person-outline"
            keyboardCorrect={false}
            autoCapitalize="none"
            placeholder="Nome Completo"
            returnKeyType="next"
            onSubmitEditing={()=> emailRef.current.focus()}
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
            onSubmitEditing={()=> telefoneRef.current.focus()}
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

          <SubmitButton loading={loading} onPress={handleSubmit}>
            Atualizar Dados
          </SubmitButton>

          <SubmitButton onPress={handleLogout}>
            Sair
          </SubmitButton>
        </Form>
      </Container>
    </Background>
  );
}

Perfil.navigationOptions = {
  tabBarLabel: 'Minha Conta',
  tabBarIcon: ({tintColor}) => (
    <Icon name="person" size={20} color={tintColor}/>
  ),
}
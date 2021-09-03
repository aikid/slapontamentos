import React from 'react';
import { Image,ScrollView } from 'react-native';
import { useDispatch,useSelector } from 'react-redux';
import { signOut } from '../../../store/modules/auth/actions';
import Background from '../../../components/Background';
import logo from '../../../assets/img/logo-sl-cafes.png';
import { Container, ButtonContent, SubmitButton, Intro } from './styles';

export default function Inicial({ navigation }) {
  const dispatch = useDispatch();
  const user = useSelector(state => state.user.profile);

  function handleLogout(){
    dispatch(signOut());
  }
  
  return (
    <Background>
      <Container>
        <Image source={logo}/>
        <ButtonContent>
          <ScrollView>
            <Intro>Olá {user.name} seja bem vindo, para adicionar um inventário cliente em adicionar apontamento.</Intro>
            <SubmitButton onPress={()=>navigation.navigate("CriarApontamento")}>
              Adicionar Apontamento
            </SubmitButton>
            <SubmitButton onPress={()=>navigation.navigate("Apontamentos")}>
              Ver Apontamentos
            </SubmitButton>
            <SubmitButton onPress={handleLogout}>
              Sair
            </SubmitButton>
          </ScrollView>
        </ButtonContent>
      </Container>
    </Background>
  );
}

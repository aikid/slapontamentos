import React,{useEffect} from 'react';
import { Image,ScrollView } from 'react-native';
import { useDispatch,useSelector } from 'react-redux';
import { signOut } from '../../../store/modules/auth/actions';
import Background from '../../../components/Background';
import logo from '../../../assets/img/logo-2btech.png';
import useLocation from '../../../hooks/useLocation';
import { Container, ButtonContent, SubmitButton, Intro } from './styles';

export default function Inicial({ navigation }) {
  const dispatch = useDispatch();
  const user = useSelector(state => state.user.profile);
  const { coords, errorMsg } = useLocation();

  useEffect(()=>{
    if(user){
      console.log(user);
      const hora = new Date(user.datelog);
      const horagora = new Date();
      console.log(horagora.getTime() - hora.getTime());
      if(horagora.getTime() - hora.getTime() > 3600000){
        if(user.password !== null && user.password !== undefined){
          navigation.navigate('SignIn');
        }
      }
    }
  },[])
  
  function handleLogout(){
    dispatch(signOut());
  }
  
  return (
    <Background>
      <Container>
        <Image source={logo}/>
        <ButtonContent>
          <ScrollView>
            <Intro>Olá {user.name} seja bem vindo, para adicionar um inventário clique em adicionar apontamento.</Intro>
            <SubmitButton onPress={()=>navigation.navigate("EscanearApontamento",{coords: coords})}>
              Escanear Apontamento
            </SubmitButton>
            <SubmitButton onPress={()=>navigation.navigate("CriarApontamento",{coords: coords})}>
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

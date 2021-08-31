import React, {useEffect,useState} from 'react';
import { useSelector } from 'react-redux';
import api from '../../../services/api';
import Background from '../../../components/Background';
import Compra from '../../../components/Compra';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { withNavigationFocus } from 'react-navigation';
import { Container, Title, List, SubmitButton } from './styles';
import { Alert } from 'react-native';

function Compras({ isFocused,navigation }) {
  const [compras,setCompras] = useState([]);
  const token = useSelector(state=> state.auth.token);

  async function loadCompras(){
    api.defaults.headers.Authorization = `Bearer ${token}`;
    const response = await api.get('/v1/Pedidos');
    console.log(response.data.data);
    setCompras(response.data.data);
  }

  useEffect(()=>{
    if(isFocused){
        loadCompras();
    }
  },[isFocused]);

  async function confirmDelete(id){
    Alert.alert(
      'Aviso!',
      'Você deseja deletar esse registro?',
      [
        {
          text: 'Cancelar',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {text: 'OK', onPress: () => handleDelet(id)},
      ],
      {cancelable: false},
    );
  }

  async function handleDelet(id){
    // api.defaults.headers.Authorization = `Bearer ${token}`;
    // const response = await api.delete(`/v1/Cartoes/${id}`);
    // console.log(response.data);

    // setCartoes(
    //   cartoes.filter(cartao =>cartao.id !== id)
    // );
  }

  return (
    <Background>
        <Container>
            <Title>Compras Realizadas</Title>

            <List
                data={compras}
                keyExtractor={item=>String(item.id)}
                renderItem={({ item }) => <Compra  onCancel={()=> confirmDelete(item.id)} data={item}/> }
            />
            <SubmitButton onPress={() => navigation.navigate('Maquina')}>
              Voltar
            </SubmitButton>
        </Container>
    </Background>
  );
}

Compras.navigationOptions = {
  tabBarLabel: 'Listar Cartões',
  tabBarIcon: ({tintColor}) => (
    <Icon name="credit-card" size={20} color={tintColor}/>
  ),
}

export default withNavigationFocus(Compras)
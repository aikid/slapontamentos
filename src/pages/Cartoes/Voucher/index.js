import React, {useEffect,useState} from 'react';
import { useSelector } from 'react-redux';
import api from '../../../services/api';
import Background from '../../../components/Background';
import Vouchers from '../../../components/Vouchers';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { withNavigationFocus } from 'react-navigation';
import { Alert } from 'react-native';
import { Switch } from 'react-native-switch';
import { Container, Title, List, SubmitButton,AddButton, Form,FormInput} from './styles';


function Voucher({ isFocused,navigation }) {
  const [vouchers,setVouchers] = useState([]);
  const [codigo,setCodigo] = useState('');
  const [value,setValue] = useState('');
  const token = useSelector(state=> state.auth.token);

  async function loadVoucher(){
    api.defaults.headers.Authorization = `Bearer ${token}`;
    const response = await api.get('/v1/vouchers');
    console.log(response.data.data);
    setVouchers(response.data.data);
  }

  useEffect(()=>{
    if(isFocused){
      loadVoucher();
    }
  },[isFocused]);

  async function handleDelet(id){
    api.defaults.headers.Authorization = `Bearer ${token}`;
    const response = await api.delete(`/v1/Cartoes/${id}`);
    console.log(response.data);

    setCartoes(
      vouchers.filter(voucher =>voucher.id !== id)
    );
  }

  async function addVoucher(){
    if(codigo === null || codigo === undefined || codigo === ''){
      Alert.alert('Campo obrigatório','É necessário informar o código do voucher!');
    }else{
      Alert.alert('Alerta de testes :D','Funcionalidade ainda não implementada!');
    }
  }

  function useVoucher(id){
    console.log(id);
  }

  return (
    <Background>
        <Container>
            <Title>Vouchers Cadastrados</Title>
            <Form>
              <FormInput 
                icon="confirmation-number"
                keyboardCorrect={false}
                autoCapitalize="none"
                placeholder="Código do Voucher"
                returnKeyType="next"
                value={codigo}
                onChangeText={setCodigo}
              />
              <AddButton onPress={() => addVoucher()}>
                +
              </AddButton>
            </Form>
            <List
                data={vouchers}
                keyExtractor={item=>String(item.id)}
                renderItem={({ item }) => <Vouchers onCancel={()=> useVoucher(item.id)} data={item}/> }
            />
            <SubmitButton onPress={() => navigation.navigate('Maquina')}>
              Voltar
            </SubmitButton>
        </Container>
    </Background>
  );
}

Voucher.navigationOptions = {
  tabBarLabel: 'Meus Vouchers',
  tabBarIcon: ({tintColor}) => (
    <Icon name="confirmation-number" size={20} color={tintColor}/>
  ),
}

export default withNavigationFocus(Voucher)
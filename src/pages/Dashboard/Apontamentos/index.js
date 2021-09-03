import React, { useEffect,useState } from 'react';
import { Image,ScrollView } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import Background from '../../../components/Background';
import logo from '../../../assets/img/logo-sl-cafes.png';
import Cards from '../../../components/Cards';
import { Container, Form, SubmitButton,Title,List } from './styles';

export default function Apontamentos({ navigation }) {
  const [listApontamentos,setListApontamentos] = useState([{
    id: 'xpto',
    data: '30/08/2021 03:05',
    login: 'leandro.brito',
    tipo: 'Maquina'
  }]);

  
  return (
    <Background>
      <Container>
        <Image source={logo}/>
        <Form>
          <ScrollView>
              <Title>Apontamentos Cadastrados</Title>
              <List
                data={listApontamentos}
                keyExtractor={item=>String(item.id)}
                renderItem={({ item }) => <Cards  onNavigate={()=>navigation.navigate("Apontamento",{apontamento: item})} onCancel={()=> confirmDelete(item.id)} data={item}/> }
              />
              <SubmitButton onPress={()=> navigation.navigate('Inicial')}>
                Voltar
              </SubmitButton>
          </ScrollView>
        </Form>
      </Container>
    </Background>
  );
}

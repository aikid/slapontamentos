import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Image,ScrollView,Text } from 'react-native';
import Background from '../../../components/Background';
import logo from '../../../assets/img/logo-2btech.png';
import api from '../../../services/api';
import Produtos from '../../../components/Produtos';
import { Container, Form, SubmitButton,Intro, List,Title } from './styles';

export default function Apontamento({ navigation }) {
  const apontamentoData = navigation.getParam('apontamento');
  const token = useSelector(state=> state.auth.token);
  const [inventario, setInventario] = useState([]);

  console.log('Dados do apontamento: ', apontamentoData);
  function getTipo(type){
    let tipo = '';
    switch(type){
      case 1:
        tipo = 'Maquina';
      break;
      case 2:
          tipo = 'Depósito';
      break;
      case 3:
          tipo = 'Expedição';
      break;
      case 4:
          tipo = 'Recebimento';
      break;
      case 10:
          tipo = 'Outros';
      break;
    }
    return tipo;
  }

  useEffect(()=>{
    getItens();
  },[]);

  async function getItens(){
    let inventario_lista = [];
    api.defaults.headers.Authorization = `Bearer ${token}`;
    const response = await api.get('/api/v1/inventario/'+apontamentoData.id);
    if(response.data.Items.length > 0){
      for (let i = 0; i < response.data.Items.length; i++){
        inventario_lista.push({
          id: response.data.Items[i].Id, 
          codigoProduto: response.data.Items[i].CodigoProduto,
          numeroSelecao: response.data.Items[i].NumeroSelecao, 
          nomeProduto: response.data.Items[i].NomeProduto,
          quantidade: response.data.Items[i].Quantidade,
        });
      }
    }
    setInventario(inventario_lista);
  }

  return (
    <Background>
      <Container>
        <Image source={logo}/>
        <Form>
          <ScrollView>
            <Text>Tipo: {getTipo(apontamentoData.tipo)}</Text>
            <Text>Data: {apontamentoData.data}</Text>
            <Title>Itens Cadastrados</Title>
            <ScrollView style={{height: 300}}>
              <List
                data={inventario}
                keyExtractor={item=>String(item.id)}
                renderItem={({ item }) => <Produtos onCancel={()=> null} data={item}/> }
              />
            </ScrollView>
            <SubmitButton onPress={()=>navigation.navigate("ApontamentoItem",{apontamentoData:apontamentoData})}>
              Adicionar Itens
            </SubmitButton>
            <SubmitButton onPress={()=>navigation.navigate("Apontamentos")}>
              Voltar
            </SubmitButton>
          </ScrollView>
        </Form>
      </Container>
    </Background>
  );
}

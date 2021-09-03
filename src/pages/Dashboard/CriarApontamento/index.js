import React, { useState,useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Image,ScrollView,Picker,Text,View,Alert } from 'react-native';
import { AutocompleteDropdown } from 'react-native-autocomplete-dropdown'
import Background from '../../../components/Background';
import logo from '../../../assets/img/logo-sl-cafes.png';
import { Container, Form, FormInput, SubmitButton,Intro } from './styles';
import api from '../../../services/api';
import moment from "moment";
import 'moment/locale/pt-br';

export default function CriarApontamento({ navigation }) {
   const dataAgora =  moment().format('DD/M/YYYY HH:mm');
   const [tipo,setTipo] = useState('1');
   const [dataInventario,setDataInventario] = useState(dataAgora);
   const [loading, setLoading] = useState(false)
   const [dataMatricula, setDataMatricula] = useState([]);
   const [dataDeposito, setDataDeposito] = useState([]);
   const [dataMatriculas, setDataMatriculas] = useState([]);
   const [dataDepositos, setDataDepositos] = useState([]);
   const [matricula,setMatricula] = useState('');
   const [maquinaId,setMaquinaId] = useState('');
   const [modeloMaquina,setModeloMaquina] = useState('');
   const [codigoDeposito,setCodigoDeposito] = useState('');
   const [nomeDeposito,setNomeDeposito] = useState('');
   const token = useSelector(state=> state.auth.token);
   api.defaults.headers.Authorization = `Bearer ${token}`;

  async function getMatricula(text){
    console.log(text);
    let matriculas_lista = [];
    if(text.length >= 3){
      setLoading(true);
      api.defaults.headers.Authorization = `Bearer ${token}`;
      const response = await api.get('/api/v1/maquina?q='+text);
      setDataMatriculas(response.data.List);
      for (let i = 0; i < response.data.List.length; i++ ){
        matriculas_lista.push({id: response.data.List[i].Id, title: response.data.List[i].Descricao});
      }
      setDataMatricula(matriculas_lista);
      setLoading(false);
    }
  }

  async function getDeposito(text){
    let deposito_lista = [];
    if(text.length >= 3){
      setLoading(true);
      const response = await api.get('/api/v1/deposito?q='+text);
      setDataDepositos(response.data.List);
      for (let i = 0; i < response.data.List.length; i++ ){
        deposito_lista.push({id: response.data.List[i].Id, title: response.data.List[i].Descricao});
      }
      setDataDeposito(deposito_lista);
      setLoading(false);
    }
  }

  function setDataMatriculaField(item){
    const matriculaFiltered = dataMatriculas.filter(function (el) {
      return el.Id == item.id;
    });
    setMatricula(matriculaFiltered[0].Matricula);
    setMaquinaId(item.id);
    setModeloMaquina(item.title);
  }

  function setDataDepositoField(item){
    const depositoFiltered = dataDepositos.filter(function (el) {
      return el.Id == item.id;
    });
    console.log(depositoFiltered);
    setCodigoDeposito(depositoFiltered[0].Codigo);
    setCodigoDeposito(item.id);
    setNomeDeposito(item.title);
  }

  async function handleSubmit(){
        console.log('Data do Inventário: ',dataInventario);
        console.log('Tipo de Apontamento: ',tipo);
        console.log('Id da Máquina: ',maquinaId);
        console.log('Matricula da Máquina: ',matricula);
        console.log('Modelo da Máquina: ',modeloMaquina);
        const params = new URLSearchParams();
        params.append('dataInventario', dataInventario);
        params.append('tipo', tipo);
        params.append('maquinaId', maquinaId);
        params.append('matricula', matricula);
        params.append('modeloMaquina', modeloMaquina);

        const response = await api.post('/api/v1/inventario',params);
        console.log(response.data);
  }
  
  return (
    <Background>
      <Container>
        <Image source={logo}/>
        <Form>
          <ScrollView>
          <Intro>Adicionar Apontamento</Intro>
          <Picker
              selectedValue={tipo}
              style={{backgroundColor:'rgba(0,0,0,0.1)',marginBottom:10,height: 44, color: '#fff'}}
              itemStyle={{height: 44}}
              onValueChange={setTipo}>
              <Picker.Item label="Maquina" value="1" />
              <Picker.Item label="Deposito" value="2" />
            </Picker>
            <FormInput 
              icon={'event'}
              keyboardCorrect={false}
              autoCapitalize="none"
              placeholder="Data do Inventário"
              value={dataInventario}
              onChangeText={setDataInventario}
            />
            
            {tipo == '1' && 
                <AutocompleteDropdown
                    clearOnFocus={false}
                    closeOnBlur={true}
                    closeOnSubmit={false}
                    onSelectItem={(item) => {
                      item && setDataMatriculaField(item)
                    }}
                    onChangeText={getMatricula}
                    dataSet={dataMatricula}
                    debounce={600}
                    loading={loading}
                    useFilter={false}
                    textInputProps={{
                      placeholder: "Digite a Matrícula",
                      autoCorrect: false,
                      autoCapitalize: "none",
                      style: {
                        backgroundColor: "rgba(0,0,0,0.1)",
                        color: "#fff",
                        paddingLeft: 18,
                        marginBottom: 10,
                      }
                    }}
                  />
            }
            
            
            {tipo == '2' &&
                <AutocompleteDropdown
                  clearOnFocus={false}
                  closeOnBlur={true}
                  closeOnSubmit={false}
                  onSelectItem={(item) => {
                    item && setDataDepositoField(item)
                  }}
                  onChangeText={getDeposito}
                  dataSet={dataDeposito}
                  debounce={600}
                  loading={loading}
                  useFilter={false}
                  textInputProps={{
                    placeholder: "Digite a Matrícula",
                    autoCorrect: false,
                    autoCapitalize: "none",
                    style: {
                      backgroundColor: "rgba(0,0,0,0.1)",
                      color: "#fff",
                      paddingLeft: 18,
                      marginBottom: 10,
                    }
                  }}
                />
            }
            
            <SubmitButton onPress={handleSubmit}>
              Adicionar
            </SubmitButton>
            <SubmitButton onPress={()=>navigation.navigate("Inicial")}>
              Voltar
            </SubmitButton>
          </ScrollView>
        </Form>
      </Container>
    </Background>
  );
}
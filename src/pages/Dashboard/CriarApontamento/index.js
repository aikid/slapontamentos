import React, { useState,useEffect,useRef } from 'react';
import { useSelector } from 'react-redux';
import { Image,ScrollView,Picker,Text,View,Alert } from 'react-native';
import { AutocompleteDropdown } from 'react-native-autocomplete-dropdown';
import { RNCamera } from 'react-native-camera';
import Background from '../../../components/Background';
import logo from '../../../assets/img/logo-sl-cafes.png';
import { Container, Form, FormInput, SubmitButton,Intro,IconTouch } from './styles';
import useLocation from '../../../hooks/useLocation';
import api from '../../../services/api';
import moment from "moment";
import 'moment/locale/pt-br';

export default function CriarApontamento({ navigation }) {
   const cameraRef = useRef();
   const dataAgora =  moment().format('DD/M/YYYY HH:mm');
   const dataAtual =  moment().format('YYYY-MM-DDTHH:mm:ss');
   const [tipo,setTipo] = useState('1');
   const [dataInventario,setDataInventario] = useState(dataAgora);
   const [loading, setLoading] = useState(false);
   const [activeCamera, setActiveCamera] = useState(false);
   const [dataMatricula, setDataMatricula] = useState([]);
   const [dataDeposito, setDataDeposito] = useState([]);
   const [dataMatriculas, setDataMatriculas] = useState([]);
   const [dataDepositos, setDataDepositos] = useState([]);
   const [items, setItems] = useState([]);
   const [apontamento, setApontamento] = useState('');
   const [matricula,setMatricula] = useState('');
   const [maquinaId,setMaquinaId] = useState('');
   const [chapa,setChapa] = useState('');
   const [modeloMaquina,setModeloMaquina] = useState('');
   const [depositoId,setDepositoId] = useState('');
   const [codigoDeposito,setCodigoDeposito] = useState('');
   const [nomeDeposito,setNomeDeposito] = useState('');
   const [codigo, setCodigo] = useState('');
   const token = useSelector(state=> state.auth.token);
   api.defaults.headers.Authorization = `Bearer ${token}`;
   const { coords, errorMsg } = useLocation();

   useEffect(()=>{
    if(apontamento && apontamento.id) navigation.navigate("Apontamento",{apontamento: apontamento});
   },[apontamento]);

  async function getMatricula(text){
    console.log(text);
    let matriculas_lista = [];
    if(text.length >= 3){
      setLoading(true);
      api.defaults.headers.Authorization = `Bearer ${token}`;
      const response = await api.get('/api/v1/maquina?q='+text);
      setDataMatriculas(response.data.List);
      for (let i = 0; i < response.data.List.length; i++ ){
        matriculas_lista.push({id: response.data.List[i].Id, title: response.data.List[i].Matricula +" - "+response.data.List[i].Descricao});
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
        deposito_lista.push({id: response.data.List[i].Id, title: response.data.List[i].Codigo +" - " + response.data.List[i].Descricao});
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
    setModeloMaquina(matriculaFiltered[0].Descricao);
  }

  function setDataDepositoField(item){
    const depositoFiltered = dataDepositos.filter(function (el) {
      return el.Id == item.id;
    });
    console.log(depositoFiltered);
    setCodigoDeposito(depositoFiltered[0].Codigo);
    setDepositoId(item.id);
    setNomeDeposito(depositoFiltered[0].Descricao);
  }

  async function handleSubmit(){
        try{
          api.defaults.headers.Authorization = `Bearer ${token}`;
          const response = await api.post('/api/v1/inventario', {
            dataInventario:dataAtual,
            tipo,
            maquinaId,
            matricula,
            modeloMaquina,
            depositoId,
            codigoDeposito,
            nomeDeposito,
            items,
            latitude: coords.latitude,
            longitude: coords.longitude 
        });
          console.log(response.data);
          console.log(response.data.Data);
          if(response.data.Data){
           let apontamento_data = {
              id: response.data.Data.Id, 
              data: response.data.Data.DataInventario,
              login: response.data.Data.LoginRegistro, 
              tipo: response.data.Data.Tipo,
              matricula: response.data.Data.Matricula,
            };
            setApontamento(apontamento_data);
          }
          
        }catch(error){
          console.log(error);
          Alert.alert('Falha ao cadastrar o apontamento', error.response);
        }
        
  }
  
  return (
    <Background>
      <Container>
        <Image source={logo}/>
        <>
        {!activeCamera && 
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
                <Picker.Item label="Expedição" value="3" />
                <Picker.Item label="Recebimento" value="4" />
                <Picker.Item label="Outro" value="5" />
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
                      closeOnBlur={false}
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
                      containerStyle={{ flexGrow: 1, flexShrink: 1 }}
                      showClear={false}
                    />
              }
              
              
              {tipo == '2' &&
                  <AutocompleteDropdown
                    clearOnFocus={false}
                    closeOnBlur={false}
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
                      placeholder: "Digite o Código",
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

              {tipo == '3' &&
                <>
                  <FormInput 
                    icon={'archive'}
                    keyboardCorrect={false}
                    autoCapitalize="none"
                    placeholder="Código"
                    value={codigo}
                    onChangeText={setCodigo}
                  />
                  {/* <IconTouch name={'camera'} size={20} onPress={()=>setActiveCamera(true)}/> */}
                </>
              }

              {tipo == '4' &&
                <>
                  <FormInput
                    icon={'archive'} 
                    keyboardCorrect={false}
                    autoCapitalize="none"
                    placeholder="Código"
                    value={codigo}
                    onChangeText={setCodigo}
                  />
                  {/* <IconTouch name={'camera'} size={20} onPress={()=>setActiveCamera(true)}/> */}
                </>
              }

              {tipo == '5' &&
                <>
                  <FormInput
                    icon={'archive'} 
                    keyboardCorrect={false}
                    autoCapitalize="none"
                    placeholder="Código"
                    value={codigo}
                    onChangeText={setCodigo}
                  />
                  {/* <IconTouch name={'camera'} size={20} onPress={()=>setActiveCamera(true)}/> */}
                </>
              }
              
              <SubmitButton onPress={handleSubmit}>
                Adicionar
              </SubmitButton>
              <SubmitButton onPress={()=>navigation.navigate("Inicial")}>
                Voltar
              </SubmitButton>
            </ScrollView>
          </Form>
        }
        {activeCamera &&

          <RNCamera
                ref={camera => { cameraRef }}
                captureAudio={false}
                style={{flex: 1,justifyContent: 'flex-end',alignItems: 'center', width: 10}}
                type={RNCamera.Constants.Type.back}
                autoFocus={RNCamera.Constants.AutoFocus.on}
                flashMode={RNCamera.Constants.FlashMode.off}
                androidCameraPermissionOptions={{
                  title: 'Permission to use camera',
                  message: 'We need your permission to use your camera',
                  buttonPositive: 'Ok',
                  buttonNegative: 'Cancel',
                }}
                onGoogleVisionBarcodesDetected={({ barcodes }) => {
                  if(barcodes[0].rawData !== null && barcodes[0].rawData !== undefined){
                    if(barcodes[0].rawData.length >= 8 && barcodes[0].rawData.length <= 20){
                      setChapa(barcodes[0].rawData);
                      setActiveCamera(false);
                    }
                  }
                }}
              />
        }
        </>
      </Container>
    </Background>
  );
}
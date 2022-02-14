import React, { useState,useEffect,useRef } from 'react';
import { useSelector } from 'react-redux';
import { Image,Alert } from 'react-native';
import { RNCamera } from 'react-native-camera';
import Background from '../../../components/Background';
import logo from '../../../assets/img/logo-2btech.png';
import { Container,SubmitButton } from './styles';
import useLocation from '../../../hooks/useLocation';
import api from '../../../services/api';
import moment from "moment";
import 'moment/locale/pt-br';

export default function EscanearApontamento({ navigation }) {
   const cameraRef = useRef();
   const dataAtual =  moment().format('YYYY-MM-DDTHH:mm:ss');
   const [apontamento, setApontamento] = useState('');
   const token = useSelector(state=> state.auth.token);
   api.defaults.headers.Authorization = `Bearer ${token}`;
   const coords = navigation.getParam('coords');
   console.log('Dados de cordenada: ', coords);

   useEffect(()=>{
    if(apontamento && apontamento.id) navigation.navigate("Apontamento",{apontamento: apontamento});
   },[apontamento]);

  async function handleSubmit(apontamento){
        try{
          api.defaults.headers.Authorization = `Bearer ${token}`;
          const response = await api.post('/api/v1/inventario', {
            dataInventario:dataAtual,
            tipo:apontamento.tipo || null,
            maquinaId: apontamento.maquinaId || null,
            matricula:  apontamento.matricula || null,
            modeloMaquina:  apontamento.modeloMaquina || null,
            depositoId:  apontamento.depositoId || null,
            codigoDeposito:  apontamento.codigoDeposito || null,
            nomeDeposito: apontamento.nomeDeposito || null,
            items: apontamento.items || null,
            latitude: coords?.latitude || 0,
            longitude: coords?.longitude || 0 
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

  function chechJsonData(rawData){
    const apontamento = JSON.parse(rawData);
    if(apontamento.tipo && apontamento.tipo !== ''){
      handleSubmit(apontamento);
    }
  }
  
  return (
    <Background>
      <Container>
        <Image source={logo}/>
          <RNCamera
                ref={camera => { cameraRef }}
                captureAudio={false}
                style={{width: '90%', height: '65%'}}
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
                  chechJsonData(barcodes[0].rawData);
                }}
          />
          <SubmitButton onPress={()=>navigation.navigate("Inicial")}>
            Voltar
          </SubmitButton>
      </Container>
    </Background>
  );
}
import React, { useState,useEffect,useRef } from 'react';
import { useSelector } from 'react-redux';
import { Image,ScrollView,Alert } from 'react-native';
import Background from '../../../components/Background';
import logo from '../../../assets/img/logo-sl-cafes.png';
import { AutocompleteDropdown } from 'react-native-autocomplete-dropdown';
import { RNCamera } from 'react-native-camera';
import api from '../../../services/api';
import { Container, Form, FormInput, SubmitButton,Intro,IconTouch } from './styles';

export default function Apontamento({ navigation }) {
   const cameraRef = useRef();
   const apontamentoData = navigation.getParam('apontamentoData');
   const [codigoProduto,setCodigoProduto] = useState('');
   const [nomeProduto,setNomeProduto] = useState('');
   const [produtoId,setProdutoId] = useState('');
   const [quantidade,setQuantidade] = useState('');
   const [numeroSelecao,setNumeroSelecao] = useState('');
   const [loading, setLoading] = useState(false);
   const [dataProduto, setDataProduto] = useState([]);
   const [dataProdutos, setDataProdutos] = useState([]);
   const [codigoChave, setCodigoChave]  = useState('');
   const [activeCamera, setActiveCamera] = useState(false);
   const token = useSelector(state=> state.auth.token);
   api.defaults.headers.Authorization = `Bearer ${token}`;

   useEffect(()=>{
      switch(apontamentoData.tipo){
        case 3:
          getProduto('EXP001');
        break;
        case 4:
          getProduto('REC001');
        break;
        case 5:
          getProduto('OUT001');
        break;
      }
   },[])

   async function getProduto(text){
    console.log(text);
    let matriculas_lista = [];
    if(text.length >= 3){
      setLoading(true);
      api.defaults.headers.Authorization = `Bearer ${token}`;
      const response = await api.get('/api/v1/produto?q='+text);
      setDataProdutos(response.data.List);
      for (let i = 0; i < response.data.List.length; i++ ){
        matriculas_lista.push({id: response.data.List[i].Id, title: response.data.List[i].Codigo+" - "+response.data.List[i].Descricao});
      }
      setDataProduto(matriculas_lista);
      setLoading(false);
    }
  }

  function setDataProdutoField(item){
    const produtoFiltered = dataProdutos.filter(function (el) {
      return el.Id == item.id;
    });
    setCodigoProduto(produtoFiltered[0].Codigo);
    setProdutoId(item.id);
    setNomeProduto(item.title);
  }
  

    async function handleSubmit(){
      try {
        api.defaults.headers.Authorization = `Bearer ${token}`;
        const response = await api.post('/api/v1/inventario/'+apontamentoData.id+'/item', {
          inventarioId: apontamentoData.id,
          produtoId,
          codigoProduto,
          nomeProduto,
          quantidade,
          numeroSelecao,
          CodigoChave: codigoChave,
        });
        if(!response.data) navigation.navigate("Apontamento",{apontamento: apontamentoData});
      }catch(error){
        console.log(error);
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
            <Intro>Adicionar Item</Intro>

              <AutocompleteDropdown
                      clearOnFocus={false}
                      closeOnBlur={false}
                      closeOnSubmit={false}
                      onSelectItem={(item) => {
                        item && setDataProdutoField(item)
                      }}
                      onChangeText={getProduto}
                      dataSet={dataProduto}
                      debounce={600}
                      loading={loading}
                      useFilter={false}
                      textInputProps={{
                        placeholder: "Digite o código do produto",
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
              <FormInput 
                icon={'filter-1'}
                keyboardCorrect={false}
                autoCapitalize="none"
                placeholder="Quantidade"
                value={quantidade}
                onChangeText={setQuantidade}
              />
              <>
                <FormInput
                    keyboardCorrect={false}
                    autoCapitalize="none"
                    placeholder="Chave (Clique no ícone para escanear)"
                    value={codigoChave}
                    onChangeText={setCodigoChave}
                  />
                <IconTouch name={'camera'} size={30} onPress={()=>setActiveCamera(true)}/>
              </>
              {apontamentoData.tipo == 1 && 
                  <FormInput 
                    icon={'filter-1'}
                    keyboardCorrect={false}
                    autoCapitalize="none"
                    placeholder="Seleção"
                    value={numeroSelecao}
                    onChangeText={setNumeroSelecao}
                  />
              }
              <SubmitButton onPress={handleSubmit}>
                Adicionar
              </SubmitButton>
              <SubmitButton onPress={()=>navigation.navigate("Apontamentos")}>
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
                onBarCodeRead={(barcodes) => {
                  if(barcodes.data !== null && barcodes.data !== undefined){
                      setCodigoChave(barcodes.data);
                      setActiveCamera(false);
                   }
                  }
                }
              />
        }
      </>
      </Container>
    </Background>
  );
}

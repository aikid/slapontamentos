import React, { Component } from 'react';
import { connect } from 'react-redux';
import { StyleSheet,Alert,Image,Text, TouchableOpacity, View, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Background from '../../../components/Background';
import { RNCamera } from 'react-native-camera';
import logo from '../../../assets/img/logo-pilao.png';
import { Container, Intro, Form, SubmitButton } from './styles';
import api from '../../../services/api';

class Maquina extends Component{

  constructor() {
    super();
  }

  state = {
    scan:false,
    maquina: [],
  };

  componentDidMount() {
    if(this.props.user !== null && this.props.user !== undefined){
      const hora = new Date(this.props.user.datelog);
      const horagora = new Date();
      console.log(horagora.getTime() - hora.getTime());
      if(horagora.getTime() - hora.getTime() > 3600000){
        if(this.props.user.password !== null && this.props.user.password !== undefined){
          this.props.navigation.navigate('SignIn');
        }
      }
    }
  }
  
  handleScan = () =>{
    //dispatch(signUpRequest(nomeCompleto, email, telefone, password, confirmPassword));
  }

  startScan = () =>{
    this.setState({scan:true});
    console.log(this.state.scan);
  }

  closeScan = () =>{
    this.setState({scan:false});
    console.log(this.state.scan);
  }

  async connectMachineNow(barcodes){
    console.warn(barcodes);
    this.setState({scan:false});
    //Alert.alert('QrCode Detectado', barcodes[0].rawData);
    const matricula = barcodes[0].rawData;
    const response = await api.get('/v1/Maquinas/'+matricula);
    console.log(response.data);
    this.setState({maquina:[response.data.data]});
    //console.log(this.state.maquina[0].matricula);
    let dadosMaquina = this.state.maquina[0];
    this.props.navigation.navigate('Buy',{dadosMaquina});
    // if(this.state.maquina[0].matricula){
    //   let dadosMaquina = this.state.maquina[0];
    //   this.props.navigation.navigate('Buy',{dadosMaquina});
    // }else{
    //   Alert.alert('Erro Detectado', 'Módulo não encontrado para se comunicar com a máquina!');
    // }
  }

  async connectMachine(barcodes){
    let dado = '';
    if(barcodes.length >= 8 && barcodes.length <= 20){
      //Alert.alert('Aviso do Scan', 'Dado recuperado pelo QrCode: '+dado);
      console.warn(barcodes);
      this.setState({scan:false});
      const matricula = barcodes;
      if(matricula !== null && matricula !== undefined){
        console.log(matricula);
        const response = await api.get('/v1/Maquinas/'+matricula);
        console.log(response.data);
        this.setState({maquina:[response.data.data]});
        let dadosMaquina = this.state.maquina[0];
        
        //setTimeout(()=>{ Alert.alert('Erro ao Escanear!', JSON.stringify(dadosMaquina))}, 5000);
        this.props.navigation.navigate('Buy',{dadosMaquina});
      }else{
        Alert.alert('Aviso do Scan', 'Máquina não encontrada tente novamente');
      }
    }
  }

  // async connectMachine(barcodes){
  //   let dado = '';
  //   if(barcodes !== null && barcodes !== undefined){
  //     dado = barcodes;
  //   }else{
  //     dado = 'Dado nulo indefinido';
  //   }
  //   //Alert.alert('Aviso do Scan', 'Dado recuperado pelo QrCode: '+dado);
  //   console.warn(barcodes);
  //   this.setState({scan:false});
  //   const matricula = barcodes;
  //   if(matricula !== null && matricula !== undefined){
  //     console.log(matricula);
  //     const response = await api.get('/v1/Maquinas/'+matricula);
  //     console.log(response.data);
  //     this.setState({maquina:[response.data.data]});
  //     let dadosMaquina = this.state.maquina[0];
      
  //     //setTimeout(()=>{ Alert.alert('Erro ao Escanear!', JSON.stringify(dadosMaquina))}, 5000);
  //     this.props.navigation.navigate('Buy',{dadosMaquina});
  //   }else{
  //     Alert.alert('Aviso do Scan', 'Máquina não encontrada tente novamente');
  //   }
  // }
  render(){
    return (
      <Background>         
            {this.state.scan &&
              <>
              <RNCamera
                ref={camera => { this.camera = camera }}
                captureAudio={false}
                style = {styles.preview}
                type={RNCamera.Constants.Type.back}
                autoFocus={RNCamera.Constants.AutoFocus.on}
                flashMode={RNCamera.Constants.FlashMode.off}
                permissionDialogTitle={'Permission to use camera'}
                permissionDialogMessage={'We need your permission to use your camera phone'}
                onGoogleVisionBarcodesDetected={({ barcodes }) => {
                  console.log(barcodes[0].rawData);
                  if(barcodes[0].rawData !== null && barcodes[0].rawData !== undefined){
                    this.connectMachine(barcodes[0].rawData);
                  }
                }}
                // onBarCodeRead={
                //   this.connectMachine.bind(this)
                // }
              />
              <View style={styles.buttonContainer}>
                <TouchableOpacity onPress={this.closeScan} style={styles.capture}>
                  <Text style={styles.buttonText}> Cancelar Scan </Text>
                </TouchableOpacity>
              </View>
              </>
            }
            {!this.state.scan &&
              <Container> 
                <Image source={logo} />
                <Form>
                  <ScrollView>
                    <Intro>Escanear o QrCode presente na máquina para iniciar uma compra.</Intro>
                    <SubmitButton onPress={this.startScan}>
                      Escanear Produtoss
                    </SubmitButton>
                    {/* <SubmitButton onPress={() => this.props.navigation.navigate('Bluetooth')}>
                      Escanear Perifericos
                    </SubmitButton> */}
                    <SubmitButton onPress={() => this.props.navigation.navigate('Compras')}>
                      Histórico de Compras
                    </SubmitButton>
                    <SubmitButton onPress={() => this.props.navigation.navigate('Cartoes')}>
                      Meus Cartões
                    </SubmitButton>
                    <SubmitButton onPress={() => this.props.navigation.navigate('Voucher')}>
                      Meus Vouchers
                    </SubmitButton>
                    <SubmitButton onPress={() => this.props.navigation.navigate('Perfil')}>
                      Meu Perfil
                    </SubmitButton>
                  </ScrollView>
                </Form>
              </Container>
            }
      </Background>
    );
  }
}

Maquina.navigationOptions = ({ navigation }) => ({
  title: 'Comprar',
  headerLeft:() =>(
    <TouchableOpacity
      onPress={() => {
        navigation.navigate('Perfil');
      }}
    >
    <Icon name="chevron-left" size={20} color="#FFF"/>
    </TouchableOpacity>
  ),
});

const styles = StyleSheet.create({
  preview: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center"
  },
  buttonContainer: {
    flex: 0,
    flexDirection: "row",
    justifyContent: "center"
  },
  capture: {
    flex: 0,
    backgroundColor: "#fff",
    borderRadius: 5,
    padding: 15,
    paddingHorizontal: 20,
    alignSelf: "center",
    margin: 20
  },
  buttonText: {
    fontSize: 14
  }
});

const mapStateToProps = state => ({
  user: state.user.profile
});

export default connect(mapStateToProps)(Maquina);
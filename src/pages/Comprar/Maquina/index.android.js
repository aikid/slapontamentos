import React, { Component } from 'react';
import { connect } from 'react-redux';
import { StyleSheet,Alert,Image,Text, TouchableOpacity, View, ScrollView,Modal } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Background from '../../../components/Background';
import Produtos from '../../../components/Produtos';
import { RNCamera } from 'react-native-camera';
import logo from '../../../assets/img/logo-pilao.png';
import { Container, Intro, Form, SubmitButton,ModalView,OpenButton,CenteredView,ModalTitle,ButtonTitle,GroupLinks,List,FormModal } from './styles';
import api from '../../../services/api';

class Maquina extends Component{

  constructor() {
    super();
    this.produtos = [];
  }

  state = {
    scan:false,
    modalVisible: false,
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

  startScan = () =>{
    this.setState({scan:true});
    console.log(this.state.scan);
  }

  closeScan = () =>{
    this.setState({scan:false});
    console.log(this.state.scan);
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

  async searchProduct(barcodes){
    //console.warn(barcodes);
    let dado = '';
    let infoProduto = {};
    if(barcodes.length >= 1 && barcodes.length <= 20){
     dado = barcodes;
     Alert.alert('Aviso do Scan', 'Dado recuperado pelo código de barras: '+dado);
     infoProduto.id = 1;
     infoProduto.codigo = barcodes;
     infoProduto.nome = 'Produto de Testes';
     infoProduto.preco = 3;
     this.produtos.push(infoProduto);
     console.log(this.produtos);
      //this.setState({scan:false});
     // const matricula = barcodes;
      //if(matricula !== null && matricula !== undefined){
        //console.log(matricula);
        //const response = await api.get('/v1/Maquinas/'+matricula);
        //console.log(response.data);
        //this.setState({maquina:[response.data.data]});
        //let dadosProduto = this.state.maquina[0];
        //setTimeout(()=>{ Alert.alert('Dados Recebidos da API', JSON.stringify(dadosMaquina))}, 5000);
      //}else{
        //Alert.alert('Aviso do Scan', 'Máquina não encontrada tente novamente');
      //}
    }
  }

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
                  //console.log(barcodes[0].rawData);
                  if(barcodes[0].rawData !== null && barcodes[0].rawData !== undefined){
                    this.searchProduct(barcodes[0].rawData);
                    //this.connectMachine(barcodes[0].rawData);
                  }
                }}
              />
              <View style={styles.buttonContainer}>
                <TouchableOpacity onPress={() => {this.setState({modalVisible:true})}} style={styles.capture}>
                  <Text style={styles.buttonText}> Ver Carrinho </Text>
                </TouchableOpacity>
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
                    <Intro>Escaneie o código de barras presente nos produtos para efetuar uma compra.</Intro>
                    <SubmitButton onPress={this.startScan}>
                      Escanear Produtos
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
                <Modal
                    animationType="slide"
                    visible={this.state.modalVisible}
                    onRequestClose={() => {
                    Alert.alert("Modal has been closed.");
                    }}
                >
                  <CenteredView>
                      <ModalView>
                          <ModalTitle>Produtos do Carrinho</ModalTitle>
                              <List
                                  data={this.produtos}
                                  keyExtractor={item=>String(item.id)}
                                  renderItem={({ item }) => <Produtos onCancel={()=> console.log('oi')} data={item}/> }
                              />
                              <OpenButton
                                  onPress={()=>{
                                    this.setState({modalVisible:false})
                                  }}
                              >
                              <ButtonTitle>Finalizar Compra</ButtonTitle>
                              </OpenButton>
                              <OpenButton
                                  onPress={() => {
                                      this.setState({modalVisible:false})
                                  }}
                              >
                              <ButtonTitle>Fechar</ButtonTitle>
                              </OpenButton>
                      </ModalView>
                  </CenteredView>
                </Modal>
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
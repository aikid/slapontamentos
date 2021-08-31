import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Platform,Modal,View,StyleSheet,TouchableHighlight,Keyboard,Alert,Image,TouchableOpacity,Picker,ScrollView,BackHandler } from 'react-native';
import { Container, Title, Form, FormInput, SubmitButton,SignLink,SignLinkText,MaskInput,CenteredView,ModalView,OpenButton,ModalTitle,ButtonTitle,GroupLinks,List,FormModal } from './styles';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Background from '../../components/Background';
import Cards from '../../components/Cards';
import Vouchers from '../../components/Vouchers';
import api from '../../services/api';
import logo from '../../assets/img/logo-pilao.png';
import ProgressLoader from 'rn-progress-loader';
import { BleManager } from 'react-native-ble-plx';
import { Buffer } from 'buffer';
import {check,request, PERMISSIONS, RESULTS} from 'react-native-permissions';
import { withNavigation } from 'react-navigation';

class Buy extends Component{

    constructor(){
        super();
	    this.isConnecting = false;
        this.initUUID();
        this.manager = new BleManager();
        this.macAddress = '';
        this.iniProdutos();
        this.iniCartoes();
        this.initVouchers();
        this.deviceMap = new Map();
        this.textMachine = 'Conectando com a Máquina';
        this.nomePlaca = 'PILAO';
        this.manufacturerData = 'nw6IoODlz3krjQ==';
        this.tentativas = 5;
        this.comandosessionClose = '<SESSIONCLOSE>';
        this.temProcesso = false;
        this.mostrarCPF = false;
        this.sistema = '';
        this.versaoSistema = '';
        this.estaComprando = false;
        this.cartaoNovo = [];
        this.voucherUsado = [];
    }

    state = {
        macAddress: '',
        conected: false,
        scaning:false,
        visible: false,
        finished: false,
        buy: false,
        message:'',
        messages:[],
        data:[],
        produto: '',
        preco: '',
        credito: '',
        selecao: '',
        maquina: '',
        cartao: '',
        autorizadora: '',
        codigoDeSeguraca: '',
        cpf: '',
        portador: '',
        entidadeid: '',
        externalId: '',
        IdCompra: '',
        fase:'',
        existCartao: false,
        modalVisible: false,
        modalvoucherVisible:false,
        novaautorizadora:'',
        novonumero: '',
        novomes: '',
        novoano: '',
        novocodigo: '',
        novotitular: '',
        novocpf: '',
        codigoVoucher: '',
        valorVoucher: '',
        valorDesconto:0,
        existeProduto: false,
        precoExibido: '',
        bluetoothInit: 'E0:E5:CF:79:2B:8D',
        statusPedido: '',
    };

    iniProdutos(){
        this.produtos = [];
    }

    iniCartoes(){
        this.cartoes = [];
    }

    initVouchers(){
        this.vouchers = [];
    }

    async loadCard(){
        api.defaults.headers.Authorization = `Bearer ${this.props.token}`;
        const response = await api.get('/v1/Cartoes');
        this.cartoes = response.data.data;
        console.log(this.cartoes);
    }

    async loadVouchers(){
        let vouchersAll = [];
        let vouchersAtivos = [];
        let indice = 0;
        api.defaults.headers.Authorization = `Bearer ${this.props.token}`;
        const response = await api.get('/v1/vouchers');
        vouchersAll = response.data.data;
        vouchersAll.map(item=>{
            if(item.statusVoucher == 1){
                vouchersAtivos[indice] = item;
                indice = indice +1;
            }
            return vouchersAtivos;
        });
        this.vouchers = vouchersAtivos;
        console.log(this.vouchers);
    }

    tratarVersao(versao){
        let versaoAndroid = '';
        switch(versao){
            case 29:
                versaoAndroid = 10;
            break;
            case 28:
                versaoAndroid = 9;
            break;
            case 27:
                versaoAndroid = 8.1;
            break;
            case 26:
                versaoAndroid = 8;
            break;
            case 25:
                versaoAndroid = 7.1;
            break;
            case 24:
                versaoAndroid = 7;
            break;
            case 23:
                versaoAndroid = 6.0;
            break;
            case 22:
                versaoAndroid = 5.1;
            break;
            case 21:
                versaoAndroid = 5.0;
            break;
            case 20:
                versaoAndroid = "4.4W";
            break;
            case 19:
                versaoAndroid = 4.4;
            break;
            case 18:
                versaoAndroid = 4.3;
            break;
            case 17:
                versaoAndroid = 4.2;
            break;
            case 16:
                versaoAndroid = 4.1;
            break;
            default:
                versaoAndroid = 'nao disponivel';
        }
        return versaoAndroid;
    }

    componentDidMount() {
        this.loadCard();
        this.loadVouchers();
        this.OnBluetooth();
        this.estaComprando = true;
        this.backHandler = BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
        const maquina = this.props.navigation.getParam('dadosMaquina');
        if(maquina.selecoes !== null && maquina.selecoes !== undefined){
            this.produtos = maquina.selecoes;
            //this.nomePlaca = maquina.nomedaPlaca;
            this.manufacturerData = maquina.manufacturerData
            this.setState({maquina:maquina.matricula});
            this.setState({entidadeid:maquina.entidadeId});
            //this.setState({bluetoothInit:maquina.macBluetooth});

            
            if(Platform.OS === 'android'){
                this.sistema = Platform.OS;
                this.versaoSistema = this.tratarVersao(Platform.Version);
                console.log(this.sistema);
                console.log(this.versaoSistema);

                let permission = PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION;
                if(this.versaoSistema == 10){
                    let permission = PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;
                }

                request(permission).then(result => {
                if(result == 'granted'){
                    //this.initBluetooth('E0:E5:CF:79:2B:8D');
                    //this.initBluetooth('E0:E5:CF:79:2B:8C');
                    //this.initBluetooth(this.state.bluetoothInit);
                    //this.setState({buy:true});
                    this.scanAndConnect();
                }else{
                    Alert.alert('Alerta','Você precisa dar permissão ao aplicativo!',[{ text:'Ok',onPress:()=>{ } }]);
                }
                });
            }

            if(Platform.OS === 'ios'){
                this.sistema = Platform.OS;
                this.versaoSistema = parseInt(Platform.Version, 10);
                request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE).then(result => {
                    if(result == 'granted'){
                        //this.initBluetooth('16930361-81FF-DB74-97C9-773B6C10428A');
                        //this.initBluetooth('16930361-81FF-DB74-97C9-773B6C10428A');
                        //this.initBluetooth(maquina.uuidBluetooth);
                        this.scanAndConnect();
                    }else{
                        Alert.alert('Alerta','Você precisa dar permissão ao aplicativo!',[{ text:'Ok',onPress:()=>{ } }]);
                    }
                });
            }
        }else{
            Alert.alert('Ops! :( ','Máquina inválida, tente novamente!');
            this.props.navigation.navigate('Maquina');
        }
    }

    handleBackPress = () => {
        if(this.estaComprando){
            Alert.alert('Aviso','Você deseja realmente desconectar da máquina?',
                [
                    {
                        text: "Cancel",onPress: () => {
                            console.log("Cancelar Pressionado!");
                        }
                    },
                    { 
                    text:'Ok',onPress:()=>{ 
                        
                            if(this.isConnecting){
                                this.estaComprando = false;
                                setTimeout(()=>{ this.manager.cancelDeviceConnection(this.macAddress)}, 500);
                                Alert.alert('Ops! :( ','Parece que você foi desconectado da máquina. Tente se conectar novamente para efetuar a compra');
                                this.props.navigation.navigate('Maquina');
                            }else{
                                this.estaComprando = false;
                                Alert.alert('Ops! :( ','Parece que você foi desconectado da máquina. Tente se conectar novamente para efetuar a compra');
                                this.props.navigation.navigate('Maquina');
                            }
                        }
                    } 
                ]
            );
        }
        return true;
      }
    OnBluetooth(){
        const subscription = this.manager.onStateChange((state) => {
            console.log(state);
            if (state === 'PoweredOn') {
                subscription.remove();
            }else if(state === 'PoweredOff'){
                if(Platform.OS === 'android'){
                    this.manager.enable();
                }else{
                    Alert.alert('Ops! :( ','Você precisa ativar o bluetooth do dispositivo para se conectar a máquina!');
                }
            }
        }, true);
    }

    initBluetooth(macAddress){
        if(macAddress !== null && macAddress !== undefined){
            this.connect(macAddress).then(()=>{
                this.setState({conected:true});  
                this.setState({buy:true});
                this.setState({fase:'fase1'});   
                setTimeout(()=>{ this.primeiraMensagem() }, 1000);                      
            });
        }
    }

    scanAndConnect() {
        if(this.tentativas > 0){
            console.log(this.tentativas);
            this.deviceMap.clear();
            const dispositivos = {};
            this.manager.startDeviceScan(null, null, (error, device) => {
                if (error) {
                    return
                }
                // console.log(device);
                // if (device.name === 'JDY-09-V4.3') {
                //     this.manager.stopDeviceScan();
                // }

                this.deviceMap.set(device.id,device); 
                this.setState({data:[...this.deviceMap.values()]}); 
                console.log(this.state.data);
                
                
                this.state.data.map(item=>{
                    if(item.manufacturerData !== null && item.manufacturerData !== undefined && item.manufacturerData !== '' && item.manufacturerData === this.manufacturerData){
                        dispositivos['nome'] = item.name;
                        dispositivos['id'] = item.id;
                    }
                    return dispositivos;
                });
            });

            setTimeout(()=>{
                this.manager.stopDeviceScan();             
            },3000);

            
            console.log(dispositivos);
            
            setTimeout(()=>{
                console.log(dispositivos.id);
                if(dispositivos.id !== null && dispositivos.id !== undefined && dispositivos.id !== ''){
                    console.log('achou');
                    this.initBluetooth(dispositivos.id);
                }else{
                    console.log('nao achou');
                    this.tentativas = this.tentativas - 1;
                    this.scanAndConnect();
                }  
            },2000);
        } else{
            Alert.alert('Ops! :( ','Erro ao se conectar com a máquina, tente novamente');
            this.props.navigation.navigate('Maquina');
        } 
    }

    tratarNome(selecao){
        console.log(selecao);
        let produtonome = '';
        this.produtos.filter(function (produto) { 
            if(produto.selecao == selecao){
                produtonome = produto.produto.descricao;
                console.log(produtonome);
            }
        });
        return produtonome;
    }

    tratarId(selecao){
        console.log(selecao);
        let produtoid = '';
        this.produtos.filter(function (produto) { 
            if(produto.selecao == selecao){
                produtoid = produto.produto.externalId;
                console.log(produtoid)
            }
        });
        return produtoid;
    }
    
    tratarPreco(selecao){
        let precoproduto = selecao * 5 / 100;
        console.log(precoproduto);
        this.setState({existeProduto:true});
        this.setState({precoExibido:precoproduto.toFixed(2)});
        return precoproduto.toFixed(2);
    }

    tratarCredito(credito){
        let creditofinal = credito * 5 / 100;
        console.log(creditofinal);
        return creditofinal.toFixed(2);
    }

    tratarCPF(cpf){
        let novocpf = cpf.replace(/[^0-9]+/g,'');
        return novocpf;
    }

    tratarNumero(numero){
        let novo = numero.replace(/[^0-9]+/g,'');
        return novo;
    }

    async Comprar(){
        // console.log(this.state.codigoDeSeguraca);
        // console.log(this.state.novocodigo);
        if(this.state.produto !== ''){
            if(this.state.autorizadora !== '' || this.state.novaautorizadora !== ''){
                if(this.state.codigoDeSeguraca !== '' || this.state.novocodigo !== ''){
                    this.temProcesso = true;
                    this.setState({fase:'fase1'});
                    this.setState({visible: true});
                    let cpfTratado = '';
                    let numeroTratado = '';
                    let codigoDoVoucher = '';
                    let valorDoPagamento = '';

                    console.log(this.state.cpf);
                    if(this.state.cpf !== null && this.state.cpf !== undefined && this.state.cpf !== ''){
                        cpfTratado = this.tratarCPF(this.state.cpf);
                    }
                    
                    if(this.state.novocpf !== null && this.state.novocpf !== undefined && this.state.novocpf !== ''){
                        cpfTratado = this.tratarCPF(this.state.novocpf);
                    }

                    if(this.state.novonumero !== null && this.state.novonumero !== undefined){
                        numeroTratado = this.tratarNumero(this.state.novonumero);
                    }

                    if(this.state.codigoVoucher !== null && this.state.codigoVoucher !== undefined && this.state.codigoVoucher !== ''){
                        codigoDoVoucher = this.state.codigoVoucher;
                    }

                    if(this.state.valorDoPagamento === null || this.state.valorDoPagamento === undefined){
                        valorDoPagamento = this.state.preco;
                    }else{
                        valorDoPagamento = this.state.valorDoPagamento;
                    }

                    try {
                        let entidadeId = this.state.entidadeid
                        let selecao = this.state.selecao;
                        let produtoNome = this.state.produto;
                        let valorDoItem = this.state.preco;
                        let valorDoDesconto = this.state.valorDesconto;
                        let valorDoProduto = this.state.preco;
                        let cartaoId = this.state.cartao;
                        let matricula = this.state.maquina;
                        let produtoId = this.state.externalId;
                        let autorizadora = this.state.autorizadora;
                        let codigoDeSeguraca = this.state.codigoDeSeguraca;
                        let cpfdotitular = cpfTratado;
                        let sistemaOperacional = this.sistema;
                        let versaoSistemaOperacional = this.versaoSistema;

                        let nomeDoTitular = this.state.novotitular;
                        let novonumero = numeroTratado;
                        let novoAutorizadora = this.state.novaautorizadora
                        let novoMes = this.state.novomes;
                        let novoAno = this.state.novoano;
                        let novoCodigo = this.state.novocodigo;
                        let cartao = {};

                        console.log(this.state.existCartao);
                        if(this.state.existCartao){
                            console.log('entrou em true');
                                cartao['numero'] = novonumero;
                                cartao['mesDeExpiracao'] =  novoMes;
                                cartao['anoDeExpiracao'] = novoAno;
                                cartao['codigoDeSeguraca'] = novoCodigo;
                                cartao['cpf'] = cpfdotitular;
                                cartao['autorizadora'] = novoAutorizadora;
                                cartao['nomeDoTitular'] = nomeDoTitular;
                        }else{
                            console.log('entrou em false');
                                cartao['id'] = cartaoId;
                                cartao['autorizadora'] = autorizadora;
                                cartao['codigoDeSeguraca'] = codigoDeSeguraca;
                                cartao['cpf'] = cpfdotitular;
                        }
                        
                        console.log("Enditade:" + entidadeId);
                        console.log("Seleção:" + selecao);
                        console.log("Nome do Produto:" + produtoNome);
                        console.log("Valor do Item:" + valorDoItem);
                        console.log("Valor do Desconto:" + valorDoDesconto);
                        console.log("Valor do Pagamento:" + valorDoPagamento);
                        console.log("Valor do Produto:" + valorDoProduto);
                        console.log("Valor do Cartão ID:" + cartaoId);
                        console.log("Matricula:" + matricula);
                        console.log("Produto:" + produtoId);
                        console.log("Autorizadora:" + autorizadora);
                        console.log("codigoDeSeguraca:" + codigoDeSeguraca);
                        console.log("Nome do Titular:" + nomeDoTitular);
                        console.log("CPF do Titular:" + cpfdotitular);
                        console.log("Cartão:" + JSON.stringify(cartao));
                        
                        api.defaults.headers.Authorization = `Bearer ${this.props.token}`;
                        const cadastrarcompra = await api.post('/v1/Pedidos',{
                            entidadeId,
                            selecao,
                            codigoDoVoucher,
                            valorDoItem,
                            valorDoDesconto,
                            valorDoPagamento,
                            valorDoProduto,
                            produtoNome,
                            cartaoId,
                            cartao,
                            matricula,
                            produtoId,
                            sistemaOperacional,
                            versaoSistemaOperacional,
                        },{timeout:10000});
                
                        console.log(cadastrarcompra);
                        this.setState({IdCompra: cadastrarcompra.data.data.id});
                        this.setState({visible: false});
                        this.setState({buy:false}); 
                        this.setState({finished:true});
                        setTimeout(()=>{ this.writeWithoutResponse("<COMPRAR>",0) }, 1000);
                    } catch (error) {
                        this.setState({visible: false});
                        console.log(error.response.data);
                        Alert.alert('Falha ao processar compra', error.response.data.errors[0]);
                    }
                }else{
                    Alert.alert('Campo Obrigatório', 'O Código de Segurança é Obrigatório');
                }
            }else{
                Alert.alert('Campo Obrigatório', 'Escolha a bandeira do cartão que vai ser utilizado na compra!');
            }
        }else{
            Alert.alert('Campo Obrigatório', 'Antes de clicar em comprar deve-se selecionar um produto na máquina');
        }
    }

    // estorno(){
    //     this.manager.cancelDeviceConnection(this.macAddress);
    //     this.props.navigation.navigate('Maquina');
    // }

    async estorno(IdCompra){
        this.temProcesso = true;
        this.setState({fase:'fase1'});
        if(IdCompra !== null && IdCompra !== undefined){
            try {
                let numerCartao = 0;
                let mesDeExpiracaoCartao = 0;
                let anoDeExpiracaoCartao = 0;
                let motivoDoCancelamento = "Máquina Travada";
                let cartaoId = this.state.cartao;
                let pagamentoID = this.state.IdCompra;
                let codigoDeSeguraca = this.state.codigoDeSeguraca;
                let cartao = {
                    id: cartaoId,
                    codigoDeSeguraca: codigoDeSeguraca,
                };

                // console.log("Seleção:" + selecao);
                // console.log("Valor do Item:" + valorDoItem);
                // console.log("Valor do Desconto:" + valorDoDesconto);
                // console.log("Valor do Pagamento:" + valorDoPagamento);
                // console.log("Valor do Produto:" + valorDoProduto);
                // console.log("Valor do Cartão ID:" + cartaoId);
                // console.log("Matricula:" + matricula);
                // console.log("Produto:" + produto);
                // console.log("Autorizadora:" + autorizadora);
                // console.log("codigoDeSeguraca:" + codigoDeSeguraca);
                // console.log("Cartão:" + cartao);

                api.defaults.headers.Authorization = `Bearer ${this.props.token}`;
                const cadastrarcompra = await api.post('/v1/Cancelamentos/'+pagamentoID,{
                    pagamentoID,
                    motivoDoCancelamento,
                    cartao,
                });
        
                console.log(cadastrarcompra.data.data);
                
                
                this.setState({visible: false});

                Alert.alert(
                    'Opa!', 
                    'Ocorreu algum erro ao finalizar a compra, ja efetuamos o estorno do valor no seu cartão',
                    [
                        {text: 'OK', onPress: () => this.mensagemFechamento()}
                    ],
                );
                // this.writeWithoutResponse("<CANCELSESSION>",0).then(()=>{
                //     setTimeout(()=>{ this.manager.cancelDeviceConnection(this.macAddress)}, 1000);
                //     Alert.alert('Opa!', 'Ocorreu algum erro ao finalizar a compra, ja efetuamos o extorno do valor no seu cartão');
                //     this.props.navigation.navigate('Maquina');
                // });
            } catch (error) {
                this.setState({visible: false});
                console.log(error.response.data);
                Alert.alert('Falha ao tentar estornar a compra entre em contato com o suporte informando o erro:', error.response.data.errors[0]);
            }
        }
    }

    otherBuy = () =>{
       this.setState({produto:''});
       this.setState({preco:''});
       this.setState({credito:''});
       this.setState({externalId:''});
       this.setState({fase:'fase2'});
       setTimeout(()=>{ this.writeWithoutResponse("<CANCELACOMPRA>",0) }, 1000);
    }

    novaCompra = () =>{
        this.setState({fase:'fase1'});
        this.setState({produto:''});
        this.setState({preco:''});
        this.setState({precoExibido:''});
        this.setState({credito:''});
        this.setState({externalId:''});
        this.setState({finished:false});
        this.setState({buy:true});
        setTimeout(()=>{ this.writeWithoutResponse("<CONECTADO>",0) }, 1000);
    }


    cancelBuy = () =>{
        this.setState({fase:'fase1'});
        console.log(this.state.produto);
        if(this.state.produto === null || this.state.produto === undefined || this.state.produto === ''){
            this.writeWithoutResponse("<CANCELSESSION>",0).then(()=>{
                setTimeout(()=>{ this.manager.cancelDeviceConnection(this.macAddress)}, 1000);
                Alert.alert('Ops! :( ','Parece que você foi desconectado da máquina. Tente se conectar novamente para efetuar a compra');
                this.props.navigation.navigate('Maquina');
            });
        }else{
            this.writeWithoutResponse("<CANCELACOMPRA>",0).then(()=>{
                this.writeWithoutResponse("<CANCELSESSION>",0).then(()=>{
                    setTimeout(()=>{ this.manager.cancelDeviceConnection(this.macAddress)}, 1000);
                    Alert.alert('Ops! :( ','Parece que você foi desconectado da máquina. Tente se conectar novamente para efetuar a compra');
                    this.props.navigation.navigate('Maquina');
                })    
            });
        }
    }

    setisConnecting(conditional){
        this.isConnecting = conditional;
    }

    async fetchServicesAndCharacteristicsForDevice(device) {
        var servicesMap = {}
        var services = await device.services()
        console.log('services and charateristics');
        console.log(services);
        for (let service of services) {
          var characteristicsMap = {}
          var characteristics = await service.characteristics()
          
          for (let characteristic of characteristics) {
            characteristicsMap[characteristic.uuid] = {
              uuid: characteristic.uuid,
              isReadable: characteristic.isReadable,
              isWritableWithResponse: characteristic.isWritableWithResponse,
              isWritableWithoutResponse: characteristic.isWritableWithoutResponse,
              isNotifiable: characteristic.isNotifiable,
              isNotifying: characteristic.isNotifying,
              value: characteristic.value
            }
          }
    
          servicesMap[service.uuid] = {
            uuid: service.uuid,
            isPrimary: service.isPrimary,
            characteristicsCount: characteristics.length,
            characteristics: characteristicsMap
          }
        }
        return servicesMap
    }

    initUUID(){
        this.readServiceUUID = [];
        this.readCharacteristicUUID = [];   
        this.writeWithResponseServiceUUID = [];
        this.writeWithResponseCharacteristicUUID = [];
        this.writeWithoutResponseServiceUUID = [];
        this.writeWithoutResponseCharacteristicUUID = [];
        this.nofityServiceUUID = [];
        this.nofityCharacteristicUUID = [];  
        this.idealId = [];
    }

    getUUID(services){       
        this.readServiceUUID = [];
        this.readCharacteristicUUID = [];   
        this.writeWithResponseServiceUUID = [];
        this.writeWithResponseCharacteristicUUID = [];
        this.writeWithoutResponseServiceUUID = [];
        this.writeWithoutResponseCharacteristicUUID = [];
        this.nofityServiceUUID = [];
        this.nofityCharacteristicUUID = [];     

        for(let i in services){
            let charchteristic = services[i].characteristics;
            for(let j in charchteristic){
                if(charchteristic[j].isReadable){
                    this.readServiceUUID.push(services[i].uuid);
                    this.readCharacteristicUUID.push(charchteristic[j].uuid);        
                }
                if(charchteristic[j].isWritableWithResponse){
                    this.writeWithResponseServiceUUID.push(services[i].uuid);
                    this.writeWithResponseCharacteristicUUID.push(charchteristic[j].uuid);           
                }
                if(charchteristic[j].isWritableWithoutResponse){
                    this.writeWithoutResponseServiceUUID.push(services[i].uuid);
                    this.writeWithoutResponseCharacteristicUUID.push(charchteristic[j].uuid);           
                }
                if(charchteristic[j].isNotifiable){
                    this.nofityServiceUUID.push(services[i].uuid);
                    this.nofityCharacteristicUUID.push(charchteristic[j].uuid);     
                }            
            }                    
        }       
          
        console.log('readServiceUUID',this.readServiceUUID);
        console.log('readCharacteristicUUID',this.readCharacteristicUUID);
        console.log('writeWithResponseServiceUUID',this.writeWithResponseServiceUUID);
        console.log('writeWithResponseCharacteristicUUID',this.writeWithResponseCharacteristicUUID);
        console.log('writeWithoutResponseServiceUUID',this.writeWithoutResponseServiceUUID);
        console.log('writeWithoutResponseCharacteristicUUID',this.writeWithoutResponseCharacteristicUUID);
        console.log('nofityServiceUUID',this.nofityServiceUUID);
        console.log('nofityCharacteristicUUID',this.nofityCharacteristicUUID); 
    }
    
    getPerfectID(services){
        this.idealId = [];
        for(let i in services){
            let charchteristic = services[i].characteristics;
            for(let j in charchteristic){
                if(
                    charchteristic[j].isReadable &&
                    charchteristic[j].isWritableWithoutResponse &&
                    //charchteristic[j].isWritableWithResponse &&
                    charchteristic[j].isNotifiable
                ){
                    this.idealId.push(services[i].uuid);
                    this.idealId.push(charchteristic[j].uuid);        
                }            
            }                    
        } 
        console.log("Eureka o Array Ideal");
        console.log(this.idealId); 
    }

    stopScan(){
        this.manager.stopDeviceScan();
        console.log('stopDeviceScan');
    }

    connect(id){
            if(id !== null && id !== undefined && id !== ""){
                console.log('isConneting:',id);      
                this.isConnecting = true; 
                this.macAddress = id;
                console.log(this.macAddress);   
                return new Promise( (resolve, reject) =>{
                    this.manager.connectToDevice(id)
                        .then(device=>{ 
                            console.log('connect success:',device.name,device.id);    
                            this.peripheralId = device.id;
                            this.textMachine = 'Conectado com a Máquina';       
                            device.onDisconnected((error, disconnectedDevice) => {
                                this.isConnecting = false;
                                this.props.navigation.navigate('Maquina');
                            });
                            return device.discoverAllServicesAndCharacteristics();
                        })
                        .then(device=>{
                            return this.fetchServicesAndCharacteristicsForDevice(device);
                        })
                        .then(services=>{
                            console.log('fetchServicesAndCharacteristicsForDevice',services);    
                            this.isConnecting = true;
                            this.getPerfectID(services)
                            this.getUUID(services);
                            console.log("SetupNotification")
                            this.monitoring();
                            resolve();                           
                        })
                        .catch(err=>{
                            this.isConnecting = false;
                            //Alert.alert('Aviso de conexão', 'Dado recuperado pela conexão: '+JSON.stringify(err));
                            console.log('connect fail: ',err);
                            this.scanAndConnect();
                            reject(err);
                        })
                });
            }else{
                console.log('chegou aqui');
                this.scanAndConnect();
            }
    }

    async setupNotifications(device) {
        device.monitorCharacteristicForService('0000ffe0-0000-1000-8000-00805f9b34fb', '0000ffe1-0000-1000-8000-00805f9b34fb', (error, characteristic) => {
            if (error) {
                console.log(error.message);
                return
            }
            //console.log(characteristic.uuid);
            //console.log(characteristic.value);
        })
    }

    disconnect(){
        return new Promise( (resolve, reject) =>{
            this.manager.cancelDeviceConnection(this.peripheralId)
                .then(res=>{
                    console.log('disconnect success',res);
                    resolve(res);
                })
                .catch(err=>{
                    reject(err);
                    console.log('disconnect fail',err);
                })     
        });
    }

    read(index){
        return new Promise( (resolve, reject) =>{
            this.manager.readCharacteristicForDevice(this.peripheralId,this.idealId[0],this.idealId[1])
                .then(characteristic=>{                    
                    let buffer = Buffer.from(characteristic.value,'base64');  
                    const value = this.byteToString(buffer);          
                    console.log('read success', buffer, value);
                    resolve(value);     
                },error=>{
                    console.log('read fail: ',error);
                    this.alert('read fail: ' + error.reason);
                    reject(error);
                })
        });
    }
    
    monitoring(){
        let transactionId = 'monitoring';
        return new Promise( (resolve, reject) =>{ 
            this.manager.monitorCharacteristicForDevice(this.peripheralId,'0000ffe0-0000-1000-8000-00805f9b34fb', '0000ffe1-0000-1000-8000-00805f9b34fb', (error, characteristic) =>{
                if(characteristic !== null){
                    console.log('Valor'+characteristic.value);
                    if (error) {
                        console.log(error.message);
                        reject(error);
                    }
                    let buffer = Buffer.from(characteristic.value,'base64');  
                    const value = this.byteToString(buffer);  
                    this.tratarMensagem(value);
                    resolve(characteristic);
                }
            });
        }); 
        
    }

    primeiraMensagem(){
            console.log('Enviando Mensagem');
            setTimeout(()=>{ this.writeWithoutResponse("<CONECTADO>",0) }, 1000);
    }

    mensagemFechamento(){
        this.temProcesso = false;
        this.tratarMensagem(this.comandosessionClose);
    }

    tratarMensagem(msg){
        console.log(msg);
        console.log('Fase Atual: '+this.state.fase);
        if(msg.includes("P") && msg.includes("I") && this.state.fase == 'fase2'){
            let dadoproduto = msg.match(/[^<>]+/g);
            console.log(dadoproduto[0]);
            console.log(dadoproduto[1]);
            //matchAll = Array.from(dadoproduto);
            // let firstMatch = matchAll[0];
            // let secondMatch = matchAll[1];
            let nomeproduto = dadoproduto[1].replace("I","");
            let precoproduto = dadoproduto[0].replace("P","");
            this.setState({selecao:nomeproduto});
            this.setState({produto:this.tratarNome(nomeproduto)});
            this.setState({externalId:this.tratarId(nomeproduto)});
            this.setState({preco:this.tratarPreco(precoproduto)});
            this.setState({credito:this.tratarCredito(precoproduto)});
        }else{
            let tratarMsg = msg.replace("<","").replace(">","");
            console.log('Esperando Mensagem');
            console.log(tratarMsg);
            if(tratarMsg.includes("CONECTADOOK")){
                console.log("trouxe: "+tratarMsg);
                setTimeout(()=>{ this.writeWithoutResponse("<CR>400</CR>",0) }, 1000);
                
            }

            if(tratarMsg.includes("CONFIG_OK")){
                console.log("trouxe: "+tratarMsg);
                setTimeout(()=>{ this.writeWithoutResponse("<RESETOK>",0); }, 1000);
                
            }

            if(tratarMsg.includes("SESSIONINIT")){
                console.log("trouxe: "+tratarMsg);
                this.setState({fase:'fase2'});
            }

            if(tratarMsg.includes("RESETOK")){
                console.log("trouxe: "+tratarMsg);
                setTimeout(()=>{ this.writeWithoutResponse("<CR>400</CR>",0); }, 1000);
            }

            if(tratarMsg.includes("COMPRAR")){
                console.log("trouxe: "+tratarMsg);
                setTimeout(()=>{ this.writeWithoutResponse("<SESSIONCLOSE>",0); }, 1000);
            }
            
        
            if(tratarMsg.includes("NAODISPREL") || tratarMsg.includes("RELTELE")){
                console.log("trouxe: "+tratarMsg);
                setTimeout(()=>{ this.manager.cancelDeviceConnection(this.macAddress)}, 1000);
                Alert.alert('Opa :< ','A máquina não está disponível pois esta imprimindo relatório, tente novamente mais tarde.');
                this.props.navigation.navigate('Maquina');
            }

            if(tratarMsg.includes("CASHLESSDISVMD")){
                console.log("trouxe: "+tratarMsg);
                setTimeout(()=>{ this.manager.cancelDeviceConnection(this.macAddress)}, 1000);
                Alert.alert('Opa :< ','A máquina não está disponível pois esta com interferência, tente novamente mais tarde.');
                this.props.navigation.navigate('Maquina');
            }

            if(tratarMsg.includes("RASPCONECTADO")){
                console.log("trouxe: "+tratarMsg);
                setTimeout(()=>{ this.manager.cancelDeviceConnection(this.macAddress)}, 1000);
                Alert.alert('Opa :< ','A máquina não está disponível pois esta efetuando vendo pela máquina de cartão, tente novamente mais tarde.');
                this.props.navigation.navigate('Maquina');
            }

            if(tratarMsg.includes("MDBFALHA")){
                console.log("trouxe: "+tratarMsg);
                setTimeout(()=>{ this.manager.cancelDeviceConnection(this.macAddress)}, 1000);
                Alert.alert('Opa :< ','A máquina não está disponível pois esta sem comunicação, tente novamente mais tarde.');
                this.props.navigation.navigate('Maquina');
            }

            if(tratarMsg.includes("SESSIONCLOSE") && !this.temProcesso){
                    console.log("trouxe: "+tratarMsg);
                    setTimeout(()=>{ this.manager.cancelDeviceConnection(this.macAddress)}, 1000);
                    Alert.alert('Aviso','Sessão finalizada, volte sempre.');
                    this.props.navigation.navigate('Maquina');
            }
            
            if(tratarMsg.includes("FALHAVENDA")){
                this.setState({PedidoStatus: 6});
                this.enviaStatus();
                this.estorno(this.state.IdCompra);
            }

            // if(tratarMsg.includes("CANCELSESSION")){
            //     console.log("trouxe: "+tratarMsg);
            //     this.manager.cancelDeviceConnection(this.macAddress);
            //     Alert.alert('Ops! :( ','Parece que você foi desconectado da máquina. Tente se conectar novamente para efetuar a compra. Caso tenha dado erro no momento da compra o extorno sera realizado');
            //     this.props.navigation.navigate('Maquina');
            // }

            if(tratarMsg.includes("VENDACONCLUIDA")){
                this.enviaStatus();
                Alert.alert(
                    'Oba :)', 
                    'O produto saiu da máquina com sucesso, deseja realizar outra compra?',
                    [
                        {text: 'Sim', onPress: () => this.novaCompra()},
                        {text: 'Não', onPress: () => this.mensagemFechamento()}
                    ],
                );
            }
        }
        
    }

    async enviaStatus(){
        try {
            let ID = this.state.IdCompra;
            let PedidoStatus = 5;

            api.defaults.headers.Authorization = `Bearer ${this.props.token}`;
            const cadastrarstatus = await api.put('/v1/Pedidos',{
                ID,
                PedidoStatus,
            });
        }catch(error){
            console.log(error.response.data);
            Alert.alert('Falha ao processar status', error.response.data.errors[0]);
        }
    }

    write(value,index){
        let formatValue;      
        if(value === '0D0A') {  
            formatValue = value;
        }else {  
            formatValue = new Buffer(value).toString('base64'); 
        }
        let transactionId = 'write';
        if(this.state.conected){
            return new Promise( (resolve, reject) =>{      
                this.manager.writeCharacteristicWithResponseForDevice(this.peripheralId, '0000ffe0-0000-1000-8000-00805f9b34fb','0000ffe1-0000-1000-8000-00805f9b34fb',formatValue,transactionId)
                    .then(characteristic=>{       
                        console.log(characteristic);             
                        console.log('write success',value);
                        resolve(characteristic);
                    },error=>{
                        console.log('write fail: ',error);
                        console.log('write fail: ',error.reason);
                        this.alert('write fail: ',error.reason);
                        reject(error);
                    })
            });
        }
    }

    writeWithoutResponse(value,index){
        let formatValue;      
        if(value === '0D0A') {  
            formatValue = value;
        }else {  
            formatValue = new Buffer(value).toString('base64');
        }
        let transactionId = 'writeWithoutResponse';
        if(this.state.conected){
            return new Promise( (resolve, reject) =>{   
                this.manager.writeCharacteristicWithoutResponseForDevice(this.peripheralId, '0000ffe0-0000-1000-8000-00805f9b34fb', '0000ffe1-0000-1000-8000-00805f9b34fb',formatValue,transactionId)
                    .then(characteristic=>{
                        console.log('writeWithoutResponse success',value);
                        resolve(characteristic);
                    },error=>{
                        console.log('writeWithoutResponse fail: ',error);
                        console.log('writeWithoutResponse fail: ',error.reason);
                        this.alert('writeWithoutResponse fail: ',error.reason);
                        reject(error);
                    })
            });
        }
    }

    destroy(){
        this.manager.destroy();
    }

    alert(text){
        Alert.alert('Alerta',text,[{ text:'Ok',onPress:()=>{ } }]);
    }


    stringToByte(str) {  
        var bytes = new Array();  
        var len, c;  
        len = str.length;  
        for(var i = 0; i < len; i++) {  
            c = str.charCodeAt(i);  
            if(c >= 0x010000 && c <= 0x10FFFF) {  
                bytes.push(((c >> 18) & 0x07) | 0xF0);  
                bytes.push(((c >> 12) & 0x3F) | 0x80);  
                bytes.push(((c >> 6) & 0x3F) | 0x80);  
                bytes.push((c & 0x3F) | 0x80);  
            } else if(c >= 0x000800 && c <= 0x00FFFF) {  
                bytes.push(((c >> 12) & 0x0F) | 0xE0);  
                bytes.push(((c >> 6) & 0x3F) | 0x80);  
                bytes.push((c & 0x3F) | 0x80);  
            } else if(c >= 0x000080 && c <= 0x0007FF) {  
                bytes.push(((c >> 6) & 0x1F) | 0xC0);  
                bytes.push((c & 0x3F) | 0x80);  
            } else {  
                bytes.push(c & 0xFF);  
            }  
        }  
        return bytes;      
    }      

    byteToString(arr) {  
        if(typeof arr === 'string') {  
            return arr;  
        }  
        var str = '',  
            _arr = arr;  
        for(var i = 0; i < _arr.length; i++) {  
            var one = _arr[i].toString(2),  
                v = one.match(/^1+?(?=0)/);  
            if(v && one.length == 8) {  
                var bytesLength = v[0].length;  
                var store = _arr[i].toString(2).slice(7 - bytesLength);  
                for(var st = 1; st < bytesLength; st++) {  
                    store += _arr[st + i].toString(2).slice(2);  
                }  
                str += String.fromCharCode(parseInt(store, 2));  
                i += bytesLength - 1;  
            } else {  
                str += String.fromCharCode(_arr[i]);  
            }  
        }  
        return str;  
    } 

    pickerChange(index){
        console.log(index);
        this.cartoes.map( (v,i)=>{
            if(index > 0){
                let indice = index - 1;
                //console.log(i);
                this.setState({
                    cartao: this.cartoes[indice].id,
                    autorizadora: this.cartoes[indice].autorizadora,
                });
                this.visibleCpf(this.cartoes[indice].autorizadora);
            }
        })
    }

    visibleCpf(autorizadora){
        console.log(autorizadora);
        switch(autorizadora){
            case 207:
                this.mostrarCPF = true;
            break;
            case 209:
                this.mostrarCPF = true;
            break;
            case 224:
                this.mostrarCPF = true;
            break;
            case 280:
                this.mostrarCPF = true;
            break;
            case 281:
                this.mostrarCPF = true;
            break;
            default:
                this.mostrarCPF = false;
        }
    }

    getBandeira(autorizadora){
        let bandeira = '';
        switch(autorizadora){
            case 1:
            bandeira = 'Visa';
            break;
            case 2:
            bandeira = 'Mastercard';
            break;
            case 3:
            bandeira = 'American Express';
            break;
            case 5:
            bandeira = 'Hipercard'
            break;
            case 6:
            bandeira = 'Aura'
            break;
            case 12:
            bandeira =  'Cabal'
            break;
            case 33:
            bandeira = 'Dinners Club'
            break;
            case 41:
            bandeira = 'Elo'
            break;
            case 207:
            bandeira = 'Vr Alimentação'
            break;
            case 209:
            bandeira = 'Vr Refeição'
            break;
            case 224:
            bandeira = 'Alelo'
            break;
            case 280:
            bandeira = 'Sodexo Alimentação'
            break;
            case 281:
            bandeira = 'Sodexo Refeição'
            break;
            default:
            bandeira = ''
        }
        return bandeira;
    }

    usarCartao(){
        let validador = 0;
        let mensagem = 'Um ou mais campos não foram preenchidos corretamente tente novamente!';

        if(this.state.novaautorizadora === ''){
            validador = validador + 1;
        }

        if(this.state.novonumero === ''){
            validador = validador + 1;
        }

        if(this.state.novomes === '' || this.state.novomes.length < 2){
            validador = validador + 1;
            mensagem = mensagem + '\n\n O mês deve ter 2 digitos!';
        }
    
        if(this.state.novoano === '' || this.state.novoano.length < 4){
            validador = validador + 1;
            mensagem = mensagem + '\n\n O telefone deve ter 4 digitos!';
        }

        if(this.state.novocodigo === ''){
            validador = validador + 1;
        }

        if(this.state.novotitular === ''){
            validador = validador + 1;
        }

        if(this.state.novocpf === ''){
            validador = validador + 1;
        }

        if(validador > 0){
            console.log(validador);
            Alert.alert('Campo Obrigatório', mensagem);
        }else{
            console.log('oi');
            console.log(this.state.novaautorizadora);
            this.cartaoNovo['id'] = 1;
            this.cartaoNovo['autorizadora'] = parseInt(this.state.novaautorizadora);
            this.cartaoNovo['nomeDoTitular'] = this.state.novotitular;
            this.cartaoNovo['suffix'] = this.state.novonumero;
            this.cartaoNovo['mesDeExpiracao'] = this.state.novomes;
            this.cartaoNovo['anoDeExpiracao'] = this.state.novoano;
            this.setState({modalVisible:false});
            this.setState({existCartao:true});
        }
    }

    confirmDelete(){
        this.setState({existCartao:false});
        this.setState({novaautorizadora:''});
        this.setState({novotitular:''});
        this.setState({novonumero:''});
        this.setState({novomes:''});
        this.setState({novoano:''});
        this.setState({novocodigo:''});
        this.setState({novotitular:''});
        this.setState({novocpf:''});
    }

    useVoucher(voucher){
        console.log(voucher);
        if(voucher !== null && voucher !== undefined && voucher !== ''){
            this.voucherUsado = voucher;
            this.setState({codigoVoucher:voucher.codigo});
            this.setState({valorVoucher:voucher.valorDoVoucher});
            this.setState({valorDesconto:voucher.valorDoVoucher});
        }
        this.setState({modalvoucherVisible:false});
        this.calculaDesconto();
    }

    calculaDesconto(){
        let novoValor = 0;
        if(this.voucherUsado.tipoDescontoVoucher == 1){
            console.log('Valor voucher:'+this.voucherUsado.valorDoVoucher);
            let valor = this.state.preco;
            let porcentagem = this.voucherUsado.valorDoVoucher / 100;
            let desconto = valor*porcentagem;
            novoValor = valor - desconto;
            if(novoValor < 0){
                novoValor = 0;
            }
            console.log('calculo: '+novoValor);
            this.setState({valorDoPagamento:novoValor.toFixed(2)});
            this.setState({precoExibido:novoValor.toFixed(2)});
        }

        if(this.voucherUsado.tipoDescontoVoucher == 2){
            console.log('Valor voucher:'+this.voucherUsado.valorDoVoucher);
            novoValor = this.state.preco - this.voucherUsado.valorDoVoucher;
            if(novoValor < 0){
                novoValor = 0;
            }
            console.log('calculo: '+novoValor);
            this.setState({valorDoPagamento:novoValor.toFixed(2)});
            this.setState({precoExibido:novoValor.toFixed(2)});
        }
        
        return novoValor.toFixed(2);
    }

    render(){
        const { macAddress, conected,messages,message, produto, precoExibido, cartao,credito} = this.state;
        return (
            <Background>
                <Container>
                    <ProgressLoader
                    visible={this.state.visible}
                    isModal={true} isHUD={true}
                    hudColor={"#000000"}
                    color={"#FFFFFF"} />
                    <Image source={logo}/> 
                    <Title>{this.textMachine}</Title>
                    <Form>
                        <ScrollView>
                            {this.state.buy &&
                                <>
                                    <Modal
                                        animationType="slide"
                                        visible={this.state.modalVisible}
                                        onRequestClose={() => {
                                        Alert.alert("Modal has been closed.");
                                        }}
                                    >
                                        <CenteredView>
                                            <ModalView>
                                                <ModalTitle>Inserir cartão para compra</ModalTitle>
                                                <FormModal>
                                                    <Picker
                                                        selectedValue={this.state.novaautorizadora}
                                                        style={{width: 340,backgroundColor:'#fff',marginTop:10,marginBottom:10,height: 44}}
                                                        itemStyle={{height: 44}}
                                                        onValueChange={(novaautorizadora)=>this.setState({novaautorizadora})}>
                                                        <Picker.Item label="Selecione uma bandeira" value="" />
                                                        <Picker.Item label="Visa" value="1" />
                                                        <Picker.Item label="MasterCard" value="2" />
                                                        <Picker.Item label="American Express" value="3" />
                                                        <Picker.Item label="Hipercard" value="5" />
                                                        <Picker.Item label="Aura" value="6" />
                                                        <Picker.Item label="Cabal" value="12" />
                                                        <Picker.Item label="Diners Club" value="33" />
                                                        <Picker.Item label="Elo" value="41" />
                                                        <Picker.Item label="VR Alimentação" value="207" />
                                                        <Picker.Item label="VR Refeição" value="209" />
                                                        <Picker.Item label="Alelo Refeição" value="224" />
                                                        <Picker.Item label="Sodexo Alimentação" value="280" />
                                                        <Picker.Item label="Sodexo Refeição" value="281" />
                                                    </Picker>

                                                    <MaskInput
                                                        icon="credit-card"
                                                        keyboardType="numeric"
                                                        keyboardCorrect={false}
                                                        autoCapitalize="none"
                                                        placeholder="Numero do Cartão"
                                                        type={'custom'}
                                                        options={{
                                                            /**
                                                             * mask: (String | required | default '')
                                                             * the mask pattern
                                                             * 9 - accept digit.
                                                             * A - accept alpha.
                                                             * S - accept alphanumeric.
                                                             * * - accept all, EXCEPT white space.
                                                            */
                                                            mask: '9999 9999 9999 9999 9999'
                                                        }}
                                                        value={this.state.novonumero}
                                                        onChangeText={(novonumero)=>this.setState({novonumero})}
                                                    />

                                                    <MaskInput
                                                        icon="credit-card"
                                                        keyboardType="numeric"
                                                        keyboardCorrect={false}
                                                        autoCapitalize="none"
                                                        placeholder="Mês de Expiração"
                                                        type={'custom'}
                                                        options={{
                                                            /**
                                                             * mask: (String | required | default '')
                                                             * the mask pattern
                                                             * 9 - accept digit.
                                                             * A - accept alpha.
                                                             * S - accept alphanumeric.
                                                             * * - accept all, EXCEPT white space.
                                                            */
                                                            mask: '99'
                                                        }}
                                                        value={this.state.novomes}
                                                        onChangeText={(novomes)=>this.setState({novomes})}
                                                    />

                                                    <MaskInput
                                                        icon="credit-card"
                                                        keyboardType="numeric"
                                                        keyboardCorrect={false}
                                                        autoCapitalize="none"
                                                        placeholder="Ano de Expiração"
                                                        type={'custom'}
                                                        options={{
                                                            /**
                                                            * mask: (String | required | default '')
                                                            * the mask pattern
                                                            * 9 - accept digit.
                                                            * A - accept alpha.
                                                            * S - accept alphanumeric.
                                                            * * - accept all, EXCEPT white space.
                                                            */
                                                            mask: '9999'
                                                        }}
                                                        value={this.state.novoano}
                                                        onChangeText={(novoano)=>this.setState({novoano})}
                                                    />

                                                    <FormInput 
                                                        icon="credit-card"
                                                        keyboardType="numeric"
                                                        keyboardCorrect={false}
                                                        autoCapitalize="none"
                                                        placeholder="Código de Segurança"
                                                        returnKeyType="next"
                                                        value={this.state.novocodigo}
                                                        onChangeText={(novocodigo)=>this.setState({novocodigo})}
                                                    />

                                                    <FormInput 
                                                        icon="credit-card"
                                                        keyboardCorrect={false}
                                                        autoCapitalize="none"
                                                        placeholder="Nome do Titular"
                                                        returnKeyType="next"
                                                        value={this.state.novotitular}
                                                        onChangeText={(novotitular)=>this.setState({novotitular})}
                                                    />

                                                    <MaskInput
                                                        icon="credit-card"
                                                        keyboardType="numeric"
                                                        keyboardCorrect={false}
                                                        autoCapitalize="none"
                                                        placeholder="CPF do Titular"
                                                        returnKeyType="next"
                                                        type={'cpf'}
                                                        value={this.state.novocpf}
                                                        onChangeText={(novocpf)=>this.setState({novocpf})}
                                                    />
                                                    <OpenButton
                                                        onPress={()=>{this.usarCartao()}}
                                                    >
                                                    <ButtonTitle>Usar Cartão</ButtonTitle>
                                                    </OpenButton>
                                                    <OpenButton
                                                        onPress={() => {
                                                            this.setState({modalVisible:false})
                                                        }}
                                                    >
                                                    <ButtonTitle>Cancelar</ButtonTitle>
                                                    </OpenButton>
                                                </FormModal>
                                            </ModalView>
                                        </CenteredView>
                                    </Modal>

                                    <Modal
                                        animationType="slide"
                                        visible={this.state.modalvoucherVisible}
                                        onRequestClose={() => {
                                        Alert.alert("Modal has been closed.");
                                        }}
                                    >
                                        <CenteredView>
                                            <ModalView>
                                                <ModalTitle>Selecione um voucher</ModalTitle>
                                                
                                                <List
                                                    data={this.vouchers}
                                                    keyExtractor={item=>String(item.id)}
                                                    renderItem={({ item }) => <Vouchers onCancel={()=> this.useVoucher(item)} data={item}/> }
                                                />

                                                <OpenButton
                                                    onPress={() => {
                                                        this.setState({modalvoucherVisible:false})
                                                    }}
                                                >
                                                    <ButtonTitle>Cancelar</ButtonTitle>
                                                </OpenButton>
                                            </ModalView>
                                        </CenteredView>
                                    </Modal>
                                    <Title>Produto: {produto} </Title>
                                    <Title>Preço: R$ {precoExibido}</Title>
                                    {!this.state.existCartao &&
                                      <>
                                        <Picker
                                            selectedValue={this.state.cartao}
                                            style={{backgroundColor:'#fff',marginBottom:10,height: 44}}
                                            itemStyle={{height: 44}}
                                            onValueChange={(itemValue, itemIndex) => this.pickerChange(itemIndex)}
                                        >
                                            <Picker.Item label="Selecione um Cartão" value="0" />
                                            {
                                                this.cartoes.map( (v,i)=>{
                                                    return <Picker.Item key={i} label={this.getBandeira(v.autorizadora)+" ****-****-****-"+v.suffix} value={v.id} />
                                                })
                                            }
                                        </Picker>
                                        <FormInput 
                                            icon="credit-card"
                                            keyboardType="numeric"
                                            keyboardCorrect={false}
                                            autoCapitalize="none"
                                            placeholder="Código de Segurança"
                                            returnKeyType="next"
                                            value={this.state.codigoDeSeguraca}
                                            onChangeText={(codigoDeSeguraca)=>this.setState({codigoDeSeguraca})}
                                        />
                                        {this.mostrarCPF &&
                                            <MaskInput
                                                icon="credit-card"
                                                keyboardType="numeric"
                                                keyboardCorrect={false}
                                                autoCapitalize="none"
                                                placeholder="CPF do Titular"
                                                returnKeyType="next"
                                                type={'cpf'}
                                                value={this.state.cpf}
                                                onChangeText={(cpf)=>this.setState({cpf})}
                                            />
                                        }
                                      </>
                                    }

                                    {this.state.existeProduto &&
                                        <GroupLinks>
                                            <SignLink onPress={() => {this.setState({modalVisible:true})}}>
                                                <Title>+Add Cartão</Title>
                                            </SignLink>

                                            <SignLink onPress={() => {this.setState({modalvoucherVisible:true})}}>
                                                <Title>+Add Voucher</Title>
                                            </SignLink>
                                        </GroupLinks>
                                    }

                                    {this.state.existCartao &&
                                        <Cards onCancel={()=> this.confirmDelete()} data={this.cartaoNovo}/>
                                    }

                                    <SubmitButton onPress={() => this.Comprar()}>
                                        Comprar Produto
                                    </SubmitButton>
                                    <SubmitButton onPress={this.otherBuy}>
                                        Escolher Outro
                                    </SubmitButton>
                                    <SubmitButton onPress={this.cancelBuy}>
                                        Cancelar Compra
                                    </SubmitButton>
                                </>
                            }
                        </ScrollView>    
                    </Form>
                    {this.state.finished &&
                        <Title>Transação realizada, aguarde o produto ser dispensado na máquina...</Title>
                    }
                </Container>
            </Background>
        );
    }
}
const mapStateToProps = state => ({
    token: state.auth.token
});

export default connect(mapStateToProps)(Buy);
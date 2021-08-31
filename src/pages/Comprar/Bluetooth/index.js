import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  FlatList,
  TextInput,
  Platform,
  Alert
} from 'react-native';
import BleModule from '../../../BleModule';
import { BleManager } from 'react-native-ble-plx';
import {check,request, PERMISSIONS, RESULTS} from 'react-native-permissions';
global.BluetoothManager = new BleModule();  

export default class Bluetooth extends Component {
    constructor(props) {
        super(props); 
        this.manager = new BleManager();  
        this.state={
            scaning:false,
            isConnected:false,
            text:'',
            writeData:'',
            receiveData:'',
            readData:'',
            data:[],
            isMonitoring:false
        }
        this.bluetoothReceiveData = [];
        this.deviceMap = new Map();
    }

    componentDidMount(){

        if(Platform.OS === 'android'){
            request(PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION).then(result => {
            if(result == 'granted'){
                this.onStateChangeListener = this.manager.onStateChange((state) => {
                    console.log("onStateChange: ", state);
                    if(state == 'PoweredOn'){
                        //this.scan();
                    }               
                })
            }else{
                Alert.alert('Alerta','Você precisa dar permissão ao aplicativo!',[{ text:'Ok',onPress:()=>{ } }]);
            }
            });
        }

        if(Platform.OS === 'ios'){
            request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE).then(result => {
                if(result == 'granted'){
                    //this.initBluetooth(maquina.uudid);
                    this.onStateChangeListener = this.manager.onStateChange((state) => {
                        console.log("onStateChange: ", state);
                        if(state == 'PoweredOn'){
                            //this.scan();
                        }               
                    })
                }else{
                    Alert.alert('Alerta','Você precisa dar permissão ao aplicativo!',[{ text:'Ok',onPress:()=>{ } }]);
                }
            });
        }
        // 监听蓝牙开关
       
    }         

    componentWillUnmount() {
       this.manager.destroy();
       this.onStateChangeListener && this.onStateChangeListener.remove();
       this.disconnectListener && this.disconnectListener.remove();
       this.monitorListener && this.monitorListener.remove();
    }

    checkErrors(campo){
        if(campo === null || campo === undefined || campo === ''){
            
        }
    }

    alert(text){
        Alert.alert('Sugestão',text,[{ text:'OK',onPress:()=>{ } }]);
    }

    scan(){
        if(!this.state.scaning) {
            this.setState({scaning:true});
            this.deviceMap.clear();
            this.manager.startDeviceScan(null, null, (error, device) => {                
                if (error) {
                    this.alert(error.errorCode.toString());
                    console.log('startDeviceScan error:',error);
                    // if(error.errorCode == 102){
                    //     this.alert('Por favor, ligue o Bluetooth do seu telefone antes de pesquisar');
                    // }
                    this.setState({scaning:false});   
                }else{
                    console.log(device.id,device.name,device.manufacturerData);
                    this.deviceMap.set(device.id,device); 
                    this.setState({data:[...this.deviceMap.values()]});
                    console.log(this.state.data);      
                }              
            })
            this.scanTimer && clearTimeout(this.scanTimer);
            this.scanTimer = setTimeout(()=>{
                if(this.state.scaning){
                   BluetoothManager.stopScan();
                   this.setState({scaning:false});                   
                }                
            },3000)  
        }else {
            BluetoothManager.stopScan();
            this.setState({scaning:false});
        }
    }
   
    connect(item){        
        if(this.state.scaning){  
            BluetoothManager.stopScan();
            this.setState({scaning:false});
        }
        if(BluetoothManager.isConnecting){
            console.log('Não é possível abrir outro processo de conexão enquanto o Bluetooth está conectado no momento');
            return;
        }
        let newData = [...this.deviceMap.values()];
        newData[item.index].isConnecting = true; 
        this.setState({data:newData});
        BluetoothManager.connect(item.item.id)
            .then(device=>{
                newData[item.index].isConnecting = false;
                this.setState({data:[newData[item.index]], isConnected:true});
                this.onDisconnect();
            })
            .catch(err=>{
                newData[item.index].isConnecting = false;
                this.setState({data:[...newData]});
                this.alert(err);
            })
    }

    read=(index)=>{
        BluetoothManager.read(index)
            .then(value=>{
                this.setState({readData:value});
            })
            .catch(err=>{

            })       
    }

    write=(index,type)=>{
        if(this.state.text.length == 0){
            this.alert('Por favor insira uma mensagem');
            return;
        }
        BluetoothManager.write(this.state.text,index,type)
            .then(characteristic=>{
                this.bluetoothReceiveData = [];
                this.setState({
                    writeData:this.state.text,
                    text:'',
                })
            })
            .catch(err=>{

            })       
    }

    writeWithoutResponse=(index,type)=>{
        if(this.state.text.length == 0){
            this.alert('Por favor insira uma mensagem');
            return;
        }
        BluetoothManager.writeWithoutResponse(this.state.text,index,type)
            .then(characteristic=>{
                this.bluetoothReceiveData = [];
                this.setState({
                    writeData:this.state.text,
                    text:'',
                })
            })
            .catch(err=>{

            })              
    }

    //监听蓝牙数据 
    monitor=(index)=>{
        let transactionId = 'monitor';
        this.monitorListener = BluetoothManager.manager.monitorCharacteristicForDevice(BluetoothManager.peripheralId,
            BluetoothManager.nofityServiceUUID[index],BluetoothManager.nofityCharacteristicUUID[index],
            (error, characteristic) => {
                if (error) {
                    this.setState({isMonitoring:false});
                    console.log('monitor fail:',error);    
                    this.alert('monitor fail: ' + error.reason);      
                }else{
                    this.setState({isMonitoring:true});
                    this.bluetoothReceiveData.push(characteristic.value); 
                    this.setState({receiveData:this.bluetoothReceiveData.join('')})
                    console.log('monitor success',characteristic.value);
                }

            }, transactionId)
    }  

    onDisconnect(){        
        this.disconnectListener = BluetoothManager.manager.onDeviceDisconnected(BluetoothManager.peripheralId,(error,device)=>{
            if(error){  
                console.log('onDeviceDisconnected','device disconnect',error);
                this.setState({data:[...this.deviceMap.values()],isConnected:false});
            }else{
                this.disconnectListener && this.disconnectListener.remove();
                console.log('onDeviceDisconnected','device disconnect',device.id,device.name);
            }
        })
    }

    disconnect(){
        BluetoothManager.disconnect()
            .then(res=>{
                this.setState({data:[...this.deviceMap.values()],isConnected:false});
            })
            .catch(err=>{
                this.setState({data:[...this.deviceMap.values()],isConnected:false});
            })     
    }   

    renderItem=(item)=>{
        let data = item.item;
        return(
            <TouchableOpacity
                activeOpacity={0.7}
                disabled={this.state.isConnected?true:false}
                onPress={()=>{this.connect(item)}}
                style={styles.item}>                         
                <View style={{flexDirection:'row'}}>
                    <Text style={{color:'black'}}>Nome: {data.name?data.name:''}</Text>
                    <Text style={{color:"red",marginLeft:50}}>{data.isConnecting?'Conectando...':''}</Text>
                </View>
                <Text>MAC: {data.id}</Text>
                <Text>Dado do Fabricante: {data.manufacturerData?data.manufacturerData:''}</Text>
               
            </TouchableOpacity>
        );
    }

    renderHeader=()=>{
        return(
            <View style={{marginTop:20}}>
                <TouchableOpacity 
                    activeOpacity={0.7}
                    style={[styles.buttonView,{marginHorizontal:10,height:40,alignItems:'center'}]}
                    onPress={this.state.isConnected?this.disconnect.bind(this):this.scan.bind(this)}>
                    <Text style={styles.buttonText}>{this.state.scaning?'Pesquisando':this.state.isConnected?'Desconectar o Bluetooth':'Pesquisa por Bluetooth'}</Text>
                </TouchableOpacity>
                
                <Text style={{marginLeft:10,marginTop:10}}>
                    {this.state.isConnected?'Dispositivo atualmente conectado':'Equipamento disponível'}
                </Text> 
            </View>
        )
    }

    renderFooter=()=>{
        return(
            <View style={{marginBottom:30}}>
                {this.state.isConnected?
                <View>
                    {this.renderWriteView('Gravar dados(write)：','Enviar',
                            BluetoothManager.writeWithResponseCharacteristicUUID,this.write)}
                    {this.renderWriteView('Gravar dados(writeWithoutResponse)：','Enviar',
                            BluetoothManager.writeWithoutResponseCharacteristicUUID,this.writeWithoutResponse,)}
                    {this.renderReceiveView('Dados lidos:','Ler',
                            BluetoothManager.readCharacteristicUUID,this.read,this.state.readData)}
                    {this.renderReceiveView(`Escute os dados recebidos:${this.state.isMonitoring?'A escuta está ativada':'A escuta não está ativada'}`,'Ative a escuta',
                            BluetoothManager.nofityCharacteristicUUID,this.monitor,this.state.receiveData)}
                </View>                   
                :<View style={{marginBottom:20}}></View>
                }        
            </View>
        )
    }

    renderWriteView=(label,buttonText,characteristics,onPress,state)=>{
        if(characteristics.length == 0){
            return null;
        }
        return(
            <View style={{marginHorizontal:10,marginTop:30}} behavior='padding'>
                <Text style={{color:'black'}}>{label}</Text>
                    <Text style={styles.content}>
                        {this.state.writeData}
                    </Text>                        
                    {characteristics.map((item,index)=>{
                        return(
                            <TouchableOpacity 
                                key={index}
                                activeOpacity={0.7} 
                                style={styles.buttonView} 
                                onPress={()=>{onPress(index)}}>
                                <Text style={styles.buttonText}>{buttonText} ({item})</Text>
                            </TouchableOpacity>
                        )
                    })}      
                    <TextInput
                        style={[styles.textInput]}
                        value={this.state.text}
                        placeholder='Por favor insira uma mensagem'
                        onChangeText={(text)=>{
                            this.setState({text:text});
                        }}
                    />
            </View>
        )
    }

    renderReceiveView=(label,buttonText,characteristics,onPress,state)=>{
        if(characteristics.length == 0){
            return null;
        }
        return(
            <View style={{marginHorizontal:10,marginTop:30}}>
                <Text style={{color:'black',marginTop:5}}>{label}</Text>               
                <Text style={styles.content}>
                    {state}
                </Text>
                {characteristics.map((item,index)=>{
                    return(
                        <TouchableOpacity 
                            activeOpacity={0.7} 
                            style={styles.buttonView} 
                            onPress={()=>{onPress(index)}} 
                            key={index}>
                            <Text style={styles.buttonText}>{buttonText} ({item})</Text>
                        </TouchableOpacity>
                    )
                })}        
            </View>
        )
    }   

    render () {
        return (
            <View style={styles.container}>  
                <FlatList 
                    renderItem={this.renderItem}
                    keyExtractor={item=>item.id}
                    data={this.state.data}
                    ListHeaderComponent={this.renderHeader}
                    ListFooterComponent={this.renderFooter}
                    extraData={[this.state.isConnected,this.state.text,this.state.receiveData,this.state.readData,this.state.writeData,this.state.isMonitoring,this.state.scaning]}
                    keyboardShouldPersistTaps='handled'
                />
                <TouchableOpacity 
                    activeOpacity={0.7}
                    style={[styles.buttonVoltar,{marginHorizontal:10,height:40,alignItems:'center'}]}
                    onPress={()=>this.props.navigation.navigate('Maquina')}>
                    <Text style={styles.buttonText}>Voltar</Text>
                </TouchableOpacity>           
            </View>
        )
    }
}

const styles = StyleSheet.create({   
    container: {
        flex: 1,
        backgroundColor:'white',
        marginTop:Platform.OS == 'ios'?20:0,
    },
    item:{
        flexDirection:'column',
        borderColor:'rgb(235,235,235)',
        borderStyle:'solid',
        borderBottomWidth:StyleSheet.hairlineWidth,
        paddingLeft:10,
        paddingVertical:8,       
    },
    buttonView:{
        height:30,
        backgroundColor:'rgb(33, 150, 243)',
        paddingHorizontal:10,
        borderRadius:5,
        justifyContent:"center",   
        alignItems:'center',
        alignItems:'flex-start',
        marginTop:10
    },
    buttonVoltar:{
        height:30,
        backgroundColor:'rgb(33, 150, 243)',
        paddingHorizontal:10,
        borderRadius:5,
        justifyContent:"center",   
        alignItems:'center',
        alignItems:'flex-start',
    },
    buttonText:{
        color:"white",
        fontSize:12,
    },
    content:{        
        marginTop:5,
        marginBottom:15,        
    },
    textInput:{       
		paddingLeft:5,
		paddingRight:5,
		backgroundColor:'white',
		height:50,
        fontSize:16,
        flex:1,
	},
})




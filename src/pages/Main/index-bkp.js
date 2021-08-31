import React, { Component } from 'react';
import { Container, Form, Input, SubmitButton,Text } from './styles';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { BleManager } from 'react-native-ble-plx';
import BleModule from '../../BleModule';
import {check,request, PERMISSIONS, RESULTS} from 'react-native-permissions';
global.BluetoothManager = new BleModule(); 
export default class Main extends Component{

    state = {
        macAddress: '',
        conected: false,
    };

    handleAddMac = () =>{
        console.log(this.state.macAddress);
    };

    constructor() {
        super();
        this.manager = new BleManager();
        this.serviceUUIDs = [
            '0000ffe0-0000-1000-8000-00805f9b34fb',
            '0000fee0-0000-1000-8000-00805f9b34fb'
        ]
    }
    
    componentDidMount() {
        request(PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION).then(result => {
          if(result == 'granted'){
            //this.initBluetooth();
          }else{

          }
        });
    }
    
    initBluetooth(){
        const subscription = this.manager.onStateChange((state) => {
          console.log(state);
          if (state === 'PoweredOn') {
              this.scanAndConnect();
              subscription.remove();
          }
        }, true);
    }
    
    scanAndConnect() {
        // this.manager.startDeviceScan(null, {allowDuplicates:false}, (error, device) => {
        //     if (error) {
        //         // Handle error (scanning will be stopped automatically)
        //         return
        //     }
        //     console.log(device);
        //     // Check if it is a device you are looking for based on advertisement data
        //     // or other criteria.
        //     if (device.name === 'JDY-09-V4.3') {
                
        //         // Stop scanning as it's not necessary if you are scanning for one device.
        //         this.manager.stopDeviceScan();
        //         // Proceed with connection.
                
        //     }
        // });
        BluetoothManager.connect('E0:E5:CF:79:2B:8D').then(()=>{
            // setInterval(() => {
            //     BluetoothManager.write("10",0);
            // }, 5000);

        });
        // this.manager.connectToDevice('E0:E5:CF:79:2B:8D', null).then((device)=>{
        //     this.getService(device);
        // //    this.manager.servicesForDevice(device.id).then((service)=>{
        // //        console.log(service);
        // //    });
        //     // this.manager.servicesForDevice(deivce.id).then((info)=>{
        //     //     console.log(info);
        //     // });
        //     // this.manager.writeCharacteristicWithoutResponseForDevice(
        //     //     'E0:E5:CF:79:2B:8D',
        //     //     '0',
        //     //     '0',
        //     //     'T2k='
        //     // );
        // });

        

        //this.manager.cancelDeviceConnection('E0:E5:CF:79:2B:8D');
    }
  render(){
    const { macAddress, conected} = this.state;
    return (
        <Container>
            <Text>Digite o MAC Address do dispositivo:</Text>
            <Form>
                <Input
                    autoCorrect={false}
                    autoCapitalize="none"
                    placeholder="Adicionar Usuário"
                    value={macAddress}
                    onChangeText={text=> this.setState({macAddress:text})}
                />
                <SubmitButton onPress={this.handleAddMac}>
                    <Icon name="add" size={20} color="#FFF"/>
                </SubmitButton>
            </Form>
        </Container>
      );
  }
}

Main.navigationOptions = {
    title: 'SlpayIos',
};
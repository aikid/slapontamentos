import { Platform,Alert } from 'react-native'
import { BleManager } from 'react-native-ble-plx';
import { Buffer } from 'buffer';

export default class BleModule{
    constructor(){
	    this.isConnecting = false;
        this.initUUID();
        this.manager = new BleManager();
        this.macAddress = '';
    }

    state = {
        macAddress: '',
        conected: false,
        message:'',
        messages:[],
    };

    setisConnecting(conditional){
        this.isConnecting = conditional;
    }

    async fetchServicesAndCharacteristicsForDevice(device) {
        var servicesMap = {}
        var services = await device.services()
    
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
                    charchteristic[j].isWritableWithResponse && 
                    charchteristic[j].isWritableWithoutResponse &&
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

    scan(){
        return new Promise( (resolve, reject) =>{
            this.manager.startDeviceScan(null, null, (error, device) => {
                if (error) {
                    console.log('startDeviceScan error:',error)
                    if(error.errorCode == 102){
                        this.alert('请打开手机蓝牙后再搜索');
                    }
                    reject(error);            
                }else{
                    resolve(device);                        
                }              
            })

        });
    }

    stopScan(){
        this.manager.stopDeviceScan();
        console.log('stopDeviceScan');
    }

    connect(id){
        console.log('isConneting:',id);      
        this.isConnecting = true; 
        this.macAddress = id;
        console.log(this.macAddress);   
        return new Promise( (resolve, reject) =>{
            this.manager.connectToDevice(id)
                .then(device=>{ 
                    console.log('connect success:',device.name,device.id);    
                    this.peripheralId = device.id;       
                    device.onDisconnected((error, disconnectedDevice) => {
                        this.alert('Disconnected: ',disconnectedDevice.name);
                    });
                    return device.discoverAllServicesAndCharacteristics();
                })
                .then(device=>{
                    return this.fetchServicesAndCharacteristicsForDevice(device);
                })
                .then(services=>{
                    console.log('fetchServicesAndCharacteristicsForDevice',services);    
                    this.isConnecting = true;
                    this.getPerfectID(services);
                    this.getUUID(services);
                    console.log("SetupNotification");
                    this.monitoring();
                    this.primeiraMensagem(); 
                    resolve();                           
                })
                .catch(err=>{
                    this.isConnecting = false;
                    console.log('connect fail: ',err);
                    reject(err);                    
                })
        });
    }

    async setupNotifications(device) {
        device.monitorCharacteristicForService('0000ffe0-0000-1000-8000-00805f9b34fb', '0000ffe1-0000-1000-8000-00805f9b34fb', (error, characteristic) => {
            if (error) {
                console.log(error.message);
                return
            }
            console.log(characteristic.uuid);
            console.log(characteristic.value);
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
            this.manager.readCharacteristicForDevice(this.peripheralId,this.idealId[0], this.idealId[1])
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
            this.manager.monitorCharacteristicForDevice(this.peripheralId,this.idealId[0], this.idealId[1], (error, characteristic) =>{
                    if (error) {
                        console.log(error.message);
                        reject(error);
                      }
                      let buffer = Buffer.from(characteristic.value,'base64');  
                      const value = this.byteToString(buffer);  
                      this.tratarMensagem(value);
                      resolve(characteristic);
           });
        }); 
        
    }

    primeiraMensagem(){
        console.log('Enviando Mensagem');
        this.write("<CONECTADO>",0);
    }

    tratarMensagem(msg){
        let tratarMsg = msg.replace("<","").replace(">","");
        console.log('Esperando Mensagem');
        console.log(tratarMsg);
        if(tratarMsg.includes("CONECTADOOK")){
            console.log("trouxe: "+tratarMsg);
            this.write("<CR>20</CR>",0);
        }

        if(tratarMsg.includes("RESETOK")){
            console.log("trouxe: "+tratarMsg);
            this.write("<CR>20</CR>",0);
        }
       
        if(tratarMsg.includes("SESSIONCLOSE")){
            console.log("trouxe: "+tratarMsg);
            this.manager.cancelDeviceConnection(this.macAddress);
        }
        
        if(tratarMsg.includes("FALHAVENDA")){
            this.estorno();
        }
        
    }

    estorno(){
        
    }

    write(value,index){
        let formatValue;      
        if(value === '0D0A') {  
            formatValue = value;
        }else {  
            formatValue = new Buffer(value).toString('base64'); 
        }
        let transactionId = 'write';
        if(this.isConnecting){
            return new Promise( (resolve, reject) =>{      
                this.manager.writeCharacteristicWithResponseForDevice(this.peripheralId,this.idealId[0], this.idealId[1],formatValue,transactionId)
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
            formatValue = new Buffer(value, "base64").toString('ascii'); 
        }
        let transactionId = 'writeWithoutResponse';
        return new Promise( (resolve, reject) =>{   
            this.manager.writeCharacteristicWithoutResponseForDevice(this.peripheralId, this.idealId[0], this.idealId[1],formatValue,transactionId)
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
}
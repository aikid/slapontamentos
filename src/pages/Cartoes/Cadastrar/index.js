import React, { useRef,useState } from 'react';
import { TouchableOpacity,Picker,Alert,ScrollView } from 'react-native';
import { useDispatch,useSelector } from 'react-redux';
import { addCardRequest } from '../../../store/modules/user/actions';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Container, Title, Form, FormInput, SubmitButton,SignLink,SignLinkText,MaskInput } from './styles';
import Background from '../../../components/Background';
import api from '../../../services/api';

// import { Container } from './styles';

export default function Cadastrar({navigation}) {
  const dispatch = useDispatch();
  const token = useSelector(state=> state.auth.token);

  const [numeros,setNumeros] = useState('');
  const [mesDeExpiracao,setMesDeExpiracao] = useState('');
  const [anoDeExpiracao,setAnoDeExpiracao] = useState('');
  const [codigoDeSeguraca,setCodigoDeSeguraca] = useState('');
  const [nomeDoTitular,setNomeDoTitular] = useState('');
  const [cpf,setCpf] = useState('');
  const [autorizadora,setAutorizadora] = useState('');

  async function handleSubmit(){
    if(validate()){
      try {
        //console.log(token);
        //console.log(autorizadora);
        //dispatch(addCardRequest(numero,mesDeExpiracao,anoDeExpiracao,codigoDeSeguraca,nomeDoTitular,cpfDoTitular,autorizadora,token));
        let numero = numeros.replace(/[^0-9]+/g,'');
        let cpfDoTitular = cpf.replace(/[^0-9]+/g,'');

        // let dados_cartao = 'Número: '+numero+' Mês: '+mesDeExpiracao+' Ano: '+anoDeExpiracao+' CVV: '+codigoDeSeguraca+' Nome :'+nomeDoTitular+' CPF: '+cpfDoTitular+' Autorizadora: '+autorizadora;
        // Alert.alert('Dados do cartão',dados_cartao);
        api.defaults.headers.Authorization = `Bearer ${token}`;
        
        const response = await api.post('/v1/Cartoes',{
          numero,
          mesDeExpiracao,
          anoDeExpiracao,
          codigoDeSeguraca,
          nomeDoTitular,
          cpfDoTitular,
          autorizadora,
        });

        Alert.alert('Sucesso!', 'Cartão cadastrado com sucesso!');
        setNumeros('');
        setMesDeExpiracao('');
        setAnoDeExpiracao('');
        setCodigoDeSeguraca('');
        setNomeDoTitular('');
        setCpf('');
        setAutorizadora('');
        navigation.navigate('Listagem');
      } catch (error) {
        console.log(error.response);
        Alert.alert('Falha ao cadastrar o cartão', error.response.data.errors[0]);
      }
    }
  }

  function validate(){
    let validador = 0;
    let mensagem = 'Um ou mais campos não foram preenchidos corretamente tente novamente!';

    if(numeros === ''){
        validador = validador + 1;
    }

    if(mesDeExpiracao === '' || mesDeExpiracao.length < 2){
        validador = validador + 1;
        mensagem = mensagem + '\n\n O mês deve ter 2 digitos!';
    }

    if(anoDeExpiracao === '' || anoDeExpiracao.length < 4){
        validador = validador + 1;
        mensagem = mensagem + '\n\n O ano de expiração deve ter 4 digitos!';
    }

    if(codigoDeSeguraca === ''){
        validador = validador + 1;
    }

    if(nomeDoTitular === ''){
        validador = validador + 1;
    }

    if(autorizadora === ''){
        validador = validador + 1;
    }

    if(validador > 0){
        console.log(validador);
        Alert.alert('Campo Obrigatório', mensagem);
        return false;
    }else{
      return true;
    }
  }

  return (
    <Background>
      <Container>
        <Form>
          <ScrollView>
            <Picker
              selectedValue={autorizadora}
              style={{backgroundColor:'#fff',marginBottom:10,height: 44}}
              itemStyle={{height: 44}}
              onValueChange={setAutorizadora}>
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
              <Picker.Item label="Alelo Alimentação" value="225" />
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
              value={numeros}
              onChangeText={setNumeros}
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
              value={mesDeExpiracao}
              onChangeText={setMesDeExpiracao}
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
              value={anoDeExpiracao}
              onChangeText={setAnoDeExpiracao}
            />

            <FormInput 
              icon="credit-card"
              keyboardType="numeric"
              keyboardCorrect={false}
              autoCapitalize="none"
              placeholder="Código de Segurança"
              returnKeyType="next"
              value={codigoDeSeguraca}
              onChangeText={setCodigoDeSeguraca}
            />

            <FormInput 
              icon="credit-card"
              keyboardCorrect={false}
              autoCapitalize="none"
              placeholder="Nome do Titular"
              returnKeyType="next"
              value={nomeDoTitular}
              onChangeText={setNomeDoTitular}
            />

            <MaskInput
            icon="credit-card"
            keyboardType="numeric"
            keyboardCorrect={false}
            autoCapitalize="none"
            placeholder="CPF do Titular"
            returnKeyType="next"
            type={'cpf'}
            value={cpf}
            onChangeText={setCpf}
            />

            <SubmitButton onPress={handleSubmit}>
              Cadastrar Cartão
            </SubmitButton>

            <SubmitButton onPress={() => navigation.navigate('Perfil')}>
                Voltar
            </SubmitButton>
          </ScrollView>
        </Form>
      </Container>
    </Background>
  );
}

Cadastrar.navigationOptions = {
  tabBarLabel: 'Cadastrar um Cartão',
  tabBarIcon: ({tintColor}) => (
    <Icon name="add" size={20} color={tintColor}/>
  ),
}
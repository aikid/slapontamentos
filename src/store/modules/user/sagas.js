import { takeLatest, call, put, all } from 'redux-saga/effects';
import { Alert } from 'react-native';
import api from '../../../services/api';
import { updateProfileSuccess, updateProfilefailure } from './actions';

export function* updateProfile({ payload }) {
  try {
    const { nomeCompleto, email, telefone, token } = payload.data;

    const profile = {
      nomeCompleto,
      email,
      telefone,
    };

    console.log(profile);

    console.log(token);
    api.defaults.headers.Authorization = `Bearer ${token}`;

    const response = yield call(api.put, '/Auth/alterar-conta', profile);

    console.log(response.data);
    
    Alert.alert('Sucesso!', 'Perfil atualizado com sucesso!');

    yield put(updateProfileSuccess(response.data));
  } catch (error) {
    console.log(error.response);
    Alert.alert('Falha na atualização', 'Erro ao atualizar Perfil');
    yield put(updateProfilefailure());
  }
}

export function* addCard({ payload }) {
  try {
    const { numero, mesDeExpiracao, anoDeExpiracao, codigoDeSeguraca, nomeDoTitular, cpfDoTitular, autorizadora, token } = payload;

    console.log('oi');
    console.log(token);
    api.defaults.headers.Authorization = `Bearer ${token}`;

    const response = yield call(api.post, '/v1/Cartoes', {
      numero,
      mesDeExpiracao,
      anoDeExpiracao,
      codigoDeSeguraca,
      nomeDoTitular,
      cpfDoTitular,
      autorizadora,
    });

    console.log(response.data);
    
    Alert.alert('Sucesso!', 'Cartão cadastro com sucesso!');

    //yield put(updateProfileSuccess(response.data));
  } catch (error) {
    console.log(error.response);
    Alert.alert('Falha ao cadastrar o cartão', 'Tente Novamente');
    //yield put(updateProfilefailure());
  }
}


export default all([
  takeLatest('@user/UPDATE_PROFILE_REQUEST', updateProfile),
  takeLatest('@user/ADD_CARD_REQUEST', addCard),
]);

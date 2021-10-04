import { takeLatest, call, put, all } from 'redux-saga/effects';
import { Alert } from 'react-native';
import api from '../../../services/api';
import { signInSuccess, signFailure,signUpSuccess } from './actions';

export function* signIn({ payload }) {
  console.log('Payload: ',payload);
  try {
    const { email, password, filial } = payload;
    
    const params = new URLSearchParams();
    params.append('grant_type', 'password');
    params.append('username', email);
    params.append('password', password);
    params.append('filial', filial);
    const response = yield call(api.post, '/Token', params);

    console.log(response.data);

    const token = response.data.access_token;

    api.defaults.headers.Authorization = `Bearer ${token}`;

    const user = {
      name: response.data.userName,
      empresaId: response.data.empresaId,
      filial: response.data.filial,
      password: password,
      datelog: new Date()
    };

    if (!user.name) {
      Alert.alert(
        'Erro no login',
        'O usuário logado não é um usuário valido!'
      );
      return;
    }

    yield put(signInSuccess(token, user));

    //history.push('/dashboard');
  } catch (err) {
    Alert.alert(
      'Falha na autenticação',
      'Houve um erro no login, verifique seu email/senha'
    );
    yield put(signFailure());
  }
}

export function* refreshlogin({ payload }) {
  console.log('Payload: ',payload);
  try {
    const { email, password, filial } = payload;
    
    const params = new URLSearchParams();
    params.append('grant_type', 'password');
    params.append('username', email);
    params.append('password', password);
    params.append('filial', filial);
    const response = yield call(api.post, '/Token', params);

    console.log(response.data);

    const token = response.data.access_token;

    api.defaults.headers.Authorization = `Bearer ${token}`;

    const user = {
      name: response.data.userName,
      empresaId: response.data.empresaId,
      filial: response.data.filial,
      password: password,
      datelog: new Date()
    };
    
    if (!user.name) {
      Alert.alert(
        'Erro no login',
        'O usuário logado não é um usuário valido!'
      );
      return;
    }

    yield put(signInSuccess(token, user));

    // history.push('/dashboard');
  } catch (err) {
    Alert.alert(
      'Falha na autenticação',
      'Houve um erro no login, verifique seu email/senha'
    );
    yield put(signFailure());
  }
}

export function* signUp({ payload }) {
  try {
    const { nomeCompleto, email, telefone, password, confirmPassword } = payload;

    yield call(api.post, '/Auth/nova-conta', {
      nomeCompleto,
      email,
      telefone,
      password,
      confirmPassword
    });
    Alert.alert('Cadastro de Usuário', 'Cadastradado com sucesso!');
    yield put(signUpSuccess());
  } catch (err) {
    console.log(err.response);
    console.log('erro no cadastro', err);
    Alert.alert('Falha no cadastro', err.response.data.errors[0]);
    yield put(signFailure());
  }
}

export function setToken({ payload }) {
  if (!payload) return;
  const { token } = payload.auth;
  if (token) {
    api.defaults.headers.Authorization = `Baerer ${token}`;
  }
}

export default all([
  takeLatest('persist/REHYDRATE', setToken),
  takeLatest('@auth/SIGN_IN_REQUEST', signIn),
  takeLatest('@auth/SIGN_UP_REQUEST', signUp),
  takeLatest('@auth/SIGN_IN_REFRESH', refreshlogin),
]);

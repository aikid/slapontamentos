import { takeLatest, call, put, all } from 'redux-saga/effects';
import { Alert } from 'react-native';
import api from '../../../services/api';
import { signInSuccess, signFailure,signUpSuccess } from './actions';

export function* signIn({ payload }) {
  try {
    const { email, password } = payload;
    const response = yield call(api.post, '/Auth/entrar', {
      email,
      password,
    });

    console.log(response.data);

    const token = response.data.data.accessToken;

    api.defaults.headers.Authorization = `Bearer ${token}`;

    const perfil = yield call(api.get, '/Auth');
    const user = perfil.data.data;
    user.password = password;
    user.datelog = new Date();
    if (!user) {
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

export function* refreshlogin({ payload }) {
  try {
    const { email, password } = payload;
    const response = yield call(api.post, '/Auth/entrar', {
      email,
      password,
    });

    console.log(response.data);

    const token = response.data.data.accessToken;

    api.defaults.headers.Authorization = `Bearer ${token}`;

    const perfil = yield call(api.get, '/Auth');
    const user = perfil.data.data;
    user.password = password;
    user.datelog = new Date();
    if (!user) {
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

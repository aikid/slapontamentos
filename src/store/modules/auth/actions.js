export function signInRequest(email, password, filial) {
  return {
    type: '@auth/SIGN_IN_REQUEST',
    payload: { email, password, filial },
  };
}

export function signInRefresh(email, password, filial) {
  return {
    type: '@auth/SIGN_IN_REFRESH',
    payload: { email, password, filial },
  };
}

export function signInSuccess(token, user) {
  return {
    type: '@auth/SIGN_IN_SUCCESS',
    payload: { token, user },
  };
}

export function signUpRequest(nomeCompleto, email, telefone, password, confirmPassword) {
  return {
    type: '@auth/SIGN_UP_REQUEST',
    payload: { nomeCompleto, email, telefone, password, confirmPassword },
  };
}

export function signUpSuccess() {
  return {
    type: '@auth/SIGN_UP_SUCCESS',
  };
}

export function signFailure() {
  return {
    type: '@auth/SIGN_IN_FAILURE',
  };
}

export function signOut() {
  return {
    type: '@auth/SIGN_OUT',
  };
}

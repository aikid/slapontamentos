export function updateProfileRequest(data) {
  return {
    type: '@user/UPDATE_PROFILE_REQUEST',
    payload: { data },
  };
}

export function addCardRequest(numero,mesDeExpiracao,anoDeExpiracao,codigoDeSeguraca,nomeDoTitular,cpfDoTitular,autorizadora,token) {
  return {
    type: '@user/ADD_CARD_REQUEST',
    payload: { numero,mesDeExpiracao,anoDeExpiracao,codigoDeSeguraca,nomeDoTitular,cpfDoTitular,autorizadora,token },
  };
}

export function updateProfileSuccess(profile) {
  return {
    type: '@user/UPDATE_PROFILE_SUCCESS',
    payload: { profile },
  };
}

export function updateProfilefailure() {
  return {
    type: '@user/UPDATE_PROFILE_FAILURE',
  };
}

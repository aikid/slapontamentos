export function machineRequest(id) {
    return {
      type: '@compra/MACHINE_REQUEST',
      payload: { id },
    };
  }
  
  export function machineSuccess(token, user) {
    return {
      type: '@compra/MACHINE_SUCCESS',
      payload: { token, user },
    };
  }
  
  export function machineFailure() {
    return {
      type: '@compra/MACHINE_FAILURE',
    };
  }
  
  export function machineOut() {
    return {
      type: '@compra/MACHINE_OUT',
    };
  }
  
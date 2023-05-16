import {createController, getController} from 'Utils/RPC';

const RPC_ID: string = 'exerciseConstructor';

createController(RPC_ID, {secured: 5556, unsecured: 5555});

export const Controller = getController(RPC_ID);

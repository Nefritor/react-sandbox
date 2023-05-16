import {createController, getController} from 'Utils/RPC';

const RPC_ID: string = 'exerciseConstructor';

createController(RPC_ID, {secured: 3336, unsecured: 3335});

export const Controller = getController(RPC_ID);

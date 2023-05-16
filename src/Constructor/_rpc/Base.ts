import {createController, getController} from 'Utils/RPC';

const RPC_ID: string = 'exerciseConstructor';

createController(RPC_ID, {secured: 1235, unsecured: 1234});

export const Controller = getController(RPC_ID);

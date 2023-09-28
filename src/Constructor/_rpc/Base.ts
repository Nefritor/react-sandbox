import { createRPC, getRPC } from 'Utils/RPC';

const RPC_ID: string = 'Constructor';

createRPC(RPC_ID, 8443);

export const call = getRPC(RPC_ID).post;

import { get, post } from './Base';

export const getRooms = async () => {
    return get('get-rooms/').then(({ data }) => data);
};

export const getRoomData = async (id: string) => {
    return post('get-room-data/', { id }).then(({ data }) => data);
};

export const createRoom = async (title: string) => {
    return post('create-room/', { title }).then(({ data }) => data);
};

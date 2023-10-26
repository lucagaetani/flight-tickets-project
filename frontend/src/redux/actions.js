import { ADD, DELETE } from './actionTypes';

export const addUserData = (userData) => {
    return {
        type: ADD,
        payload: userData,
    };
};

export const deleteUserData = () => {
    return {
        type: DELETE,
    };
};
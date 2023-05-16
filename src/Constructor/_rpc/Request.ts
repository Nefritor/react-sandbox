import {Controller} from './Base';

export const getExerciseList = () => {
    return Controller.get('exercise-list');
}

export const getExercise = (id: string) => {
    return Controller.post('get-exercise', {id});
}

export const addExercise = (data: any) => {
    return Controller.post('add-exercise', data);
}

export const removeExercise = (id: string) => {
    return Controller.post('remove-exercise', {id});
}

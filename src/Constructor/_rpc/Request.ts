import {call} from './Base';

export const getExerciseList = () => {
    return call('Exercise.GetList');
}

export const createExercise = (data: any) => {
    return call('Exercise.CreateExercise', data);
}

export const readExercise = (id: string) => {
    return call('Exercise.ReadExercise', {id});
}

export const updateExercise = (data: any) => {
    return call('Exercise.UpdateExercise', data);
}

export const deleteExercise = (id: string) => {
    return call('Exercise.DeleteExercise', {id});
}

import { TExerciseDataMeta, TExerciseDataType } from 'Constructor/interface';

export const defaultMeta: Record<TExerciseDataType, TExerciseDataMeta<TExerciseDataType>> = {
    custom: {
        name: '',
        unit: ''
    }
};

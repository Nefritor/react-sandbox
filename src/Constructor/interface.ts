export interface IExerciseBase {
    id: string;
    title: string;
}

export interface IExercise extends IExerciseBase {
    exerciseData: IExerciseData[];
}

export interface IExerciseData {
    id: string;
    type: TExerciseDataType;
    meta: TExerciseDataMeta<TExerciseDataType>;
    value?: any;
}

export type TExerciseDataMeta<Type extends TExerciseDataType> = TExerciseDataMetaTypes[Type];

export type TExerciseDataType =
    | 'custom';

interface TExerciseDataMetaTypes {
    custom: ICustomMeta;
}

interface IExerciseMeta {
    name: string;
}

interface ICustomMeta extends IExerciseMeta {
    unit: string;
}

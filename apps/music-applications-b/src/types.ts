export enum Gender {
  FEMALE = 'female',
  MALE = 'male',
  PREFER_NOT_TO_SAY = 'prefer not to say',
}

export interface AddTransactionRecordData {
  type: string;
  name: string;
}

export interface AddTransactionResult {
  isSuccess: boolean;
  records: AddTransactionRecordData[];
  reason?: string;
}

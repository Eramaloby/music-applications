export class CreateTaskDto {
  successful: boolean;
  details: string;
  reason: string;
  relationshipCount: number;
  targetRecordId: string;
  targetRecordType: string;
}

export class Event {
  ID: number;
  Name: string;
  Description: string;
  EventReview: string;
  IsRealEvent: boolean;
  CreateDate: any;
  ModifiedDate: Date;
  Event_Type: Event_Type;
  Event_Status: Event_Status;
  CreatedBy_User_ID: number;
  ModifiedBy_User_ID: number;
  ElapsedTime:string;
}

export class Event_Type {
  ID: number;
  Name: string;
}

export class Event_Status {
  ID: number;
  Name: string;
}
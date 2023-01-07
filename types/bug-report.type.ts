export enum StatusEnum {
  PENDING = "PENDING",
  ACCEPT = "ACCEPT",
  DENIED = "DENIED",
  CLOSED = "CLOSED",
}

export const statusTranslated = {
  [StatusEnum.PENDING]: "em análise",
  [StatusEnum.ACCEPT]: "sendo trabalhado",
  [StatusEnum.DENIED]: "descartado",
  [StatusEnum.CLOSED]: "consetado",
};

export type BugReportCreateRequestType = {
  title: string;
  description: string;
  steps: [
    {
      description: string;
    }
  ];
  screenshots: [
    {
      url: string;
    }
  ];
  external_id?: string;
};

export type BugReportUpdateRequestType = {
  status?: StatusEnum;
  assigned_to_id?: string;
};

export type BugReportConcludeRequestType = {
  reward_id?: string;
};

export interface BugReportType {
  id: string;
  title: string;
  description: string;
  steps: [
    {
      id: string;
      description: string;
    }
  ];
  screenshots: [
    {
      id: string;
      url: string;
    }
  ];
  notes: NoteType[];
  reward?: {
    id: string;
    name: string;
    url: string;
    notification_active: true;
    notification_title: string;
    notification_text: string;
    created_at: string;
    updated_at: string;
  };
  created_by_id: string;
  assigned_to?: Pick<UserType, "id" | "email" | "name">;
  assigned_to_id?: string;
  external_id?: string;
  reward_id?: string;
  status: StatusEnum;
  created_at: string;
  updated_at: string;
}

export type NoteCreateRequestType = {
  note: string;
  bug_report_id: string;
};

export interface NoteType {
  id: string;
  note: string;
  bug_report_id: string;
  created_by: UserType;
  created_by_id: string;
  created_at: string;
}

export type UserType = {
  id: string;
  email: string;
  name: string;
  role: Role;
  external_id: string;
  created_at: string;
  updated_at: string;
};

export enum Role {
  ADMIN = "ADMIN",
  USER = "USER",
  DEV = "DEV",
  QA = "QA",
}

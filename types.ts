
export interface Member {
  id: string;
  name: string;
}

export interface Group {
  id: string;
  name: string;
  members: Member[];
}

export enum AppMode {
  SETUP = 'SETUP',
  DRAW = 'DRAW',
  GROUPING = 'GROUPING'
}

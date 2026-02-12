
export interface Participant {
  id: string;
  name: string;
}

export interface DrawWinner {
  id: string;
  name: string;
  prize?: string;
  timestamp: number;
}

export interface Team {
  id: string;
  name: string;
  members: Participant[];
}

export enum AppTab {
  INPUT = 'input',
  DRAW = 'draw',
  GROUPING = 'grouping'
}

// src/types/index.ts

export interface Nomination {
  id: string;
  nominator: string;
  nominee: string;
  round: number;
  date: string;
  nominatorPfp: string;
}

export interface Vote {
  vote: any;
  voter: string;
  nominationId: string;
  round: number;
  date: string;
  voterPfp: string;
}

export interface CombinedVote {
  vote: Vote;
  nomination: Nomination;
}

export interface Autosubscriber {
  name: string;
  allowance: string;
  icon: string;
  color: string;
}

export interface Winner {
  roundNumber: number;
  username: string;
  date: string;
  fid: number;
  rootParentUrl: string | null;
  text: string;
}

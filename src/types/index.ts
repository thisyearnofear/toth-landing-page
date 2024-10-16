// src/types/index.ts

export interface Nomination {
  id: string;
  nominator: string;
  nominee: string;
  round: number;
  date: string;
  nominatorPfp: string;
  nominatorFid: number;
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
  date: string;
  username: string;
  fid: number;
  text: string;
}

export interface UserStats {
  votes: Vote[];
  nominations: Nomination[];
  isAutosubscriber: boolean;
  wins: Winner[];
}

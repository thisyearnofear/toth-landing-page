export interface Nomination {
  id: string;
  nominator: string;
  nominee: string;
  round: number;
  date: string;
  nominatorPfp: string;
}

export interface Vote {
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
  name: string;
  description: string;
  icon: string;
  color: string;
}

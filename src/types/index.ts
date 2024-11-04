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

export interface MemeToken {
  token_address: string; // The address of the token contract
  symbol: string; // The symbol of the token (e.g., DOGE)
  name: string; // The name of the token (e.g., Dogecoin)
  balance: string; // The balance of the token held by the user
  decimals: string; // The number of decimals the token uses
  usd_value: string; // The current USD value of the token
  chain: string; // The blockchain the token is on (e.g., eth, base, zksync)
}

export interface DegenScoreResult {
  total: number;
  breakdown: { [chain: string]: number };
  details: {
    totalTokens: number;
    chainBreakdown: {
      [chain: string]: {
        tokens: number;
        score: number;
        tokenList: Array<{ symbol: string; value: string }>;
      };
    };
  };
}

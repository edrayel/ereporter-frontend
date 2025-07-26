import { Agent, PollingUnit } from './agent';

export interface ElectionResult {
  id: string;
  agentId: string;
  agent?: Agent;
  pollingUnitId: string;
  pollingUnit?: PollingUnit;
  voteData: VoteData;
  formImageUrl?: string;
  timestamp: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  isVerified: boolean;
  verifiedBy?: string;
  verifiedAt?: string;
  createdAt: string;
}

export interface VoteData {
  totalVotes: number;
  validVotes: number;
  invalidVotes: number;
  candidates: CandidateResult[];
}

export interface CandidateResult {
  name: string;
  party: string;
  votes: number;
}

export interface CreateResultRequest {
  voteData: VoteData;
  formImage?: File;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

export interface ResultFilters {
  pollingUnitId?: string;
  agentId?: string;
  state?: string;
  lga?: string;
  isVerified?: boolean;
  startDate?: string;
  endDate?: string;
  search?: string;
  status?: string;
}

export interface ResultStats {
  totalResults: number;
  verifiedResults: number;
  pendingResults: number;
  totalVotes: number;
  averageVotesPerUnit: number;
  resultsByParty: Record<string, number>;
}

export interface ResultSummary {
  pollingUnit: PollingUnit;
  result: ElectionResult;
  agent: Agent;
  verificationStatus: 'verified' | 'pending' | 'disputed';
}

export interface Agent {
  id: string;
  userId: string;
  name: string;
  email: string;
  phone: string;
  pollingUnitId: string;
  pollingUnit?: PollingUnit | null;
  status: AgentStatus;
  isOnline: boolean;
  lastSeen: string;
  qrCode: string;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export type AgentStatus = 'active' | 'inactive' | 'suspended' | 'pending';

export interface AgentLocation {
  id: string;
  agentId: string;
  timestamp: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  accuracy: number;
  isInsideGeofence?: boolean;
  speed?: number;
  heading?: number;
}

export interface PollingUnit {
  id: string;
  code: string;
  name: string;
  lga: string;
  state: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  address: string;
  registeredVoters: number;
  isActive: boolean;
  createdAt: string;
}

export interface AgentStats {
  totalAgents: number;
  activeAgents: number;
  offlineAgents: number;
  coveragePercentage: number;
}

export interface AgentFilters {
  status?: AgentStatus;
  state?: string;
  lga?: string;
  isOnline?: boolean;
  isVerified?: boolean;
  pollingUnitId?: string;
  search?: string;
  page?: number;
  limit?: number;
}

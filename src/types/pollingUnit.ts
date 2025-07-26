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

export interface PollingUnitStats {
  totalUnits: number;
  activeUnits: number;
  inactiveUnits: number;
  totalRegisteredVoters: number;
  averageVotersPerUnit: number;
  unitsByState: Record<string, number>;
  unitsByLGA: Record<string, number>;
}

export interface PollingUnitFilters {
  state?: string;
  lga?: string;
  isActive?: boolean;
  hasAgent?: boolean;
  minVoters?: number;
  maxVoters?: number;
}

export interface CreatePollingUnitRequest {
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
}

export interface UpdatePollingUnitRequest {
  name?: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  address?: string;
  registeredVoters?: number;
  isActive?: boolean;
}

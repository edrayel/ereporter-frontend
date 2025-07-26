import axios from 'axios';
import { config, logger, shouldUseMockData } from '../config/environment';
import {
  PollingUnit,
  PollingUnitStats,
  PollingUnitFilters,
  CreatePollingUnitRequest,
  UpdatePollingUnitRequest,
} from '../types/pollingUnit';
import { mockDataService } from './mockDataService';

class PollingUnitService {
  private api = axios.create({
    baseURL: config.apiUrl,
    timeout: 10000,
  });

  constructor() {
    // Add request interceptor for authentication
    this.api.interceptors.request.use(
      config => {
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      error => {
        logger.error('Request interceptor error', error);
        return Promise.reject(error);
      },
    );

    // Add response interceptor for error handling
    this.api.interceptors.response.use(
      response => response,
      error => {
        logger.error('API Error', {
          url: error.config?.url,
          method: error.config?.method,
          status: error.response?.status,
          message: error.message,
        });
        return Promise.reject(error);
      },
    );
  }

  /**
   * Retrieves polling units with optional filtering
   * @param filters - Optional filters for polling units
   * @returns Promise resolving to polling units array
   */
  async getPollingUnits(filters?: PollingUnitFilters): Promise<PollingUnit[]> {
    logger.info('Fetching polling units', { filters, mode: config.mode });

    if (shouldUseMockData()) {
      const pollingUnits = mockDataService.getPollingUnits();
      let filteredUnits = pollingUnits;

      if (filters) {
        if (filters.state) {
          filteredUnits = filteredUnits.filter(unit => unit.state === filters.state);
        }
        if (filters.lga) {
          filteredUnits = filteredUnits.filter(unit => unit.lga === filters.lga);
        }
        if (filters.isActive !== undefined) {
          filteredUnits = filteredUnits.filter(unit => unit.isActive === filters.isActive);
        }
        if (filters.hasAgent !== undefined) {
          filteredUnits = filteredUnits.filter(unit => {
            // Mock implementation - check if unit has assigned agents (simplified)
            return filters.hasAgent ? Math.random() > 0.5 : Math.random() <= 0.5;
          });
        }
        if (filters.minVoters) {
          filteredUnits = filteredUnits.filter(unit => unit.registeredVoters >= filters.minVoters!);
        }
        if (filters.maxVoters) {
          filteredUnits = filteredUnits.filter(unit => unit.registeredVoters <= filters.maxVoters!);
        }
      }

      // Return all filtered units (pagination can be handled by the caller)
      const paginatedUnits = filteredUnits;

      logger.info('Mock polling units fetched', { count: paginatedUnits.length });
      return paginatedUnits;
    }

    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });
    }

    const response = await this.api.get(`/v1/polling-units?${params.toString()}`);
    logger.info('Polling units fetched', { count: response.data.length });
    return response.data;
  }

  /**
   * Retrieves a specific polling unit by ID
   * @param id - Polling unit ID
   * @returns Promise resolving to polling unit
   */
  async getPollingUnitById(id: string): Promise<PollingUnit> {
    logger.info('Fetching polling unit by ID', { id, mode: config.mode });

    if (shouldUseMockData()) {
      const pollingUnits = mockDataService.getPollingUnits();
      const pollingUnit = pollingUnits.find(unit => unit.id === id);

      if (!pollingUnit) {
        throw new Error(`Polling unit with ID ${id} not found`);
      }

      logger.info('Mock polling unit fetched by ID');
      return pollingUnit;
    }

    const response = await this.api.get(`/v1/polling-units/${id}`);
    logger.info('Polling unit fetched by ID');
    return response.data;
  }

  /**
   * Creates a new polling unit
   * @param pollingUnitData - Polling unit creation data
   * @returns Promise resolving to created polling unit
   */
  async createPollingUnit(pollingUnitData: CreatePollingUnitRequest): Promise<PollingUnit> {
    logger.info('Creating polling unit', { name: pollingUnitData.name, mode: config.mode });

    if (shouldUseMockData()) {
      const newPollingUnit: PollingUnit = {
        id: `pu_${Date.now()}`,
        name: pollingUnitData.name,
        code: pollingUnitData.code,
        lga: pollingUnitData.lga,
        state: pollingUnitData.state,
        coordinates: pollingUnitData.coordinates,
        address: pollingUnitData.address,
        registeredVoters: pollingUnitData.registeredVoters,
        isActive: false,
        createdAt: new Date().toISOString(),
      };

      logger.info('Mock polling unit created', { id: newPollingUnit.id });
      return newPollingUnit;
    }

    const response = await this.api.post('/v1/polling-units', pollingUnitData);
    logger.info('Polling unit created', { id: response.data.id });
    return response.data;
  }

  /**
   * Updates an existing polling unit
   * @param id - Polling unit ID
   * @param updateData - Update data
   * @returns Promise resolving to updated polling unit
   */
  async updatePollingUnit(id: string, updateData: UpdatePollingUnitRequest): Promise<PollingUnit> {
    logger.info('Updating polling unit', { id, mode: config.mode });

    if (shouldUseMockData()) {
      const pollingUnits = mockDataService.getPollingUnits();
      const pollingUnit = pollingUnits.find(unit => unit.id === id);

      if (!pollingUnit) {
        throw new Error(`Polling unit with ID ${id} not found`);
      }

      const updatedPollingUnit: PollingUnit = {
        ...pollingUnit,
        ...updateData,
      };

      logger.info('Mock polling unit updated');
      return updatedPollingUnit;
    }

    const response = await this.api.patch(`/v1/polling-units/${id}`, updateData);
    logger.info('Polling unit updated');
    return response.data;
  }

  /**
   * Deletes a polling unit
   * @param id - Polling unit ID
   * @returns Promise resolving when deletion is complete
   */
  async deletePollingUnit(id: string): Promise<void> {
    logger.info('Deleting polling unit', { id, mode: config.mode });

    if (shouldUseMockData()) {
      logger.info('Mock polling unit deleted');
      return;
    }

    await this.api.delete(`/v1/polling-units/${id}`);
    logger.info('Polling unit deleted');
  }

  /**
   * Assigns an agent to a polling unit
   * @param pollingUnitId - Polling unit ID
   * @param agentId - Agent ID
   * @returns Promise resolving to updated polling unit
   */
  async assignAgent(pollingUnitId: string, agentId: string): Promise<PollingUnit> {
    logger.info('Assigning agent to polling unit', { pollingUnitId, agentId, mode: config.mode });

    if (shouldUseMockData()) {
      const pollingUnits = mockDataService.getPollingUnits();
      const pollingUnit = pollingUnits.find(unit => unit.id === pollingUnitId);

      if (!pollingUnit) {
        throw new Error(`Polling unit with ID ${pollingUnitId} not found`);
      }

      // Mock implementation - in real scenario, this would update the assignment
      const updatedPollingUnit: PollingUnit = {
        ...pollingUnit,
      };

      logger.info('Mock agent assigned to polling unit');
      return updatedPollingUnit;
    }

    const response = await this.api.post(`/v1/polling-units/${pollingUnitId}/assign-agent`, {
      agentId,
    });
    logger.info('Agent assigned to polling unit');
    return response.data;
  }

  /**
   * Removes an agent from a polling unit
   * @param pollingUnitId - Polling unit ID
   * @param agentId - Agent ID
   * @returns Promise resolving to updated polling unit
   */
  async removeAgent(pollingUnitId: string, agentId: string): Promise<PollingUnit> {
    logger.info('Removing agent from polling unit', { pollingUnitId, agentId, mode: config.mode });

    if (shouldUseMockData()) {
      const pollingUnits = mockDataService.getPollingUnits();
      const pollingUnit = pollingUnits.find(unit => unit.id === pollingUnitId);

      if (!pollingUnit) {
        throw new Error(`Polling unit with ID ${pollingUnitId} not found`);
      }

      // Mock implementation - in real scenario, this would update the assignment
      const updatedPollingUnit: PollingUnit = {
        ...pollingUnit,
      };

      logger.info('Mock agent removed from polling unit');
      return updatedPollingUnit;
    }

    const response = await this.api.delete(`/v1/polling-units/${pollingUnitId}/agents/${agentId}`);
    logger.info('Agent removed from polling unit');
    return response.data;
  }

  /**
   * Retrieves polling unit statistics
   * @param filters - Optional filters for statistics
   * @returns Promise resolving to polling unit statistics
   */
  async getPollingUnitStats(filters?: Partial<PollingUnitFilters>): Promise<PollingUnitStats> {
    logger.info('Fetching polling unit stats', { filters, mode: config.mode });

    if (shouldUseMockData()) {
      const pollingUnits = mockDataService.getPollingUnits();
      let filteredUnits = pollingUnits;

      // Apply filters if provided
      if (filters) {
        if (filters.state) {
          filteredUnits = filteredUnits.filter(unit => unit.state === filters.state);
        }
        if (filters.lga) {
          filteredUnits = filteredUnits.filter(unit => unit.lga === filters.lga);
        }
        if (filters.isActive !== undefined) {
          filteredUnits = filteredUnits.filter(unit => unit.isActive === filters.isActive);
        }
      }

      const stats: PollingUnitStats = {
        totalUnits: filteredUnits.length,
        activeUnits: filteredUnits.filter(unit => unit.isActive).length,
        inactiveUnits: filteredUnits.filter(unit => !unit.isActive).length,
        totalRegisteredVoters: filteredUnits.reduce((sum, unit) => sum + unit.registeredVoters, 0),
        averageVotersPerUnit:
          filteredUnits.reduce((sum, unit) => sum + unit.registeredVoters, 0) /
            filteredUnits.length || 0,
        unitsByState: filteredUnits.reduce(
          (acc, unit) => {
            acc[unit.state] = (acc[unit.state] || 0) + 1;
            return acc;
          },
          {} as Record<string, number>,
        ),
        unitsByLGA: filteredUnits.reduce(
          (acc, unit) => {
            acc[unit.lga] = (acc[unit.lga] || 0) + 1;
            return acc;
          },
          {} as Record<string, number>,
        ),
      };

      logger.info('Mock polling unit stats fetched', {
        totalUnits: stats.totalUnits,
        activeUnits: stats.activeUnits,
      });
      return stats;
    }

    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });
    }

    const response = await this.api.get(`/v1/polling-units/stats?${params.toString()}`);
    logger.info('Polling unit stats fetched');
    return response.data;
  }

  /**
   * Activates a polling unit
   * @param id - Polling unit ID
   * @returns Promise resolving to updated polling unit
   */
  async activatePollingUnit(id: string): Promise<PollingUnit> {
    logger.info('Activating polling unit', { id, mode: config.mode });

    if (shouldUseMockData()) {
      const pollingUnits = mockDataService.getPollingUnits();
      const pollingUnit = pollingUnits.find(unit => unit.id === id);

      if (!pollingUnit) {
        throw new Error(`Polling unit with ID ${id} not found`);
      }

      const updatedPollingUnit: PollingUnit = {
        ...pollingUnit,
        isActive: true,
      };

      logger.info('Mock polling unit activated');
      return updatedPollingUnit;
    }

    const response = await this.api.patch(`/v1/polling-units/${id}/activate`);
    logger.info('Polling unit activated');
    return response.data;
  }

  /**
   * Deactivates a polling unit
   * @param id - Polling unit ID
   * @returns Promise resolving to updated polling unit
   */
  async deactivatePollingUnit(id: string): Promise<PollingUnit> {
    logger.info('Deactivating polling unit', { id, mode: config.mode });

    if (shouldUseMockData()) {
      const pollingUnits = mockDataService.getPollingUnits();
      const pollingUnit = pollingUnits.find(unit => unit.id === id);

      if (!pollingUnit) {
        throw new Error(`Polling unit with ID ${id} not found`);
      }

      const updatedPollingUnit: PollingUnit = {
        ...pollingUnit,
        isActive: false,
      };

      logger.info('Mock polling unit deactivated');
      return updatedPollingUnit;
    }

    const response = await this.api.patch(`/v1/polling-units/${id}/deactivate`);
    logger.info('Polling unit deactivated');
    return response.data;
  }

  /**
   * Searches polling units by text query
   * @param query - Search query
   * @param filters - Optional additional filters
   * @returns Promise resolving to matching polling units
   */
  async searchPollingUnits(query: string, filters?: PollingUnitFilters): Promise<PollingUnit[]> {
    logger.info('Searching polling units', { query, filters, mode: config.mode });

    if (shouldUseMockData()) {
      const searchFilters = {
        ...filters,
        search: query,
      };

      const searchResults = await this.getPollingUnits(searchFilters);

      logger.info('Mock polling units searched', {
        query,
        totalResults: searchResults.length,
      });
      return searchResults;
    }

    const params = new URLSearchParams({ q: query });
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });
    }

    const response = await this.api.get(`/v1/polling-units/search?${params.toString()}`);
    logger.info('Polling units searched', {
      query,
      totalResults: response.data.length,
    });
    return response.data;
  }

  /**
   * Exports polling units to CSV format
   * @param filters - Optional filters for export
   * @returns Promise resolving to CSV data
   */
  async exportPollingUnits(filters?: PollingUnitFilters): Promise<string> {
    logger.info('Exporting polling units', { filters, mode: config.mode });

    if (shouldUseMockData()) {
      const pollingUnits = await this.getPollingUnits(filters);

      // Generate CSV headers
      const headers = [
        'ID',
        'Name',
        'Code',
        'State',
        'LGA',
        'Ward',
        'Address',
        'Capacity',
        'Status',
        'Assigned Agents',
        'Created At',
        'Updated At',
      ];

      // Generate CSV rows
      const rows = pollingUnits.map(unit => [
        unit.id,
        unit.name,
        unit.code,
        unit.state,
        unit.lga,
        '',
        unit.address,
        unit.registeredVoters.toString(),
        unit.isActive ? 'Active' : 'Inactive',
        '0',
        unit.createdAt,
        '',
      ]);

      // Combine headers and rows
      const csvContent = [headers, ...rows]
        .map(row => row.map(field => `"${field}"`).join(','))
        .join('\n');

      logger.info('Mock polling units exported', { count: pollingUnits.length });
      return csvContent;
    }

    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });
    }

    const response = await this.api.get(`/v1/polling-units/export?${params.toString()}`, {
      responseType: 'text',
    });

    logger.info('Polling units exported');
    return response.data;
  }
}

export const pollingUnitService = new PollingUnitService();
export default pollingUnitService;

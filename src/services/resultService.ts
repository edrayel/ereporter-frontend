import axios, { AxiosResponse } from 'axios';
import {
  ElectionResult,
  ResultFilters,
  CreateResultRequest,
  ResultStats,
  ResultSummary,
} from '../types/result';
import { mockDataService } from './mockDataService';
import { config, shouldUseMockData } from '../config/environment';

// Base URL for the API
const API_BASE_URL = config.apiUrl;

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  },
);

// Response interceptor for error handling
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  },
);

/**
 * Result Service
 * Handles all election result-related API calls
 */
class ResultService {
  private useMockData = shouldUseMockData();

  /**
   * Get all election results with optional filtering
   */
  async getResults(filters?: ResultFilters): Promise<ElectionResult[]> {
    try {
      if (this.useMockData) {
        // Return mock data for now
        return this.generateMockResults();
      }

      const params = new URLSearchParams();
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            params.append(key, value.toString());
          }
        });
      }

      const response: AxiosResponse<ElectionResult[]> = await api.get(
        `/results?${params.toString()}`,
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching results:', error);
      throw new Error('Failed to fetch results');
    }
  }

  /**
   * Get a specific election result by ID
   */
  async getResultById(id: string): Promise<ElectionResult> {
    try {
      if (this.useMockData) {
        const results = this.generateMockResults();
        const result = results.find(r => r.id === id);
        if (!result) {
          throw new Error('Result not found');
        }
        return result;
      }

      const response: AxiosResponse<ElectionResult> = await api.get(`/results/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching result:', error);
      throw new Error('Failed to fetch result');
    }
  }

  /**
   * Create a new election result
   */
  async createResult(data: CreateResultRequest): Promise<ElectionResult> {
    try {
      if (this.useMockData) {
        // Create mock result
        const newResult: ElectionResult = {
          id: `result-${Date.now()}`,
          agentId: 'mock-agent-id',
          pollingUnitId: 'mock-polling-unit-id',
          voteData: data.voteData,
          timestamp: new Date().toISOString(),
          coordinates: data.coordinates || { latitude: 0, longitude: 0 },
          isVerified: false,
          createdAt: new Date().toISOString(),
        };
        return newResult;
      }

      const formData = new FormData();
      formData.append('voteData', JSON.stringify(data.voteData));

      if (data.formImage) {
        formData.append('formImage', data.formImage);
      }

      if (data.coordinates) {
        formData.append('coordinates', JSON.stringify(data.coordinates));
      }

      const response: AxiosResponse<ElectionResult> = await api.post('/results', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error creating result:', error);
      throw new Error('Failed to create result');
    }
  }

  /**
   * Update an existing election result
   */
  async updateResult(id: string, data: Partial<CreateResultRequest>): Promise<ElectionResult> {
    try {
      if (this.useMockData) {
        const result = await this.getResultById(id);
        return {
          ...result,
          voteData: data.voteData || result.voteData,
          coordinates: data.coordinates || result.coordinates,
        };
      }

      const formData = new FormData();
      if (data.voteData) {
        formData.append('voteData', JSON.stringify(data.voteData));
      }

      if (data.formImage) {
        formData.append('formImage', data.formImage);
      }

      if (data.coordinates) {
        formData.append('coordinates', JSON.stringify(data.coordinates));
      }

      const response: AxiosResponse<ElectionResult> = await api.put(`/results/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error updating result:', error);
      throw new Error('Failed to update result');
    }
  }

  /**
   * Delete an election result
   */
  async deleteResult(id: string): Promise<void> {
    try {
      if (this.useMockData) {
        // Mock deletion - just return
        return;
      }

      await api.delete(`/results/${id}`);
    } catch (error) {
      console.error('Error deleting result:', error);
      throw new Error('Failed to delete result');
    }
  }

  /**
   * Verify an election result
   */
  async verifyResult(id: string): Promise<ElectionResult> {
    try {
      if (this.useMockData) {
        const result = await this.getResultById(id);
        return {
          ...result,
          isVerified: true,
          verifiedAt: new Date().toISOString(),
          verifiedBy: 'mock-admin',
        };
      }

      const response: AxiosResponse<ElectionResult> = await api.post(`/results/${id}/verify`);
      return response.data;
    } catch (error) {
      console.error('Error verifying result:', error);
      throw new Error('Failed to verify result');
    }
  }

  /**
   * Reject an election result
   */
  async rejectResult(id: string, reason: string): Promise<ElectionResult> {
    try {
      if (this.useMockData) {
        const result = await this.getResultById(id);
        return {
          ...result,
          isVerified: false,
        };
      }

      const response: AxiosResponse<ElectionResult> = await api.post(`/results/${id}/reject`, {
        reason,
      });
      return response.data;
    } catch (error) {
      console.error('Error rejecting result:', error);
      throw new Error('Failed to reject result');
    }
  }

  /**
   * Get result statistics
   */
  async getResultStats(filters?: ResultFilters): Promise<ResultStats> {
    try {
      if (this.useMockData) {
        const results = this.generateMockResults();
        return {
          totalResults: results.length,
          verifiedResults: results.filter(r => r.isVerified).length,
          pendingResults: results.filter(r => !r.isVerified).length,
          totalVotes: results.reduce((sum, r) => sum + r.voteData.totalVotes, 0),
          averageVotesPerUnit:
            results.length > 0
              ? results.reduce((sum, r) => sum + r.voteData.totalVotes, 0) / results.length
              : 0,
          resultsByParty: {},
        };
      }

      const params = new URLSearchParams();
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            params.append(key, value.toString());
          }
        });
      }

      const response: AxiosResponse<ResultStats> = await api.get(
        `/results/stats?${params.toString()}`,
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching result stats:', error);
      throw new Error('Failed to fetch result statistics');
    }
  }

  /**
   * Get result summary for dashboard
   */
  async getResultSummary(filters?: ResultFilters): Promise<ResultSummary[]> {
    try {
      if (this.useMockData) {
        return [];
      }

      const params = new URLSearchParams();
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            params.append(key, value.toString());
          }
        });
      }

      const response: AxiosResponse<ResultSummary[]> = await api.get(
        `/results/summary?${params.toString()}`,
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching result summary:', error);
      throw new Error('Failed to fetch result summary');
    }
  }

  /**
   * Export results to CSV
   */
  async exportResults(filters?: ResultFilters): Promise<Blob> {
    try {
      if (this.useMockData) {
        const csvContent = 'ID,Polling Unit,Total Votes,Verified\n';
        return new Blob([csvContent], { type: 'text/csv' });
      }

      const params = new URLSearchParams();
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            params.append(key, value.toString());
          }
        });
      }

      const response: AxiosResponse<Blob> = await api.get(`/results/export?${params.toString()}`, {
        responseType: 'blob',
      });
      return response.data;
    } catch (error) {
      console.error('Error exporting results:', error);
      throw new Error('Failed to export results');
    }
  }

  /**
   * Get results by polling unit
   */
  async getResultsByPollingUnit(pollingUnitId: string): Promise<ElectionResult[]> {
    try {
      if (this.useMockData) {
        const results = this.generateMockResults();
        return results.filter(r => r.pollingUnitId === pollingUnitId);
      }

      const response: AxiosResponse<ElectionResult[]> = await api.get(
        `/results/polling-unit/${pollingUnitId}`,
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching results by polling unit:', error);
      throw new Error('Failed to fetch results by polling unit');
    }
  }

  /**
   * Get results by agent
   */
  async getResultsByAgent(agentId: string): Promise<ElectionResult[]> {
    try {
      if (this.useMockData) {
        const results = this.generateMockResults();
        return results.filter(r => r.agentId === agentId);
      }

      const response: AxiosResponse<ElectionResult[]> = await api.get(`/results/agent/${agentId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching results by agent:', error);
      throw new Error('Failed to fetch results by agent');
    }
  }

  /**
   * Generate mock results for development
   */
  private generateMockResults(): ElectionResult[] {
    return [
      {
        id: 'result-1',
        agentId: 'agent-1',
        agent: {
          id: 'agent-1',
          userId: 'user-1',
          name: 'John Doe',
          email: 'john@example.com',
          phone: '+234123456789',
          pollingUnitId: 'pu-1',
          status: 'active',
          isOnline: true,
          lastSeen: new Date().toISOString(),
          qrCode: 'QR123456',
          isVerified: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        pollingUnitId: 'pu-1',
        pollingUnit: {
          id: 'pu-1',
          name: 'Ward 1 Polling Unit A',
          code: 'WD1PUA',
          lga: 'Ikeja',
          state: 'Lagos',
          address: '123 Main Street, Ikeja',
          coordinates: { latitude: 6.5244, longitude: 3.3792 },
          registeredVoters: 1500,
          isActive: true,
          createdAt: new Date().toISOString(),
        },
        voteData: {
          totalVotes: 1200,
          validVotes: 1180,
          invalidVotes: 20,
          candidates: [
            { name: 'Candidate A', party: 'Party A', votes: 600 },
            { name: 'Candidate B', party: 'Party B', votes: 400 },
            { name: 'Candidate C', party: 'Party C', votes: 180 },
          ],
        },
        timestamp: new Date().toISOString(),
        coordinates: { latitude: 6.5244, longitude: 3.3792 },
        isVerified: true,
        verifiedBy: 'admin-1',
        verifiedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
      },
      {
        id: 'result-2',
        agentId: 'agent-2',
        agent: {
          id: 'agent-2',
          userId: 'user-2',
          name: 'Jane Smith',
          email: 'jane@example.com',
          phone: '+234987654321',
          pollingUnitId: 'pu-2',
          status: 'active',
          isOnline: false,
          lastSeen: new Date(Date.now() - 3600000).toISOString(),
          qrCode: 'QR789012',
          isVerified: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        pollingUnitId: 'pu-2',
        pollingUnit: {
          id: 'pu-2',
          name: 'Ward 2 Polling Unit B',
          code: 'WD2PUB',
          lga: 'Victoria Island',
          state: 'Lagos',
          address: '456 Victoria Street, VI',
          coordinates: { latitude: 6.4281, longitude: 3.4219 },
          registeredVoters: 2000,
          isActive: true,
          createdAt: new Date().toISOString(),
        },
        voteData: {
          totalVotes: 1800,
          validVotes: 1750,
          invalidVotes: 50,
          candidates: [
            { name: 'Candidate A', party: 'Party A', votes: 800 },
            { name: 'Candidate B', party: 'Party B', votes: 650 },
            { name: 'Candidate C', party: 'Party C', votes: 300 },
          ],
        },
        timestamp: new Date().toISOString(),
        coordinates: { latitude: 6.4281, longitude: 3.4219 },
        isVerified: false,
        createdAt: new Date().toISOString(),
      },
    ];
  }
}

// Export singleton instance
const resultService = new ResultService();
export default resultService;

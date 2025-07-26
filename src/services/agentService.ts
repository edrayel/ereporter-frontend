import axios from 'axios';
import { config, logger, shouldUseMockData } from '../config/environment';
import { Agent, AgentLocation, AgentStats, AgentFilters } from '../types/agent';
import { mockDataService } from './mockDataService';

class AgentService {
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

  async getAgents(filters?: AgentFilters): Promise<Agent[]> {
    logger.info('Fetching agents', { filters, mode: config.mode });

    if (shouldUseMockData()) {
      const agents = mockDataService.getAgents();
      let filteredAgents = agents;

      if (filters) {
        if (filters.status) {
          filteredAgents = filteredAgents.filter(agent => agent.status === filters.status);
        }
        if (filters.pollingUnitId) {
          filteredAgents = filteredAgents.filter(
            agent => agent.pollingUnit?.id === filters.pollingUnitId,
          );
        }
        if (filters.search) {
          const searchLower = filters.search.toLowerCase();
          filteredAgents = filteredAgents.filter(
            agent =>
              agent.name.toLowerCase().includes(searchLower) ||
              agent.email.toLowerCase().includes(searchLower) ||
              agent.phone.includes(filters.search!),
          );
        }
      }

      logger.info('Mock agents fetched', { count: filteredAgents.length });
      return filteredAgents;
    }

    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.pollingUnitId) params.append('pollingUnitId', filters.pollingUnitId);
    if (filters?.search) params.append('search', filters.search);
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.limit) params.append('limit', filters.limit.toString());

    const response = await this.api.get(`/v1/agents?${params.toString()}`);
    logger.info('Agents fetched', { count: response.data.length });
    return response.data;
  }

  async getAgent(id: string): Promise<Agent> {
    logger.info('Fetching agent', { id, mode: config.mode });

    if (shouldUseMockData()) {
      const agents = mockDataService.getAgents();
      const agent = agents.find(a => a.id === id);

      if (!agent) {
        throw new Error('Agent not found');
      }

      logger.info('Mock agent fetched', { agentId: id });
      return agent;
    }

    const response = await this.api.get(`/v1/agents/${id}`);
    logger.info('Agent fetched', { agentId: id });
    return response.data;
  }

  async createAgent(agentData: Partial<Agent>): Promise<Agent> {
    logger.info('Creating agent', { email: agentData.email, mode: config.mode });

    if (shouldUseMockData()) {
      const newAgent: Agent = {
        id: `agent_${Date.now()}`,
        userId: agentData.userId || `user_${Date.now()}`,
        name: agentData.name || 'New Agent',
        email: agentData.email || '',
        phone: agentData.phone || '',
        pollingUnitId: agentData.pollingUnitId || '',
        status: 'pending',
        isOnline: false,
        lastSeen: new Date().toISOString(),
        qrCode: `qr_${Date.now()}`,
        isVerified: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        pollingUnit: agentData.pollingUnit || null,
        ...agentData,
      };

      logger.info('Mock agent created', { agentId: newAgent.id });
      return newAgent;
    }

    const response = await this.api.post('/v1/agents', agentData);
    logger.info('Agent created', { agentId: response.data.id });
    return response.data;
  }

  async updateAgent(id: string, agentData: Partial<Agent>): Promise<Agent> {
    logger.info('Updating agent', { id, mode: config.mode });

    if (shouldUseMockData()) {
      const agents = mockDataService.getAgents();
      const agentIndex = agents.findIndex(a => a.id === id);

      if (agentIndex === -1) {
        throw new Error('Agent not found');
      }

      const updatedAgent = {
        ...agents[agentIndex],
        ...agentData,
        updatedAt: new Date().toISOString(),
      };

      logger.info('Mock agent updated', { agentId: id });
      return updatedAgent;
    }

    const response = await this.api.put(`/v1/agents/${id}`, agentData);
    logger.info('Agent updated', { agentId: id });
    return response.data;
  }

  async deleteAgent(id: string): Promise<void> {
    logger.info('Deleting agent', { id, mode: config.mode });

    if (shouldUseMockData()) {
      logger.info('Mock agent deleted', { agentId: id });
      return;
    }

    await this.api.delete(`/v1/agents/${id}`);
    logger.info('Agent deleted', { agentId: id });
  }

  async getAgentLocation(id: string): Promise<AgentLocation | null> {
    logger.info('Fetching agent location', { id, mode: config.mode });

    if (shouldUseMockData()) {
      const agents = mockDataService.getAgents();
      const agent = agents.find(a => a.id === id);

      if (!agent || !agent.pollingUnit) {
        return null;
      }

      const location: AgentLocation = {
        id: `location_${id}`,
        agentId: id,
        coordinates: {
          latitude: agent.pollingUnit.coordinates.latitude + (Math.random() - 0.5) * 0.001,
          longitude: agent.pollingUnit.coordinates.longitude + (Math.random() - 0.5) * 0.001,
        },
        accuracy: Math.floor(Math.random() * 10) + 5,
        timestamp: new Date().toISOString(),
        isInsideGeofence: Math.random() > 0.2,
        speed: Math.random() * 5,
        heading: Math.floor(Math.random() * 360),
      };

      logger.info('Mock agent location fetched', { agentId: id });
      return location;
    }

    const response = await this.api.get(`/v1/agents/${id}/location`);
    logger.info('Agent location fetched', { agentId: id });
    return response.data;
  }

  async updateAgentLocation(id: string, location: Partial<AgentLocation>): Promise<AgentLocation> {
    logger.info('Updating agent location', { id, mode: config.mode });

    if (shouldUseMockData()) {
      const mockLocation: AgentLocation = {
        id: `location_${id}`,
        agentId: id,
        coordinates: location.coordinates || { latitude: 0, longitude: 0 },
        accuracy: location.accuracy || 10,
        timestamp: new Date().toISOString(),
        isInsideGeofence: location.isInsideGeofence || false,
        speed: location.speed || 0,
        heading: location.heading || 0,
      };

      logger.info('Mock agent location updated', { agentId: id });
      return mockLocation;
    }

    const response = await this.api.put(`/v1/agents/${id}/location`, location);
    logger.info('Agent location updated', { agentId: id });
    return response.data;
  }

  async getAgentStats(): Promise<AgentStats> {
    logger.info('Fetching agent stats', { mode: config.mode });

    if (shouldUseMockData()) {
      const agents = mockDataService.getAgents();
      const stats: AgentStats = {
        totalAgents: agents.length,
        activeAgents: agents.filter(a => a.status === 'active').length,
        offlineAgents: agents.filter(a => !a.isOnline).length,
        coveragePercentage: Math.round(
          (agents.filter(a => a.status === 'active').length / agents.length) * 100,
        ),
      };

      logger.info('Mock agent stats fetched', stats);
      return stats;
    }

    const response = await this.api.get('/v1/agents/stats');
    logger.info('Agent stats fetched', response.data);
    return response.data;
  }

  async approveAgent(id: string): Promise<Agent> {
    logger.info('Approving agent', { id, mode: config.mode });

    if (shouldUseMockData()) {
      const agents = mockDataService.getAgents();
      const agent = agents.find(a => a.id === id);

      if (!agent) {
        throw new Error('Agent not found');
      }

      const approvedAgent = {
        ...agent,
        status: 'active' as const,
        updatedAt: new Date().toISOString(),
      };

      logger.info('Mock agent approved', { agentId: id });
      return approvedAgent;
    }

    const response = await this.api.post(`/v1/agents/${id}/approve`);
    logger.info('Agent approved', { agentId: id });
    return response.data;
  }

  async rejectAgent(id: string, reason?: string): Promise<void> {
    logger.info('Rejecting agent', { id, reason, mode: config.mode });

    if (shouldUseMockData()) {
      logger.info('Mock agent rejected', { agentId: id, reason });
      return;
    }

    await this.api.post(`/v1/agents/${id}/reject`, { reason });
    logger.info('Agent rejected', { agentId: id });
  }
}

export const agentService = new AgentService();
export default agentService;

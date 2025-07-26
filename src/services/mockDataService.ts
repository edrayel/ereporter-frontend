/**
 * Mock Data Service for Proto Mode
 * Provides comprehensive test data that mimics production-level functionality
 */

import { Agent, AgentLocation, AgentStatus, PollingUnit } from '../types/agent';
import { AuditLog } from '../types/audit';
import { User } from '../types/auth';
import { Notification } from '../types/notification';
import { Report, ReportCategory, ReportSeverity } from '../types/report';
import { ElectionResult, VoteData } from '../types/result';

// Nigerian states and LGAs for realistic data
const NIGERIAN_STATES = [
  { name: 'Lagos', lgas: ['Ikeja', 'Lagos Island', 'Lagos Mainland', 'Surulere', 'Alimosho'] },
  { name: 'Kano', lgas: ['Kano Municipal', 'Fagge', 'Dala', 'Gwale', 'Tarauni'] },
  { name: 'Rivers', lgas: ['Port Harcourt', 'Obio-Akpor', 'Eleme', 'Ikwerre', 'Emohua'] },
  { name: 'Kaduna', lgas: ['Kaduna North', 'Kaduna South', 'Chikun', 'Igabi', 'Kajuru'] },
  { name: 'Oyo', lgas: ['Ibadan North', 'Ibadan South-West', 'Egbeda', 'Akinyele', 'Lagelu'] },
];

const POLITICAL_PARTIES = ['APC', 'PDP', 'LP', 'NNPP', 'APGA', 'ADC', 'SDP'];

const CANDIDATE_NAMES = [
  'Adebayo Johnson',
  'Fatima Abdullahi',
  'Chinedu Okafor',
  'Aisha Mohammed',
  'Emeka Nwankwo',
  'Zainab Ibrahim',
  'Olumide Adeyemi',
  'Hauwa Garba',
  'Kemi Ogundimu',
  'Yusuf Aliyu',
  'Ngozi Okwu',
  'Aminu Bello',
];

const AGENT_NAMES = [
  'John Adebayo',
  'Mary Okonkwo',
  'Ibrahim Musa',
  'Grace Eze',
  'Ahmed Yusuf',
  'Blessing Okoro',
  'Musa Garba',
  'Chioma Nwosu',
  'Abdullahi Sani',
  'Funmi Adebisi',
  'Usman Bello',
  'Patience Okafor',
];

class MockDataService {
  private agents: Agent[] = [];
  private agentLocations: AgentLocation[] = [];
  private reports: Report[] = [];
  private results: ElectionResult[] = [];
  private pollingUnits: PollingUnit[] = [];
  private notifications: Notification[] = [];
  private auditLogs: AuditLog[] = [];
  private users: User[] = [];

  constructor() {
    this.generateMockData();
  }

  private generateMockData() {
    this.generatePollingUnits();
    this.generateUsers();
    this.generateAgents();
    this.generateAgentLocations();
    this.generateReports();
    this.generateResults();
    this.generateNotifications();
    this.generateAuditLogs();
  }

  private generatePollingUnits() {
    let puId = 1;
    NIGERIAN_STATES.forEach(state => {
      state.lgas.forEach(lga => {
        for (let i = 1; i <= 10; i++) {
          const lat = 6.5244 + (Math.random() - 0.5) * 10; // Nigeria latitude range
          const lng = 3.3792 + (Math.random() - 0.5) * 20; // Nigeria longitude range

          this.pollingUnits.push({
            id: `PU${puId.toString().padStart(6, '0')}`,
            code: `${state.name.substring(0, 2).toUpperCase()}/${lga.substring(0, 3).toUpperCase()}/${i.toString().padStart(3, '0')}`,
            name: `${lga} Ward ${Math.ceil(i / 2)} Unit ${i}`,
            lga,
            state: state.name,
            coordinates: {
              latitude: lat,
              longitude: lng,
            },
            address: `${i} Election Street, ${lga}, ${state.name}`,
            registeredVoters: Math.floor(Math.random() * 800) + 200,
            isActive: Math.random() > 0.1,
            createdAt: new Date(
              Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000,
            ).toISOString(),
          });
          puId++;
        }
      });
    });
  }

  private generateUsers() {
    // Admin user
    this.users.push({
      id: 'user_admin_001',
      name: 'System Administrator',
      email: 'admin@ereporter.ng',
      phone: '+2348012345678',
      role: 'admin',
      isActive: true,
      isEmailVerified: true,
      isPhoneVerified: true,
      twoFactorEnabled: true,
      createdAt: new Date('2024-01-01').toISOString(),
      lastLogin: new Date().toISOString(),
    });

    // Coordinator users
    NIGERIAN_STATES.forEach((state, index) => {
      this.users.push({
        id: `user_coord_${(index + 1).toString().padStart(3, '0')}`,
        name: `${state.name} Coordinator`,
        email: `coordinator.${state.name.toLowerCase()}@ereporter.ng`,
        phone: `+234801234${(5679 + index).toString()}`,
        role: 'coordinator',
        isActive: true,
        isEmailVerified: true,
        isPhoneVerified: true,
        twoFactorEnabled: false,
        createdAt: new Date(Date.now() - Math.random() * 15 * 24 * 60 * 60 * 1000).toISOString(),
        lastLogin: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toISOString(),
      });
    });

    // Legal team users
    for (let i = 1; i <= 3; i++) {
      this.users.push({
        id: `user_legal_${i.toString().padStart(3, '0')}`,
        name: `Legal Officer ${i}`,
        email: `legal${i}@ereporter.ng`,
        phone: `+234801234${(5700 + i).toString()}`,
        role: 'legal',
        isActive: true,
        isEmailVerified: true,
        isPhoneVerified: true,
        twoFactorEnabled: true,
        createdAt: new Date(Date.now() - Math.random() * 10 * 24 * 60 * 60 * 1000).toISOString(),
        lastLogin: new Date(Date.now() - Math.random() * 12 * 60 * 60 * 1000).toISOString(),
      });
    }

    // Leadership users
    for (let i = 1; i <= 2; i++) {
      this.users.push({
        id: `user_leader_${i.toString().padStart(3, '0')}`,
        name: `Party Leader ${i}`,
        email: `leader${i}@ereporter.ng`,
        phone: `+234801234${(5710 + i).toString()}`,
        role: 'leadership',
        isActive: true,
        isEmailVerified: true,
        isPhoneVerified: true,
        twoFactorEnabled: true,
        createdAt: new Date(Date.now() - Math.random() * 5 * 24 * 60 * 60 * 1000).toISOString(),
        lastLogin: new Date(Date.now() - Math.random() * 6 * 60 * 60 * 1000).toISOString(),
      });
    }
  }

  private generateAgents() {
    this.pollingUnits.forEach((pu, index) => {
      if (Math.random() > 0.05) {
        // 95% of polling units have agents
        const agentName = AGENT_NAMES[index % AGENT_NAMES.length];
        const status: AgentStatus = this.getRandomAgentStatus();

        this.agents.push({
          id: `agent_${(index + 1).toString().padStart(6, '0')}`,
          userId: `user_agent_${(index + 1).toString().padStart(6, '0')}`,
          name: agentName,
          email: `${agentName.toLowerCase().replace(' ', '.')}@agent.ereporter.ng`,
          phone: `+234${Math.floor(Math.random() * 900000000) + 7000000000}`,
          pollingUnitId: pu.id,
          pollingUnit: pu,
          status,
          isOnline: status === 'active',
          lastSeen: new Date(Date.now() - Math.random() * 2 * 60 * 60 * 1000).toISOString(),
          qrCode: `QR_${(index + 1).toString().padStart(6, '0')}`,
          isVerified: Math.random() > 0.1,
          createdAt: new Date(Date.now() - Math.random() * 20 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - Math.random() * 60 * 60 * 1000).toISOString(),
        });

        // Create corresponding user
        this.users.push({
          id: `user_agent_${(index + 1).toString().padStart(6, '0')}`,
          name: agentName,
          email: `${agentName.toLowerCase().replace(' ', '.')}@agent.ereporter.ng`,
          phone: `+234${Math.floor(Math.random() * 900000000) + 7000000000}`,
          role: 'agent',
          isActive: true,
          isEmailVerified: Math.random() > 0.2,
          isPhoneVerified: true,
          twoFactorEnabled: false,
          createdAt: new Date(Date.now() - Math.random() * 20 * 24 * 60 * 60 * 1000).toISOString(),
          lastLogin: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toISOString(),
        });
      }
    });
  }

  private getRandomAgentStatus(): AgentStatus {
    const statuses: AgentStatus[] = ['active', 'inactive', 'suspended'];
    const weights = [0.7, 0.2, 0.1]; // 70% active, 20% inactive, 10% suspended
    const random = Math.random();
    let cumulative = 0;

    for (let i = 0; i < weights.length; i++) {
      cumulative += weights[i];
      if (random <= cumulative) {
        return statuses[i];
      }
    }
    return 'active';
  }

  private generateAgentLocations() {
    this.agents.forEach(agent => {
      const pu = agent.pollingUnit;
      if (!pu) return;

      // Generate location history for the last 24 hours
      for (let i = 0; i < 48; i++) {
        const timestamp = new Date(Date.now() - i * 30 * 60 * 1000).toISOString(); // Every 30 minutes
        const isWithinGeofence = Math.random() > 0.1; // 90% within geofence

        let lat = pu.coordinates.latitude;
        let lng = pu.coordinates.longitude;

        if (!isWithinGeofence) {
          // Move outside geofence occasionally
          lat += (Math.random() - 0.5) * 0.01;
          lng += (Math.random() - 0.5) * 0.01;
        } else {
          // Small variations within geofence
          lat += (Math.random() - 0.5) * 0.001;
          lng += (Math.random() - 0.5) * 0.001;
        }

        this.agentLocations.push({
          id: `loc_${agent.id}_${i}`,
          agentId: agent.id,
          timestamp,
          coordinates: { latitude: lat, longitude: lng },
          accuracy: Math.floor(Math.random() * 10) + 5,
          isInsideGeofence: isWithinGeofence,
          speed: Math.random() * 5, // km/h
          heading: Math.random() * 360,
        });
      }
    });
  }

  private generateReports() {
    const categories: ReportCategory[] = ['violence', 'logistics', 'suppression', 'technical'];
    const severities: ReportSeverity[] = ['low', 'medium', 'high', 'critical'];

    this.agents.forEach(agent => {
      const numReports = Math.floor(Math.random() * 5); // 0-4 reports per agent

      for (let i = 0; i < numReports; i++) {
        const category = categories[Math.floor(Math.random() * categories.length)];
        const severity = severities[Math.floor(Math.random() * severities.length)];
        const timestamp = new Date(Date.now() - Math.random() * 12 * 60 * 60 * 1000).toISOString();

        this.reports.push({
          id: `report_${agent.id}_${i + 1}`,
          agentId: agent.id,
          agent,
          pollingUnitId: agent.pollingUnitId,
          pollingUnit: agent.pollingUnit || undefined,
          category,
          severity,
          title: this.generateReportTitle(category, severity),
          description: this.generateReportDescription(category),
          timestamp,
          coordinates: {
            latitude: agent.pollingUnit!.coordinates.latitude + (Math.random() - 0.5) * 0.001,
            longitude: agent.pollingUnit!.coordinates.longitude + (Math.random() - 0.5) * 0.001,
          },
          status: Math.random() > 0.3 ? 'pending' : 'resolved',
          attachments:
            Math.random() > 0.5
              ? [
                  {
                    id: `att_${Date.now()}_${i}`,
                    type: Math.random() > 0.5 ? 'image' : 'video',
                    url: `https://example.com/media/${Date.now()}_${i}.jpg`,
                    filename: `evidence_${i + 1}.jpg`,
                    size: Math.floor(Math.random() * 5000000) + 100000,
                  },
                ]
              : [],
          createdAt: timestamp,
          updatedAt: timestamp,
          // Additional properties for modal compatibility
          location: `${agent.pollingUnit!.address}, ${agent.pollingUnit!.lga}, ${agent.pollingUnit!.state}`,
          reportedBy: agent.name,
          reportedAt: timestamp,
          assignedTo: Math.random() > 0.5 ? 'Investigation Team' : undefined,
          resolvedAt:
            Math.random() > 0.3
              ? undefined
              : new Date(Date.now() - Math.random() * 6 * 60 * 60 * 1000).toISOString(),
          resolution:
            Math.random() > 0.3
              ? undefined
              : 'Issue resolved through appropriate intervention and monitoring.',
        });
      }
    });
  }

  private generateReportTitle(category: ReportCategory, severity: ReportSeverity): string {
    const titles = {
      violence: {
        low: 'Minor altercation between voters',
        medium: 'Heated argument at polling station',
        high: 'Physical confrontation reported',
        critical: 'Serious violence outbreak',
      },
      logistics: {
        low: 'Ballot paper shortage',
        medium: 'Voting machine malfunction',
        high: 'Polling station setup delay',
        critical: 'Complete logistics breakdown',
      },
      suppression: {
        low: 'Voter intimidation attempt',
        medium: 'Unauthorized personnel at station',
        high: 'Systematic voter suppression',
        critical: 'Polling station takeover',
      },
      technical: {
        low: 'Network connectivity issues',
        medium: 'Equipment malfunction',
        high: 'System failure',
        critical: 'Complete technical breakdown',
      },
    };

    return (titles as any)[category][severity];
  }

  private generateReportDescription(category: ReportCategory): string {
    const descriptions = {
      violence:
        'Incident involving physical altercation between parties. Immediate attention required to maintain order.',
      logistics:
        'Logistical challenge affecting the smooth conduct of elections. Coordination needed for resolution.',
      suppression:
        'Potential voter suppression activity detected. Legal intervention may be required.',
      technical: 'Technical issue affecting election processes. IT support needed for resolution.',
    };

    return (descriptions as any)[category];
  }

  private generateResults() {
    this.agents.forEach(agent => {
      if (Math.random() > 0.3) {
        // 70% of agents submit results
        const totalVotes = Math.floor(Math.random() * 500) + 100;
        const invalidVotes = Math.floor(totalVotes * 0.05); // 5% invalid
        const validVotes = totalVotes - invalidVotes;

        const candidates = POLITICAL_PARTIES.slice(0, Math.floor(Math.random() * 4) + 3).map(
          (party, index) => {
            const candidateName = CANDIDATE_NAMES[index % CANDIDATE_NAMES.length];
            return {
              name: candidateName,
              party,
              votes: 0,
            };
          },
        );

        // Distribute votes among candidates
        let remainingVotes = validVotes;
        candidates.forEach((candidate, index) => {
          if (index === candidates.length - 1) {
            candidate.votes = remainingVotes;
          } else {
            const votes = Math.floor(
              Math.random() * (remainingVotes / (candidates.length - index)),
            );
            candidate.votes = votes;
            remainingVotes -= votes;
          }
        });

        const voteData: VoteData = {
          totalVotes,
          validVotes,
          invalidVotes,
          candidates,
        };

        this.results.push({
          id: `result_${agent.id}`,
          agentId: agent.id,
          agent,
          pollingUnitId: agent.pollingUnitId,
          pollingUnit: agent.pollingUnit || undefined,
          voteData,
          formImageUrl: `https://example.com/forms/ec8a_${agent.id}.jpg`,
          timestamp: new Date(Date.now() - Math.random() * 6 * 60 * 60 * 1000).toISOString(),
          coordinates: {
            latitude: agent.pollingUnit!.coordinates.latitude,
            longitude: agent.pollingUnit!.coordinates.longitude,
          },
          isVerified: Math.random() > 0.2,
          verifiedBy: Math.random() > 0.5 ? 'user_coord_001' : undefined,
          verifiedAt: Math.random() > 0.5 ? new Date().toISOString() : undefined,
          createdAt: new Date(Date.now() - Math.random() * 6 * 60 * 60 * 1000).toISOString(),
        });
      }
    });
  }

  private generateNotifications() {
    const types = ['info', 'warning', 'error', 'success'] as const;
    const messages = [
      'New agent registered and verified',
      'Critical incident reported in Lagos State',
      'System maintenance scheduled for tonight',
      'Election results uploaded successfully',
      'Agent went offline in Kano Municipal',
      'Geofence violation detected',
      'New report submitted with high severity',
      'Backup completed successfully',
    ];

    for (let i = 0; i < 20; i++) {
      this.notifications.push({
        id: `notif_${i + 1}`,
        userId: 'user_admin_001',
        type: types[Math.floor(Math.random() * types.length)],
        title: 'System Notification',
        message: messages[Math.floor(Math.random() * messages.length)],
        isRead: Math.random() > 0.4,
        createdAt: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toISOString(),
        data: {
          source: 'system',
          priority: Math.random() > 0.7 ? 'high' : 'normal',
        },
      });
    }
  }

  private generateAuditLogs() {
    const actions = [
      'user.login',
      'user.logout',
      'agent.create',
      'agent.update',
      'report.create',
      'report.update',
      'result.upload',
      'result.verify',
      'location.update',
      'notification.send',
    ];

    for (let i = 0; i < 100; i++) {
      const action = actions[Math.floor(Math.random() * actions.length)];
      const userId = this.users[Math.floor(Math.random() * this.users.length)].id;

      this.auditLogs.push({
        id: `audit_${i + 1}`,
        userId,
        action,
        resource: action.split('.')[0],
        resourceId: `${action.split('.')[0]}_${Math.floor(Math.random() * 1000)}`,
        timestamp: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
        ipAddress: `192.168.1.${Math.floor(Math.random() * 255)}`,
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        details: {
          description: `${action} performed successfully`,
          metadata: { source: 'web_app' },
        },
      });
    }
  }

  // Public methods for accessing mock data
  getAgents(): Agent[] {
    return [...this.agents];
  }

  getAgentById(id: string): Agent | undefined {
    return this.agents.find(agent => agent.id === id);
  }

  getAgentLocations(agentId?: string): AgentLocation[] {
    if (agentId) {
      return this.agentLocations.filter(loc => loc.agentId === agentId);
    }
    return [...this.agentLocations];
  }

  getReports(filters?: {
    category?: ReportCategory;
    severity?: ReportSeverity;
    agentId?: string;
  }): Report[] {
    let filteredReports = [...this.reports];

    if (filters?.category) {
      filteredReports = filteredReports.filter(report => report.category === filters.category);
    }
    if (filters?.severity) {
      filteredReports = filteredReports.filter(report => report.severity === filters.severity);
    }
    if (filters?.agentId) {
      filteredReports = filteredReports.filter(report => report.agentId === filters.agentId);
    }

    return filteredReports;
  }

  getResults(pollingUnitId?: string): ElectionResult[] {
    if (pollingUnitId) {
      return this.results.filter(result => result.pollingUnitId === pollingUnitId);
    }
    return [...this.results];
  }

  getPollingUnits(): PollingUnit[] {
    return [...this.pollingUnits];
  }

  getNotifications(userId?: string): Notification[] {
    if (userId) {
      return this.notifications.filter(notif => notif.userId === userId);
    }
    return [...this.notifications];
  }

  getAuditLogs(filters?: {
    userId?: string;
    action?: string;
    startDate?: Date;
    endDate?: Date;
  }): AuditLog[] {
    let filteredLogs = [...this.auditLogs];

    if (filters?.userId) {
      filteredLogs = filteredLogs.filter(log => log.userId === filters.userId);
    }
    if (filters?.action) {
      filteredLogs = filteredLogs.filter(log => log.action === filters.action);
    }
    if (filters?.startDate) {
      filteredLogs = filteredLogs.filter(log => new Date(log.timestamp) >= filters.startDate!);
    }
    if (filters?.endDate) {
      filteredLogs = filteredLogs.filter(log => new Date(log.timestamp) <= filters.endDate!);
    }

    return filteredLogs;
  }

  getUsers(): User[] {
    return [...this.users];
  }

  getDashboardStats() {
    const totalAgents = this.agents.length;
    const activeAgents = this.agents.filter(agent => agent.status === 'active').length;
    const totalReports = this.reports.length;
    const criticalReports = this.reports.filter(report => report.severity === 'critical').length;
    const totalResults = this.results.length;
    const verifiedResults = this.results.filter(result => result.isVerified).length;
    const totalPollingUnits = this.pollingUnits.length;
    const activePollingUnits = this.pollingUnits.filter(pu => pu.isActive).length;

    return {
      totalAgents,
      activeAgents,
      offlineAgents: totalAgents - activeAgents,
      totalReports,
      pendingReports: this.reports.filter(report => report.status === 'pending').length,
      criticalReports,
      totalResults,
      verifiedResults,
      pendingResults: totalResults - verifiedResults,
      totalPollingUnits,
      activePollingUnits,
      coveragePercentage: Math.round((activeAgents / totalPollingUnits) * 100),
    };
  }
}

export const mockDataService = new MockDataService();
export default mockDataService;

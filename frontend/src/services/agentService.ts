import api from '@/lib/api';

export interface AgentNegotiationNote {
  negotiationId: string;
  note: string;
}

export interface EscalateNegotiation {
  negotiationId: string;
  reason: string;
}

class AgentService {
  // Get negotiations for agent's region
  async getRegionalNegotiations(): Promise<any> {
    const response = await api.get('/negotiations/agent');
    return response;
  }

  // Get users (sellers/buyers) in agent's region
  async getRegionalUsers(): Promise<any> {
    const response = await api.get('/users/agent/regional-users');
    return response;
  }

  // Add internal note to negotiation
  async addNegotiationNote(negotiationId: string, note: string): Promise<any> {
    const response = await api.put(`/negotiations/${negotiationId}/agent-note`, { note });
    return response;
  }

  // Mark negotiation as connected
  async markNegotiationAsConnected(negotiationId: string): Promise<any> {
    const response = await api.put(`/negotiations/${negotiationId}/mark-connected`);
    return response;
  }

  // Escalate negotiation to admin
  async escalateNegotiation(negotiationId: string, reason?: string): Promise<any> {
    const response = await api.put(`/negotiations/${negotiationId}/escalate`, { reason });
    return response;
  }

  // Get regional statistics
  async getRegionalStats(): Promise<any> {
    const response = await api.get('/agent/stats');
    return response;
  }

  // Get alerts for agent's region
  async getRegionalAlerts(): Promise<any> {
    const response = await api.get('/agent/alerts');
    return response;
  }

  // Get agents by district (public endpoint)
  async getAgentsByDistrict(district: string): Promise<any> {
    const response = await api.get(`/users/agents/by-district/${district}`);
    return response;
  }
}

export const agentService = new AgentService();
export default agentService;

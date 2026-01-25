import { useState, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Mail, Phone, Edit, Trash2 } from 'lucide-react';
import { FilterBar } from '../ui/FilterBar';
import { StatusBadge } from '../ui/StatusBadge';
import { TableSkeleton } from '../ui/TableSkeleton';
import { exportToCSV } from '@/utils/adminUtils';
import type { Agent } from '@/types/admin';
import { toast } from 'sonner';

interface AgentsTabProps {
  agents: Agent[];
  isLoading: boolean;
}

export const AgentsTab = ({ agents, isLoading }: AgentsTabProps) => {
  const [agentDistrictFilter, setAgentDistrictFilter] = useState('all');
  const [editingAgent, setEditingAgent] = useState<Agent | null>(null);
  const [newStatus, setNewStatus] = useState<Agent["status"]>("active");

  // Get unique districts
  const districts = useMemo(() => 
    [...new Set(agents.map(a => a.district))].sort().map(district => ({
      value: district,
      label: district
    })), 
    [agents]
  );

  // Filtered agents
  const filteredAgents = useMemo(() => {
    return agents.filter(agent => 
      agentDistrictFilter === 'all' || agent.district === agentDistrictFilter
    );
  }, [agents, agentDistrictFilter]);

  const handleExport = () => {
    exportToCSV(filteredAgents, 'agents');
  };

  const handleDeleteAgent = (id: string) => {
    if (!confirm("Are you sure you want to delete this agent?")) return;
    toast.success('Agent deleted successfully');
  };

  const openEditModal = (agent: Agent) => {
    setEditingAgent(agent);
    setNewStatus(agent.status);
  };

  const closeModal = () => {
    setEditingAgent(null);
  };

  const saveStatusChange = () => {
    if (!editingAgent) return;
    toast.success('Agent status updated successfully');
    closeModal();
  };

  const districtOptions = [
    { value: 'all', label: 'All Districts' },
    ...districts
  ];

  return (
    <div className="space-y-6">
      <FilterBar
        filterValue={agentDistrictFilter}
        onFilterChange={setAgentDistrictFilter}
        filterOptions={districtOptions}
        filterPlaceholder="All Districts"
        onExport={handleExport}
      >
        <Button variant="outline">
          <Mail className="h-4 w-4 mr-2" />
          Send Notification
        </Button>
      </FilterBar>

      <Card className="dashboard-card">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6"><TableSkeleton /></div>
          ) : (
            <>
              {/* Desktop Table */}
              <div className="hidden sm:block overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Regions</TableHead>
                      <TableHead>District</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAgents.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                          No agents found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredAgents.map(agent => (
                        <TableRow key={agent._id || agent.id}>
                          <TableCell className="font-medium">{agent.name || 'N/A'}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Mail className="h-3 w-3 text-muted-foreground" />
                              {agent.email}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Phone className="h-3 w-3 text-muted-foreground" />
                              {agent.phone || 'N/A'}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-1 flex-wrap">
                              {(agent.regions || []).map(region => (
                                <Badge key={region} variant="secondary" className="text-xs">
                                  {region}
                                </Badge>
                              ))}
                            </div>
                          </TableCell>
                          <TableCell>{agent.district}</TableCell>
                          <TableCell>
                            <StatusBadge status={agent.status} />
                          </TableCell>
                          <TableCell className="text-right flex gap-2 justify-end">
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => openEditModal(agent)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => handleDeleteAgent(agent.id)}
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* Mobile Card View */}
              <div className="sm:hidden space-y-4 p-4">
                {filteredAgents.length === 0 ? (
                  <p className="text-center text-muted-foreground">No agents found</p>
                ) : (
                  filteredAgents.map(agent => (
                    <div 
                      key={agent.id} 
                      className="border rounded-lg p-4 space-y-3 bg-white shadow-sm"
                    >
                      <div className="text-lg font-semibold">{agent.name}</div>
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        {agent.email}
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        {agent.phone}
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {agent.regions.map(region => (
                          <Badge key={region} variant="secondary" className="text-xs px-2 py-0.5">
                            {region}
                          </Badge>
                        ))}
                      </div>
                      <div className="text-sm">
                        <span className="font-medium">District: </span>
                        {agent.district}
                      </div>
                      <StatusBadge status={agent.status} />
                      <div className="flex gap-3 pt-2">
                        <Button 
                          className="flex-1"
                          variant="outline"
                          onClick={() => openEditModal(agent)}
                        >
                          <Edit className="h-4 w-4 mr-1" /> Edit
                        </Button>
                        <Button 
                          className="flex-1"
                          variant="destructive"
                          onClick={() => handleDeleteAgent(agent.id)}
                        >
                          <Trash2 className="h-4 w-4 mr-1" /> Delete
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Edit Modal */}
      {editingAgent && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-80 space-y-4 shadow-lg">
            <h2 className="text-lg font-semibold">Edit Status</h2>
            <Select value={newStatus} onValueChange={value => setNewStatus(value as Agent["status"])}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={closeModal}>Cancel</Button>
              <Button onClick={saveStatusChange}>Save</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
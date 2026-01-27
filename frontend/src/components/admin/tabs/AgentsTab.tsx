import { useState, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Mail, Phone, Edit, Trash2, Plus, MapPin } from 'lucide-react';
import { FilterBar } from '../ui/FilterBar';
import { StatusBadge } from '../ui/StatusBadge';
import { TableSkeleton } from '../ui/TableSkeleton';
import { exportToCSV } from '@/utils/adminUtils';
import type { Agent } from '@/types/admin';
import { toast } from 'sonner';
import { userAPI } from '@/services/userService';

interface AgentsTabProps {
  agents: Agent[];
  isLoading: boolean;
  onRefresh?: () => void;
}

// Sri Lankan districts
const SRI_LANKAN_DISTRICTS = [
  'Ampara', 'Anuradhapura', 'Badulla', 'Batticaloa', 'Colombo', 'Galle', 
  'Gampaha', 'Hambantota', 'Jaffna', 'Kalutara', 'Kandy', 'Kegalle', 
  'Kilinochchi', 'Kurunegala', 'Mannar', 'Matale', 'Matara', 'Monaragala', 
  'Mullaitivu', 'Nuwara Eliya', 'Polonnaruwa', 'Puttalam', 'Ratnapura', 
  'Trincomalee', 'Vavuniya'
];

const REGIONS = ['North', 'South', 'East', 'West', 'Central', 'North Central', 'North Western', 'Sabaragamuwa', 'Uva'];

export const AgentsTab = ({ agents, isLoading, onRefresh }: AgentsTabProps) => {
  const [agentDistrictFilter, setAgentDistrictFilter] = useState('all');
  const [editingAgent, setEditingAgent] = useState<Agent | null>(null);
  const [newStatus, setNewStatus] = useState<Agent["status"]>("active");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [newAgent, setNewAgent] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    district: '',
    regions: [] as string[],
    officeContact: '',
    status: 'active' as Agent['status']
  });

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

  const handleDeleteAgent = async (id: string) => {
    if (!confirm("Are you sure you want to delete this agent?")) return;
    
    try {
      await userAPI.deleteUser(id);
      toast.success('Agent deleted successfully');
      if (onRefresh) onRefresh();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to delete agent');
    }
  };

  const handleAddAgent = async () => {
    // Validate form
    if (!newAgent.name || !newAgent.email || !newAgent.phone || !newAgent.password || !newAgent.district || newAgent.regions.length === 0) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSaving(true);
    try {
      await userAPI.createAgent(newAgent);
      toast.success('Agent added successfully');
      setIsAddDialogOpen(false);
      // Reset form
      setNewAgent({
        name: '',
        email: '',
        phone: '',
        password: '',
        district: '',
        regions: [],
        officeContact: '',
        status: 'active'
      });
      if (onRefresh) onRefresh();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to add agent');
    } finally {
      setIsSaving(false);
    }
  };

  const toggleRegion = (region: string) => {
    setNewAgent(prev => ({
      ...prev,
      regions: prev.regions.includes(region)
        ? prev.regions.filter(r => r !== region)
        : [...prev.regions, region]
    }));
  };

  const openEditModal = (agent: Agent) => {
    setEditingAgent(agent);
    setNewStatus(agent.status);
  };

  const closeModal = () => {
    setEditingAgent(null);
  };

  const saveStatusChange = async () => {
    if (!editingAgent) return;
    
    try {
      await userAPI.updateAgentStatus(editingAgent._id || editingAgent.id, newStatus);
      toast.success('Agent status updated successfully');
      closeModal();
      if (onRefresh) onRefresh();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update agent status');
    }
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
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add New Agent
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Agent</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    placeholder="Enter full name"
                    value={newAgent.name}
                    onChange={(e) => setNewAgent({...newAgent, name: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="agent@example.com"
                    value={newAgent.email}
                    onChange={(e) => setNewAgent({...newAgent, email: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    placeholder="+94XXXXXXXXX"
                    value={newAgent.phone}
                    onChange={(e) => setNewAgent({...newAgent, phone: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="officeContact">Office Contact</Label>
                  <Input
                    id="officeContact"
                    placeholder="+94XXXXXXXXX"
                    value={newAgent.officeContact}
                    onChange={(e) => setNewAgent({...newAgent, officeContact: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password *</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter password"
                  value={newAgent.password}
                  onChange={(e) => setNewAgent({...newAgent, password: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="district">Primary District *</Label>
                <Select value={newAgent.district} onValueChange={(value) => setNewAgent({...newAgent, district: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select district" />
                  </SelectTrigger>
                  <SelectContent>
                    {SRI_LANKAN_DISTRICTS.map((district) => (
                      <SelectItem key={district} value={district}>{district}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Assigned Regions * (Select multiple)</Label>
                <div className="grid grid-cols-3 gap-2 p-4 border rounded-lg">
                  {REGIONS.map((region) => (
                    <div key={region} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={`region-${region}`}
                        checked={newAgent.regions.includes(region)}
                        onChange={() => toggleRegion(region)}
                        className="rounded border-gray-300"
                      />
                      <label htmlFor={`region-${region}`} className="text-sm cursor-pointer">
                        {region}
                      </label>
                    </div>
                  ))}
                </div>
                {newAgent.regions.length > 0 && (
                  <div className="flex gap-1 flex-wrap mt-2">
                    {newAgent.regions.map((region) => (
                      <Badge key={region} variant="secondary">{region}</Badge>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={newAgent.status} onValueChange={(value) => setNewAgent({...newAgent, status: value as Agent['status']})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)} disabled={isSaving}>
                  Cancel
                </Button>
                <Button onClick={handleAddAgent} disabled={isSaving}>
                  {isSaving ? 'Adding...' : 'Add Agent'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
        
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
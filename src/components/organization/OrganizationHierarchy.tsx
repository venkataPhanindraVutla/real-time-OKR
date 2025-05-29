import { useState, useEffect } from 'react';
import { CreateTeamModal } from '../team/CreateTeamModal';
import { CreateDepartmentModal } from './CreateDepartmentModal';
import { useOrganizations } from '@/hooks/useOrganizations';
import { useDepartments } from '@/hooks/useDepartments';
import { useTeams } from '@/hooks/useTeams';
import { Building2, Users, User, ChevronRight, Plus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const OrganizationHierarchy = () => {
  const [selectedLevel, setSelectedLevel] = useState<'org' | 'dept' | 'team'>('org');
  const [isCreateTeamModalOpen, setIsCreateTeamModalOpen] = useState(false);
  const [isCreateDepartmentModalOpen, setIsCreateDepartmentModalOpen] = useState(false);

  const { organizations, loading: orgLoading } = useOrganizations();
  const { departments, loading: deptLoading } = useDepartments();
  const { teams, loading: teamLoading } = useTeams();

  useEffect(() => {
    if (!orgLoading) {
      console.log("Organizations:", organizations);
    }
    if (!deptLoading) {
      console.log("Departments:", departments);
    }
    if (!teamLoading) {
      console.log("Teams:", teams);
    }
  }, [orgLoading, deptLoading, teamLoading, organizations, departments, teams]);

  if (orgLoading || deptLoading || teamLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Card className="h-fit">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-indigo-600" />
            Organization Structure
          </CardTitle>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setIsCreateDepartmentModalOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Department
            </Button>
            <Button variant="outline" size="sm" onClick={() => setIsCreateTeamModalOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Team
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {organizations && organizations.map((org) => (
            <div key={org.id}>
              {/* Organization Level */}
              <div 
                className="p-3 border rounded-lg bg-gradient-to-r from-indigo-50 to-purple-50 cursor-pointer hover:shadow-md transition-all"
                onClick={() => setSelectedLevel('org')}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-indigo-600" />
                    <span className="font-medium">{org.name}</span>
                  </div>
                  <Badge variant="secondary">{departments && departments.filter(dept => dept.organization_id === org.id).length} Departments</Badge>
                </div>
              </div>

              {/* Departments Level */}
              <div className="ml-4 space-y-2">
                {departments && departments.filter(dept => dept.organization_id === org.id).map((dept) => (
                  <div key={dept.id}>
                    <div 
                      className="p-3 border rounded-lg bg-blue-50 cursor-pointer hover:shadow-md transition-all"
                      onClick={() => setSelectedLevel('dept')}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <ChevronRight className="h-4 w-4 text-gray-400" />
                          <Users className="h-4 w-4 text-blue-600" />
                          <span className="font-medium">{dept.name}</span>
                        </div>
                        <Badge variant="outline">{teams && teams.filter(team => team.department_id === dept.id).length} Teams</Badge>
                      </div>
                    </div>

                    {/* Teams Level */}
                    <div className="ml-6 mt-2 space-y-2">
                      {teams && teams.filter(team => team.department_id === dept.id).map((team) => (
                        <div 
                          key={team.id}
                          className="p-2 border rounded bg-gray-50 cursor-pointer hover:bg-gray-100 transition-all"
                          onClick={() => setSelectedLevel('team')}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <ChevronRight className="h-3 w-3 text-gray-400" />
                              <User className="h-3 w-3 text-gray-600" />
                              <span className="text-sm font-medium">{team.name}</span>
                            </div>
                            <div className="flex gap-2">
                              {/* <Badge variant="outline" className="text-xs">
                                {team.members} members
                              </Badge> */}
                              {/* <Badge variant="secondary" className="text-xs">
                                {team.okrs} OKRs
                              </Badge> */}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Quick Stats */}
        <div className="mt-6 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg">
          <h4 className="text-sm font-medium mb-3 text-gray-700">Quick Stats</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Total Teams:</span>
              <span className="font-semibold ml-2">{teams ? teams.length : 0}</span>
            </div>
            <div>
              <span className="text-gray-600">Total Members:</span>
              <span className="font-semibold ml-2">40</span>
            </div>
            <div>
              <span className="text-gray-600">Active OKRs:</span>
              <span className="font-semibold ml-2">25</span>
            </div>
            <div>
              <span className="text-gray-600">Completion:</span>
              <span className="font-semibold ml-2 text-green-600">68%</span>
            </div>
          </div>
        </div>
      </CardContent>
      <CreateTeamModal isOpen={isCreateTeamModalOpen} onClose={() => setIsCreateTeamModalOpen(false)} />
      <CreateDepartmentModal isOpen={isCreateDepartmentModalOpen} onClose={() => setIsCreateDepartmentModalOpen(false)} />
    </Card>
  );
};

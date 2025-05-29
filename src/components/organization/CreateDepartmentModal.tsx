import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Building2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useOrganizations } from '@/hooks/useOrganizations';


interface CreateDepartmentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateDepartmentModal = ({ isOpen, onClose }: CreateDepartmentModalProps) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [organizationId, setOrganizationId] = useState('');
  const { organizations } = useOrganizations();

  const handleSubmit = async () => {
    try {
      const { data, error } = await supabase
        .from('departments')
        .insert([
          { name, description, organization_id: organizationId,created_by: (await supabase.auth.getUser()).data.user?.id || null},
        ]).select();

      if (error) {
        console.error('Error creating department:', error);
        return;
      }

      onClose();
    } catch (error) {
      console.error('Error creating department:', error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <Building2 className="h-6 w-6 text-indigo-600" />
            <DialogTitle className="text-2xl font-bold">Create New Department</DialogTitle>
          </div>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              placeholder="Department Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Department Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
           <div>
            <Label htmlFor="organizationId">Organization</Label>
            <Select value={organizationId} onValueChange={setOrganizationId}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select organization" />
              </SelectTrigger>
              <SelectContent>
                {organizations.map((organization) => (
                  <SelectItem key={organization.id} value={organization.id}>
                    {organization.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex justify-end space-x-2">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Create</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Trash2, Target } from 'lucide-react';
import { useOKRs } from '@/hooks/useOKRs';
import { useTeams } from '@/hooks/useTeams';

interface CreateOKRModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface KeyResult {
  id: string;
  title: string;
  target: string;
  unit: string;
}

export const CreateOKRModal = ({ isOpen, onClose }: CreateOKRModalProps) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [teamId, setTeamId] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [keyResults, setKeyResults] = useState<KeyResult[]>([
    { id: '1', title: '', target: '', unit: '' }
  ]);

  const { createOKR } = useOKRs();
  const { teams } = useTeams();

  const addKeyResult = () => {
    const newKR: KeyResult = {
      id: Date.now().toString(),
      title: '',
      target: '',
      unit: ''
    };
    setKeyResults([...keyResults, newKR]);
  };

  const removeKeyResult = (id: string) => {
    if (keyResults.length > 1) {
      setKeyResults(keyResults.filter(kr => kr.id !== id));
    }
  };

  const updateKeyResult = (id: string, field: keyof KeyResult, value: string) => {
    setKeyResults(keyResults.map(kr => 
      kr.id === id ? { ...kr, [field]: value } : kr
    ));
  };

  const handleSubmit = async () => {
    const validKeyResults = keyResults.filter(kr => kr.title && kr.target);
    
    await createOKR({
      title,
      description,
      team_id: teamId,
      due_date: dueDate || undefined,
      key_results: validKeyResults.map(kr => ({
        title: kr.title,
        target_value: parseFloat(kr.target),
        unit: kr.unit
      }))
    });
    
    onClose();
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setTeamId('');
    setDueDate('');
    setKeyResults([{ id: '1', title: '', target: '', unit: '' }]);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const isFormValid = title && teamId && keyResults.some(kr => kr.title && kr.target);

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <Target className="h-6 w-6 text-indigo-600" />
            <DialogTitle className="text-2xl font-bold">Create New OKR</DialogTitle>
          </div>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Objective Section */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4 text-indigo-600">Objective</h3>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g., Increase Customer Satisfaction"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Provide more context about this objective..."
                    className="mt-1"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="teamId">Assigned Team *</Label>
                    <Select value={teamId} onValueChange={setTeamId}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select team" />
                      </SelectTrigger>
                      <SelectContent>
                        {teams.map((team) => (
                          <SelectItem key={team.id} value={team.id}>
                            {team.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="dueDate">Due Date</Label>
                    <Input
                      id="dueDate"
                      type="date"
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Key Results Section */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-indigo-600">Key Results</h3>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm"
                  onClick={addKeyResult}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Key Result
                </Button>
              </div>

              <div className="space-y-4">
                {keyResults.map((kr, index) => (
                  <div key={kr.id} className="border rounded-lg p-4 bg-gray-50">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium text-gray-700">
                        Key Result #{index + 1}
                      </span>
                      {keyResults.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeKeyResult(kr.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>

                    <div className="space-y-3">
                      <div>
                        <Label>Description *</Label>
                        <Input
                          value={kr.title}
                          onChange={(e) => updateKeyResult(kr.id, 'title', e.target.value)}
                          placeholder="e.g., Achieve NPS score of 80+"
                          className="mt-1"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label>Target Value *</Label>
                          <Input
                            value={kr.target}
                            onChange={(e) => updateKeyResult(kr.id, 'target', e.target.value)}
                            placeholder="e.g., 80"
                            type="number"
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label>Unit</Label>
                          <Select 
                            value={kr.unit} 
                            onValueChange={(value) => updateKeyResult(kr.id, 'unit', value)}
                          >
                            <SelectTrigger className="mt-1">
                              <SelectValue placeholder="Select unit" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="percentage">Percentage (%)</SelectItem>
                              <SelectItem value="number">Number</SelectItem>
                              <SelectItem value="currency">Currency ($)</SelectItem>
                              <SelectItem value="hours">Hours</SelectItem>
                              <SelectItem value="days">Days</SelectItem>
                              <SelectItem value="count">Count</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
              disabled={!isFormValid}
            >
              Create OKR
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};


import { useState } from 'react';
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Calendar, Edit, MoreHorizontal, Target, Users, Trash2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useOKRs, type OKR } from '@/hooks/useOKRs';
import { EditOKRModal } from './EditOKRModal';

interface OKRCardProps {
  okr: OKR;
}

export const OKRCard = ({ okr }: OKRCardProps) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const { deleteOKR } = useOKRs();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 75) return 'bg-green-500';
    if (progress >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const handleDelete = async () => {
    await deleteOKR(okr.id);
  };

  return (
    <>
      <Card className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-indigo-500">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Target className="h-5 w-5 text-indigo-600" />
                <CardTitle className="text-lg">{okr.title}</CardTitle>
                <Badge className={getStatusColor(okr.status)}>
                  {okr.status.charAt(0).toUpperCase() + okr.status.slice(1)}
                </Badge>
              </div>
              {okr.description && (
                <p className="text-gray-600 text-sm mb-3">{okr.description}</p>
              )}
              
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  {okr.assignee}
                </div>
                {okr.due_date && (
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {new Date(okr.due_date).toLocaleDateString()}
                  </div>
                )}
              </div>
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setIsEditModalOpen(true)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit OKR
                </DropdownMenuItem>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <DropdownMenuItem 
                      className="text-red-600 focus:text-red-600"
                      onSelect={(e) => e.preventDefault()}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete OKR
                    </DropdownMenuItem>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete the OKR
                        and all associated key results.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction 
                        onClick={handleDelete}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>

        <CardContent>
          <div className="space-y-4">
            {/* Overall Progress */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Overall Progress</span>
                <span className="text-sm text-gray-600">{okr.progress}%</span>
              </div>
              <div className="relative">
                <Progress value={okr.progress} className="h-2" />
                <div 
                  className={`absolute top-0 left-0 h-2 rounded-full transition-all duration-300 ${getProgressColor(okr.progress)}`}
                  style={{ width: `${okr.progress}%` }}
                />
              </div>
            </div>

            {/* Key Results */}
            {okr.key_results && okr.key_results.length > 0 && (
              <div>
                <h4 className="text-sm font-medium mb-3 text-gray-700">Key Results</h4>
                <div className="space-y-3">
                  {okr.key_results.map((kr) => (
                    <div key={kr.id} className="bg-gray-50 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">{kr.title}</span>
                        <span className="text-xs text-gray-500">
                          {kr.current_value}/{kr.target_value} {kr.unit}
                        </span>
                      </div>
                      <div className="relative">
                        <Progress value={kr.progress} className="h-1.5" />
                        <div 
                          className={`absolute top-0 left-0 h-1.5 rounded-full transition-all duration-300 ${getProgressColor(kr.progress)}`}
                          style={{ width: `${kr.progress}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <EditOKRModal 
        okr={okr}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
      />
    </>
  );
};

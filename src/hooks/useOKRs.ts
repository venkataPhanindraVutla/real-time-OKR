
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { create } from 'domain';

export interface KeyResult {
  id: string;
  title: string;
  progress: number;
  target_value: number;
  current_value: number;
  unit?: string;
  created_by?: string;
}

export interface OKR {
  id: string;
  title: string;
  description?: string;
  progress: number;
  key_results: KeyResult[];
  assigned_user_id?: string;
  assignee?: string;
  due_date?: string;
  status: string;
  team_id: string;
}

export const useOKRs = () => {
  const [okrs, setOKRs] = useState<OKR[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchOKRs = async () => {
    if (!user) return;

    try {
      setLoading(true);
      
      // Fetch OKRs with key results and profile information
      const { data: okrsData, error: okrsError } = await supabase
        .from('okrs')
        .select(`
          *,
          key_results (*),
          profiles:assigned_user_id (full_name)
        `);

      if (okrsError) throw okrsError;

      // Transform the data to match our interface
      const transformedOKRs: OKR[] = okrsData?.map(okr => ({
        id: okr.id,
        title: okr.title,
        description: okr.description,
        progress: okr.progress || 0,
        key_results: okr.key_results?.map((kr: any) => ({
          id: kr.id,
          title: kr.title,
          progress: kr.progress || 0,
          target_value: kr.target_value || 0,
          current_value: kr.current_value || 0,
          unit: kr.unit,
          created_by: kr.created_by || null
        })) || [],
        assigned_user_id: okr.assigned_user_id,
        assignee: okr.profiles?.full_name || 'Unassigned',
        due_date: okr.due_date,
        status: okr.status || 'draft',
        team_id: okr.team_id
      })) || [];

      setOKRs(transformedOKRs);
    } catch (error: any) {
      console.error('Error fetching OKRs:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load OKRs"
      });
    } finally {
      setLoading(false);
    }
  };

  const createOKR = async (okrData: {
    title: string;
    description?: string;
    team_id: string;
    assigned_user_id?: string;
    due_date?: string;
    key_results: Array<{
      title: string;
      target_value: number;
      unit?: string;
      created_by?: string;
    }>;
  }) => {
    if (!user) return;

    try {
      // Create the OKR
      const { data: okr, error: okrError } = await supabase
        .from('okrs')
        .insert({
          title: okrData.title,
          description: okrData.description,
          team_id: okrData.team_id,
          assigned_user_id: okrData.assigned_user_id,
          due_date: okrData.due_date,
          status: 'active',
          created_by: (await supabase.auth.getUser()).data.user?.id || null
        })
        .select()
        .single();

      if (okrError) throw okrError;

      // Create key results
      if (okrData.key_results.length > 0) {
        const keyResultsToInsert = okrData.key_results.map(kr => ({
          okr_id: okr.id,
          title: kr.title,
          target_value: kr.target_value,
          unit: kr.unit,
          current_value: 0,
          progress: 0,
          created_by: user.id
        }));

        const { error: krError } = await supabase
          .from('key_results')
          .insert(keyResultsToInsert);

        if (krError) throw krError;
      }

      toast({
        title: "Success",
        description: "OKR created successfully"
      });

      fetchOKRs(); // Refresh the list
    } catch (error: any) {
      console.error('Error creating OKR:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to create OKR"
      });
    }
  };

  const updateOKR = async (id: string, updates: Partial<{
    title: string;
    description: string;
    status: string;
    progress: number;
    due_date: string;
  }>) => {
    try {
      const { error } = await supabase
        .from('okrs')
        .update(updates)
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "OKR updated successfully"
      });

      fetchOKRs();
    } catch (error: any) {
      console.error('Error updating OKR:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update OKR"
      });
    }
  };

  const deleteOKR = async (id: string) => {
    try {
      const { error } = await supabase
        .from('okrs')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "OKR deleted successfully"
      });

      fetchOKRs();
    } catch (error: any) {
      console.error('Error deleting OKR:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete OKR"
      });
    }
  };

  const updateKeyResult = async (id: string, updates: Partial<{
    current_value: number;
    progress: number;
  }>) => {
    try {
      const { error } = await supabase
        .from('key_results')
        .update(updates)
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Key result updated successfully"
      });

      fetchOKRs();
    } catch (error: any) {
      console.error('Error updating key result:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update key result"
      });
    }
  };

  useEffect(() => {
    fetchOKRs();
  }, [user]);

  return {
    okrs,
    loading,
    createOKR,
    updateOKR,
    deleteOKR,
    updateKeyResult,
    refreshOKRs: fetchOKRs
  };
};

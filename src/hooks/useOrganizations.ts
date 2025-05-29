import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface Organization {
  id: string;
  name: string;
  description?: string;
}

export const useOrganizations = () => {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchOrganizations = async () => {
    if (!user) return;

    try {
      setLoading(true);
    
      const { data, error } = await supabase
        .from('organizations')
        .select('*')
        .order('name')

      console.log("supabase.from('organizations').select('*').order('name')", data, error)
      if (error) {
        console.error("Error fetching organizations", error);
        throw error;
      }

      setOrganizations(data || []);
    } catch (error) {
      console.error('Error fetching organizations:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrganizations();
  }, [user]);

  return {
    organizations,
    loading,
    refreshOrganizations: fetchOrganizations
  };
};
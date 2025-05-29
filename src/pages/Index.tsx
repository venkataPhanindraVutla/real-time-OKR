
import { useState } from 'react';
import { Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/layout/Header';
import { OKRCard } from '@/components/okr/OKRCard';
import { CreateOKRModal } from '@/components/okr/CreateOKRModal';
import { OrganizationHierarchy } from '@/components/organization/OrganizationHierarchy';
import { useOKRs } from '@/hooks/useOKRs';
import { Skeleton } from '@/components/ui/skeleton';

const Index = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const { okrs, loading } = useOKRs();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50">
        <Header onCreateOKR={() => setIsCreateModalOpen(true)} />
        
        <main className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-3">
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  Your OKRs
                </h2>
                <p className="text-gray-600">
                  Track and manage your team's objectives and key results
                </p>
              </div>

              <div className="space-y-6">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="border rounded-lg p-6">
                    <Skeleton className="h-6 w-3/4 mb-4" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-2/3 mb-4" />
                    <Skeleton className="h-2 w-full mb-4" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-1/2" />
                      <Skeleton className="h-2 w-full" />
                      <Skeleton className="h-2 w-full" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-1">
              <OrganizationHierarchy />
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50">
      <Header onCreateOKR={() => setIsCreateModalOpen(true)} />
      
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Your OKRs
              </h2>
              <p className="text-gray-600">
                Track and manage your team's objectives and key results
              </p>
            </div>

            <div className="space-y-6">
              {okrs.map((okr) => (
                <OKRCard key={okr.id} okr={okr} />
              ))}
            </div>

            {okrs.length === 0 && (
              <div className="text-center py-12">
                <div className="max-w-md mx-auto">
                  <div className="mb-4">
                    <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-indigo-100">
                      <Target className="h-6 w-6 text-indigo-600" />
                    </div>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No OKRs yet</h3>
                  <p className="text-gray-500 mb-4">Get started by creating your first objective and key results.</p>
                  <Button 
                    onClick={() => setIsCreateModalOpen(true)}
                    className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                  >
                    Create Your First OKR
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <OrganizationHierarchy />
          </div>
        </div>
      </main>

      <CreateOKRModal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)} 
      />
    </div>
  );
};

export default Index;

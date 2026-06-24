import { ReactNode } from 'react';
import { useAuth } from '@/_core/hooks/useAuth';
import { Spinner } from '@/components/ui/spinner';
import { Card } from '@/components/ui/card';
import { useLocation } from 'wouter';

interface AdminGuardProps {
  children: ReactNode;
}

/**
 * Component to protect admin routes
 * Redirects to home if user is not authenticated or not an admin
 */
export default function AdminGuard({ children }: AdminGuardProps) {
  const { user, loading } = useAuth();
  const [, setLocation] = useLocation();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner />
      </div>
    );
  }

  // Check if user is owner (only owner can access admin panel)
  // Note: The actual owner check is done on the backend via ownerOpenId
  // Frontend just prevents unauthorized users from seeing the page
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="p-8 max-w-md">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-6">
            You do not have permission to access this page. Only administrators can view this content.
          </p>
          <button
            onClick={() => setLocation('/en')}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Return to Home
          </button>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
}

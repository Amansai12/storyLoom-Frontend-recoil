
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Home, AlertCircle } from 'lucide-react';

const PageNotFound = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
      <Card className="w-full max-w-md shadow-lg border-none">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <AlertCircle 
              size={64} 
              className="text-red-500 stroke-current animate-pulse"
            />
          </div>
          <CardTitle className="text-3xl font-bold text-gray-800">
            404 - Page Not Found
          </CardTitle>
          <CardDescription className="text-gray-500 mt-2">
            Oops! The page you're looking for seems to have gone on an unexpected journey.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-gray-600 mb-6">
            The page you are trying to access might have been moved, deleted, or never existed.
          </p>
          <div className="flex justify-center space-x-4">
            <Button 
              asChild 
              variant="outline" 
              className="hover:bg-gray-100 transition-colors"
            >
              <Link to="/" className="flex items-center">
                <Home className="mr-2 h-4 w-4" />
                Return Home
              </Link>
            </Button>
            <Button 
              variant="default" 
              className="bg-blue-600 hover:bg-blue-700 transition-colors"
              onClick={() => window.history.back()}
            >
              Go Back
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PageNotFound;
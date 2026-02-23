import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Badge } from '../ui/badge';
import { Alert, AlertDescription } from '../ui/alert';
import { CheckCircle, AlertCircle } from 'lucide-react';

const DOMValidationTest = () => {
  return (
    <div className="p-8 space-y-6">
      <h1 className="text-2xl font-bold">DOM Validation Test</h1>
      
      {/* Test CardDescription with nested elements */}
      <Card>
        <CardHeader>
          <CardTitle>Card with Complex Description</CardTitle>
          <CardDescription>
            <div className="space-y-2">
              <span className="text-blue-600">This should work now</span>
              <Badge variant="outline" className="ml-2">
                ✅ Fixed
              </Badge>
            </div>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              <div className="space-y-2">
                <div>Complex content in AlertDescription</div>
                <div className="flex gap-2">
                  <Badge variant="secondary">Working</Badge>
                  <Badge variant="outline">Properly</Badge>
                </div>
              </div>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Test proper nesting */}
      <Card>
        <CardHeader>
          <CardTitle>Proper Nesting Test</CardTitle>
          <CardDescription className="safe-text-container">
            <span>Text content with </span>
            <Badge variant="outline">inline badge</Badge>
            <span> and more text.</span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium mb-2">List of items:</h3>
              <ul className="space-y-1">
                <li>Item 1</li>
                <li>Item 2</li>
                <li>Item 3</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-medium mb-2">Status indicators:</h3>
              <div className="flex gap-2">
                <Badge variant="outline" className="bg-green-50 text-green-700">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Success
                </Badge>
                <Badge variant="outline" className="bg-blue-50 text-blue-700">
                  <AlertCircle className="w-3 h-3 mr-1" />
                  Info
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Test scrollable content */}
      <Card>
        <CardHeader>
          <CardTitle>Scrollable Content Test</CardTitle>
          <CardDescription>
            Testing custom scrollbar styling
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-40 overflow-y-auto custom-scrollbar border rounded p-4">
            {Array.from({ length: 20 }, (_, i) => (
              <div key={i} className="py-2 border-b last:border-b-0">
                Item {i + 1} - This is scrollable content to test the custom scrollbar
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DOMValidationTest;
import React from 'react';
import { TestTube, CheckCircle, AlertTriangle } from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { getStatusBadge, getPriorityBadge } from './helpers';

interface LabOrderCardProps {
  order: any;
  t: any;
  onEnterResults: (order: any) => void;
}

export const LabOrderCard = ({ order, t, onEnterResults }: LabOrderCardProps) => (
  <div className="flex items-center justify-between p-4 border rounded-lg">
    <div className="flex items-center gap-4">
      <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
        <TestTube className="w-6 h-6 text-orange-600" />
      </div>
      <div>
        <h3 className="font-semibold">{order.patientName}</h3>
        <p className="text-sm text-gray-600">{order.testType}</p>
        <p className="text-sm text-gray-500">
          Ordered by: {order.orderedBy} | {new Date(order.createdAt).toLocaleDateString()}
        </p>
        {order.priority && order.priority !== 'normal' && (
          <div className="mt-1">
            {getPriorityBadge(order.priority, t)}
          </div>
        )}
      </div>
    </div>
    <div className="flex items-center gap-2">
      {getStatusBadge(order.status, t)}
      {order.status === 'pending' && (
        <Button 
          size="sm" 
          onClick={() => onEnterResults(order)}
        >
          {t.enterResults}
        </Button>
      )}
    </div>
  </div>
);

interface CompletedTestCardProps {
  order: any;
  t: any;
}

export const CompletedTestCard = ({ order, t }: CompletedTestCardProps) => (
  <div className="flex items-center justify-between p-4 border rounded-lg">
    <div className="flex items-center gap-4">
      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
        <CheckCircle className="w-6 h-6 text-green-600" />
      </div>
      <div>
        <h3 className="font-semibold">{order.patientName}</h3>
        <p className="text-sm text-gray-600">{order.testType}</p>
        <p className="text-sm text-gray-500">
          Completed: {new Date(order.completedAt || order.createdAt).toLocaleDateString()}
        </p>
        {order.results && (
          <div className="flex items-center gap-2 mt-1">
            <span className="text-sm">{order.results.value} {order.results.unit}</span>
            {order.results.status === 'critical' && (
              <AlertTriangle className="w-4 h-4 text-red-500" />
            )}
          </div>
        )}
      </div>
    </div>
    <div className="flex items-center gap-2">
      {order.results && getResultStatusBadge(order.results.status, t)}
      <Button size="sm" variant="outline">
        <TestTube className="w-4 h-4 mr-2" />
        {t.viewReport}
      </Button>
    </div>
  </div>
);

function getResultStatusBadge(status: string, t: any) {
  switch (status) {
    case 'normal':
      return <div className="w-3 h-3 bg-green-500 rounded-full" title={t.normal}></div>;
    case 'abnormal':
      return <div className="w-3 h-3 bg-yellow-500 rounded-full" title={t.abnormal}></div>;
    case 'critical':
      return <div className="w-3 h-3 bg-red-500 rounded-full" title={t.critical}></div>;
    default:
      return <div className="w-3 h-3 bg-gray-500 rounded-full"></div>;
  }
}

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ElementType;
  color: string;
}

export const StatCard = ({ title, value, icon: Icon, color }: StatCardProps) => (
  <Card>
    <CardContent className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold">{value}</p>
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </CardContent>
  </Card>
);
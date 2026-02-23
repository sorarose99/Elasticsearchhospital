import { Badge } from '../ui/badge';
import { Clock, CheckCircle, AlertTriangle, Activity } from 'lucide-react';

export const getStatusBadge = (status: string, t: any) => {
  switch (status) {
    case 'pending':
      return <Badge variant="secondary"><Clock className="w-3 h-3 mr-1" />{t.pending}</Badge>;
    case 'in_progress':
      return <Badge variant="outline"><Activity className="w-3 h-3 mr-1" />{t.inProgress}</Badge>;
    case 'completed':
      return <Badge variant="default"><CheckCircle className="w-3 h-3 mr-1" />{t.completed}</Badge>;
    default:
      return <Badge variant="secondary">{status}</Badge>;
  }
};

export const getResultStatus = (status: string, t: any) => {
  switch (status) {
    case 'normal':
      return <Badge variant="default">{t.normal}</Badge>;
    case 'abnormal':
      return <Badge variant="secondary">{t.abnormal}</Badge>;
    case 'critical':
      return <Badge variant="destructive"><AlertTriangle className="w-3 h-3 mr-1" />{t.critical}</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

export const getPriorityBadge = (priority: string, t: any) => {
  switch (priority) {
    case 'normal':
      return <Badge variant="outline">{t.normal}</Badge>;
    case 'urgent':
      return <Badge variant="secondary">{t.urgent}</Badge>;
    case 'stat':
      return <Badge variant="destructive">STAT</Badge>;
    default:
      return <Badge variant="outline">{priority}</Badge>;
  }
};

export const filterLabOrders = (orders: any[], searchTerm: string) => {
  return orders.filter((order: any) =>
    order.patientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.testType?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.id?.toLowerCase().includes(searchTerm.toLowerCase())
  );
};

export const calculateLabStats = (orders: any[]) => {
  const pendingOrders = orders.filter((order: any) => order.status === 'pending');
  const completedOrders = orders.filter((order: any) => order.status === 'completed');
  const todayOrders = orders.filter((order: any) => 
    order.createdAt?.startsWith(new Date().toISOString().split('T')[0])
  );
  const criticalResults = completedOrders.filter((order: any) => order.results?.status === 'critical');

  return {
    pendingOrders,
    completedOrders,
    todayOrders,
    criticalResults
  };
};
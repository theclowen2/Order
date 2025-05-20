
import React from 'react';
import { Badge } from '@/components/ui/badge';

type OrderStatus = 'Pending' | 'In Progress' | 'Completed';

interface StatusBadgeProps {
  status: OrderStatus;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  switch (status) {
    case 'Pending':
      return (
        <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
          Pending
        </Badge>
      );
    case 'In Progress':
      return (
        <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
          In Progress
        </Badge>
      );
    case 'Completed':
      return (
        <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
          Completed
        </Badge>
      );
    default:
      return (
        <Badge>
          {status}
        </Badge>
      );
  }
};

export default StatusBadge;

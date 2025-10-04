import React from 'react';
import StatCard from '../../components/admin/StatCard';
import { MOCK_PROPERTIES, MOCK_CLIENTS } from '../../constants';
import { BanknotesIcon, HomeModernIcon, UserPlusIcon, CheckCircleIcon } from '@heroicons/react/24/solid';

const AdminDashboard: React.FC = () => {
  const totalProperties = MOCK_PROPERTIES.length;
  const activeListings = MOCK_PROPERTIES.filter(p => p.status === 'For Sale' || p.status === 'For Rent').length;
  const totalLeads = MOCK_CLIENTS.length;
  const closedDeals = MOCK_CLIENTS.filter(c => c.status === 'Closed').length;
  const totalSalesValue = MOCK_PROPERTIES.filter(p => p.status === 'Sold').reduce((sum, p) => sum + p.price, 0);

  // Simple placeholder for a chart component
  const ChartPlaceholder = ({ title }: {title: string}) => (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold text-gray-700 mb-4">{title}</h3>
      <div className="bg-gray-200 h-64 rounded-md flex items-center justify-center">
        <p className="text-gray-500">Chart Data Here</p>
      </div>
    </div>
  );


  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Dashboard</h1>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
          icon={BanknotesIcon} 
          title="Total Sales Value" 
          value={`$${(totalSalesValue / 1_000_000).toFixed(2)}M`}
          color="green" 
        />
        <StatCard 
          icon={HomeModernIcon} 
          title="Active Listings" 
          value={activeListings.toString()} 
          color="blue"
        />
        <StatCard 
          icon={UserPlusIcon} 
          title="New Leads (30 days)" 
          value={MOCK_CLIENTS.filter(c => c.status === 'New').length.toString()}
          color="purple"
        />
        <StatCard 
          icon={CheckCircleIcon} 
          title="Closed Deals" 
          value={closedDeals.toString()}
          color="yellow"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartPlaceholder title="Leads per Month" />
        <ChartPlaceholder title="Property Status Overview" />
      </div>
    </div>
  );
};

export default AdminDashboard;

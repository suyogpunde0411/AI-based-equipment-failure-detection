import React, { useEffect, useState } from 'react';
import { dashboardService } from '../services/dashboardService';
import Card from '../components/Card';
import ChartCard from '../components/ChartCard';
import Loader from '../components/Loader';
import { Cpu, AlertCircle, Heart, Zap, RefreshCw } from 'lucide-react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';
import { toast } from 'react-hot-toast';

export const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const response = await dashboardService.getDashboardData();
      setData(response);
    } catch (e) {
      toast.error('Failed to load telemetry dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Risk Color Mapping
  const getRiskColor = (level) => {
    const risk = String(level).toUpperCase();
    if (risk.includes('LOW')) return 'text-emerald-400 bg-emerald-950/30 border-emerald-900/40';
    if (risk.includes('MEDIUM')) return 'text-amber-400 bg-amber-950/30 border-amber-900/40';
    if (risk.includes('HIGH')) return 'text-orange-400 bg-orange-950/30 border-orange-900/40';
    return 'text-red-400 bg-red-950/30 border-red-900/40'; // CRITICAL / HIGH FAILURE RISK
  };

  const getRiskHexColor = (level) => {
    const risk = String(level).toUpperCase();
    if (risk.includes('LOW')) return '#10b981'; // Emerald
    if (risk.includes('MEDIUM')) return '#f59e0b'; // Amber
    if (risk.includes('HIGH')) return '#f97316'; // Orange
    return '#ef4444'; // Red
  };

  const dashboardMetrics = [
    {
      title: 'Total Equipment',
      value: data?.totalEquipment ?? 0,
      icon: Cpu,
      subtitle: 'Registered industrial units',
      color: 'text-enterprise-400 border-enterprise-900/30 bg-enterprise-950/10',
    },
    {
      title: 'Healthy / Running',
      value: data?.healthyEquipment ?? 0,
      icon: Zap,
      subtitle: 'Active standard state',
      color: 'text-emerald-400 border-emerald-900/30 bg-emerald-950/10',
    },
    {
      title: 'Critical Alarm',
      value: data?.criticalEquipment ?? 0,
      icon: AlertCircle,
      subtitle: 'Predicted high risk state',
      color: 'text-red-400 border-red-900/30 bg-red-950/10',
    },
    {
      title: 'Avg Health Score',
      value: data?.averageHealthScore ? `${data.averageHealthScore.toFixed(1)}%` : '0%',
      icon: Heart,
      subtitle: 'System aggregates telemetry',
      color: 'text-sky-400 border-sky-900/30 bg-sky-950/10',
    },
  ];

  // Map risk distribution to Pie Chart
  const pieData = data?.riskDistribution?.map((item) => ({
    name: item.riskLevel,
    value: item.count,
  })) || [];

  // Map recent predictions to Bar Chart
  const barData = data?.recentPredictions?.map((item) => ({
    name: item.machineName.length > 10 ? item.machineName.substring(0, 10) + '...' : item.machineName,
    health: item.healthScore,
  })) || [];

  if (loading) {
    return (
      <div className="h-[70vh] flex items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Banner Toolbar */}
      <div className="flex items-center justify-between border-b border-slate-850 pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-100">Telemetry Dashboard</h1>
          <p className="text-xs text-slate-400 mt-1">Real-time status overview of machine predictions and health indexes</p>
        </div>
        <button
          onClick={fetchDashboardData}
          className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 transition-colors flex items-center space-x-1 text-xs font-semibold"
          title="Refresh Data"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {dashboardMetrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <Card key={metric.title} className={`${metric.color} border`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">{metric.title}</p>
                  <p className="text-2xl font-bold mt-2 text-slate-150">{metric.value}</p>
                  <p className="text-[10px] text-slate-500 mt-1">{metric.subtitle}</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-850 shadow-inner text-current">
                  <Icon size={22} />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Chart Row */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Risk Distribution Pie Chart */}
        <div className="lg:col-span-2">
          <ChartCard title="System Risk Distribution" subtitle="Active threat profile segments">
            {pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="45%"
                    innerRadius={65}
                    outerRadius={85}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={getRiskHexColor(entry.name)} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      border: '1px solid #1e293b',
                      borderRadius: '8px',
                      color: '#f8fafc',
                    }}
                  />
                  <Legend
                    verticalAlign="bottom"
                    iconSize={10}
                    iconType="circle"
                    wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-slate-500 text-xs">No distribution data</div>
            )}
          </ChartCard>
        </div>

        {/* Health Scores Bar Chart */}
        <div className="lg:col-span-3">
          <ChartCard title="Telemetry Health Index" subtitle="Comparative analysis of recently evaluated machines">
            {barData.length > 0 ? (
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={barData} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="name" stroke="#64748b" fontSize={10} tickLine={false} />
                  <YAxis stroke="#64748b" fontSize={10} tickLine={false} domain={[0, 100]} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      border: '1px solid #1e293b',
                      borderRadius: '8px',
                      color: '#f8fafc',
                    }}
                  />
                  <Bar dataKey="health" fill="#3b82f6" radius={[4, 4, 0, 0]}>
                    {barData.map((entry, index) => {
                      const score = entry.health;
                      let barColor = '#10b981'; // Green
                      if (score < 50) barColor = '#ef4444'; // Red
                      else if (score < 80) barColor = '#f59e0b'; // Amber
                      return <Cell key={`cell-${index}`} fill={barColor} />;
                    })}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-slate-500 text-xs">No performance index data</div>
            )}
          </ChartCard>
        </div>
      </div>

      {/* Recent Predictions Table Card */}
      <Card title="Recent Predictive Analysis Logs" subtitle="Latest 10 sensory evaluations and model results">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-800 text-left text-xs">
            <thead className="bg-slate-900/50 text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
              <tr>
                <th className="px-6 py-3">Machine Name</th>
                <th className="px-6 py-3">Failure Probability</th>
                <th className="px-6 py-3">Telemetry Health Score</th>
                <th className="px-6 py-3">Risk Assessment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 bg-slate-950/10 text-slate-350">
              {data?.recentPredictions && data.recentPredictions.length > 0 ? (
                data.recentPredictions.map((pred, idx) => (
                  <tr key={idx} className="hover:bg-slate-900/25 transition-colors">
                    <td className="px-6 py-3.5 font-semibold text-slate-200">{pred.machineName}</td>
                    <td className="px-6 py-3.5 font-mono">{(pred.probability * 100).toFixed(2)}%</td>
                    <td className="px-6 py-3.5">
                      <div className="flex items-center space-x-2">
                        <div className="w-16 bg-slate-800 rounded-full h-1.5 overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              pred.healthScore > 75
                                ? 'bg-emerald-500'
                                : pred.healthScore > 50
                                ? 'bg-amber-500'
                                : 'bg-red-500'
                            }`}
                            style={{ width: `${pred.healthScore}%` }}
                          />
                        </div>
                        <span className="font-semibold text-slate-200">{pred.healthScore.toFixed(1)}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-3.5">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getRiskColor(pred.riskLevel)}`}>
                        {pred.riskLevel}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-slate-500">
                    No recent predictions logged in database.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;

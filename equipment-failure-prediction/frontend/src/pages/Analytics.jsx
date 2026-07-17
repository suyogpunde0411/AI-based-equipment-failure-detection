import React, { useState, useEffect } from 'react';
import { equipmentService } from '../services/equipmentService';
import { dashboardService } from '../services/dashboardService';
import Card from '../components/Card';
import ChartCard from '../components/ChartCard';
import Loader from '../components/Loader';
import { toast } from 'react-hot-toast';
import { Calendar, Filter, BarChart3, LineChart, PieChart, TrendingUp, AlertTriangle } from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  LineChart as RechartsLineChart,
  Line,
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';

export const Analytics = () => {
  const [equipmentList, setEquipmentList] = useState([]);
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Filters
  const [selectedEqId, setSelectedEqId] = useState('ALL');
  const [timeRange, setTimeRange] = useState('30DAYS');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [eqRes, dashRes] = await Promise.all([
          equipmentService.getAll(),
          dashboardService.getDashboardData(),
        ]);

        if (eqRes.success && eqRes.data) {
          setEquipmentList(eqRes.data);
        }
        setDashboardData(dashRes);
      } catch (e) {
        toast.error('Failed to load telemetry analytics data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Generate mock historical analytics data based on selections
  const telemetryTrendData = React.useMemo(() => {
    const points = timeRange === '7DAYS' ? 7 : timeRange === '30DAYS' ? 12 : 24;
    const baseList = [];
    const date = new Date();

    for (let i = points - 1; i >= 0; i--) {
      const d = new Date(date);
      if (timeRange === '7DAYS') {
        d.setDate(date.getDate() - i);
      } else {
        d.setDate(date.getDate() - i * 3);
      }

      // Add slight variances based on machine selection
      const modifier = selectedEqId === 'ALL' ? 1 : (Number(selectedEqId) % 3) + 0.8;
      const hourLabel = d.toLocaleDateString([], { month: 'short', day: 'numeric' });

      baseList.push({
        date: hourLabel,
        torque: Math.round((42 + Math.sin(i * 0.8) * 12 + Math.cos(i * 0.4) * 4) * modifier),
        speed: Math.round((1480 + Math.sin(i * 0.5) * 280 + Math.cos(i * 0.2) * 80) * modifier),
        temperature: Math.round((302 + Math.sin(i * 0.3) * 6 + (points - i) * 0.2) * modifier),
        wear: Math.round(((i * 6) % 220) * modifier),
        failureProbability: Math.min(
          98,
          Math.max(
            1,
            Math.round((12 + Math.sin(i * 0.9) * 15 + (i % 4 === 0 ? 30 : 0)) * modifier)
          )
        ),
      });
    }
    return baseList;
  }, [timeRange, selectedEqId]);

  const comparativeData = React.useMemo(() => {
    if (!equipmentList || equipmentList.length === 0) return [];
    return equipmentList.map((eq, idx) => {
      // Seed some scores based on id
      const healthScore = Math.max(
        35,
        Math.min(99, 95 - (eq.id % 4) * 15 + (eq.status === 'STOPPED' ? -30 : eq.status === 'MAINTENANCE' ? -15 : 0))
      );
      return {
        name: eq.machineName.substring(0, 12),
        healthScore,
        efficiency: Math.round(healthScore * 0.95),
      };
    });
  }, [equipmentList]);

  if (loading) {
    return (
      <div className="h-[70vh] flex items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Banner toolbar */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-850 pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-100">Telemetry Analytics</h1>
          <p className="text-xs text-slate-400 mt-1">Comparative metrics, performance wear charts, and historical failure analysis</p>
        </div>

        {/* Filters control block */}
        <div className="flex flex-wrap items-center gap-3 bg-slate-900/40 p-2 border border-slate-850 rounded-xl">
          <div className="flex items-center space-x-1.5 text-xs text-slate-400 font-semibold pl-1">
            <Filter size={14} />
            <span>Filters:</span>
          </div>

          {/* Machine dropdown */}
          <select
            value={selectedEqId}
            onChange={(e) => setSelectedEqId(e.target.value)}
            className="p-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-300 focus:outline-none cursor-pointer"
          >
            <option value="ALL">All Equipment Units</option>
            {equipmentList.map((eq) => (
              <option key={eq.id} value={eq.id}>
                {eq.machineName}
              </option>
            ))}
          </select>

          {/* Timeframe dropdown */}
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="p-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-300 focus:outline-none cursor-pointer"
          >
            <option value="7DAYS">Last 7 Days</option>
            <option value="30DAYS">Last 30 Days</option>
            <option value="6MONTHS">Last 6 Months</option>
          </select>
        </div>
      </div>

      {/* Main Charts Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Failure Probability Trend */}
        <ChartCard title="Evaluated Failure Probability Trend" subtitle="Neural risk probability averages over selected timeline" icon={TrendingUp}>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={telemetryTrendData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
              <defs>
                <linearGradient id="colorProb" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="date" stroke="#64748b" fontSize={10} tickLine={false} />
              <YAxis stroke="#64748b" fontSize={10} tickLine={false} domain={[0, 100]} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  border: '1px solid #1e293b',
                  borderRadius: '8px',
                  color: '#f8fafc',
                }}
              />
              <Area type="monotone" dataKey="failureProbability" name="Probability (%)" stroke="#ef4444" strokeWidth={2} fillOpacity={1} fill="url(#colorProb)" />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Speed vs Torque Telemetry */}
        <ChartCard title="Rotational Speed vs Torque Levels" subtitle="Evaluated load limits compared against normal limits" icon={LineChart}>
          <ResponsiveContainer width="100%" height={280}>
            <RechartsLineChart data={telemetryTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="date" stroke="#64748b" fontSize={10} tickLine={false} />
              <YAxis yAxisId="left" stroke="#3b82f6" fontSize={10} tickLine={false} />
              <YAxis yAxisId="right" orientation="right" stroke="#10b981" fontSize={10} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  border: '1px solid #1e293b',
                  borderRadius: '8px',
                  color: '#f8fafc',
                }}
              />
              <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: '11px' }} />
              <Line yAxisId="left" type="monotone" dataKey="speed" name="Speed (rpm)" stroke="#3b82f6" strokeWidth={1.5} dot={false} />
              <Line yAxisId="right" type="monotone" dataKey="torque" name="Torque (Nm)" stroke="#10b981" strokeWidth={1.5} dot={false} />
            </RechartsLineChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Equipment Health Comparatives */}
        <ChartCard title="Equipment Health Comparisons" subtitle="Telemetry score vs operational productivity state" icon={BarChart3}>
          {comparativeData.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <RechartsBarChart data={comparativeData} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
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
                <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: '11px' }} />
                <Bar dataKey="healthScore" name="Health score (%)" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
                <Bar dataKey="efficiency" name="Efficiency (%)" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </RechartsBarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full text-slate-500 text-xs">No comparison telemetry logged</div>
          )}
        </ChartCard>

        {/* Tool Wear Depletion */}
        <ChartCard title="Tool Wear Progression Rate" subtitle="Wear life cycle tracking" icon={TrendingUp}>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={telemetryTrendData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
              <defs>
                <linearGradient id="colorWear" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="date" stroke="#64748b" fontSize={10} tickLine={false} />
              <YAxis stroke="#64748b" fontSize={10} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  border: '1px solid #1e293b',
                  borderRadius: '8px',
                  color: '#f8fafc',
                }}
              />
              <Area type="monotone" dataKey="wear" name="Tool Wear (min)" stroke="#f59e0b" strokeWidth={2} fillOpacity={1} fill="url(#colorWear)" />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
};

export default Analytics;

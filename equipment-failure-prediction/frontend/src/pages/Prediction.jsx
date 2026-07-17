import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { predictionService } from '../services/predictionService';
import { equipmentService } from '../services/equipmentService';
import Card from '../components/Card';
import Button from '../components/Button';
import Loader from '../components/Loader';
import { toast } from 'react-hot-toast';
import { Cpu, AlertTriangle, CheckCircle, ShieldAlert, Sparkles, TrendingUp, HelpCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export const Prediction = () => {
  const [equipmentList, setEquipmentList] = useState([]);
  const [loadingEquipment, setLoadingEquipment] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      airTemperature: 300.0,
      processTemperature: 310.0,
      rotationalSpeed: 1500.0,
      torque: 40.0,
      toolWear: 50.0,
    },
  });

  const selectedEquipmentId = watch('equipmentId');

  useEffect(() => {
    const fetchEquipment = async () => {
      try {
        const response = await equipmentService.getAll();
        if (response.success && response.data) {
          setEquipmentList(response.data);
          if (response.data.length > 0) {
            setValue('equipmentId', response.data[0].id);
          }
        }
      } catch (e) {
        toast.error('Failed to load equipment list for prediction selection');
      } finally {
        setLoadingEquipment(false);
      }
    };
    fetchEquipment();
  }, [setValue]);

  const onSubmit = async (data) => {
    setSubmitting(true);
    setResult(null);
    try {
      // Parse numerical values to numbers
      const payload = {
        equipmentId: Number(data.equipmentId),
        airTemperature: Number(data.airTemperature),
        processTemperature: Number(data.processTemperature),
        rotationalSpeed: Number(data.rotationalSpeed),
        torque: Number(data.torque),
        toolWear: Number(data.toolWear),
      };

      const response = await predictionService.predict(payload);
      setResult(response);
      toast.success('Failure prediction evaluated successfully!');
    } catch (e) {
      toast.error(e.response?.data?.message || 'Error occurred during failure prediction evaluation');
    } finally {
      setSubmitting(false);
    }
  };

  const getRiskColor = (level) => {
    const risk = String(level).toUpperCase();
    if (risk.includes('LOW')) return 'text-emerald-400 border-emerald-900 bg-emerald-950/20';
    if (risk.includes('MEDIUM')) return 'text-amber-400 border-amber-900 bg-amber-950/20';
    if (risk.includes('HIGH')) return 'text-orange-400 border-orange-900 bg-orange-950/20';
    return 'text-red-400 border-red-900 bg-red-950/20'; // CRITICAL
  };

  const getRiskText = (level) => {
    const risk = String(level).toUpperCase();
    if (risk.includes('LOW')) return 'Normal Operation - Low Risk';
    if (risk.includes('MEDIUM')) return 'Attention Required - Moderate Risk';
    if (risk.includes('HIGH')) return 'Action Suggested - High Risk';
    return 'Immediate Shutdown Required - Critical Risk';
  };

  // SVG Gauge calculations
  const radius = 50;
  const strokeWidth = 8;
  const circumference = 2 * Math.PI * radius;
  const healthScore = result?.healthScore ?? 100;
  const strokeDashoffset = circumference - (healthScore / 100) * circumference;

  return (
    <div className="space-y-6">
      {/* Banner toolbar */}
      <div className="border-b border-slate-850 pb-4">
        <h1 className="text-2xl font-bold tracking-tight text-slate-100">Predictive Diagnostics</h1>
        <p className="text-xs text-slate-400 mt-1">
          Perform a machine safety prediction by submitting live sensory telemetry to the machine learning core
        </p>
      </div>

      {loadingEquipment ? (
        <div className="h-[50vh] flex items-center justify-center">
          <Loader size="lg" />
        </div>
      ) : equipmentList.length === 0 ? (
        <Card className="border border-slate-800/80 p-8 text-center flex flex-col items-center justify-center space-y-4">
          <div className="p-3 bg-red-500/10 text-red-400 border border-red-550/20 rounded-full">
            <AlertTriangle size={32} />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-200">No Equipment Registered</h3>
            <p className="text-xs text-slate-500 mt-1">
              You must register at least one equipment in the inventory before running diagnostics.
            </p>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Input Panel */}
          <div className="lg:col-span-2 space-y-6">
            <Card title="Sensory Telemetry Feed" icon={Cpu} className="border border-slate-800/80">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-xs font-semibold">
                {/* Equipment Selection */}
                <div className="space-y-1">
                  <label className="text-slate-400 uppercase tracking-wider block">Target Machine Unit</label>
                  <select
                    className="w-full p-2.5 bg-slate-950 border border-slate-850 rounded-lg text-slate-200 focus:outline-none focus:border-enterprise-500 cursor-pointer text-xs"
                    {...register('equipmentId', { required: 'Please select an equipment unit' })}
                  >
                    {equipmentList.map((eq) => (
                      <option key={eq.id} value={eq.id} className="bg-slate-900">
                        {eq.machineName} ({eq.equipmentCode})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Air Temperature */}
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <label className="text-slate-400 uppercase tracking-wider">Air Temperature [K]</label>
                    <span className="text-slate-500">Normal: 295 - 305 K</span>
                  </div>
                  <input
                    type="number"
                    step="0.1"
                    className="w-full p-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-enterprise-500"
                    placeholder="300.0"
                    {...register('airTemperature', { required: true })}
                  />
                </div>

                {/* Process Temperature */}
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <label className="text-slate-400 uppercase tracking-wider">Process Temperature [K]</label>
                    <span className="text-slate-500">Normal: 305 - 315 K</span>
                  </div>
                  <input
                    type="number"
                    step="0.1"
                    className="w-full p-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-enterprise-500"
                    placeholder="310.0"
                    {...register('processTemperature', { required: true })}
                  />
                </div>

                {/* Rotational Speed */}
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <label className="text-slate-400 uppercase tracking-wider">Rotational Speed [rpm]</label>
                    <span className="text-slate-500">Normal: 1200 - 2000 rpm</span>
                  </div>
                  <input
                    type="number"
                    step="1"
                    className="w-full p-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-enterprise-500"
                    placeholder="1500"
                    {...register('rotationalSpeed', { required: true })}
                  />
                </div>

                {/* Torque */}
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <label className="text-slate-400 uppercase tracking-wider">Torque [Nm]</label>
                    <span className="text-slate-500">Normal: 25 - 60 Nm</span>
                  </div>
                  <input
                    type="number"
                    step="0.1"
                    className="w-full p-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-enterprise-500"
                    placeholder="40.0"
                    {...register('torque', { required: true })}
                  />
                </div>

                {/* Tool Wear */}
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <label className="text-slate-400 uppercase tracking-wider">Tool Wear [min]</label>
                    <span className="text-slate-500">Critical: &gt; 200 min</span>
                  </div>
                  <input
                    type="number"
                    step="1"
                    className="w-full p-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-enterprise-500"
                    placeholder="50"
                    {...register('toolWear', { required: true })}
                  />
                </div>

                {/* Submit Trigger */}
                <Button type="submit" variant="primary" className="w-full mt-4" loading={submitting}>
                  Run Failure Diagnostics
                </Button>
              </form>
            </Card>
          </div>

          {/* Results Panel */}
          <div className="lg:col-span-3 space-y-6">
            {submitting ? (
              <Card className="h-full flex items-center justify-center min-h-[500px] border border-slate-800/80">
                <Loader size="lg" />
              </Card>
            ) : result ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                {/* Core Risk Banner */}
                <Card className={`border ${getRiskColor(result.riskLevel)}`}>
                  <div className="flex flex-col md:flex-row items-center md:justify-between gap-6">
                    {/* Circle Health Gauge */}
                    <div className="relative flex items-center justify-center flex-shrink-0 w-32 h-32">
                      <svg className="w-32 h-32 transform -rotate-90">
                        <circle
                          cx="64"
                          cy="64"
                          r={radius}
                          stroke="#1e293b"
                          strokeWidth={strokeWidth}
                          fill="transparent"
                        />
                        <motion.circle
                          cx="64"
                          cy="64"
                          r={radius}
                          stroke={result.healthScore > 75 ? '#10b981' : result.healthScore > 50 ? '#f59e0b' : '#ef4444'}
                          strokeWidth={strokeWidth}
                          fill="transparent"
                          strokeDasharray={circumference}
                          initial={{ strokeDashoffset: circumference }}
                          animate={{ strokeDashoffset }}
                          transition={{ duration: 1, ease: 'easeOut' }}
                          strokeLinecap="round"
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-xl font-bold text-slate-100">{result.healthScore.toFixed(0)}%</span>
                        <span className="text-[9px] text-slate-500 font-semibold uppercase tracking-wider">Health</span>
                      </div>
                    </div>

                    {/* Threat analysis description */}
                    <div className="flex-grow text-center md:text-left">
                      <div className="flex items-center justify-center md:justify-start space-x-2">
                        {result.failure ? (
                          <ShieldAlert size={20} className="text-red-500 animate-bounce" />
                        ) : (
                          <CheckCircle size={20} className="text-emerald-500 animate-pulse" />
                        )}
                        <h3 className="text-base font-bold text-slate-200">
                          {result.failure ? 'Failure State Predicted' : 'Healthy State Predicted'}
                        </h3>
                      </div>
                      <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                        Evaluated risk indicator is <span className="font-semibold text-slate-100">{result.riskLevel}</span>.{' '}
                        {getRiskText(result.riskLevel)}
                      </p>
                      <div className="grid grid-cols-2 gap-4 mt-4 text-xs">
                        <div className="p-2 rounded-lg bg-slate-900/80 border border-slate-850">
                          <p className="text-slate-500 font-semibold uppercase tracking-wider text-[9px]">Model Confidence</p>
                          <p className="text-slate-200 font-bold mt-0.5">{result.confidence.toFixed(2)}%</p>
                        </div>
                        <div className="p-2 rounded-lg bg-slate-900/80 border border-slate-850">
                          <p className="text-slate-500 font-semibold uppercase tracking-wider text-[9px]">Failure Probability</p>
                          <p className="text-slate-200 font-bold mt-0.5">{(result.probability * 100).toFixed(2)}%</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Factors & Recommendations */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Top Factors */}
                  <Card title="Top Contributing Factors" icon={TrendingUp} className="border border-slate-800/80 h-full">
                    {result.topFactors && result.topFactors.length > 0 ? (
                      <ul className="space-y-3.5 mt-2">
                        {result.topFactors.map((factor, idx) => (
                          <li key={idx} className="flex items-start text-xs text-slate-350">
                            <span className="p-1 rounded bg-slate-800 text-slate-400 text-[10px] font-bold mr-3 mt-0.5 select-none w-5 h-5 flex items-center justify-center">
                              {idx + 1}
                            </span>
                            <span className="leading-relaxed">{factor}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-xs text-slate-500">No anomaly factors identified. Operation is within normal boundary conditions.</p>
                    )}
                  </Card>

                  {/* Recommendations */}
                  <Card title="Recommended Actions" icon={Sparkles} className="border border-slate-800/80 h-full">
                    {result.recommendations && result.recommendations.length > 0 ? (
                      <ul className="space-y-3.5 mt-2">
                        {result.recommendations.map((rec, idx) => (
                          <li key={idx} className="flex items-start text-xs text-slate-350">
                            <span className="p-1.5 rounded-lg bg-enterprise-950/20 text-enterprise-400 mr-3 mt-0.5">
                              <CheckCircle size={12} className="text-enterprise-500" />
                            </span>
                            <span className="leading-relaxed">{rec}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-xs text-slate-500">No corrective actions needed. Continue standard schedules.</p>
                    )}
                  </Card>
                </div>
              </motion.div>
            ) : (
              <Card className="h-full border border-slate-800/80 flex flex-col items-center justify-center text-slate-550 text-center min-h-[500px] p-8">
                <HelpCircle size={44} className="text-slate-700 mb-3" />
                <h3 className="text-sm font-bold text-slate-400">Awaiting Telemetry Feed</h3>
                <p className="text-xs text-slate-500 mt-1 max-w-xs leading-relaxed">
                  Submit the sensor readings on the left control panel to execute neural failure evaluation.
                </p>
              </Card>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Prediction;

import React, { useState, useRef } from 'react';
import { predictionService } from '../services/predictionService';
import Card from '../components/Card';
import Button from '../components/Button';
import Loader from '../components/Loader';
import { toast } from 'react-hot-toast';
import { Upload, FileText, CheckCircle, XCircle, Download, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const CsvUpload = () => {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState(null);
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.name.endsWith('.csv')) {
        setFile(droppedFile);
        setResult(null);
      } else {
        toast.error('Invalid file type. Please upload a CSV file.');
      }
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.name.endsWith('.csv')) {
        setFile(selectedFile);
        setResult(null);
      } else {
        toast.error('Invalid file type. Please upload a CSV file.');
      }
    }
  };

  const onButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    setProgress(15);
    setResult(null);

    // Mock progress bar intervals
    const progressInterval = setInterval(() => {
      setProgress((prev) => (prev < 85 ? prev + 15 : prev));
    }, 250);

    try {
      const response = await predictionService.uploadCsv(file);
      clearInterval(progressInterval);
      setProgress(100);
      setResult(response);
      toast.success('CSV dataset processed successfully');
    } catch (e) {
      clearInterval(progressInterval);
      toast.error(e.response?.data?.message || 'Error occurred while processing CSV dataset');
    } finally {
      setUploading(false);
    }
  };

  const downloadSampleCsv = () => {
    const csvContent =
      'equipmentId,airTemperature,processTemperature,rotationalSpeed,torque,toolWear\n' +
      '1,298.1,308.6,1550.0,42.8,0\n' +
      '1,300.2,310.1,1480.0,46.2,25\n' +
      '1,302.5,312.2,1680.0,38.5,150\n';

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'sensor_readings_sample.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Banner toolbar */}
      <div className="flex items-center justify-between border-b border-slate-850 pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-100">Batch Processing</h1>
          <p className="text-xs text-slate-400 mt-1">Upload CSV datasets to run bulk machine-failure diagnostic operations</p>
        </div>
        <Button onClick={downloadSampleCsv} variant="outline" size="sm" className="flex items-center space-x-1.5">
          <Download size={14} />
          <span>Sample Template</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Upload Interface Panel */}
        <div className="lg:col-span-3">
          <Card title="Upload Sensor Dataset" subtitle="Supports CSV format conforming to template columns">
            <div className="space-y-6">
              {/* Drag Area */}
              <div
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
                onClick={onButtonClick}
                className={`border-2 border-dashed rounded-xl p-10 flex flex-col items-center justify-center cursor-pointer transition-all ${
                  dragActive
                    ? 'border-enterprise-500 bg-enterprise-950/10'
                    : 'border-slate-800 hover:border-slate-700 bg-slate-950/20'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  accept=".csv"
                  onChange={handleFileChange}
                />

                <div className="p-4 rounded-full bg-slate-900 border border-slate-800 text-slate-400 mb-4 shadow-inner">
                  <Upload size={28} className="text-enterprise-400" />
                </div>

                <p className="text-xs font-semibold text-slate-200">
                  {file ? file.name : 'Drag and drop your dataset CSV here'}
                </p>
                <p className="text-[10px] text-slate-500 mt-1">
                  {file ? `${(file.size / 1024).toFixed(2)} KB` : 'Or click to browse from device'}
                </p>
              </div>

              {/* Progress bar info */}
              <AnimatePresence>
                {file && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="p-4 rounded-xl bg-slate-900 border border-slate-850 flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-3">
                      <FileText size={20} className="text-enterprise-400" />
                      <div>
                        <p className="text-xs font-semibold text-slate-200">{file.name}</p>
                        <p className="text-[9px] text-slate-500">Ready to compute batch</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setFile(null)}
                      className="text-xs font-bold text-red-400 hover:underline focus:outline-none"
                    >
                      Clear
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Upload Trigger */}
              {file && (
                <div className="flex justify-end pt-2">
                  <Button onClick={handleUpload} variant="primary" loading={uploading} className="w-full sm:w-auto">
                    Process Dataset
                  </Button>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-2">
          <Card title="Batch Output Status" className="h-full border border-slate-850">
            <div className="h-full flex flex-col justify-center">
              {uploading ? (
                <div className="space-y-4 py-8">
                  <Loader size="md" />
                  <div className="space-y-1 max-w-xs mx-auto text-center">
                    <p className="text-xs font-semibold text-slate-350">Evaluating telemetry matrix...</p>
                    <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden border border-slate-850">
                      <div className="bg-enterprise-500 h-full rounded-full" style={{ width: `${progress}%` }} />
                    </div>
                    <span className="text-[10px] text-slate-550">{progress}% completed</span>
                  </div>
                </div>
              ) : result ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="space-y-4 py-4"
                >
                  <div className="flex items-center space-x-3 text-emerald-400 p-3 rounded-lg bg-emerald-950/20 border border-emerald-900/30">
                    <CheckCircle size={22} />
                    <div>
                      <h4 className="text-xs font-bold">Calculation Completed</h4>
                      <p className="text-[9px] text-slate-400 leading-normal">Batch model predictions stored in system repository</p>
                    </div>
                  </div>

                  {/* Stat breakdown */}
                  <div className="space-y-2 pt-2">
                    <div className="flex justify-between items-center text-xs p-2.5 rounded-lg bg-slate-950/40 border border-slate-850">
                      <span className="text-slate-450 font-semibold">Total Rows Parsed</span>
                      <span className="font-bold text-slate-200">{result.totalRows}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs p-2.5 rounded-lg bg-emerald-950/10 border border-emerald-900/20">
                      <span className="text-emerald-400 font-semibold">Successful Predictions</span>
                      <span className="font-bold text-emerald-400">{result.successPredictions}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs p-2.5 rounded-lg bg-red-950/10 border border-red-900/20">
                      <span className="text-red-400 font-semibold">Failed Parsing Errors</span>
                      <span className="font-bold text-red-400">{result.failedPredictions}</span>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <div className="text-center py-12 text-slate-500">
                  <AlertCircle size={38} className="mx-auto text-slate-700 mb-2" />
                  <p className="text-xs font-bold text-slate-400">Telemetry Log Awaiting Feed</p>
                  <p className="text-[10px] text-slate-550 mt-1 max-w-[220px] mx-auto leading-relaxed">
                    Upload and process a sensor dataset file to view batch diagnostics metrics here
                  </p>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CsvUpload;

import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { equipmentService } from '../services/equipmentService';
import DataTable from '../components/DataTable';
import Card from '../components/Card';
import Modal from '../components/Modal';
import ConfirmationDialog from '../components/ConfirmationDialog';
import Button from '../components/Button';
import Loader from '../components/Loader';
import { toast } from 'react-hot-toast';
import { Cpu, Edit, Trash2, Eye, Plus, Calendar, MapPin, Wrench, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const Equipment = () => {
  const [equipmentList, setEquipmentList] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals & Drawer State
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [selectedEquipment, setSelectedEquipment] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm();

  const fetchEquipment = async () => {
    setLoading(true);
    try {
      const response = await equipmentService.getAll();
      if (response.success && response.data) {
        setEquipmentList(response.data);
      }
    } catch (e) {
      toast.error('Failed to load equipment list');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEquipment();
  }, []);

  const getStatusBadge = (status) => {
    const s = String(status).toUpperCase();
    if (s === 'RUNNING') return 'bg-emerald-500/10 text-emerald-400 border-emerald-900/30';
    if (s === 'STOPPED') return 'bg-red-500/10 text-red-400 border-red-900/30';
    return 'bg-amber-500/10 text-amber-400 border-amber-900/30'; // MAINTENANCE
  };

  // Open Create modal
  const handleCreateOpen = () => {
    reset({
      equipmentCode: '',
      machineName: '',
      machineType: '',
      manufacturer: '',
      location: '',
      installationDate: '',
      status: 'RUNNING',
    });
    setIsCreateOpen(true);
  };

  // Open Edit modal
  const handleEditOpen = (equipment) => {
    setSelectedEquipment(equipment);
    reset({
      equipmentCode: equipment.equipmentCode,
      machineName: equipment.machineName,
      machineType: equipment.machineType,
      manufacturer: equipment.manufacturer,
      location: equipment.location,
      installationDate: equipment.installationDate,
      status: equipment.status,
    });
    setIsEditOpen(true);
  };

  // Open Confirm Delete Dialog
  const handleDeleteOpen = (equipment) => {
    setSelectedEquipment(equipment);
    setIsConfirmOpen(true);
  };

  // Open Details Drawer
  const handleViewOpen = (equipment) => {
    setSelectedEquipment(equipment);
    setIsDrawerOpen(true);
  };

  // Submit Create form
  const onCreateSubmit = async (data) => {
    try {
      const response = await equipmentService.create(data);
      if (response.success) {
        toast.success('Equipment registered successfully!');
        setIsCreateOpen(false);
        fetchEquipment();
      }
    } catch (e) {
      toast.error(e.response?.data?.message || 'Failed to register equipment');
    }
  };

  // Submit Edit form
  const onEditSubmit = async (data) => {
    try {
      const response = await equipmentService.update(selectedEquipment.id, data);
      if (response.success) {
        toast.success('Equipment settings updated successfully!');
        setIsEditOpen(false);
        fetchEquipment();
      }
    } catch (e) {
      toast.error(e.response?.data?.message || 'Failed to update equipment');
    }
  };

  // Perform delete operation
  const onDeleteConfirm = async () => {
    try {
      const response = await equipmentService.delete(selectedEquipment.id);
      if (response.success) {
        toast.success('Equipment removed successfully');
        fetchEquipment();
      }
    } catch (e) {
      toast.error(e.response?.data?.message || 'Failed to remove equipment');
    }
  };

  const columns = [
    { key: 'equipmentCode', label: 'Code' },
    { key: 'machineName', label: 'Name' },
    { key: 'machineType', label: 'Type' },
    { key: 'location', label: 'Location' },
    {
      key: 'status',
      label: 'Status',
      render: (row) => (
        <span className={`px-2.5 py-0.5 rounded text-xs font-bold border ${getStatusBadge(row.status)}`}>
          {row.status}
        </span>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      sortable: false,
      render: (row) => (
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handleViewOpen(row)}
            className="p-1 text-slate-400 hover:text-enterprise-400 hover:bg-slate-900 rounded transition-colors"
            title="View details"
          >
            <Eye size={16} />
          </button>
          <button
            onClick={() => handleEditOpen(row)}
            className="p-1 text-slate-400 hover:text-yellow-400 hover:bg-slate-900 rounded transition-colors"
            title="Edit settings"
          >
            <Edit size={16} />
          </button>
          <button
            onClick={() => handleDeleteOpen(row)}
            className="p-1 text-slate-400 hover:text-red-400 hover:bg-slate-900 rounded transition-colors"
            title="De-register"
          >
            <Trash2 size={16} />
          </button>
        </div>
      ),
    },
  ];

  if (loading && equipmentList.length === 0) {
    return (
      <div className="h-[70vh] flex items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6 relative">
      {/* Banner toolbar */}
      <div className="flex items-center justify-between border-b border-slate-850 pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-100">Equipment Inventory</h1>
          <p className="text-xs text-slate-400 mt-1">Manage industrial units, locations, status indexes, and installation cycles</p>
        </div>
        <Button onClick={handleCreateOpen} variant="primary" size="md" className="flex items-center space-x-1">
          <Plus size={16} />
          <span>Register Unit</span>
        </Button>
      </div>

      {/* Table Section */}
      <Card className="border border-slate-800/80">
        <DataTable
          columns={columns}
          data={equipmentList}
          searchKey="machineName"
          searchPlaceholder="Search machine name or model code..."
          itemsPerPage={10}
        />
      </Card>

      {/* CREATE MODAL */}
      <Modal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} title="Register Industrial Equipment" size="lg">
        <form onSubmit={handleSubmit(onCreateSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Equipment Code</label>
              <input
                type="text"
                className={`w-full p-2 bg-slate-950 border ${errors.equipmentCode ? 'border-red-500' : 'border-slate-800 focus:border-enterprise-500'} rounded-lg text-sm text-slate-200 focus:outline-none`}
                placeholder="EQ-1029"
                {...register('equipmentCode', { required: 'Code is required' })}
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Machine Name</label>
              <input
                type="text"
                className={`w-full p-2 bg-slate-950 border ${errors.machineName ? 'border-red-500' : 'border-slate-800 focus:border-enterprise-500'} rounded-lg text-sm text-slate-200 focus:outline-none`}
                placeholder="Lathe CNC Axis-A"
                {...register('machineName', { required: 'Machine Name is required' })}
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Machine Type</label>
              <input
                type="text"
                className={`w-full p-2 bg-slate-950 border ${errors.machineType ? 'border-red-500' : 'border-slate-800 focus:border-enterprise-500'} rounded-lg text-sm text-slate-200 focus:outline-none`}
                placeholder="Milling/Drilling"
                {...register('machineType', { required: 'Type is required' })}
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Manufacturer</label>
              <input
                type="text"
                className="w-full p-2 bg-slate-950 border border-slate-800 focus:border-enterprise-500 rounded-lg text-sm text-slate-200 focus:outline-none"
                placeholder="Siemens AG"
                {...register('manufacturer')}
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Location</label>
              <input
                type="text"
                className="w-full p-2 bg-slate-950 border border-slate-800 focus:border-enterprise-500 rounded-lg text-sm text-slate-200 focus:outline-none"
                placeholder="Bay 3 - Assembly Floor"
                {...register('location')}
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Installation Date</label>
              <input
                type="date"
                className="w-full p-2 bg-slate-950 border border-slate-800 focus:border-enterprise-500 rounded-lg text-sm text-slate-200 focus:outline-none text-slate-400"
                {...register('installationDate')}
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Operational Status</label>
            <select
              className="w-full p-2 bg-slate-950 border border-slate-800 focus:border-enterprise-500 rounded-lg text-sm text-slate-350 focus:outline-none cursor-pointer"
              {...register('status')}
            >
              <option value="RUNNING">RUNNING</option>
              <option value="STOPPED">STOPPED</option>
              <option value="MAINTENANCE">MAINTENANCE</option>
            </select>
          </div>

          <div className="flex items-center justify-end space-x-2 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setIsCreateOpen(false)}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 rounded-lg text-xs font-semibold"
            >
              Cancel
            </button>
            <Button type="submit" variant="primary" size="md">
              Create Equipment
            </Button>
          </div>
        </form>
      </Modal>

      {/* EDIT MODAL */}
      <Modal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} title="Update Equipment Parameters" size="lg">
        <form onSubmit={handleSubmit(onEditSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Equipment Code</label>
              <input
                type="text"
                className="w-full p-2 bg-slate-950 border border-slate-850 rounded-lg text-sm text-slate-450 focus:outline-none cursor-not-allowed"
                disabled
                {...register('equipmentCode')}
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Machine Name</label>
              <input
                type="text"
                className={`w-full p-2 bg-slate-950 border ${errors.machineName ? 'border-red-500' : 'border-slate-800 focus:border-enterprise-500'} rounded-lg text-sm text-slate-200 focus:outline-none`}
                {...register('machineName', { required: 'Machine Name is required' })}
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Machine Type</label>
              <input
                type="text"
                className={`w-full p-2 bg-slate-950 border ${errors.machineType ? 'border-red-500' : 'border-slate-800 focus:border-enterprise-500'} rounded-lg text-sm text-slate-200 focus:outline-none`}
                {...register('machineType', { required: 'Type is required' })}
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Manufacturer</label>
              <input
                type="text"
                className="w-full p-2 bg-slate-950 border border-slate-800 focus:border-enterprise-500 rounded-lg text-sm text-slate-200 focus:outline-none"
                {...register('manufacturer')}
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Location</label>
              <input
                type="text"
                className="w-full p-2 bg-slate-950 border border-slate-800 focus:border-enterprise-500 rounded-lg text-sm text-slate-200 focus:outline-none"
                {...register('location')}
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Installation Date</label>
              <input
                type="date"
                className="w-full p-2 bg-slate-950 border border-slate-800 focus:border-enterprise-500 rounded-lg text-sm text-slate-200 focus:outline-none text-slate-400"
                {...register('installationDate')}
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Operational Status</label>
            <select
              className="w-full p-2 bg-slate-950 border border-slate-800 focus:border-enterprise-500 rounded-lg text-sm text-slate-350 focus:outline-none cursor-pointer"
              {...register('status')}
            >
              <option value="RUNNING">RUNNING</option>
              <option value="STOPPED">STOPPED</option>
              <option value="MAINTENANCE">MAINTENANCE</option>
            </select>
          </div>

          <div className="flex items-center justify-end space-x-2 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setIsEditOpen(false)}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 rounded-lg text-xs font-semibold"
            >
              Cancel
            </button>
            <Button type="submit" variant="primary" size="md">
              Update Equipment
            </Button>
          </div>
        </form>
      </Modal>

      {/* CONFIRM DELETE DIALOG */}
      <ConfirmationDialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={onDeleteConfirm}
        title="Remove Equipment Unit"
        message={`Are you sure you want to remove ${selectedEquipment?.machineName} (${selectedEquipment?.equipmentCode})? This will permanently delete the unit telemetry histories.`}
        confirmText="Remove"
        type="danger"
      />

      {/* DETAILS DRAWER */}
      <AnimatePresence>
        {isDrawerOpen && selectedEquipment && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDrawerOpen(false)}
              className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-40"
            />
            {/* Drawer */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-slate-900 border-l border-slate-800 shadow-2xl p-6 z-50 overflow-y-auto flex flex-col justify-between"
            >
              <div>
                {/* Header */}
                <div className="flex items-center justify-between border-b border-slate-850 pb-4 mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-lg bg-enterprise-950/20 text-enterprise-400 border border-enterprise-900/30">
                      <Cpu size={20} />
                    </div>
                    <div>
                      <h2 className="text-base font-bold text-slate-100">{selectedEquipment.machineName}</h2>
                      <p className="text-[10px] text-slate-500 tracking-wider font-mono">{selectedEquipment.equipmentCode}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsDrawerOpen(false)}
                    className="p-1 rounded-md text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
                  >
                    <X size={18} />
                  </button>
                </div>

                {/* Status Alert Badge */}
                <div className="mb-6 p-4 rounded-xl bg-slate-950/40 border border-slate-850 flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-400">Current Status</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusBadge(selectedEquipment.status)}`}>
                    {selectedEquipment.status}
                  </span>
                </div>

                {/* Details Section */}
                <div className="space-y-4">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-850 pb-1">Specifications</h3>

                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <p className="text-slate-550 font-medium">Machine Type</p>
                      <p className="text-slate-200 font-semibold mt-1">{selectedEquipment.machineType}</p>
                    </div>
                    <div>
                      <p className="text-slate-550 font-medium">Manufacturer</p>
                      <p className="text-slate-200 font-semibold mt-1">{selectedEquipment.manufacturer || 'N/A'}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-slate-550 font-medium flex items-center">
                        <MapPin size={12} className="mr-1" /> Location
                      </p>
                      <p className="text-slate-200 font-semibold mt-1">{selectedEquipment.location || 'N/A'}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-slate-550 font-medium flex items-center">
                        <Calendar size={12} className="mr-1" /> Installation Date
                      </p>
                      <p className="text-slate-200 font-semibold mt-1">
                        {selectedEquipment.installationDate
                          ? new Date(selectedEquipment.installationDate).toLocaleDateString([], {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            })
                          : 'N/A'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-2 pt-6 border-t border-slate-850">
                <Button
                  onClick={() => {
                    setIsDrawerOpen(false);
                    handleEditOpen(selectedEquipment);
                  }}
                  variant="outline"
                  size="sm"
                  className="flex-grow flex items-center justify-center space-x-1.5"
                >
                  <Edit size={14} />
                  <span>Edit Parameters</span>
                </Button>
                <Button
                  onClick={() => {
                    setIsDrawerOpen(false);
                    handleDeleteOpen(selectedEquipment);
                  }}
                  variant="danger"
                  size="sm"
                  className="flex-grow flex items-center justify-center space-x-1.5"
                >
                  <Trash2 size={14} />
                  <span>De-register</span>
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Equipment;

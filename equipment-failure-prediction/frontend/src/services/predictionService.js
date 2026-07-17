import api from './api';

export const predictionService = {
  predict: async (data) => {
    // Expects: { equipmentId, airTemperature, processTemperature, rotationalSpeed, torque, toolWear }
    const response = await api.post('/predictions', data);
    return response.data; // PredictionResponse directly (not wrapped in ApiResponse)
  },

  uploadCsv: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post('/predictions/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data; // CsvPredictionResponse directly (not wrapped in ApiResponse)
  },
};

export default predictionService;

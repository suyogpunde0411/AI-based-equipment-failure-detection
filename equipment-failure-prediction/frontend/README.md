# Sensora Industrial - Equipment Failure Prediction Frontend

This is an enterprise-grade React 19 web dashboard built using Vite, Tailwind CSS, Recharts, Framer Motion, Axios, and React Hook Form. It interfaces directly with the Spring Boot backend to monitor telemetry readings and evaluate predictive equipment failures.

## Features

- **JWT Authentication**: Secure login and registry with automatic token injection using Axios interceptors and expiration redirects.
- **Unified Telemetry Dashboard**: Responsive cards, real-time metrics, risk distribution charts, and prediction logs.
- **Inventory CRUD**: Register, update, and manage equipment nodes.
- **Predictive Diagnostics Panel**: Execute single-point machine evaluations with animated telemetry gauges and action recommendations.
- **Batch Processing**: Drag-and-drop CSV upload for batch failure predictions.
- **Telemetry Charts**: Monthly predictions, tool wear, and comparative performance indicators.

## Running Locally

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the local development server:
   ```bash
   npm run dev
   ```
   The dev server will run on `http://localhost:5173` and automatically proxy all `/api` requests to the backend server running on `http://localhost:8080`.

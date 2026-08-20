'use client';
import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export function CourierCapacityChart() {
  const data = {
    labels: ['WB 302 (Aug 25)', 'ET 602 (Sep 02)', 'WB 308 (Sep 15)', 'WB 302 (Sep 28)'],
    datasets: [
      {
        label: 'Booked Cargo Weight (kg)',
        data: [18.5, 22.0, 15.0, 8.5],
        backgroundColor: '#000000',
      },
      {
        label: 'Available Spare Capacity (kg)',
        data: [4.5, 8.0, 8.0, 14.5],
        backgroundColor: '#D4D4D4',
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { position: 'top' as const } },
    scales: {
      x: { stacked: true },
      y: { stacked: true, title: { display: true, text: 'Kilograms (kg)' } },
    },
  };

  return (
    <div className="bg-white p-6 border-2 border-black shadow-sm font-sans">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="font-black text-black text-base uppercase tracking-wider font-retro-heading">Luggage Flight Capacity</h3>
          <p className="text-xs text-neutral-500 font-medium">Booked passenger luggage space per flight trip (kg)</p>
        </div>
        <span className="bg-black text-white text-xs font-black px-3 py-1 uppercase tracking-widest">
          78% Filled
        </span>
      </div>
      <div className="h-64">
        <Bar data={data} options={options} />
      </div>
    </div>
  );
}

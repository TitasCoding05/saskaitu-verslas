'use client';

import React, { useState } from 'react';
import { Chart } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  ChartData,
  ChartOptions
} from 'chart.js';
import { 
  ChevronLeftIcon, 
  ChevronRightIcon, 
  InfoIcon, 
  FileTextIcon, 
  DollarSignIcon, 
  ClockIcon 
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement
);

const FinancialChart = () => {
  const [year, setYear] = useState(2025);
  const [interval, setInterval] = useState('Metai');
  const [series, setSeries] = useState('Visi');

  const data = {
    labels: ['Sausis', 'Vasaris', 'Kovas', 'Balandis', 'Gegužė', 'Birželis', 'Liepa', 'Rugpjūtis', 'Rugsėjis', 'Spalis', 'Lapkritis', 'Gruodis'],
    datasets: [
      {
        type: 'line' as const,
        label: 'Grynasis pelnas',
        data: [2200, 1400, 700, 300, 600, 400, 0, 0, 0, 0, 0, 0],
        borderColor: 'oklch(0.5 0.2 261.692)',
        backgroundColor: 'oklch(0.5 0.2 261.692)',
        fill: false,
        tension: 0.4,
        pointRadius: 5,
        pointBackgroundColor: 'oklch(0.5 0.2 261.692)'
      },
      {
        type: 'bar' as const,
        label: 'Gauti mokėjimai',
        data: [2100, 2300, 1900, 200, 500, 800, 0, 0, 0, 0, 0, 0],
        backgroundColor: 'oklch(0.6 0.2 140)',
        stack: 'stack1'
      },
      {
        type: 'bar' as const,
        label: 'Išrašytos sąskaitos',
        data: [2200, 1400, 700, 300, 600, 400, 0, 0, 0, 0, 0, 0],
        backgroundColor: 'oklch(0.6 0.2 140 / 0.5)',
        stack: 'stack1'
      },
      {
        type: 'bar' as const,
        label: 'Sąnaudos',
        data: [500, 300, 400, 100, 50, 100, 0, 0, 0, 0, 0, 0],
        backgroundColor: 'oklch(0.7 0.2 70)',
        stack: 'stack1'
      }
    ]
  };

  const options: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          usePointStyle: true,
          pointStyle: 'circle'
        }
      },
      tooltip: { mode: 'index', intersect: false }
    },
    elements: {
      bar: {
        borderRadius: 1000,
      }
    },
    scales: {
      y: {
        title: { display: true, text: '€' },
        ticks: { 
          callback: function(value) { return `${value} €`; }
        },
        stacked: false
      },
      x: { 
        stacked: true 
      }
    }
  };

  return (
    <Card className="w-full">
      <CardContent className="p-6 space-y-6">
        {/* Year Navigation Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="icon" onClick={() => setYear(year - 1)}>
              <ChevronLeftIcon className="h-4 w-4" />
            </Button>
            <h2 className="text-lg font-semibold">{year} metai</h2>
            <Button variant="outline" size="icon" onClick={() => setYear(year + 1)}>
              <ChevronRightIcon className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground">Intervalas</span>
              <Select value={interval} onValueChange={setInterval}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Intervalas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Metai">Metai</SelectItem>
                  <SelectItem value="Pusmetis">Pusmetis</SelectItem>
                  <SelectItem value="Ketvirtis">Ketvirtis</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground">Serija</span>
              <Select value={series} onValueChange={setSeries}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Serija" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Visi">Visi</SelectItem>
                  <SelectItem value="Pardavimai">Pardavimai</SelectItem>
                  <SelectItem value="Paslaugos">Paslaugos</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Financial Statistics */}
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-4 flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <div className="bg-blue-100 dark:bg-blue-900/20 p-2 rounded-full">
                <FileTextIcon className="h-5 w-5 text-blue-500 dark:text-blue-400" />
              </div>
              <InfoIcon className="h-4 w-4 text-gray-500 dark:text-gray-400" />
            </div>
            <span className="text-sm text-gray-500 dark:text-gray-400">Išrašytos sąskaitos</span>
            <span className="text-xl font-bold text-black dark:text-white">5 436.36 €</span>
          </div>
          
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-4 flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <div className="bg-green-100 dark:bg-green-900/20 p-2 rounded-full">
                <DollarSignIcon className="h-5 w-5 text-green-500 dark:text-green-400" />
              </div>
              <InfoIcon className="h-4 w-4 text-gray-500 dark:text-gray-400" />
            </div>
            <span className="text-sm text-gray-500 dark:text-gray-400">Gauti mokėjimai</span>
            <span className="text-xl font-bold text-black dark:text-white">5 892.92 €</span>
          </div>
          
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-4 flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <div className="bg-yellow-100 dark:bg-yellow-900/20 p-2 rounded-full">
                <ClockIcon className="h-5 w-5 text-yellow-500 dark:text-yellow-400" />
              </div>
              <InfoIcon className="h-4 w-4 text-gray-500 dark:text-gray-400" />
            </div>
            <span className="text-sm text-gray-500 dark:text-gray-400">Sąnaudos</span>
            <span className="text-xl font-bold text-black dark:text-white">0.00 €</span>
          </div>
          
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-4 flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <div className="bg-gray-100 dark:bg-gray-900/20 p-2 rounded-full">
                <DollarSignIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
              </div>
              <InfoIcon className="h-4 w-4 text-gray-500 dark:text-gray-400" />
            </div>
            <span className="text-sm text-gray-500 dark:text-gray-400">Grynasis pelnas</span>
            <span className="text-xl font-bold text-black dark:text-white">5 436.36 €</span>
          </div>
        </div>

        {/* Chart */}
        <div className="h-[400px]">
          <Chart 
            type="bar" 
            data={data} 
            options={options} 
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default FinancialChart;
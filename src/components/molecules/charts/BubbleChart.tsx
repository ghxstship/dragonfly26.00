"use client"

import React from 'react'
import { useTranslations } from 'next-intl'
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell
} from 'recharts'

interface BubbleDataPoint {
  x: number
  y: number
  z: number
  name: string
  category?: string
}

interface BubbleChartProps {
  data: BubbleDataPoint[]
  xAxisLabel?: string
  yAxisLabel?: string
  zAxisLabel?: string
  colors?: string[]
  className?: string
}

export const BubbleChart: React.FC<BubbleChartProps> = ({
  data,
  xAxisLabel,
  yAxisLabel,
  zAxisLabel,
  colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'],
  className = ''
}): JSX.Element => {
  const t = useTranslations('charts')

  const CustomTooltip = ({ active, payload }: any): JSX.Element | null => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <p className="font-semibold text-gray-900 dark:text-gray-100">{data.name}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {xAxisLabel || 'X'}: {data.x}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {yAxisLabel || 'Y'}: {data.y}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {zAxisLabel || t('size')}: {data.z}
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <div className={`w-full h-full ${className}`}>
      <ResponsiveContainer width="100%" height="100%">
        <ScatterChart
          margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
          <XAxis
            type="number"
            dataKey="x"
            name={xAxisLabel || 'X'}
            label={{ value: xAxisLabel, position: 'insideBottom', offset: -10 }}
            className="text-gray-600 dark:text-gray-400"
          />
          <YAxis
            type="number"
            dataKey="y"
            name={yAxisLabel || 'Y'}
            label={{ value: yAxisLabel, angle: -90, position: 'insideLeft' }}
            className="text-gray-600 dark:text-gray-400"
          />
          <ZAxis
            type="number"
            dataKey="z"
            range={[100, 1000]}
            name={zAxisLabel || t('size')}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Scatter
            name={t('dataPoints')}
            data={data}
            fill="#3b82f6"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
          </Scatter>
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  )
}

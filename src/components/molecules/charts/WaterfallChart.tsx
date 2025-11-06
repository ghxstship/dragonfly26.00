"use client"

import React from 'react'
import { useTranslations } from 'next-intl'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
  ReferenceLine
} from 'recharts'

interface WaterfallDataPoint {
  name: string
  value: number
  isTotal?: boolean
}

interface WaterfallChartProps {
  data: WaterfallDataPoint[]
  className?: string
  positiveColor?: string
  negativeColor?: string
  totalColor?: string
}

export const WaterfallChart: React.FC<WaterfallChartProps> = ({
  data,
  className = '',
  positiveColor = '#10b981',
  negativeColor = '#ef4444',
  totalColor = '#3b82f6'
}): JSX.Element => {
  const t = useTranslations('charts')

  // Calculate cumulative values for waterfall effect
  const processedData = data.reduce((acc: any[], item, index) => {
    const prevValue = index > 0 ? acc[index - 1].end : 0
    const start = item.isTotal ? 0 : prevValue
    const end = item.isTotal ? item.value : prevValue + item.value
    
    return [
      ...acc,
      {
        name: item.name,
        start,
        value: item.value,
        end,
        isTotal: item.isTotal,
        displayValue: Math.abs(item.value)
      }
    ]
  }, [])

  const CustomTooltip = ({ active, payload }: any): JSX.Element | null => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <p className="font-semibold text-gray-900 dark:text-gray-100">{data.name}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {t('value')}: {data.value >= 0 ? '+' : ''}{data.value}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {t('total')}: {data.end}
          </p>
        </div>
      )
    }
    return null
  }

  const getBarColor = (item: any): string => {
    if (item.isTotal) return totalColor
    return item.value >= 0 ? positiveColor : negativeColor
  }

  return (
    <div className={`w-full h-full ${className}`}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={processedData}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
          <XAxis
            dataKey="name"
            className="text-gray-600 dark:text-gray-400"
          />
          <YAxis aria-hidden="true" className="text-gray-600 dark:text-gray-400" />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <ReferenceLine y={0} stroke="#000" />
          
          {/* Invisible bar for positioning */}
          <Bar dataKey="start" stackId="a" fill="transparent" />
          
          {/* Visible bar showing the change */}
          <Bar dataKey="displayValue" stackId="a" name={t('change')}>
            {processedData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getBarColor(entry)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

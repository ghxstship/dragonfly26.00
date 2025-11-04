"use client"

import React from 'react'
import { useTranslations } from 'next-intl'
import { FunnelChart as RechartsFunnelChart, Funnel, LabelList, Tooltip, ResponsiveContainer, Cell } from 'recharts'

interface FunnelDataPoint {
  name: string
  value: number
  fill?: string
}

interface FunnelChartProps {
  data: FunnelDataPoint[]
  className?: string
  colors?: string[]
  showPercentage?: boolean
}

export const FunnelChart: React.FC<FunnelChartProps> = ({
  data,
  className = '',
  colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'],
  showPercentage = true
}): JSX.Element => {
  const t = useTranslations('charts')

  // Calculate conversion rates
  const dataWithRates = data.map((item, index) => {
    const conversionRate = index === 0 ? 100 : (item.value / data[0].value) * 100
    return {
      ...item,
      conversionRate: conversionRate.toFixed(1),
      fill: item.fill || colors[index % colors.length]
    }
  })

  const CustomTooltip = ({ active, payload }: any): JSX.Element | null => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <p className="font-semibold text-gray-900 dark:text-gray-100">{data.name}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {t('value')}: {data.value.toLocaleString()}
          </p>
          {showPercentage && (
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {t('conversion')}: {data.conversionRate}%
            </p>
          )}
        </div>
      )
    }
    return null
  }

  const renderCustomLabel = (props: any): JSX.Element => {
    const { x, y, width, height, name, value, conversionRate } = props
    return (
      <g>
        <text
          x={x + width / 2}
          y={y + height / 2 - 10}
          fill="#fff"
          textAnchor="middle"
          dominantBaseline="middle"
          className="font-semibold"
        >
          {name}
        </text>
        <text
          x={x + width / 2}
          y={y + height / 2 + 10}
          fill="#fff"
          textAnchor="middle"
          dominantBaseline="middle"
          className="text-sm"
        >
          {value.toLocaleString()} {showPercentage && `(${conversionRate}%)`}
        </text>
      </g>
    )
  }

  return (
    <div className={`w-full h-full ${className}`}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsFunnelChart>
          <Tooltip content={<CustomTooltip />} />
          <Funnel
            dataKey="value"
            data={dataWithRates}
            isAnimationActive
          >
            <LabelList
              position="center"
              content={renderCustomLabel}
            />
            {dataWithRates.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Funnel>
        </RechartsFunnelChart>
      </ResponsiveContainer>
    </div>
  )
}

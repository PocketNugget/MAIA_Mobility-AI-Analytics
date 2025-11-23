'use client'

import { ResponsivePie } from '@nivo/pie'

interface PieDataItem {
  id: string
  label: string
  value: number
  color: string
  parentId?: string
  percentage?: string
}

interface NestedPieChartProps {
  innerData: PieDataItem[]
  outerData: PieDataItem[]
  height?: number
}

export function NestedPieChart({ innerData, outerData, height = 400 }: NestedPieChartProps) {
  // Calculate total width needed for the container
  const containerWidth = height * 1.5 // Give more horizontal space for labels
  
  return (
    <div style={{ height: `${height}px`, width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ height: `${height}px`, width: `${containerWidth}px`, position: 'relative' }}>
        {/* Outer ring - Secondary categories */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 1 }}>
          <ResponsivePie
            data={outerData}
            margin={{ top: 60, right: 120, bottom: 60, left: 120 }}
            innerRadius={0.68}
            padAngle={0.5}
            cornerRadius={2}
            activeOuterRadiusOffset={8}
            activeInnerRadiusOffset={-4}
            colors={{ datum: 'data.color' }}
            borderWidth={1}
            borderColor={{ from: 'color', modifiers: [['darker', 0.2]] }}
            enableArcLabels={true}
            arcLabel={d => `${d.value}`}
            arcLabelsSkipAngle={15}
            arcLabelsTextColor="#ffffff"
            enableArcLinkLabels={true}
            arcLinkLabelsSkipAngle={10}
            arcLinkLabelsTextColor="#334155"
            arcLinkLabelsThickness={1.5}
            arcLinkLabelsColor={{ from: 'color', modifiers: [['opacity', 0.6]] }}
            arcLinkLabel={d => `${d.label} (${(d.data as PieDataItem).percentage}%)`}
            arcLinkLabelsDiagonalLength={16}
            arcLinkLabelsStraightLength={18}
            arcLinkLabelsTextOffset={4}
            animate={true}
            motionConfig="gentle"
            transitionMode="pushIn"
            tooltip={({ datum }) => (
              <div
                style={{
                  background: 'rgb(15 23 42)',
                  color: 'white',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  fontSize: '12px',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                }}
              >
                <div style={{ fontWeight: 600 }}>{datum.label}</div>
                <div>{datum.value} incident{datum.value !== 1 ? 's' : ''}</div>
                <div>{(datum.data as PieDataItem).percentage}%</div>
              </div>
            )}
          />
        </div>
        {/* Inner ring - Primary categories */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 2 }}>
          <div style={{ 
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '65%',
            height: '65%'
          }}>
            <ResponsivePie
              data={innerData}
              margin={{ top: 40, right: 80, bottom: 40, left: 80 }}
              innerRadius={0.5}
              padAngle={3}
              cornerRadius={3}
              activeOuterRadiusOffset={6}
              activeInnerRadiusOffset={-3}
              colors={{ datum: 'data.color' }}
              borderWidth={2}
              borderColor="#ffffff"
              enableArcLabels={true}
              arcLabel={d => String(d.label)}
              arcLabelsSkipAngle={15}
              arcLabelsTextColor="#ffffff"
              enableArcLinkLabels={false}
              animate={true}
              motionConfig="gentle"
              transitionMode="pushOut"
              tooltip={({ datum }) => (
                <div
                  style={{
                    background: 'rgb(15 23 42)',
                    color: 'white',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    fontSize: '12px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                  }}
                >
                  <div style={{ fontWeight: 600 }}>{datum.label}</div>
                  <div>{datum.value} incident{datum.value !== 1 ? 's' : ''}</div>
                  {(datum.data as PieDataItem).percentage && (
                    <div>{(datum.data as PieDataItem).percentage}%</div>
                  )}
                </div>
              )}
            />
          </div>
        </div>
      </div>
    </div>
  )
}


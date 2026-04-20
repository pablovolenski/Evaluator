import { ImageResponse } from 'next/og';
import { getProjectAdmin } from '@/lib/firebase/admin';
import { evaluateProject } from '@/lib/evaluation';
import { formatCurrency, formatPercent, formatYears } from '@/lib/utils/format';

export const runtime = 'nodejs';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function OgImage({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = await params;
  const project = await getProjectAdmin(projectId);

  if (!project) {
    return new ImageResponse(
      <div style={{ width: 1200, height: 630, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f9fafb' }}>
        <span style={{ fontSize: 32, color: '#6b7280' }}>Project not found</span>
      </div>
    );
  }

  const result = evaluateProject(project);
  const bgColor = result.isViable ? '#f0fdf4' : '#fef2f2';
  const accentColor = result.isViable ? '#16a34a' : '#dc2626';
  const metrics = [
    { label: 'NPV', value: formatCurrency(result.npv) },
    { label: 'IRR', value: result.irr !== null ? formatPercent(result.irr * 100) : 'N/A' },
    { label: 'Payback', value: formatYears(result.paybackYears) },
    { label: 'ROI', value: formatPercent(result.roi) },
  ];

  return new ImageResponse(
    <div
      style={{
        width: 1200, height: 630, display: 'flex', flexDirection: 'column',
        background: bgColor, padding: '60px 72px', fontFamily: 'sans-serif',
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 40 }}>
        <span style={{ fontSize: 28, fontWeight: 700, color: '#4f46e5' }}>Evalify</span>
        <span style={{
          background: accentColor, color: 'white', borderRadius: 24,
          padding: '6px 18px', fontSize: 18, fontWeight: 600
        }}>
          {result.isViable ? 'Viable' : 'Not viable'}
        </span>
      </div>

      {/* Project name */}
      <h1 style={{ fontSize: 52, fontWeight: 800, color: '#111827', margin: 0, lineHeight: 1.1 }}>
        {project.name.length > 45 ? project.name.slice(0, 45) + '…' : project.name}
      </h1>
      {project.description && (
        <p style={{ fontSize: 22, color: '#6b7280', margin: '12px 0 0', lineHeight: 1.4 }}>
          {project.description.length > 80 ? project.description.slice(0, 80) + '…' : project.description}
        </p>
      )}

      {/* Metrics grid */}
      <div style={{ display: 'flex', gap: 20, marginTop: 'auto' }}>
        {metrics.map((m) => (
          <div key={m.label} style={{
            flex: 1, background: 'white', borderRadius: 16, padding: '20px 24px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          }}>
            <div style={{ fontSize: 16, color: '#6b7280', marginBottom: 6 }}>{m.label}</div>
            <div style={{ fontSize: 28, fontWeight: 700, color: '#111827' }}>{m.value}</div>
          </div>
        ))}
      </div>

      {/* Period info */}
      <p style={{ fontSize: 16, color: '#9ca3af', marginTop: 20 }}>
        {project.evaluationPeriodYears}-year evaluation · {(project.discountRate * 100).toFixed(1)}% discount rate
      </p>
    </div>,
    { ...size }
  );
}

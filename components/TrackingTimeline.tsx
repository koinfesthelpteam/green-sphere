/* eslint-disable @typescript-eslint/no-unused-vars */

'use client';

import React from 'react';
import { format } from 'date-fns';
import { TrackingTimeline as TimelineType, TimelineEvent } from '@/types';

const cream  = '#f0fdf4';
const navy   = '#111827';
const rust   = '#16a34a';
const muted  = 'rgba(240,253,244,0.55)';
const border = 'rgba(240,253,244,0.1)';
const serif  = "'Playfair Display', Georgia, serif";
const lora   = "'Lora', Georgia, serif";
const mono   = "'Courier New', monospace";

const STATUS_META: Record<string, { label: string; color: string }> = {
  created:          { label: 'Order Created',       color: 'rgba(240,253,244,0.35)' },
  picked_up:        { label: 'Picked Up',            color: '#64B5F6' },
  in_transit:       { label: 'In Transit',           color: '#FFD54F' },
  out_for_delivery: { label: 'Out for Delivery',     color: '#CE93D8' },
  delivered:        { label: 'Delivered',            color: '#22c55e' },
  exception:        { label: 'Exception',            color: '#FF8A80' },
  returned:         { label: 'Returned to Sender',   color: '#FFAB40' },
};

function getStatusLabel(status: string) {
  return STATUS_META[status]?.label ?? status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
}
function getStatusColor(status: string) {
  return STATUS_META[status]?.color ?? rust;
}

interface Props { timeline: TimelineType }

export default function TrackingTimeline({ timeline }: Props) {
  const total     = timeline.timeline.length;
  const completed = timeline.timeline.filter((e: TimelineEvent) => e.isCompleted).length;
  const pct       = Math.round((completed / total) * 100);

  return (
    <div style={{ backgroundColor: 'rgba(255,255,255,0.04)', borderTop: `3px solid ${rust}`, padding: '1.75rem' }}>

      {/* header */}
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: `1px solid ${border}` }}>
        <p style={{ fontFamily: mono, fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: rust }}>
          Package Journey
        </p>
        <div style={{ textAlign: 'right' }}>
          <p style={{ fontFamily: mono, fontSize: '0.6rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: muted, marginBottom: '0.2rem' }}>Est. Delivery</p>
          <p style={{ fontFamily: serif, fontSize: '0.95rem', color: cream }}>
            {format(new Date(timeline.estimatedDelivery), 'dd MMM yyyy')}
          </p>
        </div>
      </div>

      {/* event list */}
      <div style={{ paddingLeft: '1.25rem', borderLeft: `2px solid rgba(240,253,244,0.1)`, position: 'relative' }}>
        {timeline.timeline.map((event: TimelineEvent, i: number) => {
          const isCurrent = event.status === timeline.currentStatus && event.isCompleted;
          const dotColor  = event.isCompleted ? getStatusColor(event.status) : 'rgba(240,253,244,0.15)';

          return (
            <div
              key={i}
              style={{ position: 'relative', paddingBottom: i < total - 1 ? '1.5rem' : '0' }}
            >
              {/* dot */}
              <div style={{
                position: 'absolute',
                left: '-1.625rem',
                top: '0.25rem',
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                backgroundColor: dotColor,
                border: `2px solid ${event.isCompleted ? dotColor : 'rgba(240,253,244,0.15)'}`,
                boxShadow: isCurrent ? `0 0 0 4px rgba(22,163,74,0.2)` : 'none',
              }} />

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                    <p style={{
                      fontFamily: lora,
                      fontSize: '0.9rem',
                      fontWeight: 500,
                      color: event.isCompleted ? cream : 'rgba(240,253,244,0.3)',
                    }}>
                      {getStatusLabel(event.status)}
                    </p>
                    {isCurrent && (
                      <span style={{ fontFamily: mono, fontSize: '0.55rem', letterSpacing: '0.12em', textTransform: 'uppercase', backgroundColor: rust, color: cream, padding: '1px 6px' }}>
                        Current
                      </span>
                    )}
                  </div>
                  {(event.description || !event.isCompleted) && (
                    <p style={{ fontFamily: lora, fontSize: '0.8rem', color: event.isCompleted ? muted : 'rgba(240,253,244,0.2)', lineHeight: 1.6, marginBottom: '0.2rem' }}>
                      {event.description ?? 'Expected soon'}
                    </p>
                  )}
                  {event.location && (
                    <p style={{ fontFamily: mono, fontSize: '0.62rem', letterSpacing: '0.08em', color: rust }}>
                      ◆ {event.location.city}, {event.location.state}, {event.location.country}
                    </p>
                  )}
                  {!event.isCompleted && !event.timestamp && (
                    <p style={{ fontFamily: mono, fontSize: '0.6rem', letterSpacing: '0.08em', color: 'rgba(240,253,244,0.25)' }}>
                      Expected soon
                    </p>
                  )}
                </div>

                {event.timestamp && (
                  <span style={{ fontFamily: mono, fontSize: '0.65rem', letterSpacing: '0.05em', color: muted, whiteSpace: 'nowrap', flexShrink: 0 }}>
                    {format(new Date(event.timestamp), 'dd MMM · HH:mm')}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* progress bar */}
      <div style={{ marginTop: '1.75rem', paddingTop: '1.25rem', borderTop: `1px solid ${border}` }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.5rem' }}>
          <p style={{ fontFamily: mono, fontSize: '0.6rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: rust }}>Progress</p>
          <p style={{ fontFamily: mono, fontSize: '0.68rem', color: cream }}>{pct}%</p>
        </div>
        <div style={{ width: '100%', height: '3px', backgroundColor: 'rgba(240,253,244,0.1)' }}>
          <div style={{ height: '100%', width: `${pct}%`, backgroundColor: rust, transition: 'width 0.6s ease' }} />
        </div>
      </div>

    </div>
  );
}
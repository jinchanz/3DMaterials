import React, { createElement, useEffect } from 'react'

import { NumberPicker } from '@alifd/next';

const Vec3Setter = (props) => {
  const { value, onChange, precision, step } = props;
  return (
    <div
      style={{
        display: 'flex',
        width: '100%',
        justifyContent: 'space-between',
        gap: 5
      }}>
      <NumberPicker style={{ width: '100%' }} size='small' step={step || 0.1} precision={precision || 4} label="x" value={value?.[0]} onChange={(v) => {
        onChange([v, value?.[1], value?.[2]]);
      }} />
      <NumberPicker style={{ width: '100%' }} size='small' step={step || 0.1} precision={precision || 4} label="y" value={value?.[1]} onChange={(v) => {
        onChange([value?.[0], v, value?.[2]]);
      }} />
      <NumberPicker style={{ width: '100%' }} size='small' step={step || 0.1} precision={precision || 4} label="z" value={value?.[2]} onChange={(v) => {
        onChange([value?.[0], value?.[1], v]);
      }} />
    </div>
  )
}

export default Vec3Setter;
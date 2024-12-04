import { Handle, type HandleProps } from '@xyflow/react'

export function HybridHandle(props: Omit<HandleProps, 'type'>) {
  return (
    <>
      <Handle type="target" {...props} />
      <Handle type="source" {...props} />
    </>
  )
}

import { Button } from './ui'

interface Props {
  label: string
  value: boolean
  onToggle: () => void
  disabled?: boolean
}

export function ToggleProperty({
  label,
  value,
  onToggle,
  disabled = false,
}: Props) {
  return (
    <div className='flex justify-between items-center gap-2'>
      <Button
        variant='outline'
        className='w-12 h-9'
        onClick={onToggle}
        disabled={disabled}
      >
        {value ? 'Yes' : 'No'}
      </Button>
      <div className='text-sm'>{label}</div>
    </div>
  )
}

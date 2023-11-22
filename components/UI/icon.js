import Link from 'next/link'
import Box from '@mui/material/Box'

const iconSize = {
  small: '1.125rem',
  medium: '1.5rem',
  large: '1.75rem',
}

const greyColor = {
  ['grey-0']: 50,
  ['grey-1']: 100,
  ['grey-2']: 200,
  ['grey-3']: 300,
  ['grey-4']: 400,
  ['grey-5']: 500,
  ['grey-6']: 600,
  ['grey-7']: 700,
  ['grey-8']: 800,
  ['grey-9']: 900,
}

export default function Icon({
  name,
  href,
  size = 'medium',
  color,
  positionX,
  positionY,
  disabled,
  sx,
  ...props
}) {
  return href ? (
    <Link href={href}>
      <SVG
        name={name}
        size={size}
        positionX={positionX}
        positionY={positionY}
        color={color}
        disabled={disabled}
        sx={sx}
        {...props}
      />
    </Link>
  ) : (
    <SVG
      name={name}
      size={size}
      positionX={positionX}
      positionY={positionY}
      color={color}
      disabled={disabled}
      sx={sx}
      {...props}
    />
  )
}

function SVG({
  name,
  size,
  color = '',
  positionX,
  positionY,
  disabled,
  sx,
  ...props
}) {
  return (
    <Box
      component="svg"
      width={iconSize[size] ? iconSize[size] : size}
      height={iconSize[size] ? iconSize[size] : size}
      sx={{
        fill: theme =>
          disabled
            ? theme.palette.action.disabled
            : color.startsWith('grey-')
            ? theme.palette.grey[greyColor[color]]
            : color === 'success'
            ? theme.palette.success.main
            : color === 'error'
            ? theme.palette.error.main
            : color === 'warning'
            ? theme.palette.warning.main
            : color
            ? color
            : 'inherit',
        ...sx,
      }}
      {...props}
    >
      <Box
        component="use"
        x={positionX}
        y={positionY}
        href={`/icons/icons.svg#${name}`}
      />
    </Box>
  )
}

import TableCell from '@mui/material/TableCell'

export default function StyledCell({children, sx, ...props}) {
  return (
    <TableCell sx={{fontSize: 12, ...sx}} {...props}>
      {children}
    </TableCell>
  )
}

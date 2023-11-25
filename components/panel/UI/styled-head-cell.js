import TableCell from '@mui/material/TableCell'

export default function StyledHeadCell({children, align, sx, ...props}) {
  return (
    <TableCell
      align={align}
      sx={{
        backgroundColor: theme => theme.palette.common.black,
        color: theme => theme.palette.common.white,
        py: 0.5,
        ...sx,
      }}
      {...props}
    >
      {children}
    </TableCell>
  )
}

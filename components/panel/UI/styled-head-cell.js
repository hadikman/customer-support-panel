import TableCell from '@mui/material/TableCell'

export default function StyledHeadCell({children, sx, ...props}) {
  return (
    <TableCell
      align="center"
      sx={{
        backgroundColor: theme => theme.palette.common.black,
        color: theme => theme.palette.common.white,
        py: 0.5,
        px: 1,
        ...sx,
      }}
      {...props}
    >
      {children}
    </TableCell>
  )
}

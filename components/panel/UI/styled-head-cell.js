import {styled} from '@mui/material/styles'
import TableCell from '@mui/material/TableCell'

const StyledHeadCell = styled(TableCell)(({theme}) => ({
  backgroundColor: theme.palette.common.black,
  color: theme.palette.common.white,
  paddingTop: 4,
  paddingBottom: 4,
}))

export default StyledHeadCell

export const customVerticalScrollbar = {
  '&::-webkit-scrollbar': {
    width: '0.375rem',
  },
  '&::-webkit-scrollbar-track': {
    bgcolor: theme => theme.palette.grey[300],
    p: 1,
    borderRadius: '10rem',
  },
  '&::-webkit-scrollbar-thumb': {
    width: '8rem',
    bgcolor: 'hsl(0 0% 55%)',
    border: 'thin solid',
    borderColor: 'hsl(0 0% 35%)',
    borderRadius: '10rem',
    ':hover': {
      bgcolor: 'hsl(0 0% 35%)',
    },
  },
}

export const customHorizontalScrollbar = {
  '&::-webkit-scrollbar': {
    height: '0.375rem',
  },
  '&::-webkit-scrollbar-track': {
    bgcolor: theme => theme.palette.grey[700],
    p: 1,
    borderRadius: '10rem',
  },
  '&::-webkit-scrollbar-thumb': {
    width: '8rem',
    bgcolor: 'hsl(0 0% 45%)',
    border: 'thin solid',
    borderColor: 'hsl(0 0% 65%)',
    borderRadius: '10rem',
    ':hover': {
      bgcolor: 'hsl(0 0% 65%)',
    },
  },
}

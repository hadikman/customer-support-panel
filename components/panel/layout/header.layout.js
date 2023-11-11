import * as React from 'react'
import Link from 'next/link'
import {AuthContext} from 'components/panel/auth/auth'

import {styled, alpha} from '@mui/material/styles'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import Drawer from '@mui/material/Drawer'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import InputBase from '@mui/material/InputBase'
import Badge from '@mui/material/Badge'
import MenuItem from '@mui/material/MenuItem'
import Menu from '@mui/material/Menu'
import Icon from 'components/UI/icon'
import iconNames from 'library/icons-name'

const {menu, home, search, inbox, logout, moreVer} = iconNames

const menuList = [
  {
    name: 'صفحه اصلی',
    path: '/',
    icon: home,
  },
]

const Search = styled('div')(({theme}) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
}))

const SearchIconWrapper = styled('div')(({theme}) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}))

const StyledInputBase = styled(InputBase)(({theme}) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
}))

export default function Header() {
  const {onUpdateAuthState} = React.useContext(AuthContext)
  const [anchorEl, setAnchorEl] = React.useState(null)
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null)
  const [toggleDrawer, setToggleDrawer] = React.useState(false)

  const isMenuOpen = Boolean(anchorEl)
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl)

  function handleOnToggleDrawer(e) {
    if (e.type === 'keydown' && (e.key === 'Tab' || e.key === 'Shift')) {
      return
    }

    setToggleDrawer(prevState => !prevState)
  }

  const handleOnMoreMenuOpen = e => {
    setAnchorEl(e.currentTarget)
  }

  const handleOnMobileMenuClose = () => {
    setMobileMoreAnchorEl(null)
  }

  const handleOnMenuClose = () => {
    setAnchorEl(null)
    handleOnMobileMenuClose()
  }

  const handleOnMobileMenuOpen = e => {
    setMobileMoreAnchorEl(e.currentTarget)
  }

  function handleOnLogout() {
    onUpdateAuthState(false)
  }

  const renderMeunList = (
    <Box onClick={handleOnToggleDrawer} onKeyDown={handleOnToggleDrawer}>
      <List>
        {menuList.map(({name, path, icon}) => (
          <ListItem key={name} disablePadding>
            <Link href={path}>
              <ListItemButton>
                <ListItemIcon>
                  <Icon name={icon} size="small" />
                </ListItemIcon>
                <ListItemText primary={name} />
              </ListItemButton>
            </Link>
          </ListItem>
        ))}
      </List>
    </Box>
  )

  const renderMenu = (
    <Menu
      id="primary-header-menu"
      anchorEl={anchorEl}
      keepMounted
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isMenuOpen}
      onClose={handleOnMenuClose}
    >
      <MenuItem onClick={handleOnLogout}>
        <Icon name={logout} size="small" sx={{mr: 1}} />
        <Typography>خروج</Typography>
      </MenuItem>
    </Menu>
  )

  const renderMobileMenu = (
    <Menu
      id="primary-header-menu-mobile"
      anchorEl={mobileMoreAnchorEl}
      keepMounted
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isMobileMenuOpen}
      onClose={handleOnMobileMenuClose}
    >
      <MenuItem>
        <Badge badgeContent={4} color="error" sx={{mr: 1}}>
          <Icon name={inbox} size="small" />
        </Badge>
        <Typography>درخواست‌ها</Typography>
      </MenuItem>
      <MenuItem onClick={handleOnLogout}>
        <Icon name={logout} size="small" sx={{mr: 1}} />
        <Typography>خروج</Typography>
      </MenuItem>
    </Menu>
  )

  return (
    <Box component="header">
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            sx={{mr: 2}}
            onClick={handleOnToggleDrawer}
          >
            <Icon name={menu} size="small" color="#fff" />
          </IconButton>
          <Drawer open={toggleDrawer} onClose={handleOnToggleDrawer}>
            {renderMeunList}
          </Drawer>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{display: {xs: 'none', sm: 'block'}}}
          >
            کنترل پنل
          </Typography>
          <Search>
            <SearchIconWrapper>
              <Icon name={search} size="small" color="#fff" />
            </SearchIconWrapper>
            <StyledInputBase placeholder="جستجو" />
          </Search>
          <Box sx={{flexGrow: 1}} />
          <Box sx={{display: {xs: 'none', md: 'flex'}}}>
            <IconButton size="large">
              <Badge badgeContent={4} color="error">
                <Icon name={inbox} size="small" color="#fff" />
              </Badge>
            </IconButton>
            <IconButton size="large" edge="end" onClick={handleOnMoreMenuOpen}>
              <Icon name={moreVer} size="small" color="#fff" positionX="38%" />
            </IconButton>
          </Box>
          <Box sx={{display: {xs: 'flex', md: 'none'}}}>
            <IconButton size="large" onClick={handleOnMobileMenuOpen}>
              <Icon name={moreVer} size="small" color="#fff" positionX="38%" />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      {renderMobileMenu}
      {renderMenu}
    </Box>
  )
}

import {
  Typography,
  Menu,
  MenuHandler,
  Button,
  MenuList,
  MenuItem,
  Navbar,
  IconButton,
  Collapse,
} from '@material-tailwind/react'
import { useUserContext } from '../contexts/UserContext'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { XMarkIcon, Bars3Icon, ChevronDownIcon, PowerIcon, UserCircleIcon } from '@heroicons/react/24/outline'

const NavList = () => (
  <ul className="my-2 flex flex-col gap-2 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center lg:gap-6">
    <Typography as="li" variant="small" color="blue-gray" className="p-1 font-medium">
      <Link to="/" className="flex items-center hover:text-blue-500 transition-colors">
        blogs
      </Link>
    </Typography>
    <Typography as="li" variant="small" color="blue-gray" className="p-1 font-medium">
      <Link to="/users" className="flex items-center hover:text-blue-500 transition-colors">
        users
      </Link>
    </Typography>
  </ul>
)

const ProfileMenu = () => {
  const [user, userDispatch] = useUserContext()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const getInitials = (name) => {
    const [firstName, lastName] = name.split(' ')
    const letters = firstName.charAt(0) + lastName.charAt(0)
    return letters.toUpperCase()
  }

  const handleLogout = () => {
    userDispatch({ type: 'user/reset' })
  }

  return (
    <div>
      <Menu open={isMenuOpen} handler={setIsMenuOpen} placement="bottom-end">
        <MenuHandler>
          <Button
            variant="text"
            color="blue-gray"
            className="flex items-center gap-1 rounded-full py-0.5 pr-2 pl-0.5 lg:ml-auto"
          >
            <Typography>{getInitials(user.name)}</Typography>
            <ChevronDownIcon
              strokeWidth={2.5}
              className={`h-3 w-3 transition-transform ${isMenuOpen ? 'rotate-180' : ''}`}
            />
          </Button>
        </MenuHandler>
        <MenuList className="p-1">
          <Link to={`/users/${user.id}`}>
            <MenuItem className="flex items-center gap-2 rounded">
              <UserCircleIcon className="h-4 w-4" strokeWidth={2} />
              <Typography as="span" variant="small" className="font-normal" color="inherit">
                profile
              </Typography>
            </MenuItem>
          </Link>

          <MenuItem
            onClick={handleLogout}
            className="flex items-center gap-2 rounded hover:bg-red-500/10 focus:bg-red-500/10 active:bg-red-500/10"
          >
            <PowerIcon className="h-4 w-4 text-red-500" strokeWidth={2} />
            <Typography as="span" variant="small" className="font-normal" color="red">
              logout
            </Typography>
          </MenuItem>
        </MenuList>
      </Menu>
    </div>
  )
}

const NavbarSimple = () => {
  const [openNav, setOpenNav] = useState(false)

  const handleWindowResize = () => window.innerWidth >= 960 && setOpenNav(false)

  useEffect(() => {
    window.addEventListener('resize', handleWindowResize)

    return () => {
      window.removeEventListener('resize', handleWindowResize)
    }
  }, [])

  return (
    <Navbar className="mx-auto px-6 py-3">
      <div className="flex items-center justify-between text-blue-gray-900">
        <div className="flex items-center gap-2">
          <IconButton
            variant="text"
            className="ml-auto h-6 w-6 text-inherit hover:bg-transparent focus:bg-transparent active:bg-transparent lg:hidden"
            ripple={false}
            onClick={() => setOpenNav(!openNav)}
          >
            {openNav ? (
              <XMarkIcon className="h-6 w-6" strokeWidth={2} />
            ) : (
              <Bars3Icon className="h-6 w-6" strokeWidth={2} />
            )}
          </IconButton>
          <Typography as="a" href="#" variant="h6" className="mr-4 cursor-pointer py-1.5">
            bloglist
          </Typography>
        </div>

        <div className="flex items-center">
          <div className="hidden lg:block">
            <NavList />
          </div>

          <div className="ml-5">
            <ProfileMenu />
          </div>
        </div>
      </div>
      <Collapse open={openNav}>
        <NavList />
      </Collapse>
    </Navbar>
  )
}

export default NavbarSimple

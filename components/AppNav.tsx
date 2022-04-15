import React, { useEffect, useState } from 'react'
import NavLink, { NavLinkProps } from './NavLink'
import { useRouter } from 'next/router'
import { useGetAppQuery, GetAppQuery } from '../graphql'
import Navbar from 'react-bootstrap/Navbar'
import { Container, Nav } from 'react-bootstrap'
import ProfileDropdownMenu from './ProfileDropdownMenu'
import { Session } from '../@types/auth'
import styles from '../scss/appNav.module.scss'

type AuthLinkProps = {
  session: any
}

type NavItem = NavLinkProps & { name: string }

const navItems: NavItem[] = [
  { path: '/curriculum', name: 'Curriculum' },
  {
    path: 'https://github.com/garageScript/c0d3-app',
    name: 'Repo',
    external: true
  },
  {
    path: '/docs/learn',
    name: 'Learn'
  },
  {
    path: 'https://discord.gg/c0d3',
    name: 'Community',
    external: true
  }
]

const NavBar: React.FC<AuthLinkProps> = ({}) => {
  const router = useRouter()
  const location = router.asPath

  return (
    <>
      {navItems.map(button => (
        <NavLink
          {...button}
          className={` ${styles['nav-item']} ${styles['nav-link']} px-3`}
          key={button.name}
          activePath={location.includes(button.path)}
        >
          {button.name}
        </NavLink>
      ))}
    </>
  )
}

const LoggedInAuthNav: React.FC<{ username: string; session: Session }> = ({
  username,
  session
}) => {
  const isAdmin = session?.user?.isAdmin

  return <ProfileDropdownMenu username={username} isAdmin={isAdmin} />
}

const NotLoggedInAuthNav = () => (
  <div className={`${styles['nav-buttons']}`}>
    <NavLink path="/login" className={`btn m-2 me-lg-3 ${styles['login-btn']}`}>
      Login
    </NavLink>
    <NavLink
      path="/signup"
      className={`btn m-2 me-lg-3 ${styles['signup-btn']}`}
    >
      Signup
    </NavLink>
  </div>
)

const AppNav: React.FC<{}> = () => {
  const [session, setSession] = useState<GetAppQuery['session']>({
    lessonStatus: []
  })
  const isAdmin = session?.user?.isAdmin

  const { data, loading } = useGetAppQuery()

  useEffect(() => {
    if (data && data.session) {
      setSession(data.session)
    }
  }, [data])

  const renderButtons = () => {
    if (loading) return <></>

    // TODO: replace with typing
    const username = session?.user?.username || ''

    if (!session || (username || null) === null) {
      return <NotLoggedInAuthNav />
    }

    return <LoggedInAuthNav username={username} session={session} />
  }

  return (
    <Navbar
      id="appNav"
      className={`${styles['navbar']}`}
      expand="lg"
      bg="white"
    >
      <Container>
        <Navbar.Brand href="/">
          <div className={`${styles['navbar-brand']} text-primary fw-bold`}>
            C0D3
            {isAdmin ? (
              <span className={`${styles['isAdminBadge']} badge`}> ADMIN </span>
            ) : (
              ''
            )}
          </div>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav" className="text-center">
          <Nav className="m-auto">
            <NavBar session={session} />
          </Nav>
          {renderButtons()}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

export default AppNav

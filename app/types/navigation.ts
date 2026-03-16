export type NavItem = {
  title: string
  to?: string
  icon?: string
  children?: NavItem[]
}

export type NavMenu = {
  primary: NavItem[]
  secondary: NavItem[]
}


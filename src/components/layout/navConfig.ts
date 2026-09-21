import type { UserRole } from '../../types/models'

export interface NavItem {
  to: string
  label: string
}

export const navByRole: Record<UserRole, NavItem[]> = {
  student: [
    { to: '/dashboard', label: 'Dashboard' },
    { to: '/courses', label: 'Courses' },
    { to: '/ai-assistant', label: 'AI Study Assistant' },
    { to: '/quiz', label: 'Quiz' },
    { to: '/notifications', label: 'Notifications' },
  ],
  teacher: [
    { to: '/teacher', label: 'Teacher Dashboard' },
    { to: '/teacher/submissions', label: 'Submissions' },
    { to: '/teacher/announcements', label: 'Announcements' },
    { to: '/courses', label: 'Courses' },
    { to: '/notifications', label: 'Notifications' },
  ],
  admin: [
    { to: '/admin', label: 'Admin Dashboard' },
    { to: '/courses', label: 'Courses' },
    { to: '/about-firebase', label: 'Firebase Architecture' },
    { to: '/notifications', label: 'Notifications' },
  ],
}

export const sharedNav: NavItem[] = [{ to: '/about-firebase', label: 'Firebase Architecture' }]

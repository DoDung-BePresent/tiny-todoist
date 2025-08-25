import { Calendar1, Calendar2, DirectboxNotif } from "iconsax-reactjs";

export const SIDEBAR_LINKS = [
  {
    href: '/app/inbox',
    label: 'Inbox',
    icon: DirectboxNotif,
  },
  {
    href: '/app/today',
    label: 'Today',
    icon: Calendar1,
  },
  {
    href: '/app/upcoming',
    label: 'Upcoming',
    icon: Calendar2,
  }
] as const;

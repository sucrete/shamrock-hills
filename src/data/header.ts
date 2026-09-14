export interface NavLink {
  id: string;
  label: string;
  href: string;
}

export interface NavGroup {
  id: string;
  label: string;
  items: NavLink[];
}

export type NavEntry = ({ kind: 'link' } & NavLink) | ({ kind: 'group' } & NavGroup);

export const navLeft: NavEntry[] = [
  { kind: 'link', id: 'rates', label: 'Rates', href: '/greens-fees' },
  { kind: 'link', id: 'course', label: 'Course', href: '/course' },
  {
    kind: 'group',
    id: 'events',
    label: 'Events',
    items: [
      { id: 'calendar', label: 'Calendar', href: '/events' },
      { id: 'tournaments', label: 'Tournaments', href: '/events/tournaments' },
    ],
  },
  {
    kind: 'group',
    id: 'leagues',
    label: 'Leagues',
    items: [
      { id: 'couples', label: 'Couples League', href: '/leagues/couples' },
      { id: 'ladies', label: 'Ladies League', href: '/leagues/ladies' },
      { id: 'senior', label: 'Shamrock Senior League', href: '/leagues/senior' },
    ],
  },
];

export const navRight: NavEntry[] = [
  { kind: 'link', id: 'lessons', label: 'Lessons', href: '/lessons' },
  {
    kind: 'group',
    id: 'golf-association',
    label: 'Golf Assoc.',
    items: [
      { id: 'shga-home', label: 'SHGA Home', href: '/golf-association' },
      { id: 'match-play', label: 'Match Play', href: '/golf-association/match-play' },
    ],
  },

  {
    kind: 'group',
    id: 'about',
    label: 'About',
    items: [
      { id: 'location', label: 'Contact', href: '/contact' },
      { id: 'employment', label: 'Employment & Volunteers', href: '/about/employment' },
      { id: 'scorecard', label: 'Scorecard', href: '/about/scorecard' },
    ],
  },
];

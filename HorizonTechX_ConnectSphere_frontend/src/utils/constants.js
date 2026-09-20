export const APP_NAME = 'ConnectSphere';
export const APP_TAGLINE = 'Connect, share & discover with intention';

export const NAV_LINKS = [
  { id: 'home', label: 'Homepage', path: '/', icon: 'Home' },
  { id: 'connections', label: 'Connections', path: '/connections', icon: 'Users' },
  { id: 'messages', label: 'Messages', path: '/messages', icon: 'MessageSquare', badgeKey: 'unreadMessages' },
  { id: 'notifications', label: 'Notifications', path: '/notifications', icon: 'Bell', badgeKey: 'unreadNotifications' },
  { id: 'explore', label: 'Explore', path: '/explore', icon: 'Compass' },
];

export const FEED_TABS = [
  { id: 'trending', label: 'Trending' },
  { id: 'following', label: 'Following' },
  { id: 'latest', label: 'Latest' },
];

export const SORT_OPTIONS = [
  { id: 'top', label: 'Top' },
  { id: 'latest', label: 'Latest' },
  { id: 'trending', label: 'Trending' },
];

export const VISIBILITY_OPTIONS = [
  { id: 'public', label: 'Public', description: 'Anyone on or off ConnectSphere' },
  { id: 'connections', label: 'Connections only', description: 'Only people you connect with' },
  { id: 'private', label: 'Only me', description: 'Only visible to you' },
];

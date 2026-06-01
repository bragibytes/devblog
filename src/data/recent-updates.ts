export interface Update {
  date: string;
  text: string;
  link?: string;
}

export const recentUpdates: Update[] = [
  {
    date: 'Jun 2',
    text: 'Moved newsletter signup to homepage only.',
  },
  {
    date: 'Jun 1',
    text: 'Activated the Buttondown newsletter.',
  },
];

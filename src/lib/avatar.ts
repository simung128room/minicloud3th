export const ANIMATED_AVATARS = [
  'https://api.dicebear.com/7.x/bottts/svg?seed=ApexOne',
  'https://api.dicebear.com/7.x/bottts/svg?seed=ApexTwo',
  'https://api.dicebear.com/7.x/bottts/svg?seed=ApexThree',
  'https://api.dicebear.com/7.x/bottts/svg?seed=ApexFour',
  'https://api.dicebear.com/7.x/bottts/svg?seed=ApexFive'
];

export function getAvatarUrl(seed: string) {
  if (!seed) return ANIMATED_AVATARS[0];
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = seed.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % ANIMATED_AVATARS.length;
  return ANIMATED_AVATARS[index];
}

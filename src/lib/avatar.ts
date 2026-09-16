export function getAvatarUrl(seed: string) {
  if (!seed || seed === 'guest') {
    return 'https://ui-avatars.com/api/?name=G&background=333333&color=ffffff&size=128&font-size=0.5&bold=true';
  }
  
  // Extract the first letter or just pass the string to ui-avatars
  const nameParam = encodeURIComponent(seed.charAt(0).toUpperCase());
  return `https://ui-avatars.com/api/?name=${nameParam}&background=333333&color=ffffff&size=128&font-size=0.5&bold=true`;
}

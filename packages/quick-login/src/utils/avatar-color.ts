/**
 * Génère une classe Tailwind de couleur de fond consistante pour un username
 *
 * @example
 * getAvatarColor("allsitesdirecteur") // "bg-blue-500"
 */
export function getAvatarColor(username: string): string {
  let hash = 0;
  for (let i = 0; i < username.length; i++) {
    hash = username.charCodeAt(i) + ((hash << 5) - hash);
  }

  const colors = [
    'bg-blue-500',
    'bg-green-500',
    'bg-purple-500',
    'bg-pink-500',
    'bg-indigo-500',
    'bg-teal-500',
    'bg-orange-500',
  ];

  return colors[Math.abs(hash) % colors.length];
}

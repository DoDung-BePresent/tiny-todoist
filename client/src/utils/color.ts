export function getAvatarColor(char: string): { bg: string; border: string } {
  const code = char?.toUpperCase().charCodeAt(0) ?? 65;
  const hue = (code * 37) % 360;
  return {
    bg: `hsl(${hue}, 70%, 95%)`,
    border: `hsl(${hue}, 60%, 60%)`,
  };
}

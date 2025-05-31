export default function parseISO8601Duration(duration) {
  const regex = /PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/;
  const match = duration.match(regex);

  if (!match) return 0;

  const [, hours, minutes, seconds] = match.map(v => parseInt(v || '0', 10));
  return (hours * 3600) + (minutes * 60) + seconds;
}

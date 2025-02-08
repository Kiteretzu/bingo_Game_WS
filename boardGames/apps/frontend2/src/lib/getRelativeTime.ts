export const getRelativeTime = (
  timestamp?: string | number | Date | null
): string => {
  console.log("working?", timestamp, typeof timestamp);
  if (!timestamp) return "N/A";
  console.log("check1");
  const date = new Date(parseInt(timestamp as string));
  console.log("check1.2: Parsed date object:", date);

  if (isNaN(date.getTime())) {
    console.log("check1.3: Invalid date detected");
    return "N/A"; // Invalid date handling
  }
  console.log("check2");
  const diffInSeconds = Math.floor((Date.now() - date.getTime()) / 1000);
  const intervals: Record<string, number> = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60,
    second: 1,
  };

  for (let [unit, seconds] of Object.entries(intervals)) {
    const count = Math.floor(diffInSeconds / seconds);
    if (count > 0) {
      return `${count} ${unit}${count !== 1 ? "s" : ""} ago`;
    }
  }

  return "Just now";
};

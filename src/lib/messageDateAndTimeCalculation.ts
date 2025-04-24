export function messageDateAndTimeCalculation(time: number): string {
  const months = [
    "янв",
    "фев",
    "мар",
    "апр",
    "мая",
    "июн",
    "июл",
    "авг",
    "сен",
    "окт",
    "ноя",
    "дек"
  ];

  const postingMessageTime = new Date(time);
  const date = postingMessageTime.getDate();
  const month = months[postingMessageTime.getMonth()];
  const year = postingMessageTime.getFullYear();
  const hours = postingMessageTime.getHours();
  const minutes = postingMessageTime.getMinutes();

  return `${date} ${month} ${year} г., ${hours}:${minutes < 10 ? "0" + minutes : minutes}`;
}

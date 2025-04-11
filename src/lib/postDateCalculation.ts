export function postDateCalculation(time: number, key: string): string {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;
  const week = day * 7;
  const months = [
    "января",
    "февраля",
    "марта",
    "апреля",
    "мая",
    "июня",
    "июля",
    "августа",
    "сентября",
    "октября",
    "ноября",
    "декабря"
  ];

  const now = new Date();
  const timePeriod = now.getTime() - time;

  if (timePeriod >= second && timePeriod < minute) {
    const date = Math.floor(timePeriod / second); // миллисекунды переводим в секунды
    return key === "post" ? `${date} секунд назад` : `${date} cек.`;
  } else if (timePeriod >= minute && timePeriod < hour) {
    const date = Math.floor(timePeriod / minute); // минуты
    return key === "post" ? `${date} минут назад` : `${date} мин.`;
  } else if (timePeriod >= hour && timePeriod < day) {
    const date = Math.floor(timePeriod / hour); // часы
    return key === "post" ? `${date} часов назад` : `${date} ч.`;
  } else if (timePeriod >= day && timePeriod < week) {
    const date = Math.floor(timePeriod / day); // дни
    return key === "post" ? `${date} дней назад` : `${date} дн.`;
  } else {
    const currentYear = now.getFullYear();
    const fullPostDateInfo = new Date(time);
    const postYear = fullPostDateInfo.getFullYear();
    const postDate = fullPostDateInfo.getDate();
    const postMonthIndex = fullPostDateInfo.getMonth();

    if (currentYear === postYear) {
      const date = Math.floor(timePeriod / week); // недели
      return key === "post" ? `${postDate} ${months[postMonthIndex]}` : `${date} нед.`;
    } else {
      return key === "post"
        ? `${postDate} ${months[postMonthIndex]} ${postYear}`
        : `${postYear} г.`;
    }
  }
}

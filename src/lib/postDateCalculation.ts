export function postDateCalculation(postTime: number): string {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;
  const week = day * 7;
  const months = [
    "январь",
    "февраль",
    "март",
    "апрель",
    "май",
    "июнь",
    "июль",
    "август",
    "сентябрь",
    "октябрь",
    "ноябрь",
    "декабрь"
  ];

  const now = new Date();
  const timePeriod = now.getTime() - postTime;

  if (timePeriod >= second && timePeriod < minute) {
    const date = Math.floor(timePeriod / second); // миллисекунды переводим в секунды
    return `${date} секунд назад`;
  } else if (timePeriod >= minute && timePeriod < hour) {
    const date = Math.floor(timePeriod / minute); // минуты
    return `${date} минут назад`;
  } else if (timePeriod >= hour && timePeriod < day) {
    const date = Math.floor(timePeriod / hour); // часы
    return `${date} часов назад`;
  } else if (timePeriod >= day && timePeriod < week) {
    const date = Math.floor(timePeriod / day); // дни
    return `${date} дней назад`;
  } else {
    const currentYear = now.getFullYear();
    const fullPostDateInfo = new Date(postTime);
    const postYear = fullPostDateInfo.getFullYear();
    const postDate = fullPostDateInfo.getDate();
    const postMonthIndex = fullPostDateInfo.getMonth();

    if (currentYear === postYear) {
      return `${postDate} ${months[postMonthIndex]}`;
    } else {
      return `${postDate} ${months[postMonthIndex]} ${postYear}`;
    }
  }
}

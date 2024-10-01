import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

export const ageSetter = (age: string) => {
  return dayjs().from(dayjs(age), true);
};

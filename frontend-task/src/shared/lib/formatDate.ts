import dayjs from 'dayjs'
export const formatDate = (value: string) =>
  dayjs(value).format('DD.MM.YYYY, HH:mm')

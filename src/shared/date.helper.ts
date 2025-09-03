import moment from 'moment-timezone';

const VN_TZ = 'Asia/Ho_Chi_Minh';

export class DateHelper {
  /** Lấy thời gian hiện tại UTC */
  static nowUTC(): Date {
    return new Date();
  }

  /** Convert bất kỳ date sang giờ VN, nhưng trả về dạng Date (UTC) */
  static toVN(date: Date | string): Date {
    return moment.tz(date, VN_TZ).toDate(); // vẫn lưu UTC nhưng thời gian tương ứng với VN
  }

  /** Lấy khoảng thời gian 1 ngày theo giờ VN (trả về UTC Date để query Mongo) */
  static getVNDayRange(date: Date | string) {
    const startVN = moment.tz(date, VN_TZ).startOf('day');
    const endVN = moment.tz(date, VN_TZ).endOf('day');

    return {
      startUTC: startVN.clone().utc().toDate(),
      endUTC: endVN.clone().utc().toDate(),
    };
  }

  /** Format ra string cho UI (ví dụ hiển thị) */
  static formatForDisplay(
    date: Date | string,
    format = 'YYYY-MM-DD HH:mm:ss',
  ): string {
    return moment(date).tz(VN_TZ).format(format);
  }
}

class DateService {
  getDays() {
    const daysList: number[] = [];

    for (let i: number = 1; i <= 31; i++) {
      daysList.push(i);
    }

    return daysList;
  }

  getMonths() {
    const monthList = [];
    for (let i: number = 1; i <= 12; i++) {
      monthList.push(i);
    }

    return monthList;
  }

  getYears() {
    const yearsList = [];
    for (let i: number = 1900; i <= 2020; i++) {
      yearsList.push(i);
    }
    return yearsList;
  }
}
export { DateService };

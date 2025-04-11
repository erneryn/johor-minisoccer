import holiday from "@/app/config/holiday.json";


const isHolidayOrWeekend = (date: Date) => {
    const isHoliday = holiday.includes(date.toISOString().split('T')[0]);
    const isWeekend = date.getDay() === 0 || date.getDay() === 6 || date.getDay() === 5;
    return isHoliday || isWeekend;
}

export { isHolidayOrWeekend };

import {
  eachDayOfInterval,
  endOfMonth,
  format,
  endOfWeek,
  isEqual,
  isToday,
  isSameMonth,
  parse,
  add,
  getDay,
  startOfWeek,
  isBefore,
  isAfter,
} from "date-fns";
import { useState } from "react";
import { BiChevronLeft, BiChevronRight } from "react-icons/bi";

interface CalendarFromProps {
  today: Date;
  startDate: Date;
  endDate: Date;
  setStartDate: (date: Date) => void;
  setEndDate: (date: Date) => void;
  from: boolean;
}

const CalendarForm: React.FC<CalendarFromProps> = ({
  today,
  startDate,
  endDate,
  setStartDate,
  setEndDate,
  from,
}) => {
  let [selectedDay, setSelectedDay] = useState(today);
  let [currentMonth, setCurrentMonth] = useState(
    from ? format(today, "MMM-yyyy") : format(endDate, "MMM-yyyy")
  );
  let firstDayCurrentMonth = parse(currentMonth, "MMM-yyyy", new Date());

  function classNames(...classes: any[]) {
    return classes.filter(Boolean).join(" ");
  }

  function previousMonth() {
    let firstDayCurrentMonth = parse(currentMonth, "MMM-yyyy", new Date());
    let firstDayNextMonth = add(firstDayCurrentMonth, { months: -1 });
    setCurrentMonth(format(firstDayNextMonth, "MMM-yyyy"));
  }

  function nextMonth() {
    let firstDayCurrentMonth = parse(currentMonth, "MMM-yyyy", new Date());
    let firstDayNextMonth = add(firstDayCurrentMonth, { months: 1 });
    setCurrentMonth(format(firstDayNextMonth, "MMM-yyyy"));
  }

  let newDays = eachDayOfInterval({
    start: startOfWeek(firstDayCurrentMonth),
    end: endOfWeek(endOfMonth(firstDayCurrentMonth)),
  });
  return (
    <div className="flex bg-white">
      <div className="pt-2 bg-white">
        <div className="flex items-center">
          <button
            type="button"
            onClick={previousMonth}
            className="-my-1.5 flex flex-none items-center justify-center p-1.5 text-gray-400 hover:text-gray-500"
          >
            <BiChevronLeft className="w-5 h-5" aria-hidden="true" />
          </button>
          <h2 className="flex-auto text-gray-900 text-sm font-semibold font-body">
            {format(firstDayCurrentMonth, "MMMM yyyy")}
          </h2>

          <button
            onClick={nextMonth}
            type="button"
            className="-my-1.5 -mr-1.5 ml-2 flex flex-none items-center justify-center p-1.5 text-gray-400 hover:text-gray-500"
          >
            <BiChevronRight className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>
        <div className="grid grid-cols-7 gap-3 md:gap-5 mt-3 text-xs leading-6 text-center text-gray-500 px-1">
          <div className="text-sm">S</div>
          <div className="text-sm">M</div>
          <div className="text-sm">T</div>
          <div className="text-sm">W</div>
          <div className="text-sm">T</div>
          <div className="text-sm">F</div>
          <div className="text-sm">S</div>
        </div>
        <div className="grid grid-cols-7 text-center gap-2 md:gap-3">
          {newDays.map((day, index) => (
            <div
              key={day.toString()}
              className={classNames(
                index === 0 && colStartClasses[getDay(day)],
                "text-xs"
              )}
            >
              <button
                type="button"
                onClick={() => {
                  setSelectedDay(day);
                  from ? setStartDate(day) : setEndDate(day);
                }}
                className={classNames(
                  isEqual(day, selectedDay) && "text-white",
                  !isEqual(day, selectedDay) && isToday(day) && "text-red-500",
                  !isEqual(day, selectedDay) &&
                    !isToday(day) &&
                    isSameMonth(day, firstDayCurrentMonth) &&
                    "text-gray-900",
                  !isEqual(day, selectedDay) &&
                    !isToday(day) &&
                    !isSameMonth(day, firstDayCurrentMonth) &&
                    "text-gray-400",
                  isEqual(day, selectedDay) && isToday(day) && "bg-red-500",
                  isEqual(day, selectedDay) && !isToday(day) && "bg-gray-900",
                  !isEqual(day, selectedDay) && "hover:bg-gray-200",
                  (isEqual(day, selectedDay) || isToday(day)) &&
                    "font-semibold",
                  "mx-auto flex h-8 w-8 items-center justify-center rounded-full",
                  isBefore(day, endDate) &&
                    isAfter(day, startDate) &&
                    "bg-green-200 hover:bg-green-200",
                  ((isEqual(day, startDate) && !isToday(day)) ||
                    (isEqual(day, endDate) && !isToday(day))) &&
                    "bg-gray-900 text-white"
                )}
                // disabled={}
              >
                <time
                  dateTime={format(day, "yyyy-MM-dd")}
                  className="text-xs font-regular font-body"
                >
                  {format(day, "d")}
                </time>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

let colStartClasses = [
  "",
  "col-start-2",
  "col-start-3",
  "col-start-4",
  "col-start-5",
  "col-start-6",
  "col-start-7",
];

export default CalendarForm;

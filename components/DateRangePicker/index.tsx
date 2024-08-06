import { useState, useEffect, useRef } from "react";
import Calendar from "@/components/Calendar";
import { startOfToday, format } from "date-fns";
import { HiCalendar } from "react-icons/hi2";
import CalendarFrom from "@/components/CalendarFrom";
import CalendarEnd from "@/components/CalendarEnd";
import { AiOutlineCloseCircle } from "react-icons/ai";

interface DateRangePickerProps {
  startDate: Date | null;
  endDate: Date | null;
  setStartDate: (date: Date | null) => void;
  setEndDate: (date: Date | null) => void;
}

const DateRangePicker: React.FC<DateRangePickerProps> = ({
  startDate,
  endDate,
  setStartDate,
  setEndDate,
}) => {
  let today = startOfToday();
  const datePickerRef = useRef<HTMLDivElement | null>(null);
  const [show, setShow] = useState(false);

  function handler(event: Event) {
    const target = event.target as Node;

    if (datePickerRef.current && !datePickerRef.current.contains(target)) {
      setShow(false);
    }
  }

  useEffect(() => {
    window.addEventListener("click", handler);
    return () => {
      window.removeEventListener("click", handler);
    };
  }, []);

  return (
    <div
      className={`flex flex-col items-center w-96 md:w-fit relative`}
      ref={datePickerRef}
    >
      <div
        className="border-[1px] border-secondary-50 rounded-md items-center pr-1 text-sm font-body h-full flex px-3 py-1 cursor-pointer gap-2"
        onClick={() => setShow((prev) => !prev)}
      >
        <HiCalendar size={20} />
        {startDate ? format(startDate, "dd/MM/yyyy") : "dd/mm/yyyy"} -{" "}
        {endDate ? format(endDate, "dd/MM/yyyy") : "dd/mm/yyyy"}
        <AiOutlineCloseCircle
          size={20}
          onClick={(event) => {
            event.stopPropagation();
            setStartDate(null);
            setEndDate(null);
          }}
          className="cursor-pointer"
        />
      </div>
      {show && (
        <div className="bg-white px-5 py-2 absolute top-10 right-0 z-40 shadow-md border-[0.9px] border-secondary-300 rounded-md flex gap-3 md:gap-5">
          <CalendarFrom
            today={today}
            endDate={endDate ? endDate : today}
            startDate={startDate ? startDate : today}
            setEndDate={setEndDate}
            setStartDate={setStartDate}
            from={true}
          />
          <CalendarEnd
            today={today}
            endDate={endDate ? endDate : today}
            startDate={startDate ? startDate : today}
            setEndDate={setEndDate}
            setStartDate={setStartDate}
            from={false}
          />
        </div>
      )}

      {false && (
        <div className="min-w-fit flex flex-col absolute z-60">
          <div className="flex bg-white rounded min-h-fit border-[0.9px] border-secondary-300 p-2 w-fit mt-14 mb-2 justify-between">
            <Calendar
              today={today}
              endDate={endDate || today}
              startDate={startDate || today}
              setEndDate={setEndDate}
              setStartDate={setStartDate}
              from={true}
            />
            <div className=" border-r-[0.9px] border-gray-500 mr-2"></div>
            <Calendar
              today={today}
              endDate={endDate || today}
              startDate={startDate || today}
              setEndDate={setEndDate}
              setStartDate={setStartDate}
              from={false}
            />
          </div>
          <div className="flex justify-end gap-2 items-center">
            <span className="text-sm"></span>
            <button
              className={`rounded border-[1px] px-2 py-2 bg-red-500 text-white text-xs`}
              type="button"
              onClick={() => {
                setShow(false);
              }}
            >
              cancel
            </button>
            <button
              className={`rounded border-[1px] border-black px-2 py-2 bg-black text-white text-xs`}
              type="button"
              onClick={() => {
                setShow(false);
              }}
            >
              Apply
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DateRangePicker;

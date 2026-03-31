import React, { useState, useMemo } from 'react';
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
  isToday,
  startOfWeek,
  endOfWeek,
  // startOfDay,
} from 'date-fns';
import type { Task } from '../types';

interface CalendarViewProps {
  tasks: Task[];
  onTaskClick: (task: Task) => void;
}

const CalendarView: React.FC<CalendarViewProps> = ({ tasks, onTaskClick }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Get calendar days for current month
  const calendarDays = useMemo(() => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const calendarStart = startOfWeek(monthStart);
    const calendarEnd = endOfWeek(monthEnd);

    return eachDayOfInterval({ start: calendarStart, end: calendarEnd });
  }, [currentDate]);

  // Get tasks for a specific date
  //   const getTasksForDate = (date: Date) => {
  //     return tasks.filter((task) => {
  //       if (!task.due) return false;
  //       const taskDate = new Date(task.due);
  //       return isSameDay(taskDate, date) && task.status !== 'deleted';
  //     });
  //   };

  const normalize = (d: Date) =>
    new Date(d.getFullYear(), d.getMonth(), d.getDate());

  const getTasksForDate = (date: Date) => {
    return tasks.filter((task) => {
      const parsed = safeParse(task.due);
      if (!parsed) return false;

      return (
        isSameDay(normalize(parsed), normalize(date)) &&
        task.status !== 'deleted'
      );
    });
  };

  const safeParse = (dateStr?: string): Date | null => {
    if (!dateStr || dateStr.trim() === '') return null;

    // Handle TaskWarrior format
    if (/^\d{8}T\d{6}Z$/.test(dateStr)) {
      const year = dateStr.slice(0, 4);
      const month = dateStr.slice(4, 6);
      const day = dateStr.slice(6, 8);
      const hour = dateStr.slice(9, 11);
      const minute = dateStr.slice(11, 13);
      const second = dateStr.slice(13, 15);

      const iso = `${year}-${month}-${day}T${hour}:${minute}:${second}Z`;
      const d = new Date(iso);

      return isNaN(d.getTime()) ? null : d;
    }

    const d = new Date(dateStr);
    return isNaN(d.getTime()) ? null : d;
  };

  // Get tasks for selected date
//   const selectedDateTasks = useMemo(() => {
//     return getTasksForDate(selectedDate);
//   }, [selectedDate, tasks]);
    const selectedDateTasks = getTasksForDate(selectedDate);

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case 'H':
        return 'bg-[#F673B7]';
      case 'M':
        return 'bg-[#FFD700]';
      case 'L':
        return 'bg-[#9BFFCE]';
      default:
        return 'bg-[#34D4FD]';
    }
  };

  const getPriorityLabel = (priority?: string) => {
    switch (priority) {
      case 'H':
        return 'HIGH';
      case 'M':
        return 'MEDIUM';
      case 'L':
        return 'LOW';
      default:
        return '';
    }
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  return (
    <div className="flex flex-col h-full bg-[#060E20] text-gray-100 pt-20">
      {/* Calendar Section */}
      <div className="flex justify-center items-center">
        <div className="p-6 min-w-[1000px] max-w-[1200px]">
          {/* <div  className=''> */}
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="relative inline-block">
              {/* Glow background */}
              <div className="absolute inset-0 blur-xl bg-[#34D4FD]/20 rounded-full"></div>

              {/* Text */}
              <h2 className="relative text-3xl font-semibold tracking-wider bg-gradient-to-r from-[#34D4FD] via-cyan-300 to-blue-400 bg-clip-text text-transparent">
                {format(currentDate, 'MMMM yyyy')}
              </h2>
              <h2 className="text-xs text-gray-400 mt-1">
                {getTasksForDate(currentDate).length} TASKS REMAINING THIS MONTH
              </h2>
            </div>
            {/* <div>
            <h2 className="text-2xl font-semibold text-white">
              {format(currentDate, 'MMMM yyyy')}
            </h2>
            <p className="text-sm text-gray-400 mt-1">
              {getTasksForDate(currentDate).length} TASKS REMAINING THIS MONTH
            </p>
          </div> */}

            <div className="flex gap-2">
              <button
                onClick={() => navigateMonth('prev')}
                className="p-2 text-[#69DAFF] bg-[#091328] hover:bg-[#1f2937] rounded-lg transition-colors"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
              <button
                onClick={() => navigateMonth('next')}
                className="p-2 text-[#69DAFF] bg-[#091328] hover:bg-[#1f2937] rounded-lg transition-colors"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="bg-[#091328] rounded-xl p-4 border-[1.5px] border-[#1f2937]/30 flex-col items-center">
            {/* Weekday Headers */}
            <div className="grid grid-cols-7 gap-2 mb-2 ">
              {['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'].map((day) => (
                <div
                  key={day}
                  className="text-xs text-gray-500 text-center font-medium py-2"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Days */}
            <div className="grid grid-cols-7 gap-0 text-xs">
              {calendarDays.map((day, index) => {
                const dayTasks = getTasksForDate(day);
                const isCurrentMonth =
                  day.getMonth() === currentDate.getMonth();
                const isSelectedDay = isSameDay(day, selectedDate);
                const isTodayDay = isToday(day);

                return (
                  <button
                    key={index}
                    onClick={() => setSelectedDate(day)}
                    className={`
                    relative w-10 h-10 ml-11 rounded-full text-center transition-all 
                    ${isSelectedDay ? 'bg-[#34D4FD] text-[#060E20] hover:-translate-y-1 shadow-[0_1px_40px_rgba(52,212,253,0.2)]' : 'hover:bg-transparent hover:-translate-y-1'}
                    ${!isCurrentMonth && !isSelectedDay ? 'text-gray-600' : 'text-gray-200 '}
                    ${isTodayDay && !isSelectedDay ? 'bg-[#1f2937] ' : ''}
                  `}
                  >
                    <span
                      className={`text-sm font-medium ${isSelectedDay ? 'text-[#060E20]' : ' '}`}
                    >
                      {format(day, 'd')}
                    </span>

                    {/* Task Indicators */}
                    {dayTasks.length > 0 && (
                      <div className="flex justify-center gap-1 mt-1">
                        {dayTasks.slice(0, 3).map((task, i) => (
                          <div
                            key={i}
                            className={`w-1 h-1 rounded-full ${getPriorityColor(task.priority)}`}
                          />
                        ))}
                        {dayTasks.length > 3 && (
                          <div className="w-1 h-1 rounded-full bg-gray-500" />
                        )}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
        {/* </div> */}
      </div>

      {/* Scheduled Tasks Section */}
      <div className="flex-1 px-6 pb-6 overflow-y-auto flex justify-center items-center">
        <div className="min-w-[1000px] max-w-[1200px] p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">
              Scheduled for Today
            </h3>
            <span className="text-xs text-[#34D4FD] bg-[#091328] px-4 py-2 rounded-full">
              {format(selectedDate, 'EEEE, MMMM do').toUpperCase()}
            </span>
          </div>

          {selectedDateTasks.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <svg
                className="w-16 h-16 mx-auto mb-4 opacity-50"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
              <p className="text-sm">No tasks scheduled for this date</p>
            </div>
          ) : (
            <div className="space-y-3">
              {selectedDateTasks.map((task) => (
                <div
                  key={task.uuid}
                  onClick={() => onTaskClick(task)}
                  className="bg-[#091328] rounded-lg p-4 hover:bg-[#141F38] transition-colors cursor-pointer border border-transparent hover:border-[#34D4FD]/10"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-3 flex-1">
                      <input
                        type="checkbox"
                        onChange={(e) => {
                          e.stopPropagation();
                          // Handle checkbox toggle
                        }}
                        className="w-4 h-4 rounded-md
                        appearance-none
                        border
                        bg-[#091328]
                        checked:decoration-[#34D4FD]
                        border-[#34D4FD]
                        relative
                        cursor-pointer"
                      />
                      <h4 className="text-white font-medium uppercase text-xs">
                        {task.description}
                      </h4>
                    </div>

                    {task.priority && (
                      <span
                        className={`
                      text-[11px] px-2 py-1 rounded font-medium
                      ${task.priority === 'H' ? 'bg-red-500/10 text-red-400' : ''}
                      ${task.priority === 'M' ? 'bg-yellow-500/10 text-[#FFD700]' : ''}
                      ${task.priority === 'L' ? 'bg-green-500/10 text-green-400' : ''}
                    `}
                      >
                        {getPriorityLabel(task.priority)}
                      </span>
                    )}
                  </div>

                  {task.annotations && task.annotations.length > 0 && (
                    <p className="text-sm text-gray-400 ml-7 mb-2">
                      {task.annotations[0].description}
                    </p>
                  )}

                  <div className="flex items-center gap-4 ml-7 text-xs text-gray-500">
                    {(() => {
                      const parsed = safeParse(task.due);
                      if (!parsed) return null;

                      return (
                        <div className="flex items-center gap-1">
                          <svg
                            className="w-3.5 h-3.5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          <span>{format(parsed, 'hh:mm a')}</span>
                        </div>
                      );
                    })()}

                    {task.project && (
                      <div className="flex items-center gap-1">
                        <svg
                          className="w-3.5 h-3.5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                          />
                        </svg>
                        <span>{task.project}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Add Task Button */}
      <button className="fixed bottom-6 right-6 w-14 h-14 bg-cyan-500 hover:bg-cyan-600 rounded-full shadow-lg flex items-center justify-center transition-colors">
        <svg
          className="w-6 h-6 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 4v16m8-8H4"
          />
        </svg>
      </button>
    </div>
  );
};

export default CalendarView;

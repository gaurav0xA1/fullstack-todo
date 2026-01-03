import { useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import './CalanderView.css';
import WeeklyOverview from './WeeklyOverview';

function CalanderView() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const calendarRef = useState(null);

  const handlePrevMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() - 1);
    setCurrentDate(newDate);
  };

  const handleNextMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + 1);
    setCurrentDate(newDate);
  };

  const formatMonthYear = () => {
    return currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  return (
    <div className="calendar-container">
      <div className="calendar-header">
        <div className="calendar-nav">
          <button onClick={handlePrevMonth}>‹</button>
          <span className="month-year">{formatMonthYear()}</span>
          <button onClick={handleNextMonth}>›</button>
        </div>
      </div>
      
      <FullCalendar
        ref={calendarRef}
        plugins={[dayGridPlugin]}
        initialView="dayGridMonth"
        headerToolbar={false}
        initialDate={currentDate}
        key={currentDate.toISOString()}
        height="auto"
        fixedWeekCount={false}
        dayMaxEvents={false}
        events={[]}
      />

      <WeeklyOverview />
    </div>
  );
}

export default CalanderView;
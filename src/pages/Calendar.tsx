import { AppBar } from "../components/Appbar"
import CalendarView from "../components/CalendarView"
import { dummyTasks } from "../data"
import type { Task } from "../types"


export const Calendar = () => {

    const handleTaskClick = (task: Task) => {
    console.log("Clicked:", task)
  }

    return <div className="bg-[#060E20]"> 
        <AppBar/>
        <CalendarView 
        tasks={dummyTasks}
        onTaskClick={handleTaskClick}/>
    </div>
}
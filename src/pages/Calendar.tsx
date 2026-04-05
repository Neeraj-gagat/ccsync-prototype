import { AppBar } from "../components/Appbar"
import CalendarView from "../components/CalendarView"
import { dummyTasks2 } from "../data"
import type { Task } from "../types"


export const Calendar = () => {

    const handleTaskClick = (task: Task) => {
    console.log("Clicked:", task)
  }

    return <div className="bg-[#060E20]"> 
        <AppBar/>
        <CalendarView 
        tasks={dummyTasks2}
        onTaskClick={handleTaskClick}/>
    </div>
}
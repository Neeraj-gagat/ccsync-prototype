import { AppBar } from "../components/Appbar"
import { KanbanView } from "../components/KanbanView"
import { dummyTasks } from "../data"
import type { Task } from "../types"


export const Home = () => {

    const handleTaskClick = (task: Task) => {
    console.log("Clicked:", task)
  }

    return <div className="bg-[#060E20]"> 
        <AppBar/>
        <KanbanView 
        email="demo@ccsync.com"
        encryptionSecret="demo-secret"
        UUID="demo-uuid"
        tasks={dummyTasks}
        onTaskClick={handleTaskClick}
        />
    </div>
}
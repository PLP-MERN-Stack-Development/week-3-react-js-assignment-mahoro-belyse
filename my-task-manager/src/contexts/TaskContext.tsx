"use client"

import { createContext, useContext, useReducer, useEffect, type ReactNode } from "react"

interface Task {
  id: string
  text: string
  completed: boolean
  createdAt: Date
}

interface TaskState {
  tasks: Task[]
}

type TaskAction =
  | { type: "ADD_TASK"; payload: string }
  | { type: "TOGGLE_TASK"; payload: string }
  | { type: "DELETE_TASK"; payload: string }
  | { type: "LOAD_TASKS"; payload: Task[] }

interface TaskContextType {
  tasks: Task[]
  addTask: (text: string) => void
  toggleTask: (id: string) => void
  deleteTask: (id: string) => void
}

const TaskContext = createContext<TaskContextType | undefined>(undefined)

function taskReducer(state: TaskState, action: TaskAction): TaskState {
  switch (action.type) {
    case "ADD_TASK":
      const newTask: Task = {
        id: Date.now().toString(),
        text: action.payload,
        completed: false,
        createdAt: new Date(),
      }
      return {
        ...state,
        tasks: [...state.tasks, newTask],
      }

    case "TOGGLE_TASK":
      return {
        ...state,
        tasks: state.tasks.map((task) => (task.id === action.payload ? { ...task, completed: !task.completed } : task)),
      }

    case "DELETE_TASK":
      return {
        ...state,
        tasks: state.tasks.filter((task) => task.id !== action.payload),
      }

    case "LOAD_TASKS":
      return {
        ...state,
        tasks: action.payload,
      }

    default:
      return state
  }
}

export function TaskProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(taskReducer, { tasks: [] })

  // Load tasks from localStorage on mount
  useEffect(() => {
    const savedTasks = localStorage.getItem("tasks")
    if (savedTasks) {
      try {
        const parsedTasks = JSON.parse(savedTasks).map((task: any) => ({
          ...task,
          createdAt: new Date(task.createdAt),
        }))
        dispatch({ type: "LOAD_TASKS", payload: parsedTasks })
      } catch (error) {
        console.error("Error loading tasks from localStorage:", error)
      }
    }
  }, [])

  // Save tasks to localStorage whenever tasks change
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(state.tasks))
  }, [state.tasks])

  const addTask = (text: string) => {
    dispatch({ type: "ADD_TASK", payload: text })
  }

  const toggleTask = (id: string) => {
    dispatch({ type: "TOGGLE_TASK", payload: id })
  }

  const deleteTask = (id: string) => {
    dispatch({ type: "DELETE_TASK", payload: id })
  }

  return (
    <TaskContext.Provider
      value={{
        tasks: state.tasks,
        addTask,
        toggleTask,
        deleteTask,
      }}
    >
      {children}
    </TaskContext.Provider>
  )
}

export function useTasks() {
  const context = useContext(TaskContext)
  if (context === undefined) {
    throw new Error("useTasks must be used within a TaskProvider")
  }
  return context
}

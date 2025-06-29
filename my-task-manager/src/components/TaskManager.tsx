"use client"

import type React from "react"

import { useState } from "react"
import { useTasks } from "@/contexts/TaskContext"
import { useLocalStorage } from "@/hooks/useLocalStorage"
import Button from "./ui/Button"
import { Card, CardHeader, CardTitle, CardContent } from "./ui/Card"
import { Input } from "@/components/ui/input"
import { Plus, Check, Trash2, Filter } from "lucide-react"

type FilterType = "all" | "active" | "completed"

export default function TaskManager() {
  const { tasks, addTask, toggleTask, deleteTask } = useTasks()
  const [newTask, setNewTask] = useState("")
  const [filter, setFilter] = useLocalStorage<FilterType>("taskFilter", "all")

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault()
    if (newTask.trim()) {
      addTask(newTask.trim())
      setNewTask("")
    }
  }

  const filteredTasks = tasks.filter((task) => {
    if (filter === "active") return !task.completed
    if (filter === "completed") return task.completed
    return true
  })

  const taskStats = {
    total: tasks.length,
    active: tasks.filter((t) => !t.completed).length,
    completed: tasks.filter((t) => t.completed).length,
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Tasks</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{taskStats.total}</p>
              </div>
              <div className="h-12 w-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                <Filter className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active</p>
                <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">{taskStats.active}</p>
              </div>
              <div className="h-12 w-12 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center">
                <Plus className="h-6 w-6 text-orange-600 dark:text-orange-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Completed</p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">{taskStats.completed}</p>
              </div>
              <div className="h-12 w-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                <Check className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add Task Form */}
      <Card>
        <CardHeader>
          <CardTitle>Add New Task</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddTask} className="flex gap-2">
            <Input
              type="text"
              placeholder="Enter a new task..."
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              className="flex-1"
            />
            <Button type="submit" disabled={!newTask.trim()}>
              <Plus className="h-4 w-4 mr-2" />
              Add Task
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Filter Buttons */}
      <div className="flex flex-wrap gap-2">
        <Button variant={filter === "all" ? "primary" : "secondary"} size="sm" onClick={() => setFilter("all")}>
          All ({taskStats.total})
        </Button>
        <Button variant={filter === "active" ? "primary" : "secondary"} size="sm" onClick={() => setFilter("active")}>
          Active ({taskStats.active})
        </Button>
        <Button
          variant={filter === "completed" ? "primary" : "secondary"}
          size="sm"
          onClick={() => setFilter("completed")}
        >
          Completed ({taskStats.completed})
        </Button>
      </div>

      {/* Tasks List */}
      <Card>
        <CardHeader>
          <CardTitle>
            {filter === "all" ? "All Tasks" : filter === "active" ? "Active Tasks" : "Completed Tasks"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredTasks.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400">
                {filter === "all"
                  ? "No tasks yet. Add one above!"
                  : filter === "active"
                  ? "No active tasks!"
                  : "No completed tasks!"}
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredTasks.map((task) => (
                <div
                  key={task.id}
                  className={`flex items-center justify-between p-3 rounded-lg border transition-all duration-200 ${
                    task.completed
                      ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
                      : "bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => toggleTask(task.id)}
                      className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                        task.completed
                          ? "bg-green-500 border-green-500 text-white"
                          : "border-gray-300 dark:border-gray-600 hover:border-green-500"
                      }`}
                    >
                      {task.completed && <Check className="h-3 w-3" />}
                    </button>
                    <span
                      className={`transition-all duration-200 ${
                        task.completed
                          ? "text-gray-500 dark:text-gray-400 line-through"
                          : "text-gray-900 dark:text-white"
                      }`}
                    >
                      {task.text}
                    </span>
                  </div>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => deleteTask(task.id)}
                    className="opacity-70 hover:opacity-100"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

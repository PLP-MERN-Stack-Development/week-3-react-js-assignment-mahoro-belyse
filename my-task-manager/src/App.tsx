import { TaskProvider } from "@/contexts/TaskContext"
import { ThemeProvider } from "@/contexts/ThemeContext"
import Layout from "@/components/Layout"
import TaskManager from "@/components/TaskManager"
import ApiDataDisplay from "@/components/ApiDataDisplay"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function App() {
  return (
    <ThemeProvider>
      <TaskProvider>
        <Layout>
          <div className="container mx-auto px-4 py-8">
            <div className="max-w-6xl mx-auto">
              <header className="text-center mb-12">
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                  React Task Manager & API Explorer
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-300">
                  A comprehensive React application demonstrating modern development practices
                </p>
              </header>

              <Tabs defaultValue="tasks" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-8">
                  <TabsTrigger value="tasks">Task Manager</TabsTrigger>
                  <TabsTrigger value="api">API Explorer</TabsTrigger>
                </TabsList>

                <TabsContent value="tasks" className="space-y-6">
                  <TaskManager />
                </TabsContent>

                <TabsContent value="api" className="space-y-6">
                  <ApiDataDisplay />
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </Layout>
      </TaskProvider>
    </ThemeProvider>
  )
}

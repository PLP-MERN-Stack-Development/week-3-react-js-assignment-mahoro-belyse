"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "./ui/Card"
import Button from "./ui/Button"
import { Input } from "@/components/ui/input"
import { Search, Mail, Phone, Globe, ChevronLeft, ChevronRight, Loader2 } from "lucide-react"
import { UserIcon } from "lucide-react"

interface User {
  id: number
  name: string
  username: string
  email: string
  phone: string
  website: string
  company: {
    name: string
  }
  address: {
    city: string
    zipcode: string
  }
}

interface Post {
  id: number
  title: string
  body: string
  userId: number
}

export default function ApiDataDisplay() {
  const [users, setUsers] = useState<User[]>([])
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [activeTab, setActiveTab] = useState<"users" | "posts">("users")
  const itemsPerPage = 6

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)

      const [usersResponse, postsResponse] = await Promise.all([
        fetch("https://jsonplaceholder.typicode.com/users"),
        fetch("https://jsonplaceholder.typicode.com/posts"),
      ])

      if (!usersResponse.ok || !postsResponse.ok) {
        throw new Error("Failed to fetch data")
      }

      const usersData = await usersResponse.json()
      const postsData = await postsResponse.json()

      setUsers(usersData)
      setPosts(postsData)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.company.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const filteredPosts = posts.filter(
    (post) =>
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.body.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const currentData = activeTab === "users" ? filteredUsers : filteredPosts
  const totalPages = Math.ceil(currentData.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const currentItems = currentData.slice(startIndex, startIndex + itemsPerPage)

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
    setCurrentPage(1)
  }

  const handleTabChange = (tab: "users" | "posts") => {
    setActiveTab(tab)
    setCurrentPage(1)
    setSearchTerm("")
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="p-12">
          <div className="flex flex-col items-center justify-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            <p className="text-gray-600 dark:text-gray-400">Loading data from API...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-12">
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="text-red-500 text-center">
              <p className="text-lg font-semibold">Error loading data</p>
              <p className="text-sm">{error}</p>
            </div>
            <Button onClick={fetchData}>Try Again</Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
        <button
          onClick={() => handleTabChange("users")}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === "users"
              ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
              : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
          }`}
        >
          Users ({users.length})
        </button>
        <button
          onClick={() => handleTabChange("posts")}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === "posts"
              ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
              : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
          }`}
        >
          Posts ({posts.length})
        </button>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder={`Search ${activeTab}...`}
              value={searchTerm}
              onChange={handleSearch}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Data Display */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentItems.length === 0 ? (
          <div className="col-span-full">
            <Card>
              <CardContent className="p-12">
                <div className="text-center text-gray-500 dark:text-gray-400">
                  <p>No {activeTab} found matching your search.</p>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          currentItems.map((item) => (
            <Card key={item.id} className="hover:shadow-lg transition-shadow duration-200">
              {activeTab === "users" ? (
                <UserCard user={item as User} />
              ) : (
                <PostCard post={item as Post} users={users} />
              )}
            </Card>
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center space-x-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <div className="flex space-x-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={currentPage === page ? "primary" : "secondary"}
                size="sm"
                onClick={() => setCurrentPage(page)}
                className="w-8 h-8 p-0"
              >
                {page}
              </Button>
            ))}
          </div>

          <Button
            variant="secondary"
            size="sm"
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  )
}

function UserCard({ user }: { user: User }) {
  return (
    <>
      <CardHeader>
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
            <UserIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <CardTitle className="text-lg">{user.name}</CardTitle>
            <p className="text-sm text-gray-600 dark:text-gray-400">@{user.username}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center space-x-2 text-sm">
            <Mail className="h-4 w-4 text-gray-400" />
            <span className="text-gray-600 dark:text-gray-300">{user.email}</span>
          </div>
          <div className="flex items-center space-x-2 text-sm">
            <Phone className="h-4 w-4 text-gray-400" />
            <span className="text-gray-600 dark:text-gray-300">{user.phone}</span>
          </div>
          <div className="flex items-center space-x-2 text-sm">
            <Globe className="h-4 w-4 text-gray-400" />
            <span className="text-gray-600 dark:text-gray-300">{user.website}</span>
          </div>
          <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm font-medium text-gray-900 dark:text-white">{user.company.name}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {user.address.city}, {user.address.zipcode}
            </p>
          </div>
        </div>
      </CardContent>
    </>
  )
}

function PostCard({ post, users }: { post: Post; users: User[] }) {
  const author = users.find((user) => user.id === post.userId)

  return (
    <>
      <CardHeader>
        <CardTitle className="text-lg line-clamp-2">{post.title}</CardTitle>
        {author && <p className="text-sm text-gray-600 dark:text-gray-400">by {author.name}</p>}
      </CardHeader>
      <CardContent>
        <p className="text-gray-700 dark:text-gray-300 text-sm line-clamp-4">{post.body}</p>
      </CardContent>
    </>
  )
}

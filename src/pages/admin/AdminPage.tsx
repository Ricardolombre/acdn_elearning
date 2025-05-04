"use client"

import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "@/contexts/AuthContext"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Settings2, LogOut, Users, BookOpen, FileText, BarChart3, Home, Menu, X } from "lucide-react"
import AdminCourses from "@/components/admin/AdminCourses"
import AdminResources from "@/components/admin/AdminResources"
import AdminUsers from "@/components/admin/AdminUsers"

const AdminPage = () => {
  const { userData, logout, isAuthenticated, loading } = useAuth()
  const navigate = useNavigate()
  const [isMounted, setIsMounted] = useState(false)
  const [activeTab, setActiveTab] = useState("dashboard")
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (!isAuthenticated && !loading) {
      navigate("/login")
    }
  }, [isAuthenticated, loading, navigate])

  if (!isMounted) {
    return null
  }

  const handleLogout = async () => {
    try {
      await logout()
      navigate("/login")
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error)
    }
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm fixed w-full z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <button className="md:hidden mr-2" onClick={toggleMobileMenu}>
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
            <Link to="/admin" className="text-lg font-semibold text-acdn-blue">
              Administration ACDN
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Avatar>
                <AvatarImage src={userData?.avatar || ""} />
                <AvatarFallback>{userData?.name?.substring(0, 2).toUpperCase() || "AD"}</AvatarFallback>
              </Avatar>
              <div className="hidden md:block">
                <p className="text-sm font-medium">{userData?.name || "Admin"}</p>
                <p className="text-xs text-gray-500">{userData?.role}</p>
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Settings2 className="w-5 h-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Mon compte ({userData?.name || "Admin"})</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/" className="cursor-pointer w-full flex items-center">
                    <Home className="w-4 h-4 mr-2" />
                    Retour au site
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/profil" className="cursor-pointer w-full flex items-center">
                    <Users className="w-4 h-4 mr-2" />
                    Mon profil
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="cursor-pointer text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Déconnexion
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-20 bg-black bg-opacity-50" onClick={toggleMobileMenu}>
          <div className="bg-white w-64 h-full pt-20 px-4" onClick={(e) => e.stopPropagation()}>
            <nav className="space-y-2">
              <Button
                variant={activeTab === "dashboard" ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => {
                  setActiveTab("dashboard")
                  setIsMobileMenuOpen(false)
                }}
              >
                <BarChart3 className="mr-2 h-5 w-5" />
                Tableau de bord
              </Button>
              <Button
                variant={activeTab === "courses" ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => {
                  setActiveTab("courses")
                  setIsMobileMenuOpen(false)
                }}
              >
                <BookOpen className="mr-2 h-5 w-5" />
                Cours
              </Button>
              <Button
                variant={activeTab === "resources" ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => {
                  setActiveTab("resources")
                  setIsMobileMenuOpen(false)
                }}
              >
                <FileText className="mr-2 h-5 w-5" />
                Ressources
              </Button>
              <Button
                variant={activeTab === "users" ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => {
                  setActiveTab("users")
                  setIsMobileMenuOpen(false)
                }}
              >
                <Users className="mr-2 h-5 w-5" />
                Utilisateurs
              </Button>
            </nav>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-grow pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Desktop Sidebar */}
            <div className="hidden md:block w-64 shrink-0">
              <Card>
                <CardContent className="p-4">
                  <nav className="space-y-2">
                    <Button
                      variant={activeTab === "dashboard" ? "default" : "ghost"}
                      className="w-full justify-start"
                      onClick={() => setActiveTab("dashboard")}
                    >
                      <BarChart3 className="mr-2 h-5 w-5" />
                      Tableau de bord
                    </Button>
                    <Button
                      variant={activeTab === "courses" ? "default" : "ghost"}
                      className="w-full justify-start"
                      onClick={() => setActiveTab("courses")}
                    >
                      <BookOpen className="mr-2 h-5 w-5" />
                      Cours
                    </Button>
                    <Button
                      variant={activeTab === "resources" ? "default" : "ghost"}
                      className="w-full justify-start"
                      onClick={() => setActiveTab("resources")}
                    >
                      <FileText className="mr-2 h-5 w-5" />
                      Ressources
                    </Button>
                    <Button
                      variant={activeTab === "users" ? "default" : "ghost"}
                      className="w-full justify-start"
                      onClick={() => setActiveTab("users")}
                    >
                      <Users className="mr-2 h-5 w-5" />
                      Utilisateurs
                    </Button>
                  </nav>
                </CardContent>
              </Card>
            </div>

            {/* Content Area */}
            <div className="flex-1">
              {activeTab === "dashboard" && (
                <div className="space-y-6">
                  <h1 className="text-2xl font-semibold text-gray-900">Tableau de bord</h1>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg flex items-center">
                          <Users className="mr-2 h-5 w-5 text-acdn-blue" />
                          Utilisateurs
                        </CardTitle>
                        <CardDescription>Total des utilisateurs inscrits</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-3xl font-bold">124</p>
                        <p className="text-sm text-green-600">+12% ce mois</p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg flex items-center">
                          <BookOpen className="mr-2 h-5 w-5 text-acdn-green" />
                          Cours
                        </CardTitle>
                        <CardDescription>Cours disponibles</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-3xl font-bold">8</p>
                        <p className="text-sm text-gray-500">2 en préparation</p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg flex items-center">
                          <FileText className="mr-2 h-5 w-5 text-acdn-blue" />
                          Ressources
                        </CardTitle>
                        <CardDescription>Documents disponibles</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-3xl font-bold">32</p>
                        <p className="text-sm text-green-600">+5 cette semaine</p>
                      </CardContent>
                    </Card>
                  </div>

                  <Card>
                    <CardHeader>
                      <CardTitle>Activité récente</CardTitle>
                      <CardDescription>Les dernières actions sur la plateforme</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-start gap-4 border-b pb-4">
                          <div className="bg-blue-100 p-2 rounded-full">
                            <Users className="h-4 w-4 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-medium">Nouvel utilisateur inscrit</p>
                            <p className="text-sm text-gray-500">Marie Ndongo s'est inscrite il y a 2 heures</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-4 border-b pb-4">
                          <div className="bg-green-100 p-2 rounded-full">
                            <BookOpen className="h-4 w-4 text-green-600" />
                          </div>
                          <div>
                            <p className="font-medium">Nouveau cours publié</p>
                            <p className="text-sm text-gray-500">Le cours "Protection des données" a été publié hier</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-4">
                          <div className="bg-purple-100 p-2 rounded-full">
                            <FileText className="h-4 w-4 text-purple-600" />
                          </div>
                          <div>
                            <p className="font-medium">Nouvelle ressource ajoutée</p>
                            <p className="text-sm text-gray-500">Guide sur la cybersécurité ajouté il y a 3 jours</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {activeTab === "courses" && <AdminCourses />}
              {activeTab === "resources" && <AdminResources />}
              {activeTab === "users" && <AdminUsers />}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default AdminPage

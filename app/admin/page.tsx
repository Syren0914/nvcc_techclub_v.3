"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Users,
  Calendar,
  Code,
  BookOpen,
  Settings,
  Plus,
  Edit,
  Trash2,
  Eye,
  Shield,
  Database,
  Activity,
  BarChart3,
  UserPlus,
  FileText,
  Globe,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import AdminEventManager from "@/components/admin/admin-event-manager";
import AdminProjectManager from "@/components/admin/admin-project-manager";
import AdminResourceManager from "@/components/admin/admin-resource-manager";
import { ProjectMembersManager } from "@/components/admin/project-members-manager";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface AdminDashboardData {
  totalUsers: number;
  totalEvents: number;
  totalProjects: number;
  totalResources: number;
  totalTeamMembers: number;
  recentActivity: any[];
  databaseStatus: any;
}

interface AdminDashboardPageState {
  data: AdminDashboardData | null;
  loading: boolean;
  error: string | null;
  activeTab: string;
  userRole: string | null;
  isAdminUser: boolean;
}

export default function AdminDashboardPage() {
  const [data, setData] = useState<AdminDashboardData | null>(null);
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState("overview");
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isAdminUser, setIsAdminUser] = useState(false);

  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    checkAdminAccess();
    loadAdminData();
  }, []);

  const checkAdminAccess = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }

      // Check if user is admin by trying to access admin data
      const response = await fetch("/api/admin/applications", {
        headers: {
          Authorization: `Bearer ${
            (await supabase.auth.getSession()).data.session?.access_token
          }`,
        },
      });

      if (response.status === 403) {
        toast({
          title: "Access Denied",
          description: "You don't have admin privileges to access this page.",
          variant: "destructive",
        });
        router.push("/dashboard");
        return;
      }

      setIsAdminUser(true);
      setUserRole("admin");
    } catch (error) {
      console.error("Error checking admin access:", error);
      router.push("/login");
    }
  };

  const loadAdminData = async () => {
    try {
      setError(null);
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.access_token) {
        setError("Authentication required");
        setLoading(false);
        return;
      }

      const response = await fetch("/api/admin/dashboard", {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success && result.data) {
          setData(result.data);
        } else {
          setError("Failed to load dashboard data");
        }
      } else {
        setError("Failed to load dashboard data");
      }
    } catch (error) {
      console.error("Error loading admin data:", error);
      setError("Error loading dashboard data");
    } finally {
      setLoading(false);
    }
  };
  const loadUsers = async () => {
    try {
      const { data, error } = await supabase
        .from("membership_applications") // Adjust the table name as needed
        .select("*"); // Select all columns or specific columns like ['id', 'email', 'role']
      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error("Error loading users:", error);
      toast({
        title: "Error",
        description: "Failed to load users data.",
        variant: "destructive",
      });
    }
  };
  useEffect(() => {
    loadUsers(); // Load users when the component is mounted
  }, []);
  const deleteUser = async (userId: string) => {
    try {
      // Deleting the user from the membership_applications table
      const { data, error } = await supabase
        .from('membership_applications') // Correct table name
        .delete()
        .eq('id', userId); // Ensure 'id' is the correct column to delete by
  
      if (error) throw error;
  
      // Remove the deleted user from the UI
      setUsers(users.filter(user => user.id !== userId));
  
      toast({
        title: "Success",
        description: "User has been deleted from membership applications.",
        variant: "default",
      });
    } catch (error: any) {
      console.error("Error deleting user:", error.message || error);
      toast({
        title: "Error",
        description: `Failed to delete user: ${error.message || error}`,
        variant: "destructive",
      });
    }
  };
  
  
  

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  if (!isAdminUser) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Shield className="size-12 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Access Denied</h2>
          <p className="text-muted-foreground">
            You don't have admin privileges.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Admin Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <div className="size-8 rounded-lg bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center text-white">
              <Shield className="size-4" />
            </div>
            <div>
              <span className="font-bold text-lg">Admin Dashboard</span>
              <p className="text-xs text-muted-foreground">
                Role: {userRole} • Manage all data
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Badge variant="destructive" className="text-xs">
              Admin Mode
            </Badge>
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push("/admin/applications")}
            >
              Member Applications
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push("/admin/announcements")}
            >
              Annoucements  
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push("/admin/setup-test-data")}
            >
              Setup Test Data
            </Button>
            <Button variant="outline" size="sm" onClick={loadAdminData}>
              Refresh Data
            </Button>
          </div>
        </div>
      </header>

      <div className="container px-4 py-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Quick Stats */}
          {data && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold">{data.totalUsers}</p>
                      <p className="text-sm text-muted-foreground">
                        Total Users
                      </p>
                    </div>
                    <Users className="size-8 text-primary/20" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold">{data.totalEvents}</p>
                      <p className="text-sm text-muted-foreground">Events</p>
                    </div>
                    <Calendar className="size-8 text-primary/20" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold">{data.totalProjects}</p>
                      <p className="text-sm text-muted-foreground">Projects</p>
                    </div>
                    <Code className="size-8 text-primary/20" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold">
                        {data.totalResources}
                      </p>
                      <p className="text-sm text-muted-foreground">Resources</p>
                    </div>
                    <BookOpen className="size-8 text-primary/20" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold">
                        {data.totalTeamMembers}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Team Members
                      </p>
                    </div>
                    <UserPlus className="size-8 text-primary/20" />
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Error Display */}
          {error && (
            <Alert className="border-red-200 bg-red-50">
              <Database className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">
                {error}
              </AlertDescription>
            </Alert>
          )}

          {/* Database Status */}
          {data?.databaseStatus && data.databaseStatus.status !== "healthy" && (
            <Alert className="border-orange-200 bg-orange-50">
              <Database className="h-4 w-4 text-orange-600" />
              <AlertDescription className="text-orange-800">
                Database connection has issues. Some admin features may not work
                properly.
              </AlertDescription>
            </Alert>
          )}

          {/* Admin Tabs */}
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="space-y-4"
          >
            <TabsList className="grid w-full grid-cols-7">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="users">Users</TabsTrigger>
              <TabsTrigger value="events">Events</TabsTrigger>
              <TabsTrigger value="projects">Projects</TabsTrigger>
              <TabsTrigger value="members">Members</TabsTrigger>
              <TabsTrigger value="resources">Resources</TabsTrigger>
              <TabsTrigger value="team">Team</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Activity className="size-5" />
                      Recent Activity
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {data?.recentActivity?.map((activity, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 p-3 border rounded-lg"
                      >
                        <div className="flex-1">
                          <p className="text-sm font-medium">
                            {activity.action}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {activity.time}
                          </p>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {activity.type}
                        </Badge>
                      </div>
                    ))}
                    {(!data?.recentActivity ||
                      data.recentActivity.length === 0) && (
                      <p className="text-sm text-muted-foreground text-center py-4">
                        No recent activity
                      </p>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="size-5" />
                      Quick Actions
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button
                      className="w-full justify-start"
                      onClick={() => setActiveTab("events")}
                    >
                      <Plus className="size-4 mr-2" />
                      Add New Event
                    </Button>
                    <Button
                      className="w-full justify-start"
                      onClick={() => setActiveTab("projects")}
                    >
                      <Plus className="size-4 mr-2" />
                      Add New Project
                    </Button>
                    <Button
                      className="w-full justify-start"
                      onClick={() => setActiveTab("resources")}
                    >
                      <Plus className="size-4 mr-2" />
                      Add New Resource
                    </Button>
                    <Button
                      className="w-full justify-start"
                      onClick={() => setActiveTab("members")}
                    >
                      <Users className="size-4 mr-2" />
                      View Project Members
                    </Button>
                    <Button
                      className="w-full justify-start"
                      onClick={() => setActiveTab("team")}
                    >
                      <Plus className="size-4 mr-2" />
                      Add Team Member
                    </Button>
                    <Button
                      className="w-full justify-start"
                      onClick={() => router.push("/admin/setup-test-data")}
                    >
                      <Database className="size-4 mr-2" />
                      Setup Test Data
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Users Tab */}
            <TabsContent value="users" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>User Management</CardTitle>
                  <CardDescription>
                    Manage user accounts and permissions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <TabsContent value="users" className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>User Management</CardTitle>
                        <CardDescription>
                          Manage user accounts and permissions
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        {users.length > 0 ? (
                          <div className="space-y-4">
                            {users.map((user) => (
                              <div
                                key={user.id}
                                className="flex items-center justify-between p-3 border rounded-lg"
                              >
                                <div>
                                  <p className="font-medium">{user.email}</p>
                                  <p className="text-xs text-muted-foreground">
                                    {user.role}
                                  </p>{" "}
                                  {/* Customize as needed */}
                                </div>
                                <div className="flex gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    setSelectedUser(user);
                                    setIsModalOpen(true);
                                  }}
                                >
                                  <Eye className="size-4 mr-2" />
                                  View
                                </Button>
                                <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                                  <DialogContent className="max-w-lg">
                                    <DialogHeader>
                                      <DialogTitle>User Details</DialogTitle>
                                      <DialogDescription>Basic information about this user</DialogDescription>
                                    </DialogHeader>
                                    {selectedUser && (
                                      <div className="space-y-3">
                                        
                                          <div className="grid grid-cols-3 gap-2 text-sm">
                                            <span className="text-muted-foreground">Full Name</span>
                                            <span className="col-span-2">{selectedUser.first_name} {selectedUser.last_name}</span>
                                          </div>
                                       
                                        <div className="grid grid-cols-3 gap-2 text-sm">
                                          <span className="text-muted-foreground">Email</span>
                                          <span className="col-span-2 break-all">{selectedUser.email || '-'}</span>
                                        </div>
                                        <div className="grid grid-cols-3 gap-2 text-sm">
                                          <span className="text-muted-foreground">Role</span>
                                          <span className="col-span-2 capitalize">{selectedUser.role || 'member'}</span>
                                        </div>
                                        <div className="grid grid-cols-3 gap-2 text-sm">
                                          <span className="text-muted-foreground">Created</span>
                                          <span className="col-span-2">{selectedUser.created_at ? new Date(selectedUser.created_at).toLocaleString() : '-'}</span>
                                        </div>
                                        {selectedUser.name && (
                                          <div className="grid grid-cols-3 gap-2 text-sm">
                                            <span className="text-muted-foreground">Name</span>
                                            <span className="col-span-2">{selectedUser.name}</span>
                                          </div>
                                        )}
                                        {selectedUser.phone && (
                                          <div className="grid grid-cols-3 gap-2 text-sm">
                                            <span className="text-muted-foreground">Phone</span>
                                            <span className="col-span-2">{selectedUser.phone}</span>
                                          </div>
                                        )}
                                        
                                          <div className="grid grid-cols-3 gap-2 text-sm">
                                            <span className="text-muted-foreground">Github</span>
                                            <span className="col-span-2">{selectedUser.github_username}</span>
                                          </div>
                                          <div className="grid grid-cols-3 gap-2 text-sm">
                                            <span className="text-muted-foreground">LinkedIn</span>
                                            <span className="col-span-2">{selectedUser.linkedin_url}</span>
                                          </div>
                                        
                                        
                                          <div className="grid grid-cols-3 gap-2 text-sm">
                                            <span className="text-muted-foreground">Interests</span>
                                            <span className="col-span-2">{selectedUser.areas_of_interest}</span>
                                          </div>
                                        
                                        <div className="pt-2 flex justify-end">
                                          <Button
                                            variant="outline"
                                            onClick={() => {
                                              setIsModalOpen(false)
                                              setSelectedUser(null)
                                            }}
                                          >
                                            Close
                                          </Button>
                                        </div>
                                      </div>
                                    )}
                                  </DialogContent>
                                </Dialog>


                                  <Button variant="outline" size="sm">
                                    <Edit className="size-4 mr-2" />
                                    Edit
                                  </Button>
                                  <Button variant="destructive" size="sm" onClick={() => deleteUser(user.id)}>
                                    <Trash2 className="size-4 mr-2" />
                                    Delete
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-muted-foreground text-center">
                            No users available
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Events Tab */}
            <TabsContent value="events" className="space-y-6">
              <AdminEventManager />
            </TabsContent>

            {/* Projects Tab */}
            <TabsContent value="projects" className="space-y-6">
              <AdminProjectManager />
            </TabsContent>

            {/* Project Members Tab */}
            <TabsContent value="members" className="space-y-6">
              <ProjectMembersManager />
            </TabsContent>

            {/* Resources Tab */}
            <TabsContent value="resources" className="space-y-6">
              <AdminResourceManager />
            </TabsContent>

            {/* Team Tab */}
            <TabsContent value="team" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Team Management</CardTitle>
                  <CardDescription>
                    Manage team members and roles
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Team management features coming soon...
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
}

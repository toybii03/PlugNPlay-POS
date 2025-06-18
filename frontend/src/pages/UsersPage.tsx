import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, Plus, Edit, Trash2, Users, Shield } from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import UserService, { User } from "@/services/UserService";
import UserForm from "@/components/UserForm";

const UsersPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState("All");
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [showUserForm, setShowUserForm] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const data = await UserService.getUsers();
        setUsers(data);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const roles = ["All", "admin", "manager", "cashier"];

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.username.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === "All" || user.role === selectedRole;
    return matchesSearch && matchesRole;
  });

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      case "manager":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "cashier":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200";
    }
  };

  const getStatusBadgeColor = (status?: string) => {
    return status === "active"
      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200";
  };

  const handleEdit = (userId: number) => {
    const userToEdit = users.find((user) => user.id === userId) || null;
    setEditingUser(userToEdit);
    setShowUserForm(true);
  };

  const handleDeleteClick = (user: User) => {
    setUserToDelete(user);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!userToDelete) return;
    try {
      await UserService.deleteUser(userToDelete.id);
      setUsers((prevUsers) =>
        prevUsers.filter((user) => user.id !== userToDelete.id)
      );
      setSuccessMessage("User deleted successfully.");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      console.error("Failed to delete user:", error);
    } finally {
      setShowDeleteModal(false);
      setUserToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setUserToDelete(null);
  };

  const handleAddUserClick = () => {
    setEditingUser(null);
    setShowUserForm(true);
  };

  const handleUserFormSubmit = async (data: any) => {
    try {
      if (editingUser) {
        await UserService.updateUser(editingUser.id, data);
        setSuccessMessage("User updated successfully.");
      } else {
        await UserService.createUser(data);
        setSuccessMessage("User added successfully.");
      }
      setShowUserForm(false);
      setEditingUser(null);
      const updatedUsers = await UserService.getUsers();
      setUsers(updatedUsers);
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      console.error("Failed to save user:", error);
    }
  };

  const handleUserFormCancel = () => {
    setShowUserForm(false);
    setEditingUser(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Users
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage system users and their roles
          </p>
          {successMessage && (
            <div className="mt-2 p-2 bg-green-100 text-green-800 rounded">
              {successMessage}
            </div>
          )}
        </div>
        <Button onClick={handleAddUserClick}>
          <Plus className="mr-2 h-4 w-4" />
          Add User
        </Button>
      </div>

      {/* User Form Modal & Delete Confirmation Modal */}
      {(showUserForm || showDeleteModal) && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 px-4">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-lg">
            {showUserForm && (
              <>
                <UserForm
                  user={editingUser || undefined}
                  onSubmit={handleUserFormSubmit}
                  onCancel={handleUserFormCancel}
                />
              </>
            )}

            {showDeleteModal && (
              <>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Confirm Deletion
                </h2>
                <p className="text-gray-700 dark:text-gray-300 mb-6">
                  Are you sure you want to delete{" "}
                  <strong>{userToDelete?.name}</strong>? This action cannot be undone.
                </p>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={handleCancelDelete}>
                    Cancel
                  </Button>
                  <Button variant="destructive" onClick={handleConfirmDelete}>
                    Delete
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.length}</div>
            <p className="text-xs text-muted-foreground">Across all roles</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {users.filter((user) => user.status === "active").length}
            </div>
            <p className="text-xs text-muted-foreground">Currently active</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Admins</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {users.filter((user) => user.role === "admin").length}
            </div>
            <p className="text-xs text-muted-foreground">
              Administrator accounts
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search users by name, email, or username..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {roles.map((role) => (
                <Button
                  key={role}
                  variant={selectedRole === role ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedRole(role)}
                >
                  {role}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Username</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge className={getRoleBadgeColor(user.role)}>
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusBadgeColor(user.status)}>
                      {user.status || "unknown"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(user.id)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteClick(user)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default UsersPage;

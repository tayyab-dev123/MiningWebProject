"use client"
import React, { useState } from 'react';
import { 
  Trash2, 
  Search, 
  UserCircle2, 
  ShieldCheck, 
  Calendar 
} from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle, 
  AlertDialogTrigger 
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner'; // Assuming you're using sonner for notifications
import { useUsers } from '@/hooks/Userdetail';

// Import the updated hook

const AdminUsersPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { 
    users, 
    deleteUser, 
    isLoading, 
    error 
  } = useUsers();

  // Safe filtering with optional chaining
  const filteredUsers = users?.filter(user => 
    (user.name || '').toLowerCase().includes((searchTerm || '').toLowerCase()) ||
    (user.email || '').toLowerCase().includes((searchTerm || '').toLowerCase())
  ) || [];

  // Format date with fallback
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return 'Invalid Date';
    }
  };

  // Handle user deletion with toast notification
  const handleDeleteUser = async (userId: string) => {
    const success = await deleteUser(userId);
    if (success) {
      toast.success('User deleted successfully');
    } else {
      toast.error('Failed to delete user');
    }
  };

  return (
    <div className="min-h-screen bg-black text-gray-100 p-6">
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center space-x-4 text-2xl font-bold text-gray-100">
            <span>User Management</span>
          </CardTitle>
        </CardHeader>
        
        <CardContent>
          {/* Error Handling */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-lg mb-4">
              {error}
            </div>
          )}

          {/* Search Input */}
          <div className="mb-4 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input 
              placeholder="Search users by name or email"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-gray-700 border-gray-600 text-gray-100 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Users Table */}
          <Table>
            <TableHeader>
              <TableRow className="bg-black hover:bg-gray-700">
                <TableHead className="text-white font-medium ">Name</TableHead>
                <TableHead className="text-white font-medium">Email</TableHead>
                <TableHead className="text-white font-medium">Role</TableHead>
                <TableHead className="text-white font-medium">Created At</TableHead>
                <TableHead className="text-white font-medium text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-gray-400">
                    Loading users...
                  </TableCell>
                </TableRow>
              ) : filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-gray-400">
                    No users found
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map((user) => (
                  <TableRow 
                    key={user._id || user.id} 
                    className="bg-gray-700 hover:bg-gray-700 transition-colors text-[#ffffff]"
                  >
                    <TableCell className="font-medium">
                      {user.firstName || 'N/A'}
                    </TableCell>
                    <TableCell>{user.email || 'N/A'}</TableCell>
                    <TableCell>
                      <span className={`
                        px-2 py-1 rounded-full text-xs font-semibold
                        ${user.role === 'admin' 
                          ? 'bg-blue-500/20 text-[#22c55e]' 
                          : 'bg-green-500/20 text-green-400'
                        }
                      `}>
                        {user.role || 'N/A'}
                      </span>
                    </TableCell>
                    <TableCell className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                      {formatDate(user.createdAt)}
                    </TableCell>
                    <TableCell className="text-right">
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button 
                            variant="destructive" 
                            size="sm" 
                            className="bg-red-500/20 text-red-400 hover:bg-red-500/30"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="bg-gray-800 border-gray-700">
                          <AlertDialogHeader>
                            <AlertDialogTitle className="text-gray-100">
                              Are you absolutely sure?
                            </AlertDialogTitle>
                            <AlertDialogDescription className="text-gray-400">
                              This action cannot be undone. This will permanently 
                              delete the user account.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel className="bg-gray-700 text-gray-300 hover:bg-gray-600">
                              Cancel
                            </AlertDialogCancel>
                            <AlertDialogAction 
                              onClick={() => handleDeleteUser(user._id || user.id || '')}
                              className="bg-red-500 text-white hover:bg-red-600"
                            >
                              Delete User
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminUsersPage;
"use client";

import { useState } from 'react';
import { useGetAllMiningMachinesQuery, useDeleteMiningMachineMutation } from "@/lib/feature/Machines/miningMachinesApiSlice";
import { Pencil, Trash2, Eye, Search, ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from 'react-toastify';
import Link from 'next/link';

interface MiningMachine {
  _id: string;
  machineName: string;
  hashrate: string;
  powerConsumption: string;
  priceRange: string;
  coinsMined: string;
  monthlyProfit: string;
  images: string[];
  createdAt: string;
}

// Delete Confirmation Modal Component
interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  isLoading?: boolean;
}

const DeleteConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  isLoading = false
}: DeleteConfirmationModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-800 text-white border border-gray-700">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription className="text-gray-400">
            {description}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Deleting...' : 'Delete'}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// Main AdminProductTable Component
const AdminProductTable = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [machineToDelete, setMachineToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const itemsPerPage = 5;

  const { data: machines = [], isLoading, isError } = useGetAllMiningMachinesQuery();
  const [deleteMiningMachine] = useDeleteMiningMachineMutation();

  // Filter machines based on search term
  const filteredMachines = machines?.data?.filter((machine: MiningMachine) =>
    machine.machineName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    machine.coinsMined.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  // Calculate pagination
  const totalPages = Math.ceil(filteredMachines.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentMachines = filteredMachines.slice(startIndex, endIndex);

  // Delete functionality
  const handleDeleteClick = (id: string) => {
    setMachineToDelete(id);
    setDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!machineToDelete) return;
    
    setIsDeleting(true);
    try {
      await deleteMiningMachine(machineToDelete).unwrap();
      toast.success('Machine deleted successfully');
    } catch (error) {
      toast.error('Failed to delete machine');
      console.error('Delete error:', error);
    } finally {
      setIsDeleting(false);
      setDeleteModalOpen(false);
      setMachineToDelete(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-900">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-green-500"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="bg-red-500/10 text-red-500 p-4 rounded-lg">
          Error loading mining machines. Please try again later.
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <h1 className="text-2xl md:text-3xl font-bold text-white">
            Mining Machines Management
          </h1>
          <Link 
            href="/admin/add-product" 
            className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg transition-colors"
          >
            <Plus className="h-5 w-5" />
            Add New Machine
          </Link>
        </div>

        {/* Search and Stats */}
        <div className="grid md:grid-cols-2 gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search by machine name or coins..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
            />
            <Search className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
          </div>
          <div className="flex justify-end items-center text-gray-400">
            Total Machines: {filteredMachines.length}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto bg-gray-800 rounded-lg shadow-xl border border-gray-700">
          <table className="min-w-full divide-y divide-gray-700">
            <thead>
              <tr className="bg-gray-750">
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Image</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Machine Name</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Hashrate</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Price Range</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Coins Mined</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {currentMachines.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-400">
                    No mining machines found
                  </td>
                </tr>
              ) : (
                currentMachines.map((machine: MiningMachine) => (
                  <tr key={machine._id} className="hover:bg-gray-750/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <img 
                        src={machine.images[0] || '/placeholder.png'} 
                        alt={machine.machineName}
                        className="h-14 w-14 rounded-lg object-cover border border-gray-600"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-white font-medium">{machine.machineName}</div>
                      <div className="text-gray-400 text-sm">ID: {machine._id.slice(-6)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-white">{machine.hashrate}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-green-400">${machine.priceRange}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-wrap gap-2">
                        {machine.coinsMined.split(',').map((coin, index) => (
                          <span key={index} className="px-2 py-1 bg-gray-700 text-gray-300 rounded-full text-xs">
                            {coin.trim()}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex gap-3">
                        <Link
                          href={`/admin/view-product/${machine._id}`}
                          className="p-2 bg-blue-500/10 text-blue-400 rounded-lg hover:bg-blue-500/20 transition-colors"
                        >
                          <Eye className="h-5 w-5" />
                        </Link>
                        <Link
                          href={`/admin/edit-product/${machine._id}`}
                          className="p-2 bg-yellow-500/10 text-yellow-400 rounded-lg hover:bg-yellow-500/20 transition-colors"
                        >
                          <Pencil className="h-5 w-5" />
                        </Link>
                        <button
                          onClick={() => handleDeleteClick(machine._id)}
                          className="p-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition-colors"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {filteredMachines.length > 0 && (
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
            <div className="text-gray-400">
              Showing {startIndex + 1} to {Math.min(endIndex, filteredMachines.length)} of {filteredMachines.length} entries
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg bg-gray-800 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700 transition-colors"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    currentPage === page 
                      ? 'bg-green-500 text-white' 
                      : 'bg-gray-800 text-white hover:bg-gray-700'
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg bg-gray-800 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700 transition-colors"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        <DeleteConfirmationModal
          isOpen={deleteModalOpen}
          onClose={() => setDeleteModalOpen(false)}
          onConfirm={handleDelete}
          title="Delete Mining Machine"
          description="Are you sure you want to delete this mining machine? This action cannot be undone."
          isLoading={isDeleting}
        />
      </div>
    </div>
  );
};

export default AdminProductTable;
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Search, Plus, Edit, Trash2, Users, Star } from "lucide-react";
import api from "@/services/api";
import CustomerForm from "@/components/CustomerForm";

const CustomersPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTier, setSelectedTier] = useState("All");
  const [customers, setCustomers] = useState<any[]>([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState<any>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<any>(null);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await api.get("/customers");
        setCustomers(response.data.data || []);
      } catch (error) {
        console.error("Failed to fetch customers:", error);
      }
    };
    fetchCustomers();
  }, []);

  const tiers = ["All", "Bronze", "Silver", "Gold", "Platinum"];

  const filteredCustomers = customers.filter((customer) => {
    const matchesSearch =
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone.includes(searchTerm);
    const matchesTier =
      selectedTier === "All" || customer.tier === selectedTier;
    return matchesSearch && matchesTier;
  });

  const getTierColor = (tier: string) => {
    switch (tier) {
      case "Bronze":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200";
      case "Silver":
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200";
      case "Gold":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "Platinum":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200";
    }
  };

  const handleEdit = (customerId: string) => {
    const customer = customers.find((c) => c.id === customerId);
    setEditingCustomer(customer || null);
    setShowEditModal(true);
  };

  const handleDeleteClick = (customer: any) => {
    setCustomerToDelete(customer);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!customerToDelete) return;
    try {
      await api.delete(`/customers/${customerToDelete.id}`);
      setCustomers((prev) => prev.filter((c) => c.id !== customerToDelete.id));
      setShowDeleteModal(false);
      setCustomerToDelete(null);
    } catch (error) {
      console.error("Failed to delete customer:", error);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setCustomerToDelete(null);
  };

  const handleUpdateCustomer = async (data: { phone: string }) => {
    if (!editingCustomer) return;
    try {
      await api.put(`/customers/${editingCustomer.id}`, data);
      setCustomers((prev) =>
        prev.map((c) =>
          c.id === editingCustomer.id ? { ...c, phone: data.phone } : c
        )
      );
      setShowEditModal(false);
      setEditingCustomer(null);
    } catch (error) {
      console.error("Failed to update customer:", error);
    }
  };

  const handleCancelEdit = () => {
    setShowEditModal(false);
    setEditingCustomer(null);
  };

  return (
    <div
      className="space-y-6"
      data-id="b136nz4ey"
      data-path="src/pages/CustomersPage.tsx"
    >
      {/* Header */}
      <div
        className="flex justify-between items-center"
        data-id="mx24hhsuu"
        data-path="src/pages/CustomersPage.tsx"
      >
        <div data-id="r3hd4hnv3" data-path="src/pages/CustomersPage.tsx">
          <h1
            className="text-3xl font-bold text-gray-900 dark:text-white"
            data-id="m8x1is02t"
            data-path="src/pages/CustomersPage.tsx"
          >
            Customers
          </h1>
          <p
            className="text-gray-600 dark:text-gray-400"
            data-id="asond5z49"
            data-path="src/pages/CustomersPage.tsx"
          >
            Manage your customer database
          </p>
        </div>
        <Button data-id="pd7aqfw5p" data-path="src/pages/CustomersPage.tsx">
          <Plus
            className="mr-2 h-4 w-4"
            data-id="rwcmjbz3k"
            data-path="src/pages/CustomersPage.tsx"
          />
          Add Customer
        </Button>
      </div>

      {/* Stats Cards */}
      <div
        className="grid grid-cols-1 md:grid-cols-4 gap-4"
        data-id="atxhmdaoj"
        data-path="src/pages/CustomersPage.tsx"
      >
        <Card data-id="wy12budcw" data-path="src/pages/CustomersPage.tsx">
          <CardHeader
            className="flex flex-row items-center justify-between space-y-0 pb-2"
            data-id="wgyp5q0o7"
            data-path="src/pages/CustomersPage.tsx"
          >
            <CardTitle
              className="text-sm font-medium"
              data-id="bx9b4mkho"
              data-path="src/pages/CustomersPage.tsx"
            >
              Total Customers
            </CardTitle>
            <Users
              className="h-4 w-4 text-muted-foreground"
              data-id="0olxijc69"
              data-path="src/pages/CustomersPage.tsx"
            />
          </CardHeader>
          <CardContent
            data-id="r2nke5oyh"
            data-path="src/pages/CustomersPage.tsx"
          >
            <div
              className="text-2xl font-bold"
              data-id="btxhb1pgi"
              data-path="src/pages/CustomersPage.tsx"
            >
              {customers.length}
            </div>
            <p
              className="text-xs text-muted-foreground"
              data-id="ly5negikr"
              data-path="src/pages/CustomersPage.tsx"
            >
              +12% from last month
            </p>
          </CardContent>
        </Card>
        <Card data-id="5in85h261" data-path="src/pages/CustomersPage.tsx">
          <CardHeader
            className="flex flex-row items-center justify-between space-y-0 pb-2"
            data-id="j1px6lywr"
            data-path="src/pages/CustomersPage.tsx"
          >
            <CardTitle
              className="text-sm font-medium"
              data-id="rwfzaxys8"
              data-path="src/pages/CustomersPage.tsx"
            >
              Average Spent
            </CardTitle>
            <Users
              className="h-4 w-4 text-muted-foreground"
              data-id="3vsw0v378"
              data-path="src/pages/CustomersPage.tsx"
            />
          </CardHeader>
          <CardContent
            data-id="mezfn6g8l"
            data-path="src/pages/CustomersPage.tsx"
          >
            <div
              className="text-2xl font-bold"
              data-id="qmyj6l3rn"
              data-path="src/pages/CustomersPage.tsx"
            >
              ₱
              {customers
                .reduce((sum, c) => sum + (Number(c.totalSpent) || 0), 0)
                .toFixed(2)}
            </div>
            <p
              className="text-xs text-muted-foreground"
              data-id="qgfkpyymp"
              data-path="src/pages/CustomersPage.tsx"
            >
              +8% from last month
            </p>
          </CardContent>
        </Card>
        <Card data-id="522kkdnv8" data-path="src/pages/CustomersPage.tsx">
          <CardHeader
            className="flex flex-row items-center justify-between space-y-0 pb-2"
            data-id="mhf9rb0io"
            data-path="src/pages/CustomersPage.tsx"
          >
            <CardTitle
              className="text-sm font-medium"
              data-id="8i7jp1k22"
              data-path="src/pages/CustomersPage.tsx"
            >
              Loyalty Members
            </CardTitle>
            <Star
              className="h-4 w-4 text-muted-foreground"
              data-id="77zfjf2fh"
              data-path="src/pages/CustomersPage.tsx"
            />
          </CardHeader>
          <CardContent
            data-id="zkpfu37lp"
            data-path="src/pages/CustomersPage.tsx"
          >
            <div
              className="text-2xl font-bold"
              data-id="z0t7lu4ce"
              data-path="src/pages/CustomersPage.tsx"
            >
              {customers.filter((c) => c.loyaltyPoints > 0).length}
            </div>
            <p
              className="text-xs text-muted-foreground"
              data-id="qlthm62lw"
              data-path="src/pages/CustomersPage.tsx"
            >
              {Math.round(
                (customers.filter((c) => c.loyaltyPoints > 0).length /
                  customers.length) *
                  100
              )}
              % of customers
            </p>
          </CardContent>
        </Card>
        <Card data-id="k3ummqnld" data-path="src/pages/CustomersPage.tsx">
          <CardHeader
            className="flex flex-row items-center justify-between space-y-0 pb-2"
            data-id="cjotxiyku"
            data-path="src/pages/CustomersPage.tsx"
          >
            <CardTitle
              className="text-sm font-medium"
              data-id="su64jkq56"
              data-path="src/pages/CustomersPage.tsx"
            >
              Premium Customers
            </CardTitle>
            <Star
              className="h-4 w-4 text-muted-foreground"
              data-id="zcaw8xfm7"
              data-path="src/pages/CustomersPage.tsx"
            />
          </CardHeader>
          <CardContent
            data-id="ry7y7jh2d"
            data-path="src/pages/CustomersPage.tsx"
          >
            <div
              className="text-2xl font-bold"
              data-id="p4mrmztac"
              data-path="src/pages/CustomersPage.tsx"
            >
              {
                customers.filter(
                  (c) => c.tier === "Gold" || c.tier === "Platinum"
                ).length
              }
            </div>
            <p
              className="text-xs text-muted-foreground"
              data-id="z72am3yys"
              data-path="src/pages/CustomersPage.tsx"
            >
              Gold & Platinum tiers
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card data-id="vp6emhlst" data-path="src/pages/CustomersPage.tsx">
        <CardContent
          className="p-6"
          data-id="swpreszxt"
          data-path="src/pages/CustomersPage.tsx"
        >
          <div
            className="flex flex-col md:flex-row gap-4"
            data-id="570p6ejek"
            data-path="src/pages/CustomersPage.tsx"
          >
            <div
              className="relative flex-1"
              data-id="b46o3bgp4"
              data-path="src/pages/CustomersPage.tsx"
            >
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400"
                data-id="1nlish5m6"
                data-path="src/pages/CustomersPage.tsx"
              />
              <Input
                placeholder="Search customers by name, email, or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
                data-id="8e40i5t63"
                data-path="src/pages/CustomersPage.tsx"
              />
            </div>
            <div
              className="flex flex-wrap gap-2"
              data-id="auwdvxjny"
              data-path="src/pages/CustomersPage.tsx"
            >
              {tiers.map((tier) => (
                <Button
                  key={tier}
                  variant={selectedTier === tier ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedTier(tier)}
                  data-id="yxbskzl7p"
                  data-path="src/pages/CustomersPage.tsx"
                >
                  {tier}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Customers Table */}
      <Card data-id="eekzzqpqm" data-path="src/pages/CustomersPage.tsx">
        <CardHeader data-id="rkcq0s1lt" data-path="src/pages/CustomersPage.tsx">
          <CardTitle
            data-id="4i9ehet2a"
            data-path="src/pages/CustomersPage.tsx"
          >
            Customer List
          </CardTitle>
        </CardHeader>
        <CardContent
          data-id="0g0dn4w4v"
          data-path="src/pages/CustomersPage.tsx"
        >
          <Table data-id="as81tn7o7" data-path="src/pages/CustomersPage.tsx">
            <TableHeader
              data-id="iqk9dw7z1"
              data-path="src/pages/CustomersPage.tsx"
            >
              <TableRow
                data-id="15ty3jc3y"
                data-path="src/pages/CustomersPage.tsx"
              >
                <TableHead
                  data-id="ggp1yd5hx"
                  data-path="src/pages/CustomersPage.tsx"
                >
                  Customer
                </TableHead>
                <TableHead
                  data-id="email-header"
                  data-path="src/pages/CustomersPage.tsx"
                >
                  Email
                </TableHead>
                <TableHead
                  className="text-right"
                  data-id="l8956uk9k"
                  data-path="src/pages/CustomersPage.tsx"
                >
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody
              data-id="n46b8mwmv"
              data-path="src/pages/CustomersPage.tsx"
            >
              {filteredCustomers.map((customer) => (
                <TableRow
                  key={customer.id}
                  data-id="a64c9j4hy"
                  data-path="src/pages/CustomersPage.tsx"
                >
                  <TableCell
                    data-id="zwsnbxlfw"
                    data-path="src/pages/CustomersPage.tsx"
                  >
                    <div
                      data-id="80aw4rsa0"
                      data-path="src/pages/CustomersPage.tsx"
                    >
                      <div
                        className="font-medium"
                        data-id="emdec6l9y"
                        data-path="src/pages/CustomersPage.tsx"
                      >
                        {customer.name}
                      </div>
                      <div
                        className="text-sm text-gray-500"
                        data-id="msxbyv4n3"
                        data-path="src/pages/CustomersPage.tsx"
                      >
                        {customer.phone}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell
                    data-id="email-cell"
                    data-path="src/pages/CustomersPage.tsx"
                  >
                    {customer.email}
                  </TableCell>
                  <TableCell
                    className="text-right"
                    data-id="qdroq2nky"
                    data-path="src/pages/CustomersPage.tsx"
                  >
                    <div
                      className="flex justify-end space-x-2"
                      data-id="9yytgw8wv"
                      data-path="src/pages/CustomersPage.tsx"
                    >
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(customer.id)}
                        data-id="w9s5tuaxn"
                        data-path="src/pages/CustomersPage.tsx"
                      >
                        <Edit
                          className="h-4 w-4"
                          data-id="cd9ygpt35"
                          data-path="src/pages/CustomersPage.tsx"
                        />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteClick(customer)}
                        className="text-red-600 hover:text-red-700"
                        data-id="oaf76w0lv"
                        data-path="src/pages/CustomersPage.tsx"
                      >
                        <Trash2
                          className="h-4 w-4"
                          data-id="c153o70td"
                          data-path="src/pages/CustomersPage.tsx"
                        />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      {/* Edit Modal */}
      {showEditModal && editingCustomer && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded p-6 w-96">
            <CustomerForm
              customer={editingCustomer}
              onSubmit={handleUpdateCustomer}
              onCancel={handleCancelEdit}
              readOnlyName={editingCustomer.name}
              readOnlyEmail={editingCustomer.email}
            />
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && customerToDelete && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded p-6 w-96">
            <h2 className="text-xl font-semibold mb-4">Confirm Delete</h2>
            <p className="mb-4">
              Are you sure you want to delete customer{" "}
              <strong>{customerToDelete.name}</strong>?
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={handleCancelDelete}
                className="px-4 py-2 border rounded bg-gray-200 hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomersPage;

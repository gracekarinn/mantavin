"use client";
import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Employee, CreateEmployeeDTO } from '../interface';
import { createEmployee, getEmployees } from '../services/employeeService';
import { useAuth } from '@/context/auth';
import { redirect } from 'next/navigation';

const departments = ["IT", "HR", "Finance", "Marketing", "Sales"];
const roles = ["Software Engineer", "HR Manager", "Financial Analyst", "Marketing Specialist", "Sales Representative"];

export const EmployeesPageSection = () => {
  const { isAuthenticated } = useAuth();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(false);
  const [newEmployee, setNewEmployee] = useState<CreateEmployeeDTO>({
    name: '',
    email: '',
    role: '',
    department: '',
  });

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      setLoading(true);
      const response = await fetch('/api/cv-upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setNewEmployee({
            ...newEmployee,
            ...data.extractedData,
          });
          toast.success('CV processed successfully');
        }
      }
    } catch (error) {
      toast.error('Error processing CV');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchEmployees = async () => {
      if (!isAuthenticated) {
        redirect('/login');
      }

      setLoading(true);
      try {
        const response = await getEmployees();

        if (response.success && response.data) {
          setEmployees(Array.isArray(response.data) ? response.data : []);
        } else {
          toast.error(response.message || 'Failed to fetch employees');
        }
      } catch (error) {
        console.error('Error in fetchEmployees:', error);
        toast.error('Error fetching employees');
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, [isAuthenticated]);

  const handleCreateEmployee = async () => {
    if (!isAuthenticated) {
      redirect('/login');
      return;
    }

    try {
      setLoading(true);
      const response = await createEmployee(newEmployee);

      if (response.success && response.data) {
        const newData = Array.isArray(response.data) ? response.data[0] : response.data;
        setEmployees(prev => [...prev, newData]);
        toast.success('Employee created successfully');
      } else {
        toast.error(response.message || 'Error creating employee');
      }
    } catch (error) {
      console.error('Error in handleCreateEmployee:', error);
      toast.error('Error creating employee');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex gap-6">
        <Card className="flex-1 p-8">
          <div className="grid grid-cols-4 gap-8">
            <div>
              <div className="text-4xl font-semibold text-gray-900">209</div>
              <div className="text-gray-500 mt-2">Active employees</div>
            </div>
            <div>
              <div className="text-4xl font-semibold text-gray-900">308</div>
              <div className="text-gray-500 mt-2">Total employees</div>
            </div>
            <div>
              <div className="text-4xl font-semibold text-gray-900">5</div>
              <div className="text-gray-500 mt-2">Employees with overdue trainings</div>
            </div>
            <div>
              <div className="text-4xl font-semibold text-gray-900">2</div>
              <div className="text-gray-500 mt-2">Employees requesting PoW</div>
            </div>
          </div>
        </Card>

        <Card className="p-8 w-80 flex flex-col items-center">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">New hire?</h2>
            <div className="flex flex-row gap-3 items-center">
              <Button className="bg-teal-500 hover:bg-teal-600 text-white w-full" onClick={() => document.getElementById('cv-upload')?.click()} disabled={loading}>
                <Plus className="w-4 h-4 mr-2" />
                Bulk add
              </Button>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="border-teal-500 text-teal-500 hover:bg-teal-50 w-full">
                    Manual add
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Employee</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Name</label>
                      <Input
                        value={newEmployee.name}
                        onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Email</label>
                      <Input
                        value={newEmployee.email}
                        onChange={(e) => setNewEmployee({ ...newEmployee, email: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Department</label>
                      <Select
                        value={newEmployee.department}
                        onValueChange={(value) => setNewEmployee({ ...newEmployee, department: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select department" />
                        </SelectTrigger>
                        <SelectContent>
                          {departments.map((dept) => (
                            <SelectItem key={dept} value={dept}>
                              {dept}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Role</label>
                      <Select
                        value={newEmployee.role}
                        onValueChange={(value) => setNewEmployee({ ...newEmployee, role: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent>
                          {roles.map((role) => (
                            <SelectItem key={role} value={role}>
                              {role}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <Button
                      className="w-full bg-teal-500 hover:bg-teal-600"
                      onClick={handleCreateEmployee}
                      disabled={loading}
                    >
                      Create Employee
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-8">
        <h2 className="text-xl font-semibold mb-6">List of employees</h2>
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Overdue trainings</TableHead>
              <TableHead>Milestones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {employees.map((employee) => (
              <TableRow key={employee._id || employee.email} className="hover:bg-gray-50">
                <TableCell className="font-medium">{employee.name}</TableCell>
                <TableCell>{employee.email}</TableCell>
                <TableCell>{employee.role}</TableCell>
                <TableCell>{employee.department}</TableCell>
                <TableCell>
                  <span className="text-teal-500 font-medium">
                    {employee.overdueTrainings}
                  </span>
                </TableCell>
                <TableCell>
                  <span className="text-teal-500 font-medium">
                    {employee.milestones}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      <input
        type="file"
        id="cv-upload"
        className="hidden"
        accept=".pdf,.doc,.docx"
        onChange={handleFileUpload}
      />
    </div>
  );
};

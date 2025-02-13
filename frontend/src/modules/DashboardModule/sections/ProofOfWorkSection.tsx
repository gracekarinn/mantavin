"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { incomingRequests } from '../constant';

export const ProofOfWorkSection = () => {
  const handleApprove = (requestId: string) => {
    console.log('Approving request:', requestId);
  };

  return (
    <div className="space-y-6 p-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-gray-800">
            Incoming requests
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Reason of request</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {incomingRequests.map((request) => (
                <TableRow key={request.id}>
                  <TableCell>{request.name}</TableCell>
                  <TableCell>{request.email}</TableCell>
                  <TableCell>{request.role}</TableCell>
                  <TableCell>{request.department}</TableCell>
                  <TableCell>{request.reasonOfRequest}</TableCell>
                  <TableCell>
                    <Button
                      onClick={() => handleApprove(request.id)}
                      className="bg-teal-500 hover:bg-teal-600 text-white"
                    >
                      Approve
                    </Button>
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

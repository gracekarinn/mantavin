"use client";

import React from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { proofOfWorkRequests } from '../constant';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { yearlyData, quarterlyData } from '../constant';

export const OverviewPageSection = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-6 mb-6">
        <Card className="p-6">
          <div className="text-5xl font-bold mb-2">110</div>
          <div className="text-gray-600">Total active employees</div>
        </Card>
        <Card className="p-6">
          <div className="text-5xl font-bold mb-2">282</div>
          <div className="text-gray-600">Total past employees</div>
        </Card>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Yearly Training Completion</h3>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={yearlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#14b8a6"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Last 3 Months Completion</h3>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={quarterlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar
                  dataKey="value"
                  fill="#14b8a6"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-2">
          There are 5 employees with overdue trainings
        </h2>
      </Card>

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Proof of work requests</h2>
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4 pb-2 text-sm text-gray-600">
            <div>Employee Name</div>
            <div>Reason of Request</div>
            <div></div>
          </div>
          {proofOfWorkRequests.map((request, index) => (
            <div key={index} className="grid grid-cols-3 gap-4 items-center">
              <div>{request.employeeName}</div>
              <div className="text-gray-600">{request.reason}</div>
              <div className="flex justify-end">
                <Button
                  variant="outline"
                  className="text-teal-500 border-teal-500 hover:bg-teal-50 transition-colors duration-200"
                >
                  Approve
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

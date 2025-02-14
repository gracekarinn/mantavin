"use client";

import React, { useState } from "react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import { LoaderCircle } from "lucide-react";

interface VerificationResult {
  blockNumber: number;
  transactionHash: string;
  description: string;
  timestamp: string;
  verified: boolean;
  employeeName: string;
  department: string;
}

const VerifyForm = () => {
  const [certificateNumber, setCertificateNumber] = useState("");
  const [workerEmail, setWorkerEmail] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<VerificationResult | null>(null);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/training/verify?${
        certificateNumber ? `certificate=${certificateNumber}` : `email=${workerEmail}`
      }`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setResult(data);
        toast.success("Verification successful");
      } else {
        const error = await response.json();
        toast.error(error.error || "Verification failed");
      }
    } catch (error) {
      console.error("Verification error:", error);
      toast.error("An error occurred during verification");
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      toast.error("Please select a file first");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("certificate", file);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/training/verify-file`, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setResult(data);
        toast.success("Certificate verification successful");
      } else {
        const error = await response.json();
        toast.error(error.error || "Certificate verification failed");
      }
    } catch (error) {
      console.error("File verification error:", error);
      toast.error("An error occurred during file verification");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-lg shadow-2xl rounded-lg border border-gray-100">
      <CardHeader>
        <CardTitle className="text-3xl font-bold text-gray-900">Employee Milestone Verification</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="certificate" className="text-gray-700 font-medium">Certificate number</Label>
            <Input
              id="certificate"
              type="text"
              placeholder="12 digit alphanumeric string"
              value={certificateNumber}
              onChange={(e) => setCertificateNumber(e.target.value)}
              className="ring-1 ring-gray-200 focus:ring-2 focus:ring-teal-500 rounded-lg py-2 px-3 transition duration-200"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-gray-700 font-medium">Worker email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Email"
              value={workerEmail}
              onChange={(e) => setWorkerEmail(e.target.value)}
              className="ring-1 ring-gray-200 focus:ring-2 focus:ring-teal-500 rounded-lg py-2 px-3 transition duration-200"
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200 ease-in-out transform hover:scale-105"
            disabled={loading || (!certificateNumber && !workerEmail)}
          >
            {loading && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
            Check
          </Button>
        </form>

        <div className="relative">
          <Separator />
          <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-2 text-gray-500">
            Or
          </span>
        </div>

        <form onSubmit={handleFileUpload} className="space-y-4">
          <div className="space-y-2">
            <Label className="text-gray-700 font-medium">Upload certificate</Label>
            <div className="border-2 border-dashed border-gray-200 rounded-lg p-4 bg-gray-50">
              <Input
                type="file"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="border-0 bg-transparent"
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200 ease-in-out transform hover:scale-105"
            disabled={loading || !file}
          >
            {loading && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
            Check
          </Button>
        </form>

        {result && (
          <Alert className="bg-teal-50 border border-teal-200">
            <AlertTitle className="text-teal-800 font-semibold">Verification Result</AlertTitle>
            <AlertDescription>
              <div className="mt-2 space-y-2">
                <div className="grid grid-cols-3 gap-2">
                  <span className="font-medium text-teal-700">Block Number:</span>
                  <span className="col-span-2 text-gray-800">{result.blockNumber}</span>

                  <span className="font-medium text-teal-700">Transaction:</span>
                  <span className="col-span-2 break-all text-gray-800">{result.transactionHash}</span>

                  <span className="font-medium text-teal-700">Description:</span>
                  <span className="col-span-2 text-gray-800">{result.description}</span>

                  <span className="font-medium text-teal-700">Employee:</span>
                  <span className="col-span-2 text-gray-800">{result.employeeName}</span>

                  <span className="font-medium text-teal-700">Department:</span>
                  <span className="col-span-2 text-gray-800">{result.department}</span>

                  <span className="font-medium text-teal-700">Timestamp:</span>
                  <span className="col-span-2 text-gray-800">
                    {new Date(result.timestamp).toLocaleString()}
                  </span>

                  <span className="font-medium text-teal-700">Status:</span>
                  <span className={`col-span-2 ${result.verified ? "text-green-600" : "text-red-600"} font-medium`}>
                    {result.verified ? "Verified" : "Not Verified"}
                  </span>
                </div>
              </div>
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};

export default VerifyForm;

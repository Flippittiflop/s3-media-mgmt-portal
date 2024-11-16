'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, FolderOpen } from 'lucide-react';
import Link from 'next/link';

interface DashboardStats {
  totalImages: number;
  categories: number;
  recentUploads: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalImages: 0,
    categories: 0,
    recentUploads: 0,
  });

  useEffect(() => {
    // Fetch dashboard stats
    // This would be replaced with actual API calls
    setStats({
      totalImages: 156,
      categories: 8,
      recentUploads: 12,
    });
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <div className="flex space-x-4">
          <Link href="/admin/upload">
            <Button className="flex items-center space-x-2">
              <Upload className="h-4 w-4" />
              <span>Upload Images</span>
            </Button>
          </Link>
          <Link href="/admin/categories">
            <Button variant="outline" className="flex items-center space-x-2">
              <FolderOpen className="h-4 w-4" />
              <span>Manage Categories</span>
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Images</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalImages}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.categories}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recent Uploads</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.recentUploads}</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
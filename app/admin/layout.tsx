import { Header } from '@/components/layout/header';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { LayoutGrid, Upload, FolderOpen, FileCode } from 'lucide-react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex space-x-4">
          <Link href="/admin/dashboard">
            <Button variant="ghost" className="flex items-center space-x-2">
              <LayoutGrid className="h-4 w-4" />
              <span>Dashboard</span>
            </Button>
          </Link>
          <Link href="/admin/upload">
            <Button variant="ghost" className="flex items-center space-x-2">
              <Upload className="h-4 w-4" />
              <span>Upload</span>
            </Button>
          </Link>
          <Link href="/admin/categories">
            <Button variant="ghost" className="flex items-center space-x-2">
              <FolderOpen className="h-4 w-4" />
              <span>Categories</span>
            </Button>
          </Link>
          <Link href="/admin/templates">
            <Button variant="ghost" className="flex items-center space-x-2">
              <FileCode className="h-4 w-4" />
              <span>Templates</span>
            </Button>
          </Link>
        </div>
        {children}
      </div>
    </div>
  );
}
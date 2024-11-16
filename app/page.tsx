import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { GalleryHorizontalEnd } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted flex items-center justify-center">
      <div className="max-w-3xl mx-auto text-center px-4">
        <div className="mb-8 flex justify-center">
          <GalleryHorizontalEnd className="h-16 w-16 text-primary" />
        </div>
        <h1 className="text-4xl font-bold tracking-tight mb-4">
          Welcome to Image Gallery Manager
        </h1>
        <p className="text-lg text-muted-foreground mb-8">
          A powerful platform for managing and organizing your image collections with custom metadata and categories.
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/auth/login">
            <Button size="lg">
              Login to Dashboard
            </Button>
          </Link>
          <Link href="/gallery">
            <Button variant="outline" size="lg">
              View Gallery
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
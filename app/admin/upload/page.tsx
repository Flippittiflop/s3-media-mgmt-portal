'use client';

import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/components/ui/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MediaService } from '@/lib/services/media-service';
import { CategoryService } from '@/lib/services/category-service';
import { useCategories } from '@/hooks/use-categories';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

const metadataSchema = z.object({
  categoryId: z.string().min(1, 'Category is required'),
  title: z.string().min(2, 'Title is required'),
  description: z.string().optional(),
});

type MetadataForm = z.infer<typeof metadataSchema>;

interface UploadFile extends File {
  preview?: string;
  progress?: number;
  error?: string;
}

export default function UploadPage() {
  const [files, setFiles] = useState<UploadFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();
  const { categories } = useCategories();

  const { register, handleSubmit, formState: { errors }, watch } = useForm<MetadataForm>({
    resolver: zodResolver(metadataSchema),
  });

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'image/*': ACCEPTED_IMAGE_TYPES,
    },
    maxSize: MAX_FILE_SIZE,
    onDrop: (acceptedFiles) => {
      const newFiles = acceptedFiles.map(file => 
        Object.assign(file, {
          preview: URL.createObjectURL(file),
          progress: 0,
        })
      );
      setFiles(prev => [...prev, ...newFiles]);
    },
    onDropRejected: (rejectedFiles) => {
      rejectedFiles.forEach(({ file, errors }) => {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: `${file.name}: ${errors[0].message}`,
        });
      });
    },
  });

  const removeFile = (file: UploadFile) => {
    setFiles(files => files.filter(f => f !== file));
    if (file.preview) {
      URL.revokeObjectURL(file.preview);
    }
  };

  const onSubmit = async (data: MetadataForm) => {
    if (files.length === 0) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Please select at least one file to upload',
      });
      return;
    }

    setIsUploading(true);
    try {
      await Promise.all(
        files.map(async (file) => {
          try {
            await MediaService.uploadMedia({
              file,
              metadata: {
                ...data,
                filename: file.name,
              },
              onProgress: (progress) => {
                setFiles(prev =>
                  prev.map(f =>
                    f === file ? { ...f, progress } : f
                  )
                );
              },
            });
          } catch (error) {
            setFiles(prev =>
              prev.map(f =>
                f === file ? { ...f, error: 'Upload failed' } : f
              )
            );
          }
        })
      );

      toast({
        title: 'Success',
        description: 'All files uploaded successfully',
      });
      
      // Clear files after successful upload
      files.forEach(file => {
        if (file.preview) URL.revokeObjectURL(file.preview);
      });
      setFiles([]);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Some files failed to upload',
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Upload Images</h2>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select onValueChange={value => register('categoryId').onChange({ target: { value } })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.categoryId && (
                <p className="text-sm text-destructive">{errors.categoryId.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                {...register('title')}
                className={errors.title ? 'border-destructive' : ''}
              />
              {errors.title && (
                <p className="text-sm text-destructive">{errors.title.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Input
                id="description"
                {...register('description')}
              />
            </div>
          </div>

          <div>
            <div
              {...getRootProps()}
              className="border-2 border-dashed rounded-lg p-8 text-center hover:border-primary/50 transition-colors"
            >
              <input {...getInputProps()} />
              <div className="space-y-4">
                <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">
                    Drag & drop images here, or click to select files
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    Maximum file size: 10MB
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {files.length > 0 && (
          <div className="grid gap-4 md:grid-cols-3">
            {files.map((file) => (
              <Card key={file.name} className="p-4 space-y-3">
                <div className="aspect-video relative rounded-lg overflow-hidden bg-muted">
                  {file.preview ? (
                    <img
                      src={file.preview}
                      alt={file.name}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <ImageIcon className="h-8 w-8 text-muted-foreground" />
                    </div>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2"
                    onClick={() => removeFile(file)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium truncate">{file.name}</p>
                  <Progress value={file.progress} className="h-1" />
                  {file.error && (
                    <p className="text-xs text-destructive">{file.error}</p>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}

        <Button type="submit" disabled={isUploading || files.length === 0}>
          {isUploading ? 'Uploading...' : 'Upload Files'}
        </Button>
      </form>
    </div>
  );
}
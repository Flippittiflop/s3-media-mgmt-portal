'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { CategoryService } from '@/lib/services/category-service';
import { isAdmin } from '@/lib/auth';

const categorySchema = z.object({
  name: z.string().min(2, 'Category name must be at least 2 characters'),
  description: z.string().optional(),
});

type CategoryForm = z.infer<typeof categorySchema>;

interface Category {
  id: string;
  name: string;
  description?: string;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [isAdminUser, setIsAdminUser] = useState(false);
  const { toast } = useToast();
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm<CategoryForm>({
    resolver: zodResolver(categorySchema),
  });

  useEffect(() => {
    loadCategories();
    checkAdminStatus();
  }, []);

  const checkAdminStatus = async () => {
    const adminStatus = await isAdmin();
    setIsAdminUser(adminStatus);
  };

  const loadCategories = async () => {
    try {
      const response = await CategoryService.getCategories();
      setCategories(response);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to load categories',
      });
    }
  };

  const onSubmit = async (data: CategoryForm) => {
    setIsLoading(true);
    try {
      if (selectedCategory) {
        await CategoryService.updateCategory(selectedCategory.id, data);
        toast({ title: 'Success', description: 'Category updated successfully' });
      } else {
        await CategoryService.createCategory(data);
        toast({ title: 'Success', description: 'Category created successfully' });
      }
      loadCategories();
      reset();
      setSelectedCategory(null);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to save category',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this category?')) return;
    
    try {
      await CategoryService.deleteCategory(id);
      toast({ title: 'Success', description: 'Category deleted successfully' });
      loadCategories();
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to delete category',
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Categories</h2>
        {isAdminUser && (
          <Dialog>
            <DialogTrigger asChild>
              <Button className="flex items-center space-x-2">
                <Plus className="h-4 w-4" />
                <span>Add Category</span>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{selectedCategory ? 'Edit Category' : 'Add New Category'}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <Input
                    {...register('name')}
                    placeholder="Category Name"
                    className={errors.name ? 'border-destructive' : ''}
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-destructive">{errors.name.message}</p>
                  )}
                </div>
                <div>
                  <Input
                    {...register('description')}
                    placeholder="Description (optional)"
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? 'Saving...' : 'Save Category'}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {categories.map((category) => (
          <Card key={category.id}>
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold">{category.name}</h3>
                  {category.description && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {category.description}
                    </p>
                  )}
                </div>
                {isAdminUser && (
                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setSelectedCategory(category)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(category.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
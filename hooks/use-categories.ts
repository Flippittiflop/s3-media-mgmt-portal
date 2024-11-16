'use client';

import { useState, useEffect } from 'react';
import { CategoryService, Category } from '@/lib/services/category-service';
import { useToast } from '@/components/ui/use-toast';

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadCategories();
  }, []);

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
    } finally {
      setIsLoading(false);
    }
  };

  return { categories, isLoading, reloadCategories: loadCategories };
}
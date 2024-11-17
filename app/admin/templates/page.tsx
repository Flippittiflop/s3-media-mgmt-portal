'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Plus, Pencil, Trash2, PlusCircle, MinusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { TemplateService, Template, TemplateField } from '@/lib/services/template-service';
import { isAdmin } from '@/lib/auth';

const fieldSchema = z.object({
  name: z.string().min(2, 'Field name must be at least 2 characters'),
  type: z.enum(['string', 'number', 'date', 'boolean']),
  required: z.boolean(),
  label: z.string().min(2, 'Label must be at least 2 characters'),
});

const templateSchema = z.object({
  name: z.string().min(2, 'Template name must be at least 2 characters'),
  description: z.string().optional(),
  fields: z.array(fieldSchema).min(1, 'At least one field is required'),
});

type TemplateForm = z.infer<typeof templateSchema>;

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [isAdminUser, setIsAdminUser] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();
  
  const { register, handleSubmit, reset, watch, setValue, formState: { errors } } = useForm<TemplateForm>({
    resolver: zodResolver(templateSchema),
    defaultValues: {
      fields: [{ name: '', type: 'string', required: true, label: '' }]
    }
  });

  const fields = watch('fields');

  useEffect(() => {
    loadTemplates();
    checkAdminStatus();
  }, []);

  const checkAdminStatus = async () => {
    const adminStatus = await isAdmin();
    setIsAdminUser(adminStatus);
  };

  const loadTemplates = async () => {
    try {
      const response = await TemplateService.getTemplates();
      setTemplates(response);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to load templates',
      });
    }
  };

  const addField = () => {
    const currentFields = watch('fields');
    setValue('fields', [...currentFields, { name: '', type: 'string', required: true, label: '' }]);
  };

  const removeField = (index: number) => {
    const currentFields = watch('fields');
    setValue('fields', currentFields.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: TemplateForm) => {
    setIsLoading(true);
    try {
      if (selectedTemplate) {
        await TemplateService.updateTemplate(selectedTemplate.id, data);
        toast({ title: 'Success', description: 'Template updated successfully' });
      } else {
        await TemplateService.createTemplate(data);
        toast({ title: 'Success', description: 'Template created successfully' });
      }
      loadTemplates();
      reset();
      setSelectedTemplate(null);
      setIsDialogOpen(false);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to save template',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this template?')) return;
    
    try {
      await TemplateService.deleteTemplate(id);
      toast({ title: 'Success', description: 'Template deleted successfully' });
      loadTemplates();
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to delete template',
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Templates</h2>
        {isAdminUser && (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center space-x-2">
                <Plus className="h-4 w-4" />
                <span>Add Template</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{selectedTemplate ? 'Edit Template' : 'Add New Template'}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Template Name</Label>
                    <Input
                      id="name"
                      {...register('name')}
                      className={errors.name ? 'border-destructive' : ''}
                    />
                    {errors.name && (
                      <p className="mt-1 text-sm text-destructive">{errors.name.message}</p>
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="description">Description (optional)</Label>
                    <Input
                      id="description"
                      {...register('description')}
                    />
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <Label>Fields</Label>
                      <Button type="button" variant="outline" size="sm" onClick={addField}>
                        <PlusCircle className="h-4 w-4 mr-2" />
                        Add Field
                      </Button>
                    </div>
                    
                    {fields.map((field, index) => (
                      <Card key={index}>
                        <CardContent className="pt-6">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label>Field Name</Label>
                              <Input
                                {...register(`fields.${index}.name`)}
                                placeholder="e.g., title"
                                className={errors.fields?.[index]?.name ? 'border-destructive' : ''}
                              />
                              {errors.fields?.[index]?.name && (
                                <p className="mt-1 text-sm text-destructive">
                                  {errors.fields[index]?.name?.message}
                                </p>
                              )}
                            </div>
                            
                            <div>
                              <Label>Label</Label>
                              <Input
                                {...register(`fields.${index}.label`)}
                                placeholder="e.g., Title"
                                className={errors.fields?.[index]?.label ? 'border-destructive' : ''}
                              />
                              {errors.fields?.[index]?.label && (
                                <p className="mt-1 text-sm text-destructive">
                                  {errors.fields[index]?.label?.message}
                                </p>
                              )}
                            </div>
                            
                            <div>
                              <Label>Type</Label>
                              <Select
                                onValueChange={(value) => setValue(`fields.${index}.type`, value as any)}
                                defaultValue={field.type}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="string">Text</SelectItem>
                                  <SelectItem value="number">Number</SelectItem>
                                  <SelectItem value="date">Date</SelectItem>
                                  <SelectItem value="boolean">Yes/No</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            
                            <div className="flex items-end justify-between">
                              <div className="flex items-center space-x-2">
                                <input
                                  type="checkbox"
                                  {...register(`fields.${index}.required`)}
                                  id={`required-${index}`}
                                  className="rounded border-gray-300"
                                />
                                <Label htmlFor={`required-${index}`}>Required</Label>
                              </div>
                              
                              {fields.length > 1 && (
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => removeField(index)}
                                >
                                  <MinusCircle className="h-4 w-4 text-destructive" />
                                </Button>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? 'Saving...' : 'Save Template'}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {templates.map((template) => (
          <Card key={template.id}>
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <h3 className="font-semibold">{template.name}</h3>
                  {template.description && (
                    <p className="text-sm text-muted-foreground">
                      {template.description}
                    </p>
                  )}
                  <div className="mt-4">
                    <h4 className="text-sm font-medium mb-2">Fields:</h4>
                    <ul className="space-y-1">
                      {template.fields.map((field, index) => (
                        <li key={index} className="text-sm text-muted-foreground">
                          {field.label} ({field.type}){field.required ? ' *' : ''}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                {isAdminUser && (
                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setSelectedTemplate(template);
                        reset(template);
                        setIsDialogOpen(true);
                      }}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(template.id)}
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
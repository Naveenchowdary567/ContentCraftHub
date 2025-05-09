import { PostFormProps } from "@/types";
import { categories, statuses, InsertPost } from "../../../shared/schema";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { UploadIcon } from "lucide-react";

const PostForm = ({ isOpen, isEditing, post, onClose, onSubmit }: PostFormProps) => {
  const { toast } = useToast();
  
  const [formData, setFormData] = useState<InsertPost>({
    title: "",
    content: "",
    category: "Technology",
    status: "published",
    imageUrl: ""
  });

  const [errors, setErrors] = useState({
    title: false,
    content: false,
    category: false
  });

  // Update form data when editing a post
  useEffect(() => {
    if (post && isEditing) {
      setFormData({
        title: post.title,
        content: post.content,
        category: post.category as "Technology" | "Development" | "Database" | "Design" | "Business",
        status: post.status as "published" | "draft" | "archived",
        imageUrl: post.imageUrl || ""
      });
    } else {
      // Reset form when creating a new post
      setFormData({
        title: "",
        content: "",
        category: "Technology",
        status: "published",
        imageUrl: ""
      });
    }
    // Reset errors
    setErrors({
      title: false,
      content: false,
      category: false
    });
  }, [post, isEditing, isOpen]);

  const handleChange = (field: keyof InsertPost, value: string) => {
    setFormData({
      ...formData,
      [field]: field === "category" 
        ? value as "Technology" | "Development" | "Database" | "Design" | "Business"
        : field === "status"
        ? value as "published" | "draft" | "archived"
        : value
    });
    
    // Clear error for the field being updated
    if (errors[field as keyof typeof errors]) {
      setErrors({
        ...errors,
        [field]: false
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors = {
      title: !formData.title.trim(),
      content: !formData.content.trim(),
      category: !formData.category
    };
    
    setErrors(newErrors);
    
    return !Object.values(newErrors).some(Boolean);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
    } else {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl overflow-y-auto max-h-[90vh]">
        <DialogTitle>
          {isEditing ? 'Edit Post' : 'Create New Post'}
        </DialogTitle>
        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          <div>
            <Label htmlFor="post-title" className={errors.title ? "text-red-500" : ""}>
              Title {errors.title && <span className="text-red-500">*</span>}
            </Label>
            <Input
              id="post-title"
              value={formData.title}
              onChange={(e) => handleChange("title", e.target.value)}
              placeholder="Enter post title"
              className={errors.title ? "border-red-500" : ""}
            />
            {errors.title && (
              <p className="text-red-500 text-sm mt-1">Title is required</p>
            )}
          </div>
          
          <div>
            <Label htmlFor="post-category" className={errors.category ? "text-red-500" : ""}>
              Category {errors.category && <span className="text-red-500">*</span>}
            </Label>
            <Select
              value={formData.category}
              onValueChange={(value) => handleChange("category", value)}
            >
              <SelectTrigger id="post-category" className={errors.category ? "border-red-500" : ""}>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.category && (
              <p className="text-red-500 text-sm mt-1">Category is required</p>
            )}
          </div>
          
          <div>
            <Label htmlFor="post-image">Featured Image URL</Label>
            <div className="mt-1 flex">
              <Input
                id="post-image"
                value={formData.imageUrl || ""}
                onChange={(e) => handleChange("imageUrl", e.target.value)}
                placeholder="https://example.com/image.jpg"
                className="flex-grow"
              />
            </div>
            {formData.imageUrl && (
              <div className="mt-2 p-2 border rounded-md">
                <p className="text-xs text-gray-500 mb-2">Image Preview:</p>
                <img 
                  src={formData.imageUrl} 
                  alt="Preview" 
                  className="max-h-24 object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "https://via.placeholder.com/800x400?text=Invalid+Image+URL";
                  }}
                />
              </div>
            )}
          </div>
          
          <div>
            <Label htmlFor="post-content" className={errors.content ? "text-red-500" : ""}>
              Content {errors.content && <span className="text-red-500">*</span>}
            </Label>
            <Textarea
              id="post-content"
              value={formData.content}
              onChange={(e) => handleChange("content", e.target.value)}
              placeholder="Write your post content here..."
              className={`min-h-[150px] ${errors.content ? "border-red-500" : ""}`}
            />
            {errors.content && (
              <p className="text-red-500 text-sm mt-1">Content is required</p>
            )}
          </div>
          
          <div>
            <Label htmlFor="post-status">Status</Label>
            <Select
              value={formData.status}
              onValueChange={(value) => handleChange("status", value)}
            >
              <SelectTrigger id="post-status">
                <SelectValue placeholder="Select a status" />
              </SelectTrigger>
              <SelectContent>
                {statuses.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex justify-end space-x-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {isEditing ? 'Update' : 'Save'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PostForm;

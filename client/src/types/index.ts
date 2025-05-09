import { Post, InsertPost, UpdatePost, categories, statuses } from "../../../shared/schema";

export interface PostCardProps {
  post: Post;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

export interface PostFormProps {
  isOpen: boolean;
  isEditing: boolean;
  post?: Post;
  onClose: () => void;
  onSubmit: (post: InsertPost | UpdatePost) => void;
}

export interface DeleteConfirmationProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export interface PageHeaderProps {
  title: string;
  subtitle?: string;
  onNewPost: () => void;
}

export interface FilterBarProps {
  onCategoryChange: (category: string) => void;
  onStatusChange: (status: string) => void;
  onSearch: (search: string) => void;
}

export interface PaginationProps {
  totalItems: number;
  itemsPerPage: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

export { Post, InsertPost, UpdatePost, categories, statuses };

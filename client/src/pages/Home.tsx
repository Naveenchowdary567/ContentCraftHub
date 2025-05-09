import { useState, useEffect, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHeader from "@/components/PageHeader";
import FilterBar from "@/components/FilterBar";
import PostCard from "@/components/PostCard";
import PostForm from "@/components/PostForm";
import DeleteConfirmation from "@/components/DeleteConfirmation";
import Pagination from "@/components/Pagination";
import { Post, InsertPost, UpdatePost } from "../../../shared/schema";

// Number of posts per page
const ITEMS_PER_PAGE = 6;

const Home = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // State for handling modals
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentPost, setCurrentPost] = useState<Post | undefined>(undefined);
  const [currentPostId, setCurrentPostId] = useState<number | null>(null);
  
  // State for filtering
  const [categoryFilter, setCategoryFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  
  // Fetch posts data
  const { data: posts = [], isLoading, isError } = useQuery<Post[]>({
    queryKey: ['/api/posts'],
  });
  
  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [categoryFilter, statusFilter, searchTerm]);
  
  // Filter and paginate posts
  const filteredPosts = useMemo(() => {
    return posts.filter((post: Post) => {
      const matchesCategory = !categoryFilter || post.category === categoryFilter;
      const matchesStatus = !statusFilter || post.status === statusFilter;
      const matchesSearch = !searchTerm || 
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        post.content.toLowerCase().includes(searchTerm.toLowerCase());
      
      return matchesCategory && matchesStatus && matchesSearch;
    });
  }, [posts, categoryFilter, statusFilter, searchTerm]);
  
  const paginatedPosts = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredPosts.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredPosts, currentPage]);
  
  // Mutations
  const createPostMutation = useMutation({
    mutationFn: (post: InsertPost) => 
      apiRequest('POST', '/api/posts', post),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/posts'] });
      toast({
        title: "Success",
        description: "Post created successfully!",
        variant: "default",
      });
      handleCloseModal();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to create post: ${error.message}`,
        variant: "destructive",
      });
    }
  });
  
  const updatePostMutation = useMutation({
    mutationFn: ({ id, post }: { id: number; post: UpdatePost }) => 
      apiRequest('PUT', `/api/posts/${id}`, post),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/posts'] });
      toast({
        title: "Success",
        description: "Post updated successfully!",
        variant: "default",
      });
      handleCloseModal();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to update post: ${error.message}`,
        variant: "destructive",
      });
    }
  });
  
  const deletePostMutation = useMutation({
    mutationFn: (id: number) => 
      apiRequest('DELETE', `/api/posts/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/posts'] });
      toast({
        title: "Success",
        description: "Post deleted successfully!",
        variant: "default",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to delete post: ${error.message}`,
        variant: "destructive",
      });
    }
  });
  
  // Handle opening modals
  const handleNewPost = () => {
    setIsEditing(false);
    setCurrentPost(undefined);
    setIsPostModalOpen(true);
  };
  
  const handleEditPost = (id: number) => {
    const post = posts.find((p: Post) => p.id === id);
    if (post) {
      setCurrentPost(post);
      setIsEditing(true);
      setIsPostModalOpen(true);
    }
  };
  
  const handleDeletePost = (id: number) => {
    setCurrentPostId(id);
    setIsDeleteModalOpen(true);
  };
  
  // Handle modal closures
  const handleCloseModal = () => {
    setIsPostModalOpen(false);
    setCurrentPost(undefined);
  };
  
  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setCurrentPostId(null);
  };
  
  // Handle form submissions
  const handleSubmitPost = (post: InsertPost | UpdatePost) => {
    if (isEditing && currentPost) {
      updatePostMutation.mutate({ 
        id: currentPost.id, 
        post 
      });
    } else {
      createPostMutation.mutate(post as InsertPost);
    }
  };
  
  const handleConfirmDelete = () => {
    if (currentPostId !== null) {
      deletePostMutation.mutate(currentPostId);
    }
  };
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-6">
        {/* Page Header */}
        <PageHeader 
          title="Blog Posts" 
          subtitle="Manage your content from one place" 
          onNewPost={handleNewPost} 
        />
        
        {/* Filters & Search */}
        <FilterBar 
          onCategoryChange={setCategoryFilter} 
          onStatusChange={setStatusFilter}
          onSearch={setSearchTerm}
        />
        
        {/* Posts Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="bg-white rounded-lg shadow overflow-hidden animate-pulse">
                <div className="h-48 w-full bg-gray-300" />
                <div className="p-4">
                  <div className="h-4 bg-gray-300 rounded mb-2 w-1/4" />
                  <div className="h-6 bg-gray-300 rounded mb-2" />
                  <div className="h-4 bg-gray-300 rounded mb-2" />
                  <div className="h-4 bg-gray-300 rounded mb-2" />
                  <div className="h-4 bg-gray-300 rounded mb-2 w-3/4" />
                </div>
              </div>
            ))}
          </div>
        ) : isError ? (
          <div className="text-center py-10">
            <p className="text-red-500">Error loading posts. Please try again later.</p>
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="text-center py-10 bg-white rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900">No posts found</h3>
            <p className="mt-2 text-sm text-gray-500">
              {searchTerm || categoryFilter || statusFilter
                ? "Try adjusting your filters"
                : "Create your first post by clicking 'New Post'"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {paginatedPosts.map((post: Post) => (
              <PostCard 
                key={post.id} 
                post={post} 
                onEdit={handleEditPost} 
                onDelete={handleDeletePost} 
              />
            ))}
          </div>
        )}
        
        {/* Pagination */}
        <Pagination 
          totalItems={filteredPosts.length} 
          itemsPerPage={ITEMS_PER_PAGE} 
          currentPage={currentPage} 
          onPageChange={setCurrentPage} 
        />
      </main>
      
      <Footer />
      
      {/* Modals */}
      <PostForm 
        isOpen={isPostModalOpen} 
        isEditing={isEditing} 
        post={currentPost} 
        onClose={handleCloseModal} 
        onSubmit={handleSubmitPost} 
      />
      
      <DeleteConfirmation 
        isOpen={isDeleteModalOpen} 
        onClose={handleCloseDeleteModal} 
        onConfirm={handleConfirmDelete} 
      />
    </div>
  );
};

export default Home;

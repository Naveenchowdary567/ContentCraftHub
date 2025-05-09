import { PostCardProps } from "@/types";
import { Eye, Edit, Trash2 } from "lucide-react";
import { format } from "date-fns";

const PostCard = ({ post, onEdit, onDelete }: PostCardProps) => {
  const formattedDate = format(new Date(post.createdAt), "MMMM dd, yyyy");

  // Function to determine badge color based on category
  const getBadgeColor = (category: string) => {
    switch (category) {
      case "Technology":
        return "bg-blue-100 text-blue-800";
      case "Development":
        return "bg-green-100 text-green-800";
      case "Database":
        return "bg-purple-100 text-purple-800";
      case "Design":
        return "bg-pink-100 text-pink-800";
      case "Business":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Truncate content to 150 characters
  const truncateContent = (content: string, maxLength: number = 150) => {
    return content.length > maxLength
      ? `${content.substring(0, maxLength)}...`
      : content;
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      {post.imageUrl && (
        <img 
          className="h-48 w-full object-cover" 
          src={post.imageUrl} 
          alt={post.title} 
        />
      )}
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getBadgeColor(post.category)}`}>
            {post.category}
          </span>
          <span className="text-sm text-gray-500">{formattedDate}</span>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{post.title}</h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">{truncateContent(post.content)}</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center text-sm text-gray-500">
            <Eye className="h-4 w-4 mr-1" />
            {post.views} views
          </div>
          <div className="flex space-x-2">
            <button 
              className="text-gray-500 hover:text-blue-600"
              onClick={() => onEdit(post.id)}
              aria-label="Edit post"
            >
              <Edit className="h-5 w-5" />
            </button>
            <button 
              className="text-gray-500 hover:text-red-600"
              onClick={() => onDelete(post.id)}
              aria-label="Delete post"
            >
              <Trash2 className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostCard;

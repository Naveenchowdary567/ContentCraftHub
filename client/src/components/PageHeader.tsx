import { PageHeaderProps } from "@/types";
import { PlusIcon } from "lucide-react";

const PageHeader = ({ title, subtitle, onNewPost }: PageHeaderProps) => {
  return (
    <div className="mb-6 md:flex md:items-center md:justify-between">
      <div className="flex-1 min-w-0">
        <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-1 text-sm text-gray-500">
            {subtitle}
          </p>
        )}
      </div>
      <div className="mt-4 flex md:mt-0 md:ml-4">
        <button 
          type="button" 
          onClick={onNewPost}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
        >
          <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
          New Post
        </button>
      </div>
    </div>
  );
};

export default PageHeader;

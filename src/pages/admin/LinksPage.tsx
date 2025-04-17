
import { Link } from "react-router-dom";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import LinkTable from "@/components/dashboard/LinkTable";

const LinksPage = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold mb-1">Links</h1>
          <p className="text-gray-500">Manage and monitor all your tracked links</p>
        </div>
        
        <Button asChild>
          <Link to="/OOR/create">
            <PlusCircle className="mr-2 h-4 w-4" />
            Create New Link
          </Link>
        </Button>
      </div>
      
      <LinkTable />
    </div>
  );
};

export default LinksPage;

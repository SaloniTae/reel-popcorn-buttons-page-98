
import { Link } from "react-router-dom";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import LinkTable from "@/components/dashboard/LinkTable";

const LinksPage = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-1 text-gradient">
          Links
        </h1>
        <p className="text-muted-contrast">Manage and monitor all your tracked links</p>
      </div>
      
      <div className="glass-morphism-light rounded-2xl p-6 shadow-lg border border-apple-border">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-white">All Links</h2>
          <Button 
            asChild
            className="bg-apple-accent hover:bg-apple-accent/90 text-white"
          >
            <Link to="/OOR/create">
              <PlusCircle className="mr-2 h-4 w-4" />
              Create New Link
            </Link>
          </Button>
        </div>
        
        <LinkTable />
      </div>
    </div>
  );
};

export default LinksPage;


import CreateLinkForm from "@/components/dashboard/CreateLinkForm";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const CreateLinkPage = () => {
  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center mb-4">
        <Button 
          variant="ghost" 
          size="sm" 
          asChild 
          className="mr-2 text-apple-light hover:text-white transition-colors"
        >
          <Link to="/OOR/links">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Links
          </Link>
        </Button>
      </div>
      
      <div className="glass-morphism-light rounded-2xl p-6 shadow-lg border border-apple-border">
        <h1 className="text-2xl font-bold mb-4 text-gradient">
          Create Landing Page
        </h1>
        <p className="text-muted-contrast mb-8">
          Create a new landing page with auto-generated tracking buttons
        </p>
        
        <CreateLinkForm />
      </div>
    </div>
  );
};

export default CreateLinkPage;

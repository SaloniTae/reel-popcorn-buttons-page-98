
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
          className="mr-2 text-apple-gray hover:text-white transition-colors"
        >
          <Link to="/OOR/links">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Links
          </Link>
        </Button>
      </div>
      
      <div className="bg-apple-dark/50 backdrop-blur-xl rounded-2xl shadow-lg p-6 border border-apple-muted/10">
        <h1 className="text-2xl font-bold mb-4 bg-gradient-to-r from-white via-white/90 to-white/80 bg-clip-text text-transparent">
          Create Landing Page
        </h1>
        <p className="text-apple-gray mb-8">
          Create a new landing page with auto-generated tracking buttons
        </p>
        
        <CreateLinkForm />
      </div>
    </div>
  );
};

export default CreateLinkPage;

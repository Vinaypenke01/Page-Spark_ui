import { useState } from "react";
import Header from "@/components/Header";
import PageGenerator from "@/components/PageGenerator";
import ResultCard from "@/components/ResultCard";
import LoadingState from "@/components/LoadingState";
import { Sparkles, Zap, Globe, Shield } from "lucide-react";
import { api, ApiRequestError } from "@/services/api";
import { toast } from "sonner";
import type { GeneratePageRequest } from "@/types/api";

const Index = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [generatedUrl, setGeneratedUrl] = useState<string | null>(null);

  const handleGenerate = async (data: {
    prompt: string;
    email: string;
    pageType: string;
    theme: string;
  }) => {
    setIsLoading(true);

    try {
      const requestData: GeneratePageRequest = {
        prompt: data.prompt,
        email: data.email,
        page_type: data.pageType || undefined,
        theme: data.theme || undefined,
      };

      const response = await api.pages.generate(requestData);

      setGeneratedUrl(response.live_url);

      toast.success("Page generated successfully!", {
        description: `Your page is live at ${response.live_url}`,
      });
    } catch (error) {
      if (error instanceof ApiRequestError) {
        toast.error("Failed to generate page", {
          description: error.message,
        });
      } else {
        toast.error("An error occurred", {
          description: "Please make sure the backend is running and try again.",
        });
      }
      console.error("Generation error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateNew = () => {
    setGeneratedUrl(null);
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-hero">
      <Header />

      {/* Hero Section */}
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Hero Content */}
          <div className="max-w-3xl mx-auto text-center mb-12 animate-fade-in">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-medium mb-6">
              <Sparkles className="h-4 w-4" />
              AI-Powered Page Generation
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
              Create stunning web pages
              <span className="text-gradient-primary"> in seconds</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Describe what you need, and our AI will generate a beautiful, live web page for you.
              No coding required. No account needed.
            </p>
          </div>

          {/* Main Card */}
          <div className="max-w-2xl mx-auto">
            <div className="bg-card rounded-2xl shadow-xl border border-border p-6 md:p-8 animate-scale-in">
              {generatedUrl ? (
                <div className="space-y-6">
                  <ResultCard pageUrl={generatedUrl} />
                  <button
                    onClick={handleCreateNew}
                    className="w-full text-sm text-primary hover:text-primary/80 transition-colors font-medium"
                  >
                    ← Create another page
                  </button>
                </div>
              ) : isLoading ? (
                <LoadingState />
              ) : (
                <PageGenerator onGenerate={handleGenerate} isLoading={isLoading} />
              )}
            </div>
          </div>

          {/* Features */}
          <div className="max-w-4xl mx-auto mt-20">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FeatureCard
                icon={<Zap className="h-6 w-6" />}
                title="Instant Generation"
                description="Your page is live in seconds, not hours"
              />
              <FeatureCard
                icon={<Globe className="h-6 w-6" />}
                title="Shareable Links"
                description="Get a unique URL you can share anywhere"
              />
              <FeatureCard
                icon={<Shield className="h-6 w-6" />}
                title="No Account Needed"
                description="Start creating immediately, no signup required"
              />
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 border-t border-border">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground">
            © 2024 Page Spark. Create beautiful pages with AI.
          </p>
          <div className="mt-4">
            <a href="/admin/login" className="text-xs text-muted-foreground/30 hover:text-muted-foreground transition-colors">
              Admin
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

const FeatureCard = ({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) => {
  return (
    <div className="bg-card rounded-xl p-6 border border-border hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      <div className="h-12 w-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="font-semibold text-foreground mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
};

export default Index;

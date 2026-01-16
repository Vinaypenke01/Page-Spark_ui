import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Check, Copy, ExternalLink, PartyPopper } from "lucide-react";

interface ResultCardProps {
  pageUrl: string;
}

const ResultCard = ({ pageUrl }: ResultCardProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(pageUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="animate-scale-in bg-gradient-card rounded-2xl border border-border p-8 shadow-xl">
      <div className="text-center space-y-6">
        {/* Success Icon */}
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-success/10 text-success animate-fade-in">
          <PartyPopper className="h-8 w-8" />
        </div>

        {/* Success Message */}
        <div className="space-y-2">
          <h3 className="text-2xl font-bold text-foreground">
            Your page is live! 🎉
          </h3>
          <p className="text-muted-foreground">
            Your page has been generated and is ready to share with the world.
          </p>
        </div>

        {/* Link Display */}
        <div className="bg-muted rounded-xl p-4">
          <p className="text-sm text-muted-foreground mb-2">Your live link:</p>
          <div className="flex items-center gap-2 bg-card rounded-lg p-3 border border-border">
            <code className="flex-1 text-sm font-mono text-primary truncate">
              {pageUrl}
            </code>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            variant="glass"
            size="lg"
            className="flex-1"
            onClick={handleCopy}
          >
            {copied ? (
              <>
                <Check className="h-4 w-4 text-success" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" />
                Copy Link
              </>
            )}
          </Button>
          <Button
            variant="hero"
            size="lg"
            className="flex-1"
            onClick={() => window.open(pageUrl, "_blank")}
          >
            <ExternalLink className="h-4 w-4" />
            Open Page
          </Button>
        </div>

        {/* Additional Info */}
        <p className="text-xs text-muted-foreground">
          A confirmation email has been sent with your page details
        </p>
      </div>
    </div>
  );
};

export default ResultCard;

import { ExternalLink, Eye, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface Page {
  id: string;
  email: string;
  prompt: string;
  pageType: string;
  createdAt: string;
  views: number;
  url: string;
}

interface PagesTableProps {
  pages: Page[];
}

const PagesTable = ({ pages }: PagesTableProps) => {
  const getPageTypeBadge = (type: string) => {
    const colors: Record<string, string> = {
      birthday: "bg-pink-100 text-pink-700 border-pink-200",
      event: "bg-blue-100 text-blue-700 border-blue-200",
      landing: "bg-green-100 text-green-700 border-green-200",
      portfolio: "bg-purple-100 text-purple-700 border-purple-200",
      announcement: "bg-orange-100 text-orange-700 border-orange-200",
    };
    return colors[type] || "bg-muted text-muted-foreground";
  };

  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className="font-semibold">Email</TableHead>
            <TableHead className="font-semibold">Prompt Summary</TableHead>
            <TableHead className="font-semibold">Type</TableHead>
            <TableHead className="font-semibold">Created</TableHead>
            <TableHead className="font-semibold text-center">Views</TableHead>
            <TableHead className="font-semibold text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {pages.map((page) => (
            <TableRow key={page.id} className="hover:bg-muted/30 transition-colors">
              <TableCell className="font-medium">{page.email}</TableCell>
              <TableCell className="max-w-[200px] truncate text-muted-foreground">
                {page.prompt}
              </TableCell>
              <TableCell>
                <Badge variant="outline" className={getPageTypeBadge(page.pageType)}>
                  {page.pageType}
                </Badge>
              </TableCell>
              <TableCell className="text-muted-foreground">{page.createdAt}</TableCell>
              <TableCell className="text-center">
                <div className="flex items-center justify-center gap-1">
                  <Eye className="h-4 w-4 text-muted-foreground" />
                  <span>{page.views}</span>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => window.open(page.url, "_blank")}
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default PagesTable;

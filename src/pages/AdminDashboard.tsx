import { useEffect, useState } from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import StatCard from "@/components/admin/StatCard";
import PagesTable from "@/components/admin/PagesTable";
import { FileText, Users, Eye, TrendingUp, RefreshCw } from "lucide-react";
import { api, ApiRequestError } from "@/services/api";
import { toast } from "sonner";
import type { DashboardData } from "@/types/api";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

const AdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboard = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await api.admin.getDashboard();
      setDashboardData(data);
    } catch (err) {
      const errorMessage = err instanceof ApiRequestError
        ? err.message
        : "Failed to load dashboard data";
      setError(errorMessage);
      toast.error("Error loading dashboard", {
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const handleRefresh = () => {
    fetchDashboard();
    toast.success("Dashboard refreshed");
  };

  if (error && !dashboardData) {
    return (
      <div className="min-h-screen bg-background">
        <AdminSidebar />
        <main className="ml-64 p-8">
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <div className="text-center space-y-4">
              <div className="h-16 w-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto">
                <svg className="h-8 w-8 text-destructive" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-foreground">Failed to load dashboard</h2>
              <p className="text-muted-foreground">{error}</p>
              <Button onClick={handleRefresh} variant="default">
                <RefreshCw className="h-4 w-4 mr-2" />
                Try Again
              </Button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <AdminSidebar />

      <main className="ml-64 p-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Overview of your page generation platform
            </p>
          </div>
          <Button onClick={handleRefresh} variant="outline" size="sm" disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {isLoading ? (
            <>
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-card rounded-xl border border-border p-6">
                  <Skeleton className="h-4 w-24 mb-2" />
                  <Skeleton className="h-8 w-16 mb-2" />
                  <Skeleton className="h-3 w-32" />
                </div>
              ))}
            </>
          ) : dashboardData ? (
            <>
              <StatCard
                title="Total Pages Generated"
                value={dashboardData.stats.totalPages.toLocaleString()}
                change="+12% from last month"
                changeType="positive"
                icon={FileText}
              />
              <StatCard
                title="Pages Today"
                value={dashboardData.stats.pagesToday}
                change="+8 from yesterday"
                changeType="positive"
                icon={TrendingUp}
              />
              <StatCard
                title="Total Page Views"
                value={dashboardData.stats.totalViews.toLocaleString()}
                change="+23% from last week"
                changeType="positive"
                icon={Eye}
              />
              <StatCard
                title="Unique Users"
                value={dashboardData.stats.uniqueUsers.toLocaleString()}
                change="Active users"
                changeType="neutral"
                icon={Users}
              />
            </>
          ) : null}
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Popular Page Types */}
          <div className="bg-card rounded-xl border border-border p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">
              Popular Page Types
            </h2>
            {isLoading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-2 w-full" />
                  </div>
                ))}
              </div>
            ) : dashboardData ? (
              <div className="space-y-4">
                {dashboardData.popularTypes.map((item) => (
                  <div key={item.type} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-foreground">{item.type}</span>
                      <span className="text-muted-foreground">{item.count}</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-primary rounded-full transition-all duration-500"
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : null}
          </div>

          {/* Recent Activity */}
          <div className="lg:col-span-2 bg-card rounded-xl border border-border p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">
              Recent Activity
            </h2>
            {isLoading ? (
              <div className="space-y-4">
                {[...Array(4)].map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : dashboardData ? (
              <div className="space-y-4">
                {dashboardData.recentPages.slice(0, 4).map((page) => (
                  <div
                    key={page.id}
                    className="flex items-center gap-4 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                  >
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                      <FileText className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {page.prompt.slice(0, 50)}...
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {page.email} • {page.createdAt}
                      </p>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {page.views} views
                    </div>
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        </div>

        {/* Recent Pages Table */}
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-4">
            Recent Generated Pages
          </h2>
          {isLoading ? (
            <div className="bg-card rounded-xl border border-border p-6">
              <Skeleton className="h-64 w-full" />
            </div>
          ) : dashboardData ? (
            <PagesTable pages={dashboardData.recentPages} />
          ) : null}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;

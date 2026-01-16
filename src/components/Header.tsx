import { Link } from "react-router-dom";


const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <div className="h-9 w-9 rounded-xl bg-gradient-primary flex items-center justify-center shadow-md overflow-hidden">
            <img src="/logo.png" alt="Page Spark Logo" className="h-full w-full object-cover" />
          </div>
          <span className="text-xl font-bold text-foreground">Page Spark</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <Link
            to="/"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Create Page
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;

import { ChevronRight } from "lucide-react";
import { Link } from "wouter";

interface Breadcrumb {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: Breadcrumb[];
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav className="flex items-center gap-2 text-sm" data-testid="breadcrumbs">
      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          {index > 0 && <ChevronRight className="h-3 w-3 text-muted-foreground" />}
          {item.href ? (
            <Link href={item.href} className="text-muted-foreground hover:text-foreground transition-colors">
              {item.label}
            </Link>
          ) : (
            <span className="font-medium">{item.label}</span>
          )}
        </div>
      ))}
    </nav>
  );
}

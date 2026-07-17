import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

interface BlogCardProps {
  id: number;
  title: string;
  excerpt: string;
  date: string;
  featured_image?: string;
  slug: string;
  onReadMore?: (slug: string) => void;
}

export default function BlogCard({
  id,
  title,
  excerpt,
  date,
  featured_image,
  slug,
  onReadMore,
}: BlogCardProps) {
  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 h-full flex flex-col">
      {featured_image && (
        <div className="w-full h-48 overflow-hidden bg-gray-200">
          <img
            src={featured_image}
            alt={title}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}
      <CardHeader className="pb-3">
        <div className="text-sm text-gray-500 mb-2">{formattedDate}</div>
        <CardTitle className="text-lg leading-tight">{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow pb-4">
        <CardDescription className="text-base line-clamp-3">{excerpt}</CardDescription>
      </CardContent>
      <div className="px-6 pb-6">
        <Button
          variant="outline"
          className="w-full group"
          onClick={() => onReadMore?.(slug)}
        >
          Read More
          <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
        </Button>
      </div>
    </Card>
  );
}

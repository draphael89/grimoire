// src/app/page.tsx
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function Home() {
  return (
    <main className="flex items-center justify-center min-h-screen bg-gray-50">
      <Card className="w-full max-w-md mx-4">
        <CardHeader>
          <CardTitle className="text-center text-3xl font-bold">
            The Power of Words
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center mb-6 text-gray-700">
            Explore how specific words, commands, and phrasing in AI prompts impact AI responses.
          </p>
          <div className="flex justify-center">
            <Link href="/experiment">
              <Button>Start Experimenting</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
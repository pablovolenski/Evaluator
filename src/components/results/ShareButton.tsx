'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';

interface ShareButtonProps {
  projectId: string;
}

export function ShareButton({ projectId }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    const url = `${window.location.origin}/share/${projectId}`;
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  }

  return (
    <Button variant="outline" onClick={handleCopy}>
      {copied ? '✓ Link copied!' : '🔗 Share project'}
    </Button>
  );
}

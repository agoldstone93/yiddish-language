import type { NextApiRequest, NextApiResponse } from 'next';
import { getVerbSearchIndex } from '@/lib/searchIndex';

export default function handler(_req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Cache-Control', 'public, max-age=3600, s-maxage=3600');
  res.json(getVerbSearchIndex());
}
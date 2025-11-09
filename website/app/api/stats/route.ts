import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { Feedback, Stats } from '@/lib/types';

const FEEDBACKS_FILE = path.join(process.cwd(), '..', 'data', 'feedbacks.json');

function readFeedbacks(): Feedback[] {
  try {
    const dataDir = path.join(process.cwd(), '..', 'data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    if (!fs.existsSync(FEEDBACKS_FILE)) {
      fs.writeFileSync(FEEDBACKS_FILE, '[]');
    }
    const data = fs.readFileSync(FEEDBACKS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading feedbacks:', error);
    return [];
  }
}

export async function GET() {
  try {
    const feedbacks = readFeedbacks();

    if (feedbacks.length === 0) {
      return NextResponse.json({
        total: 0,
        averages: { design: '0', idea: '0', usefulness: '0' }
      } as Stats);
    }

    const totals = feedbacks.reduce(
      (acc, fb) => {
        acc.design += fb.ratings.design;
        acc.idea += fb.ratings.idea;
        acc.usefulness += fb.ratings.usefulness;
        return acc;
      },
      { design: 0, idea: 0, usefulness: 0 }
    );

    const stats: Stats = {
      total: feedbacks.length,
      averages: {
        design: (totals.design / feedbacks.length).toFixed(2),
        idea: (totals.idea / feedbacks.length).toFixed(2),
        usefulness: (totals.usefulness / feedbacks.length).toFixed(2)
      }
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch statistics' },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { Feedback } from '@/lib/types';

const FEEDBACKS_FILE = path.join(process.cwd(), '..', 'data', 'feedbacks.json');

// Ensure data directory and file exist
function ensureDataFile() {
  const dataDir = path.join(process.cwd(), '..', 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  if (!fs.existsSync(FEEDBACKS_FILE)) {
    fs.writeFileSync(FEEDBACKS_FILE, '[]');
  }
}

function readFeedbacks(): Feedback[] {
  try {
    ensureDataFile();
    const data = fs.readFileSync(FEEDBACKS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading feedbacks:', error);
    return [];
  }
}

function writeFeedbacks(feedbacks: Feedback[]): boolean {
  try {
    ensureDataFile();
    fs.writeFileSync(FEEDBACKS_FILE, JSON.stringify(feedbacks, null, 2));
    return true;
  } catch (error) {
    console.error('Error writing feedbacks:', error);
    return false;
  }
}

export async function POST(request: NextRequest) {
  try {
    const feedback: Feedback = await request.json();

    // Validate feedback
    if (!feedback.ratings || !feedback.ratings.design || !feedback.ratings.idea || !feedback.ratings.usefulness) {
      return NextResponse.json(
        { error: 'Missing required ratings' },
        { status: 400 }
      );
    }

    // Add ID and ensure timestamp
    feedback.id = Date.now().toString();
    if (!feedback.timestamp) {
      feedback.timestamp = new Date().toISOString();
    }

    // Read existing feedbacks
    const feedbacks = readFeedbacks();

    // Add new feedback
    feedbacks.push(feedback);

    // Write to file
    if (writeFeedbacks(feedbacks)) {
      console.log('New feedback received:', {
        id: feedback.id,
        name: feedback.name,
        ratings: feedback.ratings,
        timestamp: feedback.timestamp
      });

      return NextResponse.json(
        { success: true, id: feedback.id },
        { status: 201 }
      );
    } else {
      return NextResponse.json(
        { error: 'Failed to save feedback' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error processing feedback:', error);
    return NextResponse.json(
      { error: 'Invalid request data' },
      { status: 400 }
    );
  }
}

export async function GET() {
  try {
    const feedbacks = readFeedbacks();
    return NextResponse.json(feedbacks);
  } catch (error) {
    console.error('Error fetching feedbacks:', error);
    return NextResponse.json(
      { error: 'Failed to fetch feedbacks' },
      { status: 500 }
    );
  }
}

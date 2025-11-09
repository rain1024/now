import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const USERS_FILE = path.join(process.cwd(), '..', 'data', 'users.json');

interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  createdAt: string;
}

function readUsers(): User[] {
  try {
    const dataDir = path.join(process.cwd(), 'data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    if (!fs.existsSync(USERS_FILE)) {
      fs.writeFileSync(USERS_FILE, '[]');
    }
    const data = fs.readFileSync(USERS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading users:', error);
    return [];
  }
}

function writeUsers(users: User[]): boolean {
  try {
    const dataDir = path.join(process.cwd(), 'data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
    return true;
  } catch (error) {
    console.error('Error writing users:', error);
    return false;
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json();

    // Validate input
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
      );
    }

    // Read existing users
    const users = readUsers();

    // Check if email already exists
    if (users.find(u => u.email === email)) {
      return NextResponse.json(
        { error: 'Email already exists' },
        { status: 400 }
      );
    }

    // Create new user
    const newUser: User = {
      id: Date.now().toString(),
      name,
      email,
      password, // In production, this should be hashed!
      createdAt: new Date().toISOString()
    };

    users.push(newUser);

    // Write to file
    if (writeUsers(users)) {
      console.log('New user registered:', { id: newUser.id, name, email });

      return NextResponse.json(
        { success: true, userId: newUser.id },
        { status: 201 }
      );
    } else {
      return NextResponse.json(
        { error: 'Failed to save user' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error processing signup:', error);
    return NextResponse.json(
      { error: 'Invalid request data' },
      { status: 400 }
    );
  }
}

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

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Missing email or password' },
        { status: 400 }
      );
    }

    // Read users
    const users = readUsers();

    // Find user
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
      console.log('User logged in:', { id: user.id, name: user.name, email: user.email });

      // Return user data (without password)
      const { password: _, ...userWithoutPassword } = user;
      return NextResponse.json({
        success: true,
        user: userWithoutPassword
      });
    } else {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('Error processing login:', error);
    return NextResponse.json(
      { error: 'Invalid request data' },
      { status: 400 }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    // Supabase 로그아웃
    await supabase.auth.signOut();

    return NextResponse.json(
      { success: true, message: '로그아웃되었습니다' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { error: '로그아웃 중 오류가 발생했습니다' },
      { status: 500 }
    );
  }
}
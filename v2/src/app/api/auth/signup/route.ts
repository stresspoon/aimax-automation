import { NextRequest, NextResponse } from 'next/server';
import { createUser } from '@/lib/db';
import { generateToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, name, phone, companyName, agreeMarketing } = body;

    // 입력값 검증
    if (!email || !password || !name || !phone) {
      return NextResponse.json(
        { error: '필수 정보를 모두 입력해주세요' },
        { status: 400 }
      );
    }

    // 이메일 형식 검증
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: '올바른 이메일 형식이 아닙니다' },
        { status: 400 }
      );
    }

    // 비밀번호 길이 검증
    if (password.length < 8) {
      return NextResponse.json(
        { error: '비밀번호는 8자 이상이어야 합니다' },
        { status: 400 }
      );
    }

    // 사용자 생성
    const user = await createUser({
      email,
      password,
      name,
      phone,
      companyName,
      agreeMarketing: agreeMarketing || false,
    });

    // JWT 토큰 생성
    const token = generateToken({
      userId: user.id,
      email: user.email,
      name: user.name,
    });

    // 응답 생성 및 쿠키 설정
    const response = NextResponse.json(
      {
        success: true,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
      },
      { status: 201 }
    );

    // HTTP-only 쿠키로 토큰 저장
    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7일
      path: '/',
    });

    return response;
  } catch (error: any) {
    console.error('Signup error:', error);
    
    if (error.message === '이미 존재하는 이메일입니다') {
      return NextResponse.json(
        { error: '이미 사용 중인 이메일입니다' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: '회원가입 중 오류가 발생했습니다' },
      { status: 500 }
    );
  }
}
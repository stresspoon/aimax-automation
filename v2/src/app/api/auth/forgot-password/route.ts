import { NextRequest, NextResponse } from 'next/server';
import { findUserByEmail, createResetToken } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { error: '이메일을 입력해주세요' },
        { status: 400 }
      );
    }

    // 사용자 찾기
    const user = await findUserByEmail(email);
    
    // 보안을 위해 사용자가 존재하지 않아도 성공 응답을 반환
    // 이렇게 하면 악의적인 사용자가 이메일 존재 여부를 확인할 수 없음
    if (!user) {
      return NextResponse.json(
        { success: true, message: '비밀번호 재설정 이메일을 전송했습니다' },
        { status: 200 }
      );
    }

    // 비밀번호 재설정 토큰 생성
    const resetToken = createResetToken(user.id);

    // 실제로는 여기서 이메일을 발송해야 함
    // 예: sendPasswordResetEmail(user.email, resetToken);
    console.log('Password reset token:', resetToken);
    console.log('Reset link:', `http://localhost:3001/reset-password?token=${resetToken}`);

    // 개발 환경에서는 콘솔에 토큰을 출력
    if (process.env.NODE_ENV === 'development') {
      return NextResponse.json(
        { 
          success: true, 
          message: '비밀번호 재설정 이메일을 전송했습니다',
          // 개발 환경에서만 토큰 반환 (프로덕션에서는 제거해야 함)
          devToken: resetToken 
        },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { success: true, message: '비밀번호 재설정 이메일을 전송했습니다' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json(
      { error: '비밀번호 재설정 요청 중 오류가 발생했습니다' },
      { status: 500 }
    );
  }
}
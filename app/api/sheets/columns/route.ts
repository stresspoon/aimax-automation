import { NextRequest, NextResponse } from "next/server";
import Papa from "papaparse";

export const runtime = "edge";

export async function POST(req: NextRequest) {
  try {
    const { csvUrl } = await req.json();
    if (!csvUrl || typeof csvUrl !== "string") {
      return NextResponse.json({ error: "csvUrl is required" }, { status: 400 });
    }
    const res = await fetch(csvUrl, { cache: "no-store" });
    if (!res.ok) throw new Error(`Failed to fetch CSV: ${res.status}`);
    const csvText = await res.text();
    const parsed = Papa.parse<string[]>(csvText, { delimiter: ",", newline: "\n" });
    const headers = parsed?.data?.[0] as string[] | undefined;
    if (!headers || headers.length === 0) throw new Error("No headers found");
    return NextResponse.json({ headers });
  } catch (e) {
    // fallback mock
    const mock = [
      "타임스탬프",
      "성함",
      "연락처",
      "메일주소",
      "어디에서 신청주셨나요?",
      "후기 작성할 스레드 URL",
      "후기 작성할 인스타그램 URL",
      "후기 작성할 블로그 URL",
      "영상 촬영은 필수입니다. 가능하시죠?",
      "개인정보 활용 동의",
    ];
    return NextResponse.json({ headers: mock, fallback: true }, { status: 200 });
  }
}



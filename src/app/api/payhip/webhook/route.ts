import { NextRequest, NextResponse } from "next/server";
const SECRET = "WP_SEC_2025";
export async function POST(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");
  if (token !== SECRET) return NextResponse.json({ ok:false, error:"unauthorized" }, { status: 401 });
  try {
    const data = await req.json();
    const event = data?.event || data?.type;
    console.log("PAYHIP_WEBHOOK_EVENT", event, JSON.stringify(data));
    return NextResponse.json({ ok:true });
  } catch (e) {
    console.error("PAYHIP_WEBHOOK_ERROR", e);
    return NextResponse.json({ ok:false }, { status:400 });
  }
}

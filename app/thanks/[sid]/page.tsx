import ThanksClient from "./ThanksClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function ThanksSidPage({ params }: { params: { sid: string } }) {
  return <ThanksClient sid={params.sid} />;
}

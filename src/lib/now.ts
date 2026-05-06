export type NowEntry = {
  label: "BUILDING" | "READING" | "LISTENING";
  value: string;
};

export const NOW: NowEntry[] = [
  { label: "BUILDING", value: "CloseHound — invite-only seller waitlist." },
  { label: "READING", value: "The Anthology of Balaji, vol. 1." },
  { label: "LISTENING", value: "Four Tet — Three." },
];

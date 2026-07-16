import { serve } from "inngest/next";
import { inngest } from "@/lib/inngest/client";
import { analyzeProfile } from "@/lib/inngest/functions/analyze-profile";

export const maxDuration = 300;

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [analyzeProfile],
});

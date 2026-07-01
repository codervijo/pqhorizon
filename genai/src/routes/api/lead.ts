import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

const leadSchema = z.object({
  email: z.string().trim().email().max(255),
  company: z.string().trim().min(1).max(120),
  timeline: z.enum(["rfp", "audit", "customer", "insurance", "planning"]),
});

export const Route = createFileRoute("/api/lead")({
  server: {
    handlers: {
      OPTIONS: async () => new Response(null, { status: 204, headers: corsHeaders }),
      POST: async ({ request }) => {
        let json: unknown;
        try {
          json = await request.json();
        } catch {
          return Response.json(
            { error: "Invalid JSON body." },
            { status: 400, headers: corsHeaders },
          );
        }
        const parsed = leadSchema.safeParse(json);
        if (!parsed.success) {
          return Response.json(
            { error: "Please complete every field with a valid email." },
            { status: 400, headers: corsHeaders },
          );
        }
        // TODO: wire to email/CRM (e.g. Resend + a CRM webhook).
        console.log("[pqhorizon:lead]", {
          ...parsed.data,
          at: new Date().toISOString(),
        });
        return Response.json({ ok: true }, { headers: corsHeaders });
      },
    },
  },
});

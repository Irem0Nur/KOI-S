export const dynamic = "force-dynamic";
import { NextRequest } from "next/server";
import { validateApiKey } from "@/lib/api-keys";
import { getNextKey } from "@/lib/hf-client";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get("authorization") ?? "";
  const apiKey = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;

  if (!apiKey || !apiKey.startsWith("sk_")) {
    return Response.json(
      { error: "Geçersiz API key. Authorization: Bearer sk_xxx formatında gönderin." },
      { status: 401 }
    );
  }

  const userId = await validateApiKey(apiKey);
  if (!userId) {
    return Response.json({ error: "API key bulunamadı veya devre dışı." }, { status: 401 });
  }

  const body = await req.json();
  const { model, messages, stream = false, max_tokens = 1024 } = body;

  // Model ID: kullanıcı HF model ID'si gönderebilir ya da bizim kısa adlarımızı
  const { HF_MODELS } = await import("@/lib/hf-client");
  const resolvedModel =
    HF_MODELS[model]?.id ?? model ?? HF_MODELS["mistral-7b"].id;

  const hfRes = await fetch(
    "https://api-inference.huggingface.co/v1/chat/completions",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${getNextKey()}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ model: resolvedModel, messages, max_tokens, stream }),
    }
  );

  if (!hfRes.ok) {
    const err = await hfRes.text();
    return Response.json({ error: err }, { status: hfRes.status });
  }

  if (stream) {
    return new Response(hfRes.body, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
      },
    });
  }

  const data = await hfRes.json();
  return Response.json(data);
}

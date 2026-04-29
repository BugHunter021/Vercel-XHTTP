export const config = { runtime: "edge" };

const TRG_BSE = (process.env.TRG_DMN || "").replace(/\/$/, "");

const New_HEADS = new Set([
  "host",
  "connection",
  "keep-alive",
  "proxy-authenticate",
  "proxy-authorization",
  "te",
  "trailer",
  "transfer-encoding",
  "upgrade",
  "forwarded",
  "x-forwarded-host",
  "x-forwarded-proto",
  "x-forwarded-port",
]);

export default async function handler(req) {
  if (!TRG_BSE) {
    return new Response("tanzimattttttt kharabeeee: TRG_DMN nist", { status: 500 });
  }

  try {
    const pthStr = req.url.indexOf("/", 8);
    const trguri =
      pthStr === -1 ? TRG_BSE + "/" : TRG_BSE + req.url.slice(pthStr);

    const out = new Headers();
    let clip = null;
    for (const [k, v] of req.headers) {
      if (New_HEADS.has(k)) continue;
      if (k.startsWith("x-vercel-")) continue;
      if (k === "x-real-ip") {
        clip = v;
        continue;
      }
      if (k === "x-forwarded-for") {
        if (!clip) clip = v;
        continue;
      }
      out.set(k, v);
    }
    if (clip) out.set("x-forwarded-for", clip);

    const method = req.method;
    const hasBody = method !== "GET" && method !== "HEAD";

    return await fetch(trguri, {
      method,
      headers: out,
      body: hasBody ? req.body : undefined,
      duplex: "half",
      redirect: "manual",
    });
  } catch (err) {
    console.error("shomare khata:", err);
    return new Response("dadash giti bad shodeeeeeeee: tun ham kharab shodeeee", { status: 502 });
  }
}

import { NextResponse } from "next/server";
import { deliverLead, esc, rateLimited, readForm, str } from "@/lib/leads";

export async function POST(req: Request) {
  const body = await readForm(req);
  if (!body) return NextResponse.json({ ok: false }, { status: 400 });
  if (str(body.website, 200)) return NextResponse.json({ ok: true });

  const complex = str(body.complex, 120);
  const business = str(body.business, 120);
  const name = str(body.name, 80);
  const contact = str(body.contact, 20);
  const comment = str(body.comment, 1000);
  const locale = body.locale === "en" ? "en" : "uk";
  const digits = contact.replace(/\D/g, "");
  const isPhone = /^\+?[0-9\s\-()]+$/.test(contact) && digits.length >= 10 && digits.length <= 15;
  if (!complex || !business || !name || !isPhone) return NextResponse.json({ ok: false }, { status: 400 });
  if (rateLimited(req)) return NextResponse.json({ ok: false }, { status: 429 });

  const text = [
    "🏪 <b>Заявка бізнесу на мапу</b>",
    "",
    `<b>ЖК:</b> ${esc(complex)}`,
    `<b>Заклад:</b> ${esc(business)}`,
    `<b>Ім'я:</b> ${esc(name)}`,
    `<b>Телефон:</b> ${esc(contact)}`,
    ...(comment ? [`<b>Коментар:</b> ${esc(comment)}`] : []),
  ].join("\n");

  return deliverLead(req, { type: "listing", name, contact, complex, business, message: comment, locale }, text);
}

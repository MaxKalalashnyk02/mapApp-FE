import { NextResponse } from "next/server";
import { deliverLead, esc, rateLimited, readForm, str } from "@/lib/leads";

export async function POST(req: Request) {
  const body = await readForm(req);
  if (!body) return NextResponse.json({ ok: false }, { status: 400 });
  if (str(body.website, 200)) return NextResponse.json({ ok: true });

  const fromFaq = body.source === "faq";
  const name = str(body.name, 80);
  const business = str(body.business, 120);
  const contact = str(body.contact, 120);
  const question = str(body.question, 2000);
  const locale = body.locale === "en" ? "en" : "uk";
  if (!name || !contact || !question) return NextResponse.json({ ok: false }, { status: 400 });
  if (rateLimited(req)) return NextResponse.json({ ok: false }, { status: 429 });

  const text = [
    fromFaq ? "❓ <b>Питання з сайту</b>" : "❓ <b>Питання від бізнесу</b>",
    "",
    `<b>Ім'я:</b> ${esc(name)}`,
    ...(business ? [`<b>Заклад:</b> ${esc(business)}`] : []),
    `<b>Контакт:</b> ${esc(contact)}`,
    "",
    esc(question),
  ].join("\n");

  return deliverLead(
    req,
    { type: fromFaq ? "question" : "business", name, contact, business, message: question, locale },
    text,
  );
}

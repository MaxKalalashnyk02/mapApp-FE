import { NextResponse } from "next/server";
import { deliverLead, esc, rateLimited, readForm, str } from "@/lib/leads";

const ROLES = ["osbb", "management", "developer", "resident", "other"] as const;
type Role = (typeof ROLES)[number];
const ROLE_LABEL: Record<Role, string> = {
  osbb: "ОСББ",
  management: "Керуюча компанія",
  developer: "Забудовник",
  resident: "Мешканець / ініціативна група",
  other: "Інше",
};

export async function POST(req: Request) {
  const body = await readForm(req);
  if (!body) return NextResponse.json({ ok: false }, { status: 400 });
  if (str(body.website, 200)) return NextResponse.json({ ok: true });

  const complex = str(body.complex, 120);
  const address = str(body.address, 200);
  const name = str(body.name, 80);
  const contact = str(body.contact, 120);
  const comment = str(body.comment, 2000);
  const role: Role = ROLES.includes(body.role as Role) ? (body.role as Role) : "other";
  const locale = body.locale === "en" ? "en" : "uk";
  if (!complex || !address || !name || !contact) return NextResponse.json({ ok: false }, { status: 400 });
  if (rateLimited(req)) return NextResponse.json({ ok: false }, { status: 429 });

  const text = [
    "🏢 <b>Нова заявка на підключення ЖК</b>",
    "",
    `<b>ЖК:</b> ${esc(complex)}`,
    `<b>Адреса:</b> ${esc(address)}`,
    `<b>Хто:</b> ${ROLE_LABEL[role]}`,
    `<b>Ім'я:</b> ${esc(name)}`,
    `<b>Контакт:</b> ${esc(contact)}`,
    ...(comment ? [`<b>Коментар:</b> ${esc(comment)}`] : []),
    "",
    `<i>Мова сайту: ${locale}</i>`,
  ].join("\n");

  return deliverLead(req, { type: "complex", name, contact, complex, address, role, message: comment, locale }, text);
}

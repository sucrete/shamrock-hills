import { NextRequest, NextResponse } from 'next/server';

// Field/label names here mirror shamrockhills.com's current newsletter form
// (firstName, lastName, email, birthdayMonth, and the four group checkboxes)
// so subscribers land in the same Campaign Monitor list under the same
// custom field names their existing form already writes to.
const GROUP_CUSTOM_FIELD_LABELS: Record<string, string> = {
  'golf-association': 'Golf Association',
  'seniors-golf': 'Seniors Golf',
  'couples-league': 'Couples League',
  'ladies-league': 'Ladies League',
};

interface NewsletterPayload {
  firstName?: string;
  lastName?: string;
  email?: string;
  birthdayMonth?: string | null;
  groups?: string[];
}

export async function POST(request: NextRequest) {
  const { firstName, lastName, email, birthdayMonth, groups = [] } = (await request.json()) as NewsletterPayload;

  if (!firstName || !lastName || !email) {
    return NextResponse.json({ error: 'First name, last name, and email are required.' }, { status: 400 });
  }

  const apiKey = process.env.CAMPAIGN_MONITOR_API_KEY;
  const listId = process.env.CAMPAIGN_MONITOR_LIST_ID;

  if (!apiKey || !listId) {
    console.error('Newsletter signup: CAMPAIGN_MONITOR_API_KEY / CAMPAIGN_MONITOR_LIST_ID are not configured.');
    return NextResponse.json({ error: 'Newsletter signup is not configured yet.' }, { status: 500 });
  }

  const customFields = [
    { Key: 'Birthday Month', Value: birthdayMonth ?? '' },
    ...Object.entries(GROUP_CUSTOM_FIELD_LABELS).map(([id, label]) => ({
      Key: label,
      Value: groups.includes(id) ? 'Yes' : 'No',
    })),
  ];

  const cmRes = await fetch(`https://api.createsend.com/api/v3.3/subscribers/${listId}.json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Basic ${Buffer.from(`${apiKey}:x`).toString('base64')}`,
    },
    body: JSON.stringify({
      EmailAddress: email,
      Name: `${firstName} ${lastName}`.trim(),
      CustomFields: customFields,
      ConsentToTrack: 'Yes',
      Resubscribe: true,
    }),
  });

  if (!cmRes.ok) {
    console.error('Newsletter signup: Campaign Monitor request failed', cmRes.status, await cmRes.text());
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 502 });
  }

  return NextResponse.json({ success: true });
}

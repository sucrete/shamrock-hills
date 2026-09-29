import { Button, Card, Container, Flex, Heading, Stack, Text } from '@sanity/ui';
import type { Tool } from 'sanity';
import { EnvelopeIcon } from '../icons/icons';

const CAMPAIGN_MONITOR_URL = 'https://teequest.createsend.com/login';

// Campaign Monitor sends X-Frame-Options: SAMEORIGIN, so it can't be iframed here.
const EmailMarketing = () => (
  <Flex align="center" justify="center" height="fill" padding={4}>
    <Container width={1}>
      <Card padding={5} radius={3} shadow={1}>
        <Stack space={4}>
          <Heading size={2}>Email Marketing</Heading>
          <Text muted>
            Newsletters and email campaigns are managed in Campaign Monitor. It opens in a new tab, and your browser
            will keep you signed in between visits.
          </Text>
          <Button
            as="a"
            href={CAMPAIGN_MONITOR_URL}
            target="_blank"
            rel="noopener noreferrer"
            icon={EnvelopeIcon}
            text="Open Campaign Monitor"
            tone="primary"
            padding={4}
          />
        </Stack>
      </Card>
    </Container>
  </Flex>
);

export const emailMarketingTool: Tool = {
  name: 'email-marketing',
  title: 'Email Marketing',
  icon: EnvelopeIcon,
  component: EmailMarketing,
};

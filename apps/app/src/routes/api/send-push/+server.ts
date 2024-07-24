import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import webpush from 'web-push';

// Set your VAPID keys
webpush.setVapidDetails(
  'mailto:your-email@example.com',
  'BNQnK3cJhovdfVcIONcUjK1JYtdnzrgkKbvf1ZHSg2wCc6OVMwJU19CexTe7tusiH7FfNfOF0N0V1E2gRy7ls8I',
  'NInNH1aC0Nny9Nf5FNdLv6Ew_e94uJtYqh1RheneZ1A',
);

export const POST: RequestHandler = async () => {
  // TODO: Fetch subscriptions from your database
  const subscriptions = [
    // Example subscription object
    {
      endpoint: 'https://fcm.googleapis.com/fcm/send/...',
      keys: {
        p256dh: '...',
        auth: '...'
      }
    }
  ];

  const notificationPayload = {
    notification: {
      title: 'Test Notification',
      body: 'This is a test push notification!',
      icon: '/icon.png'
    }
  };

  const promises = subscriptions.map(subscription =>
    webpush.sendNotification(subscription, JSON.stringify(notificationPayload))
  );

  await Promise.all(promises);

  return json({ success: true });
};
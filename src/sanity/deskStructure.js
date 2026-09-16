// ./deskStructure.js
import { TrashIcon } from '@sanity/icons';
import { createBulkActionsTable } from 'sanity-plugin-bulk-actions-table';

import { RateseIcon, NoticeIcon, EventIcon, EditorIcon } from './icons/icons';

export const deskStructure = (S, context) =>
  S.list()
    .title('Website')
    .id('website')
    .items([
      ...S.documentTypeListItems().filter(
        (listItem) =>
          ![
            'rates',
            'ticker',
            'events',
            'golfAssociation',
            'matchPlay',
            'ladiesLeague',
            'couplesLeague',
            'seniorLeague',
            'lessons',
            'employment',
            'tournaments',
            'media.tag',
          ].includes(listItem.getId()),
      ),

      S.listItem()
        .icon(EventIcon)
        .title('Events')
        .child(
          S.list()
            .title('Events')
            .items([
              S.listItem()
                .icon(EventIcon)
                .title('All Events')
                .child(S.documentTypeList('events').title('Events')),
              createBulkActionsTable({ type: 'events', S, context, title: 'Manage', icon: TrashIcon }),
            ]),
        ),
      S.listItem()
        .icon(RateseIcon)
        .title('Greens Fees')
        .child(S.document().schemaType('rates').documentId('rates').title('Greens Fees')),
      S.divider(),
      S.listItem()
        .icon(NoticeIcon)
        .title('Notices')
        .child(S.document().schemaType('ticker').documentId('ticker').title('Notices')),
      S.divider(),
      S.listItem()
        .icon(EditorIcon)
        .title('Tournaments')
        .child(S.document().schemaType('tournaments').documentId('tournaments').title('Tournaments')),
        S.listItem()
          .icon(EditorIcon)
          .title('Couples League')
          .child(S.document().schemaType('couplesLeague').documentId('couplesLeague').title('Couples League')),
      S.listItem()
        .icon(EditorIcon)
        .title('Ladies League')
        .child(S.document().schemaType('ladiesLeague').documentId('ladiesLeague').title('Ladies League')),
      S.listItem()
        .icon(EditorIcon)
        .title('Senior League')
        .child(S.document().schemaType('seniorLeague').documentId('seniorLeague').title('Senior League')),
      S.listItem()
        .icon(EditorIcon)
        .title('Lessons')
        .child(S.document().schemaType('lessons').documentId('lessons').title('Lessons')),
      S.listItem()
        .icon(EditorIcon)
        .title('SHGA Home')
        .child(S.document().schemaType('golfAssociation').documentId('golfAssociation').title('SHGA Home')),
      S.listItem()
        .icon(EditorIcon)
        .title('Match Play')
        .child(S.document().schemaType('matchPlay').documentId('matchPlay').title('Match Play')),
      S.listItem()
        .icon(EditorIcon)
        .title('Employment & Volunteers')
        .child(S.document().schemaType('employment').documentId('employment').title('Employment & Volunteers')),
    ]);

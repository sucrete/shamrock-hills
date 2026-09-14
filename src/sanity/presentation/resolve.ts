import { defineLocations, PresentationPluginOptions } from 'sanity/presentation'

export const resolve: PresentationPluginOptions['resolve'] = {
  locations: {
    rates: defineLocations({
      select: { title: 'title' },
      resolve: () => ({
        locations: [{ title: 'Rates', href: '/greens-fees' }],
      }),
    }),
  },
}
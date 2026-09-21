import { client } from "@/sanity/lib/client";
import { token } from "@/sanity/lib/token"
import { defineLive } from "next-sanity/live";

export const { sanityFetch, SanityLive } = defineLive({
  client,
  browserToken: token,
  serverToken: token,
  // In production, next-sanity's default is to cache fetches indefinitely and
  // rely solely on <SanityLive />'s real-time listener to bust the cache —
  // which only fires when a browser tab is open at the moment content
  // changes. Without this, published/deleted content can stay stale
  // indefinitely for visitors. This bounds staleness to 60s as a safety net.
  fetchOptions: {
    revalidate: 60,
  },
});
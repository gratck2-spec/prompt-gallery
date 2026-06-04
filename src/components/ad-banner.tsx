"use client"

import { useEffect } from "react"

export function AdBanner() {
  const adClientId = process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_ID

  useEffect(() => {
    if (!adClientId) return
    try {
      ;(window.adsbygoogle = window.adsbygoogle || []).push({})
    } catch (e) {
      console.error("AdSense error:", e)
    }
  }, [adClientId])

  if (!adClientId) return null

  return (
    <div className="my-8 min-h-[100px]">
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client={adClientId}
        data-ad-slot="auto"
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  )
}

declare global {
  interface Window {
    adsbygoogle: unknown[]
  }
}

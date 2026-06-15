import { BannerAd, BannerAdSize } from 'react-native-google-mobile-ads';

export function BannerAdComponent() {
  return (
    <BannerAd
      unitId="ca-app-pub-3940256099942544/6300978111"
      size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
      requestOptions={{
        requestNonPersonalizedAdsOnly: true,
      }}
    />
  );
}

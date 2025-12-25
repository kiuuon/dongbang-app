export default {
  expo: {
    name: '동방',
    slug: 'dongbang-app',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/images/icon.png',
    scheme: 'myapp',
    userInterfaceStyle: 'automatic',
    newArchEnabled: true,
    splash: {
      image: './assets/splash-icon.png',
      resizeMode: 'contain',
      backgroundColor: '#ffffff',
    },
    ios: {
      bundleIdentifier: 'com.dongbang.www',
      buildNumber: '1.0.0',
      supportsTablet: false,
      infoPlist: {
        ITSAppUsesNonExemptEncryption: false,
      },
    },
    android: {
      package: 'com.dongbang.www',
      versionCode: 1,
      // 핵심: EAS Secret(GOOGLE_SERVICES_JSON)이 있으면 그 경로를 사용하고, 없으면 로컬 파일을 사용함
      googleServicesFile: process.env.GOOGLE_SERVICES_JSON ?? './google-services.json',
      adaptiveIcon: {
        foregroundImage: './assets/images/icon.png',
        backgroundColor: '#ffffff',
      },
    },
    web: {
      bundler: 'metro',
      output: 'static',
      favicon: './assets/images/favicon.png',
    },
    plugins: [
      'expo-router',
      [
        'expo-splash-screen',
        {
          image: './assets/images/splash-icon.png',
          imageWidth: 200,
          resizeMode: 'contain',
          backgroundColor: '#ffffff',
        },
      ],
      [
        'expo-notifications',
        {
          icon: './assets/images/logo.png',
          color: '#ffffff',
        },
      ],
      'expo-font',
      'expo-web-browser',
    ],
    experiments: {
      typedRoutes: true,
    },
    extra: {
      router: {},
      eas: {
        projectId: '932000c0-3dbf-448f-b653-ef3f1d95a2d2',
      },
    },
    owner: 'kiuuon',
    runtimeVersion: {
      policy: 'appVersion',
    },
    updates: {
      url: 'https://u.expo.dev/932000c0-3dbf-448f-b653-ef3f1d95a2d2',
    },
  },
};

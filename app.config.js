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
      bundleIdentifier: 'com.dongbang.dongbangapp',
      buildNumber: '1.0.0',
      supportsTablet: false,
      infoPlist: {
        ITSAppUsesNonExemptEncryption: false,
        NSCameraUsageDescription: '사진을 촬영해 업로드하기 위해 카메라 접근 권한이 필요합니다.',
        NSPhotoLibraryUsageDescription: '갤러리에 저장된 사진을 선택해 업로드하기 위해 권한이 필요합니다.',
        NSPhotoLibraryAddUsageDescription: '촬영한 사진을 기기에 저장하기 위해 권한이 필요합니다.',
      },
    },
    android: {
      package: 'com.dongbang.dongbangapp',
      versionCode: 1,
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

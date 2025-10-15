import { create } from 'zustand';

interface TermsStoreType {
  termOfUse: boolean;
  setTermOfUse: (termOfUse: boolean) => void;
  privacyPolicy: boolean;
  setPrivacyPolicy: (privacyPolicy: boolean) => void;
  thirdPartyConsent: boolean;
  setThirdPartyConsent: (thirdPartyConsent: boolean) => void;
  marketing: boolean;
  setMarketing: (marketing: boolean) => void;
}

const termsStore = create<TermsStoreType>((set) => ({
  termOfUse: false, // 동방 이용약관 동의
  setTermOfUse: (termOfUse) => set({ termOfUse }),
  privacyPolicy: false, // 개인정보 수집 및 이용 동의
  setPrivacyPolicy: (privacyPolicy) => set({ privacyPolicy }),
  thirdPartyConsent: false, // 개인정보 제3자 제공 동의
  setThirdPartyConsent: (thirdPartyConsent) => set({ thirdPartyConsent }),
  marketing: false, // 마케팅 정보 수신 동의
  setMarketing: (marketing) => set({ marketing }),
}));

export default termsStore;

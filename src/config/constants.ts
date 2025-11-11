// Configuration Constants

// API Configuration
export const API_CONFIG = {
  // Toggle this to switch between mock and real API
  USE_MOCK: false,
  BASE_URL: 'http://3.39.207.166:8080',
  WS_URL: 'http://3.39.207.166:8080/gyeonggi_partners-chat',
};

// Mock Data Configuration
export const MOCK_CONFIG = {
  CURRENT_USER_ID: 1,
  CURRENT_USER_NICKNAME: '현재사용자',
  MESSAGE_DELAY: 1000, // Simulated network delay in ms
};

// Region Mapping
export const REGIONS: Record<string, string> = {
  BUCHEON: '부천',
  SEOUL: '서울',
  INCHEON: '인천',
  GWANGJU: '광주',
  DAEJEON: '대전',
  BUSAN: '부산',
};
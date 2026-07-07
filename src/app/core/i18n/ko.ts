import { en } from './en';

export const ko: typeof en = {
  'tabs.convert': '환전',
  'tabs.settings': '설정',

  'home.title': '환율 변환기',
  'home.from': '출발',
  'home.to': '도착',
  'home.amountPlaceholder': '예: 100+50*2',
  'home.loadCurrenciesError': '통화 목록을 불러올 수 없습니다.',
  'home.conversionError': '환율 변환에 실패했습니다. 연결 상태를 확인하세요.',

  'settings.title': '설정',
  'settings.language': '언어',
  'settings.theme': '테마',
  'settings.themeLight': '라이트',
  'settings.themeDark': '다크',
  'settings.themeSystem': '시스템',

  'settings.dataSourceTitle': '환율 데이터 출처',
  'settings.dataSourceInfo':
    '환율 정보는 Frankfurter API(frankfurter.dev)에서 제공되며, 유럽중앙은행(ECB) 기준 환율을 바탕으로 합니다. 영업일 기준 매일 업데이트됩니다.',
};

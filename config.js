// 다른 친구용으로 재사용할 땐 이 파일만 고치면 됨.
// 배포 후 URL로도 덮어쓸 수 있음: ?to=민수&from=형래
// 문자열 안의 {to}, {from} 은 이름으로, {total} 은 뽑기판 칸 수로 바뀜.
window.BIRTHDAY = {
  to: '준수',
  from: '형래',
  pageTitle: '{to} 생일 축하해 (일단은) 🎂',

  letter: `{to}야, 생일 축하한다.

선물 뭐 줄지 진지하게 1초 고민했는데
너한텐 이 링크 하나면 충분하다는 결론이 나왔어.

뽑기 결과? 그건 내 잘못 아님.
카드 전부 까서 보여줬잖아. 고른 건 너야.
원망하려면 네 손가락이랑 네 운을 원망해라 🙏

아무튼 생일 축하하고,
내년에도 이 링크 꼭 믿어줘 🙂`,

  // 회차별 결과 멘트. 마지막 회차가 끝나면 재뽑기 버튼 없음
  // rank: 팝업 제목, desc: 팝업 멘트, tease: 칸 공개 후 문구, retry: 재뽑기 버튼
  rounds: [
    {
      rank: '꽝 당첨!',
      desc: '축하해! 아무것도 없어 ^^\n{total}칸 중에 딱 1칸을 고르네 ㅋㅋㅋ',
      tease: '바로 옆 칸이 1등이었네 ㅋㅋㅋ\n아깝다~ 진짜 아깝다~ 🤭',
      retry: '한 번만 더 해볼래? 이번엔 될 듯 😏',
    },
    {
      rank: '또 꽝!',
      desc: '이걸 믿네...\n순진한.. 놈 🤭',
      tease: '두 번이나 믿어줘서 고마워 🙏\n그 순수함 평생 간직해~',
    },
  ],

  // count: 뽑기판에 깔리는 칸 수 (전부 더한 게 판 크기, 5의 배수 추천)
  // weight: 실제 당첨 확률 비중 (없으면 0 = 절대 안 나옴 😏)
  // tease: true 면 뽑은 칸 바로 옆에 항상 깔림 ("아깝다~" 용)
  prizes: [
    { rank: '특등', emoji: '📱', name: '아이폰 17 Pro', count: 1 },
    { rank: '1등', emoji: '🎮', name: '닌텐도 스위치 2', count: 1, tease: true },
    { rank: '2등', emoji: '🎧', name: '에어팟 프로 3', count: 2, tease: true },
    { rank: '3등', emoji: '💳', name: '신세계 상품권 5만 원', count: 3, tease: true },
    { rank: '4등', emoji: '🍗', name: 'BBQ 황금올리브', count: 6 },
    { rank: '5등', emoji: '☕', name: '스타벅스 아메리카노', count: 16 },
    { rank: '꽝', emoji: '💩', name: '꽝', count: 1, weight: 1, bad: true },
  ],
};

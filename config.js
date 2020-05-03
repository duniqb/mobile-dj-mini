"use strict";
var host = 'http://192.168.1.200:8080/api/v2';
var config = {
  host,
    // 小程序
  miniLoginUrl: host + '/mini/login',
  miniSessionUrl: host + '/mini/session',
  miniDecryptUrl: host + '/mini/decrypt',
  miniTipUrl: host + '/mini/tip',
  miniAddUrl: host + '/mini/add',
  miniQueryUrl: host + '/mini/query',
  miniRegisterUrl: host + '/mini/register',
  miniSlideImageUrl: 'http://192.168.1.200:8080/slide/',

  // 新闻
  newsListUrl: host + '/news/list',
  newsDetailUrl: host + '/news/detail',

  // 图书馆
  libraryHotUrl: host + '/library/hot',
  libraryBookCateUrl: host + '/library/bookCate',
  libraryCollegeUrl: host + '/library/college',
  libraryShowUrl: host + '/library/show',
  libraryQueryUrl: host + '/library/query',
  libraryCategoryUrl: host + '/library/category',
  libraryMajorUrl: host + '/library/major',

  // 校历
  festivalUrl: host + '/calendar/festival',
  calendarUrl: host + '/calendar/calendar',

  // 学生相关
  studentInfoUrl: host + '/student/info',
  studentGradeUrl: host + '/student/grade',
  studentCreditUrl: host + '/student/credit',
  studentScoreUrl: host + '/student/score',

  // 一卡通
  cardVerifyUrl: host + '/card/verify',
  cardLoginUrl: host + '/card/login',

  // 就业
  jobCalendarUrl: host + '/job/calendar',
  jobDemandListUrl: host + '/job/demandList',
  jobRecruitListUrl: host + '/job/recruitList',
  jobDemandUrl: host + '/job/demand',
  jobRecruitUrl: host + '/job/recruit',

  // 后勤
  repairDataUrl: host + '/repair/data',
  repairDetailUrl: host + '/repair/detail',
  repairListUrl: host + '/repair/list',
  repairNoticeUrl: host + '/repair/notice',
  repairRecentUrl: host + '/repair/recent',
  repairReportUrl: host + '/repair/report',
  repairEvaluateUrl: host + '/repair/evaluate',

  // 教务
  jwExistUrl: host + '/jw/exist',
  jwVerifyUrl: host + '/jw/verify',
  jwLoginUrl: host + '/jw/login',
  jwClearUrl: host + '/jw/clear',
  jwNoticeListUrl: host + '/jw/noticeList',
  jwNoticeUrl: host + '/jw/notice',

  // 校友圈
  feedListUrl: host + '//feed/list',
  feedDetailUrl: host + '//feed/detail',
  feedLikeTitleUrl: host + '//feed/likeTitle',
  feedUnlikeTitleUrl: host + '//feed/unlikeTitle'
}

module.exports = config;
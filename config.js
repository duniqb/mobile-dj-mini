"use strict";
var host = 'https://dj.xiaoshi98.top/';
var config = {
  host,
  loginUrl: host + 'api/v1/mini/login',
  sessionUrl: host + 'api/v1/mini/session',
  decryptUrl: host + 'api/v1/mini/decrypt',
  tipUrl: host + 'api/v1/mini/tip',
  addUrl: host + 'api/v1/mini/add',
  queryUrl: host + 'api/v1/mini/query',
  registerUrl: host + 'api/v1/mini/register',
  slideImageUrl: host + 'slide/',

  // 新闻
  newsUrl: host + 'api/v1/news/list',
  detailUrl: host + 'api/v1/news/detail',

  // 图书馆
  hotUrl: host + 'api/v1/library/hot',
  categorylUrl: host + 'api/v1/library/category',
  bookCateUrl: host + 'api/v1/library/bookCate',
  collegeUrl: host + 'api/v1/library/college',
  showUrl: host + 'api/v1/library/show',
  queryLibraryUrl: host + 'api/v1/library/query',
  libraryCategoryUrl: host + 'api/v1/library/category',
  libraryMajorUrl: host + 'api/v1/library/major',

  // 校历
  festivalUrl: host + 'api/v1/calendar/festival',
  calendarUrl: host + 'api/v1/calendar/calendar',

  // 学生相关
  infoUrl: host + 'api/v1/student/info',
  gradeUrl: host + 'api/v1/student/grade',
  studentCreditUrl: host + 'api/v1/student/credit',
  studentScoreUrl: host + 'api/v1/student/score',

  // 一卡通
  cardVerifyUrl: host + 'api/v1/card/verify',
  cardLoginUrl: host + 'api/v1/card/login',

  // 就业
  jobCalendarUrl: host + 'api/v1/job/calendar',
  jobDemandListUrl: host + 'api/v1/job/demandList',
  jobRecruitListUrl: host + 'api/v1/job/recruitList',
  jobDemandUrl: host + 'api/v1/job/demand',
  jobRecruitUrl: host + 'api/v1/job/recruit',

  // 后勤
  logisticsDataUrl: host + 'api/v1/logistics/data',
  logisticsDetailUrl: host + 'api/v1/logistics/detail',
  logisticsListUrl: host + 'api/v1/logistics/list',
  logisticsNoticeUrl: host + 'api/v1/logistics/notice',
  logisticsRecentUrl: host + 'api/v1/logistics/recent',
  logisticsReportUrl: host + 'api/v1/logistics/report',
  logisticsEvaluateUrl: host + 'api/v1/logistics/evaluate',

  // 教务
  jwExistUrl: host + 'api/v1/jw/exist',
  jwVerifyUrl: host + 'api/v1/jw/verify',
  jwLoginUrl: host + 'api/v1/jw/login',
  jwClearUrl: host + 'api/v1/jw/clear',
  jwNoticeListUrl: host + 'api/v1/jw/noticeList',
  jwNoticeUrl: host + 'api/v1/jw/notice',
}

module.exports = config;
"use strict";
var host = 'https://dj.duniqb.cn/api/v2';
// var host = 'http://192.168.1.200:8080/api/v2';

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
  libraryLikeUrl: host + '/likebook/update',
  libraryIsLikeUrl: host + '/likebook/info',
  libraryLikeBookUrl: host + '/likebook/list',

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
  jwScoreUrl: host + '/jw/score',
  jwIsLoginUrl: host + '/jw/jwIsLogin',
  jwGradeUrl: host + '/jw/grade',


  // 失物招领
  seekListUrl: host + '/seek/list',
  seekDetailUrl: host + '/seek/info',
  seekSaveUrl: host + '/seek/save',
  seekDeleteUrl: host + '/seek/update',
  seekSaveImgUrl: host + '/imgurl/save',
  seekPolicyUrl: host + '/oss/policy',


  // 校友圈
  feedListUrl: host + '/article/list',
  feedDetailUrl: host + '/article/info',
  feedLikeTitleUrl: host + '/likearticle/update',
  feedPolicyUrl: host + '/oss/policy',
  feedSaveArticleUrl: host + '/article/save',
  feedSaveImgUrl: host + '/imgurl/save',
  feedCommentListUrl: host + '/comment/list',
  feedLikeListUrl: host + '/likearticle/list',
  feedCommentPublishUrl: host + '/comment/save',
  feedCommentReplyPublishUrl: host + '/commentreply/save',
  feedDeleteArticleUrl: host + '/article/update',

}
module.exports = config;

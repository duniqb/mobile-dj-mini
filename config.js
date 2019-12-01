"use strict";
var host = 'http://192.168.1.10:8080/';
var config = {
  host,
  loginUrl: host + 'api/v1/mini/login',
  sessionUrl: host + 'api/v1/mini/session',
  decryptUrl: host + 'api/v1/mini/decrypt',
  tipUrl: host + 'api/v1/mini/tip',
  addUrl: host + 'api/v1/mini/add',
  queryUrl: host + 'api/v1/mini/query',
  registerUrl: host + 'api/v1/mini/register',

  newsUrl: host + 'api/v1/news/list',
  detailUrl: host + 'api/v1/news/detail',

  hotUrl: host + 'api/v1/library/hot',
  categorylUrl: host + 'api/v1/library/category',
  bookCateUrl: host + 'api/v1/library/bookCate',
  collegeUrl: host + 'api/v1/library/college',
  showUrl: host + 'api/v1/library/show',
  queryLibraryUrl: host + 'api/v1/library/query',
  libraryCategoryUrl: host + 'api/v1/library/category',
  libraryMajorUrl: host + 'api/v1/library/major',

  festivalUrl: host + 'api/v1/calendar/festival',
  calendarUrl: host + 'api/v1/calendar/calendar',

  infoUrl: host + 'api/v1/student/info',
  gradeUrl: host + 'api/v1/student/grade',

  cardVerifyUrl: host + 'api/v1/card/verify',
  cardLoginUrl: host + 'api/v1/card/login',
}

module.exports = config;
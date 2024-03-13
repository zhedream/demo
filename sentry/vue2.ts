import Vue from "vue";

import * as Sentry from "@sentry/vue";
import { Integrations } from "@sentry/tracing";
import router from "./router"; // new VueRouter
// "@sentry/tracing": "^7.74.0",
// "@sentry/vue": "^7.73.0",


// 初始化

Sentry.init({
  enabled: false,
  Vue,
  dsn: "https://xxx@xxx.ingest.sentry.io/xxx",
  // integrations: [
  //   new Integrations.BrowserTracing({
  //     routingInstrumentation: Sentry.vueRouterInstrumentation(router),
  //     // tracingOrigins: ["localhost", "my-site-url.com", /^\//],
  //   }),
  // ],
  integrations: [
    new Sentry.BrowserTracing({
      // Set 'tracePropagationTargets' to control for which URLs distributed tracing should be enabled
      // tracePropagationTargets: ["localhost", /^https:\/\/yourserver\.io\/api/],
      routingInstrumentation: Sentry.vueRouterInstrumentation(router),
    }),
    new Sentry.Replay(),
  ],
  // Performance Monitoring
  tracesSampleRate: 1.0, // Capture 100% of the transactions, reduce in production!
  // Session Replay
  replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
  replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
});


// 手动上报
Sentry.captureMessage('cancel', {
  extra: {
    params: {},
    desc: "取消轮询",
  },// 附带的数据
  level: "debug", // 错误等级，警告还是报错由你决定
});


// 配置用户
Sentry.configureScope((scope) => {
  scope.setUser({
    User_Account: '',
    User_Name: '',
  });
});
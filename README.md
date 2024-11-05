npx playwright test --project=chromium
npx playwright test --project=chromium --headed
npx playwright test tests/UIBasicstest.spec.js
npx playwright test tests/UIBasicstest.spec.js --config playwright.config1.js
npx playwright test tests/UIBasicstest.spec.js --project=chromium --debug
npx playwright test tests/dropdown.spec.js --project=chromium
npx playwright test tests/dropdown.spec.js --project=chromium --debug
npx playwright codegen http://google.com --project=chromium // record playback
npx playwright test --ui
npx playwright test --grep @Web --project=chromium
npx playwright test --grep @Web --project=chromium --reporter=line,allure-playwright // Allure reporter
allure generate ./allure-results --clean
allure open ./allure-report

SHIFT + COMMAND + P : debug npm script

java -jar jenkins.war -httpPort=9090
java -jar jenkins.war -httpPort=9090 --enable-future-java

Compile ts to js and run js file

```
tsc demo1.ts
node demo1.ts
```

# Stop jenkins
brew services stop jenkins-lts


### Updating the screenshots baseline for tests like Visual regression testing
npx playwright test --update-snapshots
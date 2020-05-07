let fs = require("fs");
require("chromedriver");
let swd = require("selenium-webdriver");
let bldr = new swd.Builder();
let driver = bldr.forBrowser("chrome").build();

let cFile = process.argv[2];
// let moderatorName=process.argv[3];
let ques=require("./question.js");
// console.log("Questions length is: "+(ques[0]["Testcases"]).length);
(async function () {
  try {
    await loginHelper();
    let DropDownBtn = await driver.findElement(swd.By.css("a[data-analytics=NavBarProfileDropDown]"))
    await DropDownBtn.click();
    let adminLinkanchor = await driver.findElement(swd.By.css("a[data-analytics=NavBarProfileDropDownAdministration]"));
    await adminLinkanchor.click();
    await waitForLoader();
    let manageTabs = await driver.findElements(swd.By.css(".administration header ul li"));
    await manageTabs[1].click();
    console.log("Manage Challenges Page Reached");
    

    const mpUrl = await driver.getCurrentUrl();
        console.log(mpUrl);
        // console.log("*************Reached Manage Challenges page********************");
        let qidx = 0;
        while (true) {
            //  => qnumber => question
            let question = await getMeQuestionElement(qidx, mpUrl);
            if (question == null) {
                console.log("All Question processed");
                return;
            }
            await addTestCase(question,ques[qidx]);
            qidx++;
        }
    } catch (err) {
        console.log("Error is: "+err);
    }
})();

async function loginHelper() {
  await driver.manage().setTimeouts({ implicit: 30000, pageLoad: 50000 })
  let data = await fs.promises.readFile(cFile);
  let { url, pwd, user } = JSON.parse(data);
  // Login page
  await driver.get(url);
  let unInputWillBeFoundPromise = driver.findElement(swd.By.css("#input-1"));
  let psInputWillBeFoundPromise = driver.findElement(swd.By.css("#input-2"));
  let unNpsEl = await Promise.all([unInputWillBeFoundPromise, psInputWillBeFoundPromise]);
  let uNameWillBeSendPromise = unNpsEl[0].sendKeys(user);
  let pWillBeSendPromise = unNpsEl[1].sendKeys(pwd);
  await Promise.all([uNameWillBeSendPromise, pWillBeSendPromise]);
  let loginBtn = await driver.findElement(swd.By.css("button[data-analytics=LoginPassword]"));
  await loginBtn.click();
}

async function getMeQuestionElement(qidx, mpUrl) {
    let pidx = Math.floor(qidx / 10);
    let pQidx = qidx % 10;
    console.log(pidx + " " + pQidx + " ");
    let reqpageurl = mpUrl + "/page/" + (pidx + 1);
    // console.log(reqpageurl);    
    await driver.get(reqpageurl);
    await waitForLoader();
    let challengeList = await driver.findElements(swd.By.css(".backbone.block-center"));
    if (challengeList.length > pQidx) {
        return challengeList[pQidx];
    } else {
        return null;
    }
}


async function waitForLoader() {
    let loader = await driver.findElement(swd.By.css("#ajax-msg"));
    await driver.wait(swd.until.elementIsNotVisible(loader));
}


async function addTestCase(question,quesdata) {
    
    await question.click();
    await driver.sleep(10000);
    console.log(question +"is the question element");
    console.log("question data is: "+quesdata );
    let testcaseTab = await driver.findElements(swd.By.css(".cursor.change-tab.cep"));
    await testcaseTab[2].click();
    let numberOfTestCases=(quesdata["Testcases"]).length;
    console.log("Number of test cases is: "+numberOfTestCases);

    for(let i=0;i<numberOfTestCases;i++){
      await driver.wait(swd.until.elementLocated(swd.By.css(".btn.add-testcase.btn-green")));
      let addTestCaseBtn=await driver.findElement(swd.By.css(".btn.add-testcase.btn-green"));
      await addTestCaseBtn.click();
      let inputTC=await driver.findElement(swd.By.css(".formgroup.horizontal.input-testcase-row.row .CodeMirror.cm-s-default.CodeMirror-wrap div textarea"));
      let outputTC=await driver.findElement(swd.By.css(".formgroup.horizontal.output-testcase-row.row .CodeMirror.cm-s-default.CodeMirror-wrap div textarea"));
      let indata=quesdata["Testcases"][i]["Input"];
      let outdata=quesdata["Testcases"][i]["Output"];
      console.log("input data is "+indata);
      console.log("output data is "+outdata);
      await driver.sleep(4000);
    await editorHandler(".formgroup.horizontal.input-testcase-row.row .CodeMirror.cm-s-default.CodeMirror-wrap div",inputTC,indata);
    await editorHandler(".formgroup.horizontal.output-testcase-row.row .CodeMirror.cm-s-default.CodeMirror-wrap div",outputTC,outdata);
    let saveBtn = await driver.findElement(swd.By.css(".btn.btn-primary.btn-large.save-testcase"));
    await saveBtn.click();
    await driver.sleep(5000);
    }


}


async function editorHandler(parentSelector, element, data) {
    // console.log("Element is: "+element);
    // console.log("Parent Selector is:"+parentSelector);
    // console.log("Data is:"+data);
    let parent = await driver.findElement(swd.By.css(parentSelector));
    // selenium => browser js execute 
    await driver.executeScript("arguments[0].style.height='10px'", parent);
    await element.sendKeys(data);
  }
    

    

 
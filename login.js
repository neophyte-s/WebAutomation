require("chromedriver");
let swd=require("selenium-webdriver");
let fs=require("fs");

let bldr=new swd.Builder();
let driver=bldr.forBrowser("chrome").build();

let cFile=process.argv[2];

(async function(){
    try{
        await driver.manage().setTimeouts({implicit:30000,pageLoad:10000})
        let data=await fs.promises.readFile(cFile);
        let {url}=JSON.parse(data);
        await driver.get(url);
        await loginHelper();
        // console.log("Website opened");

    }
    catch(err){
      console.log(err);
    }
})
()

async function loginHelper() {
  await driver.manage().setTimeouts({ implicit: 30000, pageLoad: 50000 })
  let data = await fs.promises.readFile(cFile);
  let { url, pwd, user } = JSON.parse(data);
  await driver.get(url);
  let unInputWillBeFoundPromise = driver.findElement(swd.By.css("#input-1"));
  let pwInputWillBeFoundPromise = driver.findElement(swd.By.css("#input-2"));
  let  unNpwEl= await Promise.all([unInputWillBeFoundPromise, psInputWillBeFoundPromise]);
  let uNameWillBeSendPromise = unNpsEl[0].sendKeys(user);
  let pWillBeSendPromise = unNpwEl[1].sendKeys(pwd);
  await Promise.all([uNameWillBeSendPromise, pWillBeSendPromise]);
  let loginBtn = await driver.findElement(swd.By.css("button[data-analytics=LoginPassword]"));
  await loginBtn.click();
}

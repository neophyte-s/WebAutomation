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
        // console.log("Website opened");

    }
    catch(err){
      console.log(err);
    }
})
()
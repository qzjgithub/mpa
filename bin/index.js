#! /usr/bin/env node
console.log("mpa test");
const fs = require('fs');
const path = require('path');
const readline = require('readline');

const read = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
console.log(process.argv);
let args = process.argv.slice(2) // 可以通过process.argv这里获得你输入的参数
console.log( args );

let dirname = "";

if(args.length <= 0){
    console.log('please input operate');
    read.close();
}else{
    firstParam(args[0]);
}

function firstParam(param){
    switch(param){
        case 'create':
            if(args.length <= 1){
                console.log('please input dirname');
                read.close();
            }else{
                secondParamWithCreate(args[1]);
            }
            break;
        default:
    }
}

function secondParamWithCreate(param){
    switch(param){
        case 'fm':
            if(args.length <= 2 ){
                console.log('please input dirname');
                read.close();
            }else{
                dirname = args[2];
                generateFeatureModule();
            }
            break;
        case 'sm':
        case 'mm':
            break;
        default:
            dirname = param;
            generateMpa();
    }
}

function generateFeatureModule(){
    let target = path.resolve(process.cwd(), 'src');
    if(!fs.existsSync(target)){
        console.log('no have src');
        return;
    }

    let source = path.resolve(__dirname,'../src/feature_modules/demo');
    target = path.join(target,'feature_modules');
    if(!fs.existsSync(target)){
        fs.mkdirSync(target);
    }

    target = path.join(target,dirname);
    if(fs.existsSync(target)){
        read.question(`${dirname} is exist,are you sure create in it?(Y/N):`,(answer) => {
            switch(answer){
                case 'Y':
                case 'y':
                case 'yes':
                    console.log(`overwrite ${dirname} content...`);
                    copyFmContent(source,target);
                    break;
                default:
                    console.log('over');
                    read.close();
            }
        });
    }else{
        fs.mkdirSync(target);
        copyFmContent(source,target);
    }

    // copyFmPkg(source,target);

}

function copyFmContent(source,target){
    copyFmPkg(source,target);
    recursionCopyDirect(source,target,'src');
    recursionCopyDirect(source,target,'webpack');
    read.close();
}

function copyFmPkg(source,target){
    let pkg = fs.readFileSync(path.join(source,'package.json'));
    pkg = JSON.parse(pkg);
    pkg["name"] = dirname;
    fs.writeFileSync(path.join(target,'package.json'),JSON.stringify(pkg,null,2));
}

//生成mpa项目
function generateMpa(){
    let target = path.resolve(process.cwd(), dirname);
    let source = path.resolve(__dirname, '../');
    if(fs.existsSync(target)){
        read.question(`${dirname} is exist,are you sure create in it?(Y/N):`,(answer) => {
           switch(answer){
               case 'Y':
               case 'y':
               case 'yes':
                   console.log('continue create mpa content...');
                   copyMpaContent(source,target);
                   break;
               default:
                   console.log('over');
                   read.close();
           }
        });
    }else{
        fs.mkdirSync(target);
        copyMpaContent(source,target);
    };
}
//拷贝mpa的内容
function copyMpaContent(source, target){
    copyMpaPackageJson(source,target);
    copyMpaSrcDirect(source,target);
    recursionCopyDirect(source,target,'webpack');
    read.close();
}
//拷贝package
function copyMpaPackageJson(source,target){
    let pkg = fs.readFileSync(path.join(source,'package.json'));
    pkg = JSON.parse(pkg);
    pkg["name"] = dirname;
    pkg["bin"] = "";
    fs.writeFileSync(path.join(target,'package.json'),JSON.stringify(pkg,null,2));
}
//拷贝src内容，不要feature_modules内容
function copyMpaSrcDirect(source,target){
    let sourceSrc = path.join(source, 'src');
    let targetSrc = path.join(target,'src');
    if(!fs.existsSync(targetSrc)){
        fs.mkdirSync(targetSrc);
    }
    fs.readdirSync(sourceSrc).filter((entry)=>{
        return ['feature_modules'].indexOf(entry) < 0;
    }).forEach((entry)=>{
        recursionCopyDirect(sourceSrc,targetSrc,entry);
    });
}
//递归拷贝文件
function recursionCopyDirect(source, target, entry){
    let sourceEntry = path.join(source,entry);
    let targetEntry = path.join(target,entry);
    if(fs.statSync(sourceEntry).isDirectory()){
        if(!fs.existsSync(targetEntry)){
            fs.mkdirSync(targetEntry);
        }
        fs.readdirSync(sourceEntry).forEach((en)=>{
            console.log(en);
            recursionCopyDirect(sourceEntry,targetEntry,en);
        });
    }else{
        fs.copyFileSync(sourceEntry,targetEntry);
    }
}
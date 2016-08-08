import 'babel-polyfill';
import path from 'path';
import { Promise, coroutine as co} from 'bluebird';
import IO from './lib/io';
import Parser from './lib/parse';
import Log from './lib/log';
const forgeUrl = 'http://files.minecraftforge.net/';
// 将相对网址转换为绝对网址
function buildUrl(relativeUrl) {
	return `${forgeUrl}${relativeUrl}`;
}

// 将对象转换为json字符串
function obj2jsonstr(obj) {
	return JSON.stringify(obj, null, '\t');
}

// 根据页面索引对象分析forge并写入文件
function analyseAndWriteToFile(forge){
	return new Promise((resolve, reject) => {
		Log.debug(`开始分析forge页面，version: ${forge.version}`);
		IO.request(buildUrl(forge.url), 20000).then(text => {
			const parser = Parser(text);
			return parser.getForgeVersion();
		}).then(result => {
			return IO.createFolderAndWriteFile(path.resolve(__dirname, `../files/forge/${forge.version}.json`), JSON.stringify(result, null, '\t'));
		}).then(() => resolve()).catch(err => reject(err));
	});
}

Log.debug('开始分析任务...');
IO.request(forgeUrl, 20000).then(text => {
	const parser = Parser(text);
	// 获取所支持的所有版本信息（页面索引）
	const versions = parser.getSupportVersion();
	return {
		parser: parser,
		vs: versions
	};
}).then(result => {
	// 解析当前页面版本的所有forge版本
	const versions = result.parser.getForgeVersion();
	// 转换成map
	var forgeMap = {};
	for (var i = 0; i < result.vs.length; i++) {
		const v = result.vs[i];
		for (var j = 0; j < v.subs.length; j++) {
			const item = v.subs[j];
			forgeMap[item.version] = item;
		}
	}
	return {
		forgeMap: forgeMap,
		vs: result.vs
	};
}).then((result) => {
	const forgeMap = result.forgeMap;
	// 开始下载分析页面
	const forges = Reflect.ownKeys(forgeMap);
	var task = forges.length - 1;
	const run = co(function*() {
		Log.debug(`准备分析页面，共有${task}个任务.`);
		for (var i = 0; i <= task; i++) {
			const forge = forgeMap[forges[i]];
			yield analyseAndWriteToFile(forge).then(() => {
				Log.debug(`分析完毕，forge ${forge.version}.json 写入成功！`);
			}).catch(err => {
				Log.error(`分析forge页面失败。`, err);
				i--; // 重试一次
				Log.debug(`开始一次重试...`);
			}).finally(() => {
				Log.debug(`[========== 剩余任务数：${task - i} ==========]\n\n`);
			});
		}
		return result.vs;
	});
	return run();
}).then((versions) => {
	// 写入版本页面索引
	return IO.createFolderAndWriteFile(path.resolve(__dirname, '../files/versions.json'), obj2jsonstr(versions));
}).then(() => {
	Log.debug('versions.json 写入成功！');
	Log.debug('分析任务全部完毕，文件已全部写出到files目录下，请查看。');
}).catch(err => {
	Log.error('error', err);
});

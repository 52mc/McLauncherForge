const forgeUrl = 'http://files.minecraftforge.net/';
import path from 'path';
import 'babel-polyfill';
import { Promise, coroutine as co} from 'bluebird';
const IO = require('./lib/io');
const Parser = require('./lib/parse');
import Log from './lib/log';

IO.request(forgeUrl, 20000).then(text => {
	const parser = Parser(text);
	const versions = parser.getSupportVersion();
	// Log.debug('获取到的版本信息\n%j', versions);
	return {
		parser: parser,
		vs: versions
	};
}).then(result => {
	// 解析当前页面的所有forge版本
	const versions = result.parser.getForgeVersion();
	// Log.debug('获取到的Forge版本信息\n%j', versions);
	// 转换成map
	var forgeMap = {};
	for (var i = 0; i < result.vs.length; i++) {
		const v = result.vs[i];
		for (var j = 0; j < v.subs.length; j++) {
			const item = v.subs[j];
			forgeMap[item.version] = item;
		}
	}
	// Log.debug('forgeMap %j', forgeMap);
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
		while(task >= 0) {
			const forge = forgeMap[forges[task]];
			yield free(forge).then(() => {
				Log.debug(`forge ${forge.version}.json 写入成功！`);
			}).catch(err => {
				Log.error(`分析forge页面失败。`, err);
			}).finally(() => {
				Log.debug(`剩余任务数：${task--}`);
			});
		}
		return result.vs;
	});
	return run();
}).then((versions) => {
	return IO.createFolderAndWriteFile(path.resolve(__dirname, '../files/versions.json'), JSON.stringify(versions, null, '\t'));
}).then(() => {
	Log.debug('versions.json write done.');
}).catch(err => {
	Log.error('error', err);
});

function buildUrl(relativeUrl){
	return `http://files.minecraftforge.net/${relativeUrl}`;
}

function free(forge){
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

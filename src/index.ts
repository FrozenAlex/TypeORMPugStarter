require("dotenv").config();

import * as path from "path";

import * as Koa from "koa";
import * as Body from "koa-body";
import * as Pug from "koa-pug";
import * as koaStatic from "koa-static";
import * as Router from "koa-router";

import { createConnection} from "typeorm";

import Post from "./entity/Post";
import Comment from "./entity/Comment";


const app = new Koa();
app.keys = ["Very Secret Key"];

app.use(Body());

// Serve static content
app.use(
	koaStatic(path.resolve(__dirname, "../static"), {
		gzip: process.env.NODE_ENV === "production",
		brotli: process.env.NODE_ENV === "production",
	})
);

// Compress stuff with gzip
var compress = require("koa-compress");
app.use(compress());

// Add pug support
// @ts-ignore
const pug = new Pug({
	viewPath: path.resolve(__dirname, "./../views"),
	locals: {
		/* variables and helpers */
	},
	basedir: __dirname + "../views",
	app: app, // Binding `ctx.render()`, equals to pug.use(app)
	cache: process.env.NODE_ENV === "production",
});

// Create a router
var router = new Router();

router.get("/", async (ctx, next) => {
	await ctx.render("index");
});

router.post("/secretroute", async (ctx, next) => {
	// https://www.npmjs.com/package/koa-body to get request body
	console.log(ctx.request.body);
	await ctx.render("index", {title:"secretRoute"});
});

router.get("/say/:id", async (ctx, next) => {	
	await ctx.render("index", {title:ctx.params.id});
});

app.use(router.routes());

// Actual start of the app
async function main() {

	// @ts-ignore
	await createConnection({
		entities: [Post, Comment],
		logging: process.env.NODE_ENV !== "production",
		synchronize: true,
		type: process.env.DB_TYPE || "sqlite",
		database: process.env.DB_NAME || __dirname + `/../db.sqlite`,
		host: process.env.DB_HOST,
		port: process.env.DB_PORT,
		username: process.env.DB_USER,
		password: process.env.DB_PASSWORD,
	});

	app.listen(process.env.PORT || 3000, () => {
		console.log(`Koa has started on http://localhost:${process.env.PORT || 3000}`);
	});
}
main();

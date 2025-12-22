const jsonServer = require("json-server");
const path = require("path");

const server = jsonServer.create();
const router = jsonServer.router(path.join(__dirname, "db.json"));
const middlewares = jsonServer.defaults();

const PORT = process.env.PORT || 3001;

server.use(middlewares);
server.use(jsonServer.bodyParser);
server.use(router);

server.listen(PORT, () => {
  console.log(`✅ JSON Server running on port ${PORT}`);
});

import NodeSSPI from 'node-sspi';
import express from 'express';
import httpProxyMiddleware from 'http-proxy-middleware';


const proxyPort = 3030;


const app = express();


const nodeSSPI = new NodeSSPI();


app.use((req, res, next) => {
	nodeSSPI.authenticate(req, res, err => {
		if(err) {
			console.log('authentication error:', err);
		}
		
		res.finished || next();
	});
});


const meteorProxy = httpProxyMiddleware({
	target: 'http://localhost:3000/',
	ws: true,
	onProxyReq: (proxyReq, { connection: { user } }) => {
		proxyReq.setHeader('x-ntlm-user', user);
	}
});


app.use(meteorProxy);


app.listen(proxyPort, () => {
	console.log('Express server listening on port %d', proxyPort);
});

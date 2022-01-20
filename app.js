var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const BlockChain = require('./blockchain');
const P2PServer = require('./p2pserver')
const Wallet = require('./wallet');
const TransactionPool = require('./wallet/transaction-pool');
const Miner = require('./miner');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// app.use('/', indexRouter);
// app.use('/users', usersRouter);

const bc = new BlockChain();
const tp = new TransactionPool();
const p2p = new P2PServer(bc, tp);
const wallet = new Wallet();
const miner = new Miner(bc, tp, wallet, p2p);

p2p.listen()

app.get('/transactions', (req, res) => {
  res.json(tp.transactions);
});

app.post('/transact', (req, res) => {
  const { recipient, amount } = req.body;
  const transaction = wallet.createTransaction(recipient, amount, bc, tp);
  p2p.broadcastTransaction(transaction);
  res.redirect('/transactions');
});

app.get('/public-key', (req, res) => {
  res.json({ publicKey: wallet.publicKey })
})

app.get('/blocks', (req, res) => {
  res.json(bc.chain)
})

app.get('/mine-transactions', (req, res) => {
  const block = miner.mine();
  console.log(`New block added: ${block.toString()}`)

  res.redirect('/blocks');
})

app.post('/mine', (req, res) => {
  const data = req.body.data
  const block = bc.addBlock(data)
  p2p.syncChains()
  console.log(`new block: ${block}`)
  res.redirect(`/blocks`);
})

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

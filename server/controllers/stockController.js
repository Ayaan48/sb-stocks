const YF_HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Accept': 'application/json',
};

const yfFetch = async (url) => {
  const res = await fetch(url, { headers: YF_HEADERS });
  if (!res.ok) throw new Error(`Yahoo Finance API error: ${res.status}`);
  return res.json();
};

const searchStocks = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) return res.status(400).json({ message: 'Query required' });

    const data = await yfFetch(
      `https://query1.finance.yahoo.com/v1/finance/search?q=${encodeURIComponent(q)}&quotesCount=10&newsCount=0&enableFuzzyQuery=false`
    );

    const stocks = (data.quotes || [])
      .filter(s => s.quoteType === 'EQUITY')
      .slice(0, 10)
      .map(s => ({
        symbol:    s.symbol,
        shortname: s.shortname || s.longname || s.symbol,
        exchange:  s.exchDisp || s.exchange || '',
        quoteType: s.quoteType,
      }));

    res.json(stocks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getStockQuote = async (req, res) => {
  try {
    const { symbol } = req.params;
    const data = await yfFetch(
      `https://query1.finance.yahoo.com/v8/finance/chart/${symbol.toUpperCase()}?interval=1d&range=1d`
    );

    const result = data.chart?.result?.[0];
    if (!result) return res.status(404).json({ message: 'Stock not found' });

    const meta   = result.meta;
    const prev   = meta.chartPreviousClose || meta.previousClose;
    const price  = meta.regularMarketPrice;
    const change = parseFloat((price - prev).toFixed(4));
    const changePct = parseFloat(((change / prev) * 100).toFixed(4));

    res.json({
      symbol:                     meta.symbol,
      shortName:                  meta.shortName,
      regularMarketPrice:         price,
      regularMarketChange:        change,
      regularMarketChangePercent: changePct,
      regularMarketPreviousClose: prev,
      regularMarketOpen:          meta.regularMarketDayOpen,
      regularMarketDayHigh:       meta.regularMarketDayHigh,
      regularMarketDayLow:        meta.regularMarketDayLow,
      regularMarketVolume:        meta.regularMarketVolume,
      fiftyTwoWeekHigh:           meta.fiftyTwoWeekHigh,
      fiftyTwoWeekLow:            meta.fiftyTwoWeekLow,
      exchange:                   meta.fullExchangeName,
      currency:                   meta.currency,
      marketCap:                  null,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getStockHistory = async (req, res) => {
  try {
    const { symbol } = req.params;
    const { period = '1mo' } = req.query;

    const periodMap = {
      '1d':  { range: '1d',  interval: '5m'  },
      '1w':  { range: '5d',  interval: '1h'  },
      '1mo': { range: '1mo', interval: '1d'  },
      '3mo': { range: '3mo', interval: '1d'  },
      '1y':  { range: '1y',  interval: '1wk' },
    };

    const { range, interval } = periodMap[period] || periodMap['1mo'];
    const data = await yfFetch(
      `https://query1.finance.yahoo.com/v8/finance/chart/${symbol.toUpperCase()}?interval=${interval}&range=${range}`
    );

    const result = data.chart?.result?.[0];
    if (!result) return res.status(404).json({ message: 'No history found' });

    const timestamps = result.timestamp || [];
    const closes     = result.indicators?.quote?.[0]?.close || [];

    const quotes = timestamps
      .map((ts, i) => ({ date: new Date(ts * 1000), close: closes[i] }))
      .filter(q => q.close !== null && q.close !== undefined);

    res.json(quotes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getPopularStocks = async (req, res) => {
  try {
    const symbols = ['AAPL','MSFT','GOOGL','AMZN','NVDA','TSLA','META','NFLX','AMD','INTC'];
    const quotes  = await Promise.all(
      symbols.map(async (s) => {
        try {
          const data = await yfFetch(
            `https://query1.finance.yahoo.com/v8/finance/chart/${s}?interval=1d&range=1d`
          );
          const meta  = data.chart?.result?.[0]?.meta;
          if (!meta) return null;
          const prev      = meta.chartPreviousClose || meta.previousClose;
          const price     = meta.regularMarketPrice;
          const change    = parseFloat((price - prev).toFixed(2));
          const changePct = parseFloat(((change / prev) * 100).toFixed(2));
          return { symbol: meta.symbol, shortName: meta.shortName, price, change, changePct };
        } catch { return null; }
      })
    );
    res.json(quotes.filter(Boolean));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { searchStocks, getStockQuote, getStockHistory, getPopularStocks };

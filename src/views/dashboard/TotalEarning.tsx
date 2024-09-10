import { Card } from '@mui/material';
import React, { useEffect, useRef, memo } from 'react';

// Global flag to check if the script has been loaded
let scriptLoaded = false;

function TradingViewWidget() {
  const container = useRef();

  useEffect(() => {
    if (!scriptLoaded) {
      const script = document.createElement("script");
      script.src = "https://s3.tradingview.com/external-embedding/embed-widget-symbol-overview.js";
      script.type = "text/javascript";
      script.async = true;
      script.innerHTML = `
        {
          "symbols": [
            [
              "Apple",
              "AAPL|1D"
            ],
            [
              "Google",
              "GOOGL|1D"
            ],
            [
              "Microsoft",
              "MSFT|1D"
            ],
            [
              "CRYPTO:BTCUSD|1D"
            ],
            [
              "IG:NASDAQ.USD.100|1D"
            ]
          ],
          "chartOnly": false,
          "width": "100%",
          "height": "100%",
          "locale": "en",
          "colorTheme": "light",
          "autosize": true,
          "showVolume": false,
          "showMA": false,
          "hideDateRanges": false,
          "hideMarketStatus": false,
          "hideSymbolLogo": false,
          "scalePosition": "right",
          "scaleMode": "Normal",
          "fontFamily": "-apple-system, BlinkMacSystemFont, Trebuchet MS, Roboto, Ubuntu, sans-serif",
          "fontSize": "10",
          "noTimeScale": false,
          "valuesTracking": "1",
          "changeMode": "price-and-percent",
          "chartType": "area",
          "headerFontSize": "medium",
          "lineWidth": 2,
          "lineType": 0,
          "dateRanges": [
            "1d|1",
            "1m|30",
            "3m|60",
            "12m|1D",
            "60m|1W",
            "all|1M"
          ]
        }`;
      container.current.appendChild(script);
      scriptLoaded = true;
    }

    // Cleanup function
    return () => {

    };
  }, []);

  return (
    <Card sx={{ height: "100%" }}>
      <div
        className="tradingview-widget-container"
        ref={container}
      >
        <div className="tradingview-widget-container__widget"></div>
      </div>
    </Card>

  );
}

export default memo(TradingViewWidget);

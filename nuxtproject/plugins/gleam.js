(function () {
    if (document.querySelectorAll) {
      var base = "https://widget.gleamjs.io",
        defaultImage = "https://js.gleam.io/images/logo.svg",
        elems = document.querySelectorAll('a.e-gleam, a.e-widget');
  
      for (var i = 0; i < elems.length; i++) {
        var elem = elems[i];
        if(!elem.href.match(/(?:\/|%2f)([a-z0-9]{5})(?:\/|%2f)/i, '/')) {
          continue;
        }
        var loadingText = elem.getAttribute('data-loading-text') || 'Loading...',
          key = elem.href.match(/(?:\/|%2f)([a-z0-9]{5})(?:\/|%2f)/i, '/')[1],
          replacement = document.createElement('div');
        var g = document.createElement('script'),
          s = document.getElementsByTagName('script')[0];
  
        var classes = "e-widget-preloader";
        var extras = [];
        var postEmbed = '';
        if(('' + elem.className).match(/no-button/)) {
          extras.push("no_button");
        }
        if(('' + elem.className).match(/allow-scroll/)) {
          extras.push("allow_scroll");
        }
        if(('' + elem.className).match(/xdga/)) {
          extras.push("xdga");
        }
        if(('' + elem.className).match(/leaderboard/)) {
          extras.push("leaderboard");
          postEmbed = '-L';
        }
        if(('' + elem.className).match(/generic-loader/) || !defaultImage) {
          replacement.innerHTML = "<div><div class='e-widget-fc'><div class='e-widget-c1 e-widget-c'></div><div class='e-widget-c2 e-widget-c'></div><div class='e-widget-c3 e-widget-c'></div><div class='e-widget-c4 e-widget-c'></div><div class='e-widget-c5 e-widget-c'></div><div class='e-widget-c6 e-widget-c'></div><div class='e-widget-c7 e-widget-c'></div><div class='e-widget-c8 e-widget-c'></div><div class='e-widget-c9 e-widget-c'></div><div class='e-widget-c10 e-widget-c'></div><div class='e-widget-c11 e-widget-c'></div><div class='e-widget-c12 e-widget-c'></div></div></div>";
        } else {
          replacement.innerHTML = "<div><img class='app-spin' src='" + defaultImage + "'/> "+loadingText+"</div>";
        }
  
        if (('' + elem.className).match(/e-modern/)) {
          classes += " e-modern";
        }
        if (('' + elem.className).match(/e-dark/)) {
          classes += " e-dark";
        }
  
        replacement.className = "GleamEmbed" + key + postEmbed + " " + classes;
        elem.parentNode.replaceChild(replacement, elem);
        if (!document.getElementById("e-widget-preload-styles")) {
          var c = document.createElement('style'),
            css = "html body .e-widget-wrapper{margin:auto;max-width:540px;padding:0}html body .e-widget-preloader,html body .e-widget-wrapper{box-shadow:0 0 2px rgba(0,0,0,0.3),0 3px 5px rgba(0,0,0,0.2)}html body .e-widget-wrapper.e-classic.pseudo-popup-border{border:5px solid rgba(240,240,240,0.5);box-shadow:none}html body .e-widget-preloader.e-modern,html body .e-widget-preloader.e-dark,html body .e-widget-wrapper.e-modern,html body .e-widget-wrapper.e-dark{border-radius:16px;box-shadow:0 6px 10px 0 rgba(0,0,0,0.14),0 1px 18px 0 rgba(0,0,0,0.12),0 3px 5px -1px rgba(0,0,0,0.2)}html body .e-widget-preloader.e-dark,html body .e-widget-wrapper.e-dark{background:#1C202E;color:#999999}html body .e-widget-wrapper.e-modern iframe.e-embed-frame,html body .e-widget-wrapper.e-dark iframe.e-embed-frame{border-radius:16px}html body .e-widget-preloader,html body iframe.e-embed-frame{width:100%;max-width:540px;min-width:320px;margin:0 auto 20px;display:block;float:none;background:white}html body .e-widget-preloader\u003ediv{line-height:200px;font-size:30px;text-align:center;font-family:sans-serif;color:#666}html body .e-widget-preloader.e-dark\u003ediv{color:#FFFFFF}html body .e-widget-preloader\u003e*\u003eimg{vertical-align:middle !important;height:74px !important;width:74px !important;margin:0 10px 0 0 !important;border:none !important;display:inline-block !important;float:none !important;box-shadow:none !important}html body .e-widget-preloader\u003ediv\u003eimg.app-spin{animation:app-spin 2s infinite linear} @keyframes app-spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}html body .e-widget-fc{width:74px;height:74px;position:relative;display:inline-block;vertical-align:middle;margin:0 16px 0 0 !important}.e-widget-fc .e-widget-c{width:100%;height:100%;position:absolute;left:0;top:0}.e-widget-fc .e-widget-c:before{content:'';display:block;margin:0 auto;width:15%;height:15%;background-color:#333;border-radius:100%;animation:e-widget-cFadeDelay 1.2s infinite ease-in-out both}.e-widget-fc .e-widget-c2{transform:rotate(30deg)}.e-widget-fc .e-widget-c2:before{animation-delay:-1.1s}.e-widget-fc .e-widget-c3{transform:rotate(60deg)}.e-widget-fc .e-widget-c3:before{animation-delay:-1s}.e-widget-fc .e-widget-c4{transform:rotate(90deg)}.e-widget-fc .e-widget-c4:before{animation-delay:-0.9s}.e-widget-fc .e-widget-c5{transform:rotate(120deg)}.e-widget-fc .e-widget-c5:before{animation-delay:-0.8s}.e-widget-fc .e-widget-c6{transform:rotate(150deg)}.e-widget-fc .e-widget-c6:before{animation-delay:-0.7s}.e-widget-fc .e-widget-c7{transform:rotate(180deg)}.e-widget-fc .e-widget-c7:before{animation-delay:-0.6s}.e-widget-fc .e-widget-c8{transform:rotate(210deg)}.e-widget-fc .e-widget-c8:before{animation-delay:-0.5s}.e-widget-fc .e-widget-c9{transform:rotate(240deg)}.e-widget-fc .e-widget-c9:before{animation-delay:-0.4s}.e-widget-fc .e-widget-c10{transform:rotate(270deg)}.e-widget-fc .e-widget-c10:before{animation-delay:-0.3s}.e-widget-fc .e-widget-c11{transform:rotate(300deg)}.e-widget-fc .e-widget-c11:before{animation-delay:-0.2s}.e-widget-fc .e-widget-c12{transform:rotate(330deg)}.e-widget-fc .e-widget-c12:before{animation-delay:-0.1s}@keyframes e-widget-cFadeDelay{0%,39%,100%{opacity:0}40%{opacity:1}}";
          c.setAttribute('id', 'e-widget-preload-styles');
          c.setAttribute("type", "text/css");
          c.textContent = css;
          document.getElementsByTagName('head')[0].appendChild(c);
        }
  
        g.src = base + '/' + key + '/embed.js' + (extras.length > 0 ? ("?" + extras.join("&")) : '');
        s.parentNode.insertBefore(g, s);
      }
    }
  })();
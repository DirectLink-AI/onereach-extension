if (/:\/\/studio\.[^\/]+/.test(location.href)) {
  const click = (elem) => {
    const evt = new MouseEvent("click", {
      bubbles: true,
      cancelable: true,
      view: window,
    });
    const canceled = elem != null && !elem.dispatchEvent(evt);
  };

  const tabNode = (() => {
    var count = 0;
    const nodes = document.getElementsByClassName("tree-node");
    return () => {
      if (nodes.length > 0) {
        const index = count++ % nodes.length;
        click(nodes[index]);
      }
    };
  })();

  const saveActivate = () => {
    const xpath = "//div[text()='Save & Activate']";
    click(
      document.evaluate(
        xpath,
        document,
        null,
        XPathResult.FIRST_ORDERED_NODE_TYPE,
        null
      ).singleNodeValue
    );
  };

  const save = () => {
    const xpath = "//button[text()='Save Flow']";
    click(
      document.evaluate(
        xpath,
        document,
        null,
        XPathResult.FIRST_ORDERED_NODE_TYPE,
        null
      ).singleNodeValue
    );
  };

  const stepControls = () => {
    const stepcontrols = document.getElementsByClassName("step-controls");
    if (stepcontrols.length > 0) {
      const controls = stepcontrols[0].childNodes;
      return {
        showontree: () => {
          controls[0].click();
        },
        splittree: () => {
          controls[2].click();
        },
        clonetree: () => {
          controls[4].click();
        },
        deletetree: () => {
          confirm("Are you sure you want to delete this tree?") &&
            controls[6].click();
        },
      };
    }
    return {};
  };

  const flowControls = () => {
    const flowcontrols = document.getElementsByClassName("flow-controls");
    if (flowcontrols.length > 0) {
      const controls = flowcontrols[0].childNodes;
      return {
        zoomin: () => {
          controls[2].click();
        },
        zoommap: () => {
          controls[4].click();
        },
        zoomout: () => {
          controls[6].click();
        },
      };
    }
    return {};
  };

  const command = (e) => `${e.altKey && "alt+" + e.key}`;

  const hints = () => {
    const nodes = document.getElementsByClassName("tree-node");
    Object.keys(nodes).forEach((key, index) => {
      const node = nodes[key];
      var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      var text = document.createElementNS("http://www.w3.org/2000/svg", "text");
      text.setAttribute("x", "0");
      text.setAttribute("y", "14");
      text.textContent = `${index}`;
      svg.appendChild(text);
      svg.setAttribute("xlink", "http://www.w3.org/1999/xlink");
      svg.setAttribute("width", "20");
      svg.setAttribute("height", "20");
      svg.setAttribute("x", node.firstChild.getAttribute("x"));
      svg.setAttribute("y", node.firstChild.getAttribute("y"));
      svg.style.overflow = "visible";
      nodes[key].appendChild(svg);
      var back = document.createElementNS("http://www.w3.org/2000/svg", "rect");
      const { x, y, width, height } = text.getBBox();
      back.setAttribute("x", x - 4);
      back.setAttribute("y", y);
      back.setAttribute("width", width + 8);
      back.setAttribute("height", height);
      back.setAttribute("rx", width / 3);
      back.setAttribute("ry", width / 3);
      back.setAttribute("fill", "#E3BE23");
      svg.insertBefore(back, text);
    });
  };

  const commands = {
    "alt+a": tabNode,
    "alt+s": saveActivate,
    "alt+q": () => {
      stepControls().deletetree();
    },
    "alt+c": () => {
      stepControls().clonetree();
    },
    "alt+g": () => {
      stepControls().showontree();
    },
    "alt+x": () => {
      stepControls().splittree();
    },
    "alt+=": () => {
      flowControls().zoomin();
    },
    "alt+o": () => {
      flowControls().zoommap();
    },
    "alt+-": () => {
      flowControls().zoomout();
    },
    "alt+i": hints,
  };

  document.addEventListener("keydown", (e) => {
    if (document.getElementsByClassName("builder").length == 0) return;
    const commandFunc = commands[command(e)];
    if (typeof commandFunc == "function") commandFunc();
  });

  const everyMinute = () => {
    save();
    setTimeout(everyMinute, 60000);
  };

  const updateTitle = () => {
    const breadcrumbs = document.getElementsByClassName("breadcrumbs");
    if (breadcrumbs.length > 0 && breadcrumbs[0].childElementCount > 2) {
      const bot = breadcrumbs[0]?.children[1]?.children[0]?.innerText;
      const flow = breadcrumbs[0]?.children[2]?.children[0]?.innerText;
      document.title = `${bot && bot + " |"} ${flow && flow}`;
    } else {
      document.title = `Studio`;
    }
  };

  var script = document.createElement("script");
  script.onload = () => {
    document.arrive(
      ".breadcrumbs",
      this.arrive("div", () => setTimeout(updateTitle, 5000))
    );
  };
  script.src =
    "https://raw.githubusercontent.com/uzairfarooq/arrive/master/minified/arrive.min.js";

  document.head.appendChild(script);

  // window.onload = () =>{
  //   setTimeout(updateTitle, 2000);
  //   everyMinute();
  // }

  // window.onhashchange = () => {
  //   setTimeout(updateTitle, 2000);
  // };
}
